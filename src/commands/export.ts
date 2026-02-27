import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "export",
    description: "Export frames to PNG/JPG/SVG/PDF",
  },
  args: {
    url: { type: "positional", description: "Figma file or node URL" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
