import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { isPretty, printJSON, printTable, printError } from "../lib/output.ts";

interface VersionEntry {
  id: string;
  label: string;
  description: string;
  created_at: string;
  user: { handle: string };
}

interface VersionsResponse {
  versions: VersionEntry[];
}

export default defineCommand({
  meta: {
    name: "versions",
    description: "Show file version history",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
    limit: {
      type: "string",
      description: "Maximum number of versions to return (default: 20)",
    },
    named: {
      type: "boolean",
      description: "Show only named versions (with a label)",
      default: false,
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
      const data = await figmaFetch<VersionsResponse>(
        `/v1/files/${fileKey}/versions`
      );

      let versions = data.versions
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .map((v) => ({
          id: v.id,
          label: v.label || "",
          description: v.description || "",
          createdAt: v.created_at,
          author: v.user.handle,
        }));

      if (args.named) {
        versions = versions.filter((v) => v.label !== "");
      }

      const limit = args.limit ? parseInt(args.limit, 10) : 20;
      versions = versions.slice(0, limit);

      if (isPretty()) {
        printTable(
          ["ID", "Label", "Author", "Date"],
          versions.map((v) => [
            v.id,
            v.label || "-",
            v.author,
            v.createdAt.replace("T", " ").replace(/:\d{2}(\.\d+)?Z$/, ""),
          ])
        );
      } else {
        printJSON(versions);
      }
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }
  },
});
