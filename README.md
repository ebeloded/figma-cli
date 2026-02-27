# figma-cli

A scriptable, pipeable CLI for the Figma REST API. Like `gh` for GitHub, but for Figma.

---

## Quick Start

```sh
bun install
bun run cli auth set <token>
bun run cli auth status
```

## Commands

```sh
figma auth set <token>    # Store a Figma PAT (interactive prompt if no arg)
figma auth status         # Verify token, show user name and email
figma auth clear          # Remove stored token

figma file <url>          # File name, last modified, pages
figma frames <url>        # List frames in a page, section, or frame
figma export <url>        # Export frames to PNG/JPG/SVG/PDF
```

## Global Flags

- `--pretty` -- human-readable output with color
- `--json` -- force JSON output (default)
- `--no-color` -- disable color in pretty mode

## Project Structure

```
src/
  cli.ts              # Entry point (citty)
  commands/           # One file per command
  lib/
    config.ts         # Token storage (~/.config/figma-cli/config.json)
    url-parser.ts     # Figma URL -> { fileKey, nodeId }
    api-client.ts     # Typed fetch wrapper for Figma REST API
    output.ts         # JSON/pretty output, error formatting
    frames.ts         # Shared frame discovery logic
```

## Development

```sh
bun install
bun test
bun run cli --help
```
