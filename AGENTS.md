---
description: Figma CLI project conventions and agent instructions.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Project Context

This is `figma-cli` -- a scriptable CLI for the Figma REST API, built with Bun and TypeScript. Think `gh` for Figma. It is in early development; no commands are implemented yet.

**Goal**: accept Figma URLs, output JSON by default, be pipeable and agent-friendly.

**Key files**:
- `IDEA.md` -- vision and full command surface
- `MASTERPLAN.md` -- task checklist (check this to understand what's done and what's next)
- `tasks/` -- individual PRD-style task specs
- `tasks/done/` -- completed tasks (moved here after finishing)
- `export-frames.ts` -- working prototype demonstrating the core export flow
- `.env` -- contains `FIGMA_API_KEY`

**Source layout** (once T01 is complete):
- `src/cli.ts` -- entry point
- `src/commands/` -- one file per command
- `src/lib/` -- shared utilities (api client, url parser, config, output)
- `src/types/` -- TypeScript types

## After Completing a Task

1. Mark it `[x]` in `MASTERPLAN.md`
2. Move the task file from `tasks/` to `tasks/done/`
3. Update `README.md` to reflect the new current state

## Figma API

- Base URL: `https://api.figma.com`
- Auth header: `X-Figma-Token: <pat>`
- Node IDs use `:` in the API (`1:2`) but `-` in URLs (`1-2`) -- always convert
- Rate limit: 15 req/min (Tier 1)
- Types: `@figma/rest-api-spec` (dev dep only, not bundled)

## Bun (use instead of Node.js)

- `bun <file>` not `node` or `ts-node`
- `bun test` not jest or vitest
- `bun build` not webpack or esbuild
- `bun install` not npm/yarn/pnpm install
- `Bun.file` / `Bun.write` instead of `fs.readFile` / `fs.writeFile`
- `Bun.$\`cmd\`` instead of execa
- `Bun.serve()` instead of express
- `bun:sqlite` instead of better-sqlite3
- Bun auto-loads `.env` -- no dotenv needed

## Output Conventions

- Default output: JSON (no color, no decoration) -- pipeable to `jq`
- `--pretty`: human-readable tables with color (picocolors)
- Errors: always to stderr, never stdout
- Exit codes: `0` success, `1` error

## Stack

- CLI framework: `citty`
- Interactive prompts: `@clack/prompts`
- Colors: `picocolors`
- Config: `~/.config/figma-cli/config.json`
- API types: `@figma/rest-api-spec` (dev dep)
