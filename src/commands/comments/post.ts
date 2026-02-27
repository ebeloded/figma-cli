import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "post",
    description: "Post a comment on a file or node",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
    message: { type: "string", description: "Comment text", required: true },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
