# T12 - `figma versions` Command

## Goal

Show the version history of a Figma file. Useful for auditing changes, finding when something was introduced, or restoring context about design decisions.

## Output (JSON default)

```json
[
  {
    "id": "1234567890",
    "label": "Ready for review",
    "description": "Updated spacing on all cards",
    "createdAt": "2025-02-20T10:30:00Z",
    "author": "Alice"
  }
]
```

## Flags

- `--limit <n>` -- show only the most recent N versions (default: 20)
- `--named` -- show only named versions (those with a label)

## Expected Outcome

- Returns a list of versions in reverse chronological order
- Auto-saves (versions without a label) are included by default
- `--named` filters to only explicitly saved/named versions
- `--limit` caps the result count

## Verification

1. Run against any file -- returns version history
2. Versions are in reverse chronological order (most recent first)
3. `--named` -- only returns versions with a non-empty label
4. `--limit 5` -- returns at most 5 versions
5. Unlabeled auto-saves are present in default output
