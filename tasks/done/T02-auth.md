# T02 - Auth & Config Management

## Goal

Give users a way to store and verify their Figma Personal Access Token (PAT). The token should persist across sessions and be available to all commands without requiring it as a flag every time.

## Background

Figma PATs are passed via the `X-Figma-Token` header. They expire after a maximum of 90 days. Config should live at `~/.config/figma-cli/config.json` so it's user-scoped and not accidentally committed to a repo.

## Commands

- `figma auth set <token>` -- store the token; optionally prompt interactively if no token arg given
- `figma auth status` -- verify the token by calling `GET /v1/me`, print name + email on success
- `figma auth clear` -- remove the stored token

## Expected Outcome

- Running `figma auth set figd_...` stores the token to `~/.config/figma-cli/config.json`
- Running `figma auth status` confirms the token is valid and prints the authenticated user
- Running any other command without a stored token prints a clear "not authenticated" error with instructions
- `figma auth clear` removes the token and confirms removal
- Config directory and file are created automatically if they don't exist

## Verification

1. `figma auth set <valid-token>` exits 0; file exists at `~/.config/figma-cli/config.json`
2. `figma auth status` prints name and email of the token owner
3. `figma auth set <invalid-token>` followed by `figma auth status` prints an auth error
4. Delete the config file, run `figma file <url>` -- outputs "Not authenticated. Run `figma auth set <token>`"
5. `figma auth clear` -- config file no longer contains a token; subsequent `figma auth status` returns unauthenticated
