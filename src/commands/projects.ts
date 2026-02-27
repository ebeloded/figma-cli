import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "projects",
    description: "List team projects and their files",
  },
  args: {
    "team-id": { type: "positional", description: "Figma team ID" },
  },
  run() {
    throw new Error("Not implemented yet");
  },
});
