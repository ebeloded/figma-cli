import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "comments",
    description: "List or post comments on a file or node",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
  },
  subCommands: {
    post: () => import("./comments/post.ts").then((m) => m.default),
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
