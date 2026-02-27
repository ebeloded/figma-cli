# T11 - `figma components` Command

## Goal

List published components and styles in a Figma file. Useful for auditing the component library, checking what's published, or feeding a component inventory.

## Behavior

- `figma components <url>` -- list components in the file
- `figma components --styles <url>` -- list styles (colors, text, effects, grids) instead

## Output (JSON default, components)

```json
[
  {
    "key": "abc123",
    "name": "Button/Primary/Default",
    "description": "Primary action button",
    "componentSetName": "Button"
  }
]
```

## Flags

- `--styles` -- list styles instead of components
- `--search <query>` -- filter by name (case-insensitive substring match)

## Expected Outcome

- Returns a flat list of all local components with their names, keys, and descriptions
- Component set membership is indicated where applicable
- `--styles` returns color, text, and effect styles
- `--search` filters the output list

## Verification

1. Run against a file with a component library -- returns a non-empty list
2. Component names match what's visible in the Figma assets panel
3. `--styles` returns style objects with `type` field (`FILL`, `TEXT`, `EFFECT`, etc.)
4. `--search button` -- returns only components/styles with "button" in the name
5. File with no components -- returns `[]` not an error
