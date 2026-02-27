# figma-cli

A scriptable, pipeable CLI for the Figma REST API. Like `gh` for GitHub, but for Figma.

> **Status: Foundation complete.** Auth, URL parsing, API client, and output formatting are implemented. Command implementations in progress. See [MASTERPLAN.md](MASTERPLAN.md).

---

## Quick Start

```sh
bun install

# Store your Figma personal access token
bun run cli auth set <token>

# Verify authentication
bun run cli auth status
```

## Implemented

- **`figma auth set <token>`** -- store a Figma PAT (interactive prompt if no arg)
- **`figma auth status`** -- verify token, show user name and email
- **`figma auth clear`** -- remove stored token
- **`--pretty`** -- human-readable output with color
- **`--json`** -- force JSON output (default)
- **`--no-color`** -- disable color in pretty mode

## Planned Commands

```sh
figma file <figma-url>         # File name, last modified, pages
figma frames <figma-url>       # List frames in a page/section/frame
figma export <figma-url>       # Export frames to PNG/JPG/SVG/PDF
figma comments <figma-url>     # List comments
figma variables <figma-url>    # Dump design tokens
figma components <figma-url>   # List published components
figma versions <figma-url>     # Version history
figma projects <team-id>       # Team projects and files
```

## Project Structure

```
src/
  cli.ts              # Entry point (citty)
  commands/            # One file per command
    auth.ts            # Auth subcommand router
    auth/              # Auth subcommands (set, status, clear)
    file.ts, frames.ts, export.ts, ...  # Command stubs
  lib/
    config.ts          # Token storage (~/.config/figma-cli/config.json)
    url-parser.ts      # Figma URL -> { fileKey, nodeId }
    api-client.ts      # Typed fetch wrapper for Figma REST API
    output.ts          # JSON/pretty output, error formatting
```

## Development

```sh
bun install
bun test              # Run all tests
bun run cli --help    # Show available commands
bun run cli --version # Show version
```
