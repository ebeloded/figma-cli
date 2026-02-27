import { defineCommand } from "citty";
import { getToken } from "../../lib/config.ts";
import { printError, printJSON, isPretty } from "../../lib/output.ts";
import pc from "picocolors";

export default defineCommand({
  meta: {
    name: "status",
    description: "Verify stored token and show user info",
  },
  async run() {
    const token = await getToken();
    if (!token) {
      printError("Not authenticated. Run `figma auth set <token>`");
      process.exit(1);
    }

    const res = await fetch("https://api.figma.com/v1/me", {
      headers: { "X-Figma-Token": token },
    });

    if (!res.ok) {
      if (res.status === 401) {
        printError("Invalid token. Run `figma auth set <token>`");
      } else {
        printError(`Figma API error: ${res.status} ${res.statusText}`);
      }
      process.exit(1);
    }

    const user = (await res.json()) as { handle: string; email: string };

    if (isPretty()) {
      console.log(`${pc.bold("User:")}  ${user.handle}`);
      console.log(`${pc.bold("Email:")} ${user.email}`);
    } else {
      printJSON({ handle: user.handle, email: user.email });
    }
  },
});
