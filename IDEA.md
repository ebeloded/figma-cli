# Figma CLI - Concept & Vision

## The Problem

The Figma MCP server is powerful but designed for conversational AI workflows -- it injects all its tools into the context window and requires an active LLM session to do anything. That's great for design-to-code, but it's the wrong tool when you just want to:

- Download all frames from a section as PNGs for a review deck
- Dump design tokens to diff against what's in code
- Post a batch of comments from a script
- Wire Figma exports into a CI pipeline
- Let an agent perform a targeted Figma action without polluting its context

There's no `gh`-equivalent for Figma. This is it.

## What It Is

`figma` is a scriptable CLI for the Figma REST API. It lets you interact with Figma files, frames, exports, comments, variables, and more -- from the terminal, from scripts, from CI, or from agents -- without a browser, without an LLM session, and without context overhead.

It accepts Figma URLs directly. It outputs JSON by default (pipeable to `jq`, composable with other tools). It has a `--pretty` flag for humans.

## Design Philosophy

- **URL-first**: paste a Figma URL, it works. No manual file key extraction.
- **JSON by default**: every command outputs structured data. Pipe it, transform it, store it.
- **Minimal, composable**: commands do one thing well. `frames` lists frames. `export` exports them. Pipe them together if needed.
- **No state, no session**: each invocation is independent. Works in CI, cron jobs, agent loops.
- **Bun-native**: fast startup, native TypeScript, no build step needed during development.

## Command Surface

### Auth
```
figma auth set <token>     Store a Figma PAT
figma auth status          Verify the stored token and show user info
figma auth clear           Remove stored token
```

### File Inspection
```
figma file <url>           File name, last modified, pages list
figma frames <url>         List frames within a page, section, or frame
figma versions <url>       File version history
```

### Export
```
figma export <url>         Export frames to PNG/JPG/SVG/PDF
  --format png|jpg|svg|pdf   (default: png)
  --scale 1|2|3              (default: 1)
  --out <dir>                Output directory (default: ./exports)
```

### Content
```
figma comments <url>       List comments on a file or node
figma comments post <url> --message "..."   Post a comment
figma variables <url>      Dump design token variable collections
figma components <url>     List published components and styles
```

### Team & Projects
```
figma projects <team-id>   List team projects and their files
```

## Agent Use Case

Because the CLI outputs JSON and accepts URLs, it's a natural tool for AI agents:

```
# An agent can call this to get frame list, then decide what to export
figma frames <section-url> --json
figma export <frame-url> --format png --out ./assets
```

No MCP server needed. No tool-list context bloat. Just a subprocess call.

## What It Is Not

- Not a design editor or write-back tool (for now -- variables write-back is a future candidate)
- Not a real-time listener (use webhooks + a server for that)
- Not a replacement for the Figma MCP in design-to-code LLM workflows

## Roadmap Candidates (Post-MVP)

- `figma watch <url>` -- poll for file changes and emit events
- `figma variables set` -- write design tokens back to Figma
- `figma dev-resources` -- manage Figma-to-code links
- `figma diff <url> <url>` -- compare two file versions
- Shell completions (zsh, fish, bash)
- Config profiles (multiple tokens / workspaces)

## Stack

- **Runtime**: Bun
- **CLI framework**: citty (argument parsing, subcommands)
- **UI/prompts**: @clack/prompts (interactive auth setup)
- **API types**: @figma/rest-api-spec (TypeScript types only, no runtime dep)
- **Output colors**: picocolors
- **Config**: `~/.config/figma-cli/config.json` via `Bun.file` / `Bun.write`

## From Prototype to README

This `IDEA.md` documents the vision. As the project reaches feature completeness, it will be merged into `README.md` and rewritten as documentation rather than vision.
