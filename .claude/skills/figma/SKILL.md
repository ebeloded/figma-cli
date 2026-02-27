---
name: figma
description: Use the figma CLI to interact with Figma files, frames, exports, comments, variables, and team projects. Load this skill when asked to list frames, export assets, inspect a Figma file, read design tokens, check comments, or do anything with a Figma URL from the command line.
---

# figma CLI

A scriptable CLI for the Figma REST API. Already installed and authenticated globally via `bun link`.

## Key facts

- Accepts Figma URLs directly -- no manual key extraction needed
- Default output is JSON (pipe to `jq`)
- `--pretty` for human-readable output
- Auth token stored at `~/.config/figma-cli/config.json`
- Node IDs: hyphens in URLs (`435-51464`), colons in API (`435:51464`) -- the CLI handles conversion

## Commands

### Auth

```sh
figma auth set <token>    # Store PAT; prompts interactively if no arg
figma auth status         # Verify token, show user name and email
figma auth clear          # Remove stored token
```

### File info

```sh
figma file <url>           # Name, last modified, version, pages list
figma file <url> --pretty  # Human-readable format
```

### Frames

```sh
figma frames <url>          # List FRAME nodes in a page, section, or frame
figma frames <url> --deep   # Include nested frames recursively
figma frames <url> --pretty # Hierarchical: sections as headers, frames indented below
```

Output is a nested tree -- sections/groups become container nodes with `children`:
```json
[
  {
    "id": "322:33631", "name": "Section 3", "type": "SECTION",
    "width": 0, "height": 0,
    "children": [
      { "id": "322:33632", "name": "Video Studio", "type": "FRAME", "width": 1728, "height": 1117 }
    ]
  },
  { "id": "2:8272", "name": "Insights", "type": "FRAME", "width": 1440, "height": 900 }
]
```

Point to a section URL to get a flat list of just that section's frames:
```sh
figma frames "https://figma.com/design/:key/:name?node-id=322-33631"
```

### Export

```sh
figma export <url>                          # Export frames as PNG to ./exports/
figma export <url> --format svg             # svg | png | jpg | pdf
figma export <url> --scale 2               # 1 | 2 | 3 (PNG/JPG only)
figma export <url> --out /tmp/assets       # Custom output directory
figma export <url> --json                  # JSON array of { id, file, size }
```

File naming: `frame-01-435-53583.png` (zero-padded index + node ID)

If URL points to a section or page, all child frames are exported. If URL points to a single frame, only that frame is exported.

### Comments

```sh
figma comments <url>                          # List all comments on file
figma comments <url> --unresolved             # Only unresolved comments
figma comments <url> --author "Alice"         # Filter by author
figma comments post <url> --message "text"    # Post a comment
```

### Variables (design tokens)

```sh
figma variables <url>                         # All collections with modes and values
figma variables <url> --collection "Colors"   # Single collection
figma variables <url> --mode "Dark"           # Values for one mode only
```

Color values are hex strings (`#6366F1`), not raw RGBA objects.

### Components

```sh
figma components <url>                  # List local components
figma components <url> --styles         # List styles instead
figma components <url> --search button  # Filter by name (case-insensitive)
```

### Versions

```sh
figma versions <url>             # Version history (most recent first)
figma versions <url> --named     # Only explicitly named versions
figma versions <url> --limit 5   # Cap results
```

### Projects

```sh
figma projects <team-id>         # All projects and their files
figma projects <team-id> --flat  # Flat file list with project name on each
```

Team IDs appear in Figma URLs: `figma.com/files/team/:teamId/...`

## Global flags

| Flag | Effect |
|------|--------|
| `--pretty` | Human-readable tables with color |
| `--json` | Force JSON output (default, but explicit) |
| `--no-color` | Disable color in `--pretty` mode |

Errors always go to stderr. Exit 0 on success, 1 on error.

## Composing with jq

```sh
# Get all frame IDs from a section URL (flat output)
figma frames <section-url> | jq '.[].id'

# Get all frame IDs from a page (hierarchical -- recurse through sections)
figma frames <page-url> | jq '[.. | objects | select(.type == "FRAME") | .id]'

# Export only frames wider than 1000px (from a flat section)
figma frames <section-url> | jq '[.[] | select(.width > 1000) | .id] | join(",")'

# Count unresolved comments
figma comments <url> | jq '[.[] | select(.resolved == false)] | length'

# Get all variable names in a collection
figma variables <url> --collection Colors | jq '.collections[0].variables[].name'
```

## Error handling

```sh
# Suppress errors, only process success output
figma file <url> 2>/dev/null | jq '.name'

# Check if authenticated before running a script
figma auth status || { echo "Run: figma auth set <token>"; exit 1; }
```
