# T01 - Project Structure & CLI Entry Point

## Goal

Establish the foundational project layout and wire up a working CLI entry point that supports subcommands, `--help`, and version output. After this task, running `figma --help` should print usage, and `figma <unknown-command>` should give a helpful error.

## Scope

- Directory structure for source files (commands, lib, types)
- `package.json` configured for a global binary (`bin` field pointing to CLI entry)
- CLI entry point using `citty` for subcommand routing
- Placeholder stubs for all planned commands (so `--help` shows the full surface)
- `--version` flag returning the current package version
- `tsconfig.json` properly configured

## Out of Scope

- Actual command implementations (those are later tasks)
- Auth or API calls

## Expected Outcome

- `bun run cli --help` prints a formatted list of all commands with descriptions
- `bun run cli --version` prints the version
- `bun run cli <unknown>` prints an error and suggests `--help`
- Source is organized into `src/commands/`, `src/lib/`, `src/types/`
- `package.json` has a `bin` entry so `bun link` makes `figma` available globally

## Verification

1. Run `bun run cli --help` -- output lists all planned commands
2. Run `bun run cli --version` -- outputs a version string
3. Run `bun run cli notacommand` -- outputs a clear error, exit code 1
4. `src/` directory exists with `commands/` and `lib/` subdirectories
5. `package.json` has `"bin": { "figma": "..." }` entry
