import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "versions",
    description: "Show file version history",
  },
  args: {
    url: { type: "positional", description: "Figma file URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
