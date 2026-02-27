import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { discoverFrames } from "../lib/frames.ts";
import {
  isPretty,
  printJSON,
  printTable,
  printError,
} from "../lib/output.ts";

export default defineCommand({
  meta: {
    name: "frames",
    description: "List frames within a page, section, or frame",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
    deep: {
      type: "boolean",
      description: "Include nested frames recursively",
      default: false,
    },
  },
  async run({ args }) {
    try {
      const { fileKey, nodeId } = parseFigmaUrl(args.url);
      const frames = await discoverFrames(fileKey, nodeId, args.deep);

      if (frames.length === 0) {
        if (isPretty()) {
          printError("No frames found at the given URL");
        } else {
          printJSON([]);
        }
        process.exit(1);
      }

      if (isPretty()) {
        printTable(
          ["ID", "Name", "Size"],
          frames.map((f) => [f.id, f.name, `${f.width} x ${f.height}`])
        );
      } else {
        printJSON(
          frames.map((f) => ({
            id: f.id,
            name: f.name,
            width: f.width,
            height: f.height,
          }))
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      printError(msg);
      process.exit(1);
    }
  },
});
