# figma-cli

A scriptable, pipeable CLI for the Figma REST API. Like `gh` for GitHub, but for Figma.

Accepts Figma URLs directly. Outputs JSON by default (pipeable to `jq`). Use `--pretty` for human-readable output.

## Install

```sh
bun install -g @ebeloded/figma-cli
```

Requires [Bun](https://bun.sh) to be installed.

**From source:**

```sh
git clone https://github.com/ebeloded/figma-cli.git
cd figma-cli
bun install && bun link
```

## Quick Start

```sh
# Store your Figma personal access token
figma auth set <token>

# Inspect a file
figma file <figma-url>

# List frames
figma frames <figma-url>

# Export frames as PNGs
figma export <figma-url> --format png --scale 2 --out ./assets
```

## Auth

```sh
figma auth set <token>     # Store a Figma personal access token
figma auth status          # Verify token and show user info
figma auth clear           # Remove stored token
```

Get a personal access token from [Figma Settings > Personal access tokens](https://www.figma.com/developers/api#access-tokens).

## Commands

### File Inspection

```sh
figma file <url>           # File name, last modified, pages
figma frames <url>         # List frames in a page, section, or frame
figma frames <url> --deep  # Include nested frames recursively
figma versions <url>       # File version history
```

### Export

```sh
figma export <url>                          # Export frames as PNG
figma export <url> --format svg --scale 2   # SVG at 2x
figma export <url> --out ./assets           # Custom output directory
```

| Flag | Default | Options |
|------|---------|---------|
| `--format` | `png` | `png`, `jpg`, `svg`, `pdf` |
| `--scale` | `1` | `1`, `2`, `3` |
| `--out` | `./exports` | Any directory path |

### Content

```sh
figma comments <url>                        # List comments
figma comments post <url> --message "..."   # Post a comment
figma variables <url>                       # Design token variable collections
figma components <url>                      # Published components and styles
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

## Agent / CI Usage

Every command outputs structured JSON by default, making it easy to use in scripts and CI pipelines:

```sh
# Get frame IDs, then export specific ones
figma frames <url> | jq '.[].id'
figma export <frame-url> --format png --out ./assets

# Dump design tokens for diffing
figma variables <url> > tokens.json
```

## Claude Code Skill

This package includes a [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code/skills) that teaches Claude how to use the figma CLI:

```sh
bunx skills add ebeloded/figma-cli
```

Once installed, Claude Code can use `figma` commands directly when you ask it to interact with Figma files.

## Development

```sh
bun install
bun test
bun run cli -- <args>      # Run without compiling
bun run build              # Compile to ./bin/figma
```

## License

MIT
