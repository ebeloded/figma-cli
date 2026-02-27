# T05 - `figma frames` Command

## Goal

List all frames within a given Figma node -- whether that node is a page, a section, or a frame. This is the discovery command: you run it to find what's there before exporting.

## Behavior

- Accepts a Figma URL (with or without a node ID)
- If the URL points to a page (or has no node): lists all top-level frames on that page
- If the URL points to a section: lists all frames directly inside it
- If the URL points to a frame: lists that frame (and optionally its direct child frames with `--deep`)
- Skips helper/utility nodes (instances named `Helpers/*`, section title blocks, etc.)

## Output (JSON default)

```json
[
  { "id": "435:53583", "name": "Insights", "width": 1440, "height": 900 },
  { "id": "435:57116", "name": "Insights", "width": 1440, "height": 900 }
]
```

## Output (`--pretty`)

```
ID            Name       Size
435:53583     Insights   1440 x 900
435:57116     Insights   1440 x 900
```

## Flags

- `--pretty` -- human-readable table
- `--deep` -- include nested frames recursively (with depth indicated)

## Expected Outcome

- Given a section URL, outputs only the `frame` type children (not instances or helper nodes)
- Given a page URL, outputs top-level frames
- Output is valid JSON by default, parseable by `jq`
- `--pretty` output is a readable table with aligned columns

## Verification

1. Run against the section URL `435:51464` -- returns 7 frames matching the ones we exported manually
2. Run against a page URL -- returns only `frame` type nodes, not instances or groups
3. Pipe output to `jq '.[].id'` -- works, returns a list of IDs
4. `--pretty` flag produces a readable table with no JSON artifacts
5. Non-existent node ID gives a clear "not found" error
