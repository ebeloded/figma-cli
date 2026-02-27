import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "components",
    description: "List published components and styles",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
