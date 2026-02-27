import pc from "picocolors";

let prettyMode = false;
let noColor = false;

export function setPrettyMode(value: boolean) {
  prettyMode = value;
}

export function setNoColor(value: boolean) {
  noColor = value;
  if (value) {
    pc.createColors(false);
  }
}

export function isPretty(): boolean {
  return prettyMode;
}

export function printJSON(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: string[][]) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length))
  );

  const header = headers
    .map((h, i) => h.padEnd(colWidths[i]!))
    .join("  ");
  console.log(noColor ? header : pc.bold(header));
  console.log(colWidths.map((w) => "-".repeat(w)).join("  "));

  for (const row of rows) {
    console.log(
      row.map((cell, i) => (cell ?? "").padEnd(colWidths[i]!)).join("  ")
    );
  }
}

export function printError(msg: string) {
  if (prettyMode) {
    const formatted = noColor ? `Error: ${msg}` : pc.red(`Error: ${msg}`);
    console.error(formatted);
  } else {
    console.error(JSON.stringify({ error: msg }));
  }
}

export function printSuccess(msg: string) {
  if (prettyMode) {
    const formatted = noColor ? msg : pc.green(msg);
    console.log(formatted);
  } else {
    console.log(JSON.stringify({ message: msg }));
  }
}
