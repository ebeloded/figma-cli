# T09 - `figma comments` Command

## Goal

List and post comments on a Figma file or specific node. Useful for reviewing feedback in scripts, piping comment threads to other tools, or automating comment posting.

## Subcommands

- `figma comments <url>` -- list all comments on the file (or filtered to a node if node ID present in URL)
- `figma comments post <url> --message "..."` -- post a new comment on the node

## Output (JSON default, list)

```json
[
  {
    "id": "123",
    "message": "This needs more padding",
    "author": "Alice",
    "createdAt": "2025-02-20T10:00:00Z",
    "resolved": false,
    "nodeId": "435:53583"
  }
]
```

## Flags

- `--unresolved` -- only show unresolved comments
- `--author <name>` -- filter by author name
- `--message <text>` -- (for `post`) the comment text

## Expected Outcome

- `figma comments <file-url>` lists all comments in the file
- `figma comments <node-url>` lists only comments on that specific node
- `figma comments post <url> --message "..."` posts a comment and returns the new comment object
- `--unresolved` filters the list correctly
- Posted comments are immediately visible in the Figma UI

## Verification

1. `figma comments <file-url>` -- returns a non-empty array for a file with comments
2. Pipe to `jq '[.[] | select(.resolved == false)]'` -- filters correctly
3. `figma comments post <node-url> --message "Test comment"` -- comment appears in Figma UI
4. `--unresolved` on a file with both resolved and unresolved comments -- only unresolved returned
