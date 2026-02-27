import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "frames",
    description: "List frames within a page, section, or frame",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
