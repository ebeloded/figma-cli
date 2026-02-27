# T10 - `figma variables` Command

## Goal

Export design token variable collections from a Figma file. This is the bridge between Figma's variable system and code -- useful for syncing tokens, auditing design decisions, or feeding a token pipeline.

## Background

Figma Variables are organized into collections, each with modes (e.g., Light/Dark) and variables of types: COLOR, FLOAT, STRING, BOOLEAN. The API returns them via `GET /v1/files/:key/variables/local`.

## Output (JSON default)

```json
{
  "collections": [
    {
      "name": "Colors",
      "modes": ["Light", "Dark"],
      "variables": [
        {
          "name": "colors/primary/500",
          "type": "COLOR",
          "values": {
            "Light": "#6366F1",
            "Dark": "#818CF8"
          }
        }
      ]
    }
  ]
}
```

## Flags

- `--collection <name>` -- filter to a single collection
- `--mode <name>` -- output values only for a specific mode
- `--format tokens` -- output in W3C Design Token format (future stretch goal)

## Expected Outcome

- Returns all variable collections with their variables and per-mode values
- Color values are output as hex strings (not raw Figma RGBA objects)
- Number values are output as plain numbers
- `--collection` flag filters the results correctly

## Verification

1. Run against a file with variables -- returns all collections
2. Color variable values are hex strings, not `{ r, g, b, a }` objects
3. `--collection Colors` -- only the Colors collection is returned
4. File with no variables -- returns `{ "collections": [] }` not an error
5. Result is valid JSON pipeable to `jq`
