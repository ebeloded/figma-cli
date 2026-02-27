import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { isPretty, printJSON, printTable, printError } from "../lib/output.ts";

interface ComponentEntry {
  key: string;
  name: string;
  description: string;
  containing_frame?: { name: string };
  component_set_id?: string;
}

interface StyleEntry {
  key: string;
  name: string;
  description: string;
  style_type: string;
}

interface ComponentsResponse {
  meta: { components: ComponentEntry[] };
}

interface StylesResponse {
  meta: { styles: StyleEntry[] };
}

export default defineCommand({
  meta: {
    name: "components",
    description: "List published components and styles",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
    styles: {
      type: "boolean",
      description: "List styles instead of components",
      default: false,
    },
    search: {
      type: "string",
      description: "Filter by name (case-insensitive substring)",
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

    try {
      if (args.styles) {
        const data = await figmaFetch<StylesResponse>(
          `/v1/files/${fileKey}/styles`
        );

        let styles = data.meta.styles.map((s) => ({
          key: s.key,
          name: s.name,
          type: s.style_type,
          description: s.description,
        }));

        if (args.search) {
          const query = args.search.toLowerCase();
          styles = styles.filter((s) => s.name.toLowerCase().includes(query));
        }

        if (isPretty()) {
          printTable(
            ["Key", "Name", "Type", "Description"],
            styles.map((s) => [s.key, s.name, s.type, s.description])
          );
        } else {
          printJSON(styles);
        }
      } else {
        const data = await figmaFetch<ComponentsResponse>(
          `/v1/files/${fileKey}/components`
        );

        let components = data.meta.components.map((c) => ({
          key: c.key,
          name: c.name,
          description: c.description,
          componentSetName: null as string | null,
        }));

        if (args.search) {
          const query = args.search.toLowerCase();
          components = components.filter((c) =>
            c.name.toLowerCase().includes(query)
          );
        }

        if (isPretty()) {
          printTable(
            ["Key", "Name", "Description"],
            components.map((c) => [c.key, c.name, c.description])
          );
        } else {
          printJSON(components);
        }
      }
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }
  },
});
