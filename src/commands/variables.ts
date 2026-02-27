import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "variables",
    description: "Dump design token variable collections",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
