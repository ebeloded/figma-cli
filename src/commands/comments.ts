import { defineCommand } from "citty";
import { parseFigmaUrl } from "../lib/url-parser.ts";
import { figmaFetch, FigmaApiError } from "../lib/api-client.ts";
import { printJSON, printTable, printError, isPretty } from "../lib/output.ts";

interface FigmaComment {
  id: string;
  message: string;
  user: { handle: string };
  created_at: string;
  resolved_at: string | null;
  client_meta?: { node_id?: string } | null;
}

interface FigmaCommentsResponse {
  comments: FigmaComment[];
}

function mapComment(c: FigmaComment) {
  return {
    id: c.id,
    message: c.message,
    author: c.user.handle,
    createdAt: c.created_at,
    resolved: c.resolved_at !== null,
    nodeId: c.client_meta?.node_id ?? null,
  };
}

export default defineCommand({
  meta: {
    name: "comments",
    description: "List or post comments on a file or node",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
    unresolved: {
      type: "boolean",
      description: "Only show unresolved comments",
      default: false,
    },
    author: {
      type: "string",
      description: "Filter by author name",
    },
  },
  subCommands: {
    post: () => import("./comments/post.ts").then((m) => m.default),
  },
  async run({ args }) {
    let fileKey: string;
    let nodeId: string | undefined;
    try {
      ({ fileKey, nodeId } = parseFigmaUrl(args.url));
    } catch (err) {
      printError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }

    let response: FigmaCommentsResponse;
    try {
      response = await figmaFetch<FigmaCommentsResponse>(
        `/v1/files/${fileKey}/comments`
      );
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }

    let comments = response.comments;

    // Filter to node if URL contains a node ID
    if (nodeId) {
      comments = comments.filter(
        (c) => c.client_meta?.node_id === nodeId
      );
    }

    // Filter to unresolved
    if (args.unresolved) {
      comments = comments.filter((c) => c.resolved_at === null);
    }

    // Filter by author
    if (args.author) {
      const authorLower = args.author.toLowerCase();
      comments = comments.filter(
        (c) => c.user.handle.toLowerCase().includes(authorLower)
      );
    }

    const mapped = comments.map(mapComment);

    if (isPretty()) {
      if (mapped.length === 0) {
        printError("No comments found");
        return;
      }
      printTable(
        ["ID", "Author", "Node", "Message", "Resolved"],
        mapped.map((c) => [
          c.id,
          c.author,
          c.nodeId ?? "-",
          c.message.length > 60 ? c.message.slice(0, 57) + "..." : c.message,
          c.resolved ? "Yes" : "No",
        ])
      );
    } else {
      printJSON(mapped);
    }
  },
});
