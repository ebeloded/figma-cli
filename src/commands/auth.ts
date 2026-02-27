import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "auth",
    description: "Manage Figma authentication",
  },
  subCommands: {
    set: () => import("./auth/set.ts").then((m) => m.default),
    status: () => import("./auth/status.ts").then((m) => m.default),
    clear: () => import("./auth/clear.ts").then((m) => m.default),
  },
});
