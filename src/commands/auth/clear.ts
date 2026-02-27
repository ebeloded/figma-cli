import { defineCommand } from "citty";
import { clearToken } from "../../lib/config.ts";
import { printError, printSuccess } from "../../lib/output.ts";

export default defineCommand({
  meta: {
    name: "clear",
    description: "Remove stored token",
  },
  async run() {
    try {
      await clearToken();
      printSuccess("Token cleared.");
    } catch (err) {
      printError(`Failed to clear token: ${err}`);
      process.exit(1);
    }
  },
});
