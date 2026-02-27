import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { printJSON, printError, isPretty } from "../lib/output.ts";
import pc from "picocolors";

interface FigmaFileResponse {
  name: string;
  lastModified: string;
  version: string;
  document: {
    children: Array<{
      id: string;
      name: string;
      type: string;
    }>;
  };
}

export default defineCommand({
  meta: {
    name: "file",
    description: "Show file info (name, last modified, pages)",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
  },
  async run({ args }) {
    let fileKey: string;
    try {
      ({ fileKey } = parseFigmaUrl(args.url));
    } catch (err) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }

    let file: FigmaFileResponse;
    try {
      file = await figmaFetch<FigmaFileResponse>(`/v1/files/${fileKey}`, {
        depth: "1",
      });
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }

    const pages = file.document.children
      .filter((node) => node.type === "CANVAS")
      .map((node) => ({ id: node.id, name: node.name }));

    if (isPretty()) {
      const label = (l: string) => pc.bold(l.padEnd(15));
      console.log(`${label("File:")}${file.name}`);
      console.log(
        `${label("Last modified:")}${file.lastModified.replace("T", " ").replace(/:\d{2}(\.\d+)?Z$/, "")}`
      );
      console.log(`${label("Version:")}${file.version}`);
      console.log();
      console.log(`Pages (${pages.length}):`);
      for (const page of pages) {
        console.log(`  ${page.id.padEnd(13)}${page.name}`);
      }
    } else {
      printJSON({
        name: file.name,
        lastModified: file.lastModified,
        version: file.version,
        pages,
      });
    }
  },
});
