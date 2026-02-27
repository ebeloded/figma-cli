# T13 - `figma projects` Command

## Goal

List projects and files belonging to a Figma team. The top-level navigation command -- useful when you don't have a specific file URL yet and need to browse the team's work.

## Commands

- `figma projects <team-id>` -- list all projects in a team
- `figma projects files <team-id>` -- list all files across all projects (flattened)

## Output (JSON default, projects)

```json
[
  {
    "id": "123456",
    "name": "Product Design",
    "files": [
      { "key": "Mq62Nug25i4tWCaZGifzdO", "name": "Directions 2026", "lastModified": "2025-02-20T10:30:00Z" }
    ]
  }
]
```

## Flags

- `--flat` -- flatten projects and files into a single list of files (with project name included)

## Finding a Team ID

Team IDs are visible in Figma URLs when browsing a team: `figma.com/files/team/:teamId/...`. This command should print a helpful hint about where to find the team ID if the user seems confused.

## Expected Outcome

- Returns all projects in the team with their contained files
- Each file entry includes its key (usable in other commands), name, and last modified date
- `--flat` produces a flat list of files across all projects

## Verification

1. `figma projects <valid-team-id>` -- returns a list with at least one project
2. Each file in the output has a `key` that can be passed directly to `figma file`
3. `--flat` returns a flat list with `project` field on each file
4. Invalid team ID gives a clear error (likely 403 or 404)
