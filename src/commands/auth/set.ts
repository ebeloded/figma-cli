import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { setToken } from "../../lib/config.ts";
import { printError, printSuccess } from "../../lib/output.ts";

export default defineCommand({
  meta: {
    name: "set",
    description: "Store a Figma personal access token",
  },
  args: {
    token: { type: "positional", description: "Figma PAT", required: false },
  },
  async run({ args }) {
    let token = args.token;

    if (!token) {
      p.intro("Figma CLI Authentication");
      const value = await p.text({
        message: "Enter your Figma personal access token:",
        validate(val) {
          if (!val.trim()) return "Token is required";
        },
      });

      if (p.isCancel(value)) {
        p.cancel("Authentication cancelled.");
        process.exit(1);
      }

      token = value;
      p.outro("Token saved.");
    }

    try {
      await setToken(token);
      printSuccess("Token stored. Run `figma auth status` to verify.");
    } catch (err) {
      printError(`Failed to store token: ${err}`);
      process.exit(1);
    }
  },
});
