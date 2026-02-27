# T14 - Installable Global Binary

## Goal

Make `figma` available as a global command -- type `figma export ...` from any directory. This is what turns the project from a local script into a real CLI tool.

## Approach

Bun can compile TypeScript to a standalone binary via `bun build --compile`. The binary bundles the runtime, so users don't need Bun installed to use it.

Two distribution paths:
1. **Development**: `bun link` installs the local project as a global `figma` command (for contributors)
2. **Distribution**: `bun build --compile` produces a single binary file for distribution

## Expected Outcome

- `bun link` in the project root makes `figma` available globally in the current shell
- `figma --help` works from any directory after linking
- `bun run build` produces a compiled binary at `./bin/figma`
- The compiled binary runs without Bun installed
- `package.json` has a `build` script and a `bin` entry

## package.json Requirements

- `"bin": { "figma": "./src/cli.ts" }` for `bun link`
- `"scripts": { "build": "bun build --compile ./src/cli.ts --outfile ./bin/figma" }`

## Verification

1. `bun link` -- `figma --help` works from a different directory
2. `bun run build` -- `./bin/figma` file exists and is executable
3. `./bin/figma --help` -- works without calling `bun` directly
4. `./bin/figma --version` -- outputs version from `package.json`
5. Binary size is reasonable (under 100MB; Bun binaries embed the runtime)
