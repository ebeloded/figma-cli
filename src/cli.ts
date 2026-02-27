#!/usr/bin/env bun
import { defineCommand, runMain } from "citty";
import { setPrettyMode, setNoColor } from "./lib/output.ts";

const main = defineCommand({
  meta: {
    name: "figma",
    version: "0.1.0",
    description: "Scriptable CLI for the Figma REST API",
  },
  args: {
    pretty: {
      type: "boolean",
      description: "Human-readable output",
      default: false,
    },
    json: {
      type: "boolean",
      description: "Force JSON output (default)",
      default: false,
    },
    "no-color": {
      type: "boolean",
      description: "Disable color output",
      default: false,
    },
  },
  setup({ args }) {
    if (args.pretty) {
      setPrettyMode(true);
    }
    if (args["no-color"]) {
      setNoColor(true);
    }
  },
  subCommands: {
    auth: () => import("./commands/auth.ts").then((m) => m.default),
    file: () => import("./commands/file.ts").then((m) => m.default),
    frames: () => import("./commands/frames.ts").then((m) => m.default),
    export: () => import("./commands/export.ts").then((m) => m.default),
    comments: () => import("./commands/comments.ts").then((m) => m.default),
    variables: () => import("./commands/variables.ts").then((m) => m.default),
    components: () => import("./commands/components.ts").then((m) => m.default),
    versions: () => import("./commands/versions.ts").then((m) => m.default),
    projects: () => import("./commands/projects.ts").then((m) => m.default),
  },
});

runMain(main);
