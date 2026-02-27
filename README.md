# figma-cli

A scriptable, pipeable CLI for the Figma REST API. Like `gh` for GitHub, but for Figma.

> **Status: Early development.** No commands implemented yet. See [MASTERPLAN.md](MASTERPLAN.md).

---

## What's Here

| File | Purpose |
|------|---------|
| `export-frames.ts` | Working prototype -- exports frames from a hardcoded section as PNGs |
| `IDEA.md` | Vision, design philosophy, full command surface |
| `MASTERPLAN.md` | Task checklist with links to individual specs |
| `tasks/` | PRD-style spec for each task |
| `.env` | `FIGMA_API_KEY` -- required for the prototype |

## Running the Prototype

```sh
# Requires FIGMA_API_KEY in .env
bun export-frames.ts
# Downloads 7 PNG frames to ./exports/
```

## Planned Usage (once built)

```sh
figma auth set <token>
figma frames <figma-url>
figma export <figma-url> --format png --scale 2 --out ./exports
figma file <figma-url>
figma comments <figma-url>
figma variables <figma-url>
```

## Development

```sh
bun install
bun test
```
