import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { printJSON, printTable, printError, isPretty } from "../lib/output.ts";

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaVariableMode {
  modeId: string;
  name: string;
}

interface FigmaVariableCollection {
  name: string;
  modes: FigmaVariableMode[];
  variableIds: string[];
}

interface FigmaVariable {
  name: string;
  resolvedType: string;
  valuesByMode: Record<string, unknown>;
}

interface FigmaVariablesResponse {
  meta: {
    variableCollections: Record<string, FigmaVariableCollection>;
    variables: Record<string, FigmaVariable>;
  };
}

function colorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
  if (color.a < 1) {
    const a = Math.round(color.a * 255);
    return `${hex}${a.toString(16).padStart(2, "0").toUpperCase()}`;
  }
  return hex;
}

function isColor(value: unknown): value is FigmaColor {
  return (
    typeof value === "object" &&
    value !== null &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    "a" in value
  );
}

function formatValue(value: unknown, type: string): unknown {
  if (type === "COLOR" && isColor(value)) {
    return colorToHex(value);
  }
  return value;
}

export default defineCommand({
  meta: {
    name: "variables",
    description: "Dump design token variable collections",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
    collection: {
      type: "string",
      description: "Filter to a specific collection (case-insensitive)",
    },
    mode: {
      type: "string",
      description: "Only output values for a specific mode",
    },
  },
  async run({ args }) {
    let fileKey: string;
    try {
      ({ fileKey } = parseFigmaUrl(args.url));
    } catch (err) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }

    let response: FigmaVariablesResponse;
    try {
      response = await figmaFetch<FigmaVariablesResponse>(
        `/v1/files/${fileKey}/variables/local`
      );
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }

    const { variableCollections, variables } = response.meta;

    let collections = Object.values(variableCollections).map((col) => {
      let modes = col.modes;

      // Filter modes if --mode is specified
      if (args.mode) {
        const modeLower = args.mode.toLowerCase();
        modes = modes.filter((m) => m.name.toLowerCase() === modeLower);
      }

      const modeNames = modes.map((m) => m.name);

      const vars = col.variableIds
        .map((varId) => variables[varId])
        .filter((v): v is FigmaVariable => v !== undefined)
        .map((v) => {
          const values: Record<string, unknown> = {};
          for (const mode of modes) {
            const raw = v.valuesByMode[mode.modeId];
            values[mode.name] = formatValue(raw, v.resolvedType);
          }
          return {
            name: v.name,
            type: v.resolvedType,
            values,
          };
        });

      return {
        name: col.name,
        modes: modeNames,
        variables: vars,
      };
    });

    // Filter collections if --collection is specified
    if (args.collection) {
      const colLower = args.collection.toLowerCase();
      collections = collections.filter(
        (c) => c.name.toLowerCase() === colLower
      );
    }

    if (isPretty()) {
      if (collections.length === 0) {
        printError("No variable collections found");
        return;
      }
      for (const col of collections) {
        console.log(`\n${col.name} (modes: ${col.modes.join(", ")})`);
        if (col.variables.length === 0) {
          console.log("  (no variables)");
          continue;
        }
        const headers = ["Name", "Type", ...col.modes];
        const rows = col.variables.map((v) => [
          v.name,
          v.type,
          ...col.modes.map((m) => String(v.values[m] ?? "-")),
        ]);
        printTable(headers, rows);
      }
    } else {
      printJSON({ collections });
    }
  },
});
