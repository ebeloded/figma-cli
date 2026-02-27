# T03 - Figma URL Parser

## Goal

A shared utility that accepts any Figma URL and reliably extracts `fileKey` and `nodeId`. All commands take URLs as their primary input, so this is foundational infrastructure used everywhere.

## Background

Figma URLs come in several formats:
- `figma.com/design/:fileKey/:name?node-id=1-2` (design file with node)
- `figma.com/design/:fileKey/:name` (design file, no node -- implies the first page)
- `figma.com/design/:fileKey/branch/:branchKey/:name?node-id=1-2` (branch -- use branchKey as fileKey)
- `figma.com/board/:fileKey/:name` (FigJam)
- `figma.com/make/:fileKey/:name` (Figma Make)

Node IDs use hyphens in URLs (`1-2`) but colons in the API (`1:2`). The parser must convert between them.

## Expected Outcome

- Given any valid Figma URL, returns `{ fileKey, nodeId? }`
- `nodeId` uses colon format (`1:2`) ready for API calls
- Handles all known URL formats
- Throws a clear, descriptive error for non-Figma URLs or malformed inputs
- Exported as a reusable utility callable by any command

## Verification

1. Parse `figma.com/design/ABC123/Name?node-id=435-51464` -- returns `{ fileKey: "ABC123", nodeId: "435:51464" }`
2. Parse `figma.com/design/ABC123/Name` -- returns `{ fileKey: "ABC123", nodeId: undefined }`
3. Parse `figma.com/design/ABC123/branch/XYZ/Name?node-id=1-2` -- returns `{ fileKey: "XYZ", nodeId: "1:2" }`
4. Parse `figma.com/board/ABC123/Name` -- returns `{ fileKey: "ABC123", nodeId: undefined }`
5. Pass `"not-a-figma-url"` -- throws error with message explaining the issue
6. Unit tests cover all cases above
