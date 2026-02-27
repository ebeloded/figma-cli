import { defineCommand } from "citty";
import { parseFigmaUrl } from "../../lib/url-parser.ts";
import { figmaPost, FigmaApiError } from "../../lib/api-client.ts";
import { printJSON, printError, printSuccess, isPretty } from "../../lib/output.ts";

interface FigmaCommentResponse {
  id: string;
  message: string;
  user: { handle: string };
  created_at: string;
  resolved_at: string | null;
  client_meta?: { node_id?: string } | null;
}

export default defineCommand({
  meta: {
    name: "post",
    description: "Post a comment on a file or node",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
    message: { type: "string", description: "Comment text", required: true },
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

    if (!args.message) {
      printError("--message is required");
      process.exit(1);
    }

    const body: Record<string, unknown> = { message: args.message };
    if (nodeId) {
      body.client_meta = { node_id: nodeId };
    }

    let comment: FigmaCommentResponse;
    try {
      comment = await figmaPost<FigmaCommentResponse>(
        `/v1/files/${fileKey}/comments`,
        body
      );
    } catch (err) {
      printError(
        err instanceof FigmaApiError ? err.message : `Unexpected error: ${err}`
      );
      process.exit(1);
    }

    const mapped = {
      id: comment.id,
      message: comment.message,
      author: comment.user.handle,
      createdAt: comment.created_at,
      resolved: comment.resolved_at !== null,
      nodeId: comment.client_meta?.node_id ?? null,
    };

    if (isPretty()) {
      printSuccess(`Comment posted (ID: ${mapped.id})`);
    } else {
      printJSON(mapped);
    }
  },
});
