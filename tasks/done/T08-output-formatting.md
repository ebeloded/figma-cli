# T08 - Output Formatting & Global Flags

## Goal

Establish consistent output conventions across all commands. Every command should behave predictably whether it's being read by a human or piped to another tool.

## Background

Two audiences:
1. **Scripts/agents**: want clean JSON, no decorative text, pipeable to `jq`
2. **Humans**: want readable tables, colors, clear labels

The default should work for both as much as possible, but `--pretty` and `--json` provide explicit control.

## Conventions to Establish

- **Default output**: JSON (no color, no decorative text)
- `--pretty`: human-readable tables/lists, with color where useful (picocolors)
- `--json`: explicitly JSON, useful when piping and the default might be ambiguous
- **Errors**: always go to stderr, never stdout -- so piped output remains clean
- **Exit codes**: `0` on success, `1` on error

## Global Flags (available on all commands)

- `--pretty` -- human-readable output
- `--json` -- force JSON output (default, but explicit)
- `--no-color` -- disable color even in `--pretty` mode

## Error Format

JSON mode:
```json
{ "error": "Not authenticated. Run `figma auth set <token>`" }
```

Pretty mode:
```
Error: Not authenticated. Run `figma auth set <token>`
```

## Expected Outcome

- All commands respect `--pretty` and `--json`
- Errors never appear on stdout
- `figma <any-command> 2>/dev/null` -- only success output goes to stdout
- `figma <any-command> --pretty` -- output is readable by a human with no raw JSON
- Color is used in `--pretty` mode but never in JSON mode

## Verification

1. `figma file <url> | jq '.name'` -- works cleanly, returns just the name
2. `figma file <badurl> 2>/dev/null` -- stdout is empty
3. `figma file <badurl> 1>/dev/null` -- stderr shows the error
4. `figma file <url> --pretty` -- output has labels, alignment, no raw braces
5. `figma file <url> --no-color --pretty` -- same as above without ANSI codes
