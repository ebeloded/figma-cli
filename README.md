# figma-cli

A scriptable, pipeable CLI for the Figma REST API. Like `gh` for GitHub, but for Figma.

Accepts Figma URLs directly. Outputs JSON by default (pipeable to `jq`). Use `--pretty` for human-readable output.

## Install

**Development (via Bun link):**

```sh
bun install
bun link
figma --help
```

**Compiled binary:**

```sh
bun run build          # produces ./bin/figma
./bin/figma --help     # works without Bun installed
```

Add `./bin/figma` to your PATH for global access.

## Auth

```sh
figma auth set <token>     # Store a Figma personal access token
figma auth status          # Verify token and show user info
figma auth clear           # Remove stored token
```

## Commands

### File inspection

```sh
figma file <url>           # File name, last modified, pages
figma frames <url>         # List frames in a page, section, or frame
figma versions <url>       # File version history
```

### Export

```sh
figma export <url>         # Export frames to image files
  --format png|jpg|svg|pdf   (default: png)
  --scale 1|2|3              (default: 1)
  --out <dir>                (default: ./exports)
```

### Content

```sh
figma comments <url>       # List comments on a file or node
figma comments post <url> --message "..."   # Post a comment
figma variables <url>      # Dump design token variable collections
figma components <url>     # List published components and styles
```

### Team & Projects

```sh
figma projects <team-id>   # List team projects and their files
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--pretty` | Human-readable output with color |
| `--json` | Force JSON output (default) |
| `--no-color` | Disable color output |

## Development

```sh
bun install
bun test
bun run cli -- <args>      # Run without compiling
bun run build              # Compile to ./bin/figma
```

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
