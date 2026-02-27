# T07 - `figma file` Command

## Goal

Get a high-level overview of a Figma file: its name, last modified date, version, and the list of pages it contains. The entry point for exploring an unfamiliar file.

## Behavior

- Accepts a Figma file URL (node ID ignored if present)
- Calls `GET /v1/files/:key?depth=1` to get file metadata without pulling the full node tree
- Returns file-level info and a list of pages (canvas nodes)

## Output (JSON default)

```json
{
  "name": "Directions 2026",
  "lastModified": "2025-02-20T10:30:00Z",
  "version": "1234567890",
  "pages": [
    { "id": "0:1", "name": "Cover" },
    { "id": "435:51451", "name": "Misc" }
  ]
}
```

## Output (`--pretty`)

```
File:          Directions 2026
Last modified: 2025-02-20 10:30
Version:       1234567890

Pages (4):
  0:1          Cover
  435:51451    Misc
```

## Expected Outcome

- Returns file name, last modified timestamp, version string, and all pages
- Does not fetch the full node tree (uses `depth=1` to keep it fast)
- Page list matches what's visible in the Figma UI

## Verification

1. Run against the Directions 2026 file URL -- returns its correct name and page list
2. Response time is fast -- `depth=1` prevents a huge payload
3. `--pretty` output is readable with no raw JSON
4. Invalid file key gives a clear "file not found" error
