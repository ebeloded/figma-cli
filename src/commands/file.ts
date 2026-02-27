import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "file",
    description: "Show file info (name, last modified, pages)",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
