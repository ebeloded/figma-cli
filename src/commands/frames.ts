import { defineCommand } from "citty";
import pc from "picocolors";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { discoverFrames, type FrameInfo } from "../lib/frames.ts";
import { isPretty, printJSON, printError } from "../lib/output.ts";

function printFrameTree(frames: FrameInfo[], indent = 0) {
  const pad = "  ".repeat(indent);
  for (const frame of frames) {
    if (frame.type === "SECTION" || frame.type === "GROUP") {
      console.log(`\n${pad}${pc.bold(frame.name)}`);
      if (frame.children?.length) {
        printFrameTree(frame.children, indent + 1);
      }
    } else {
      const size = `${frame.width} x ${frame.height}`;
      console.log(
        `${pad}${pc.dim(frame.id.padEnd(12))}  ${frame.name.padEnd(32)}  ${size}`
      );
    }
  }
}

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
        printFrameTree(frames);
      } else {
        printJSON(frames);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      printError(msg);
      process.exit(1);
    }
  },
});
