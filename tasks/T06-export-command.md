# T06 - `figma export` Command

## Goal

Export one or more Figma frames to local files. This is the primary action command -- the thing people will use most often.

## Behavior

- Accepts a Figma URL
- If the URL points to a single frame: exports that frame
- If the URL points to a section or page: discovers child frames (same logic as `frames` command) and exports all of them
- Calls `GET /v1/images/:key` with the collected node IDs
- Downloads the resulting S3 URLs in parallel
- Names output files with a zero-padded index and the node ID: `frame-01-435-53583.png`

## Flags

- `--format png|jpg|svg|pdf` -- export format (default: `png`)
- `--scale 1|2|3` -- pixel density multiplier (default: `1`; for PNG/JPG only)
- `--out <dir>` -- output directory (default: `./exports`)

## Output

Progress lines during download, then a summary:

```
Exporting 7 frames as PNG (2x)...
  [1/7] frame-01-435-53583.png  (2.5 MB)
  [2/7] frame-02-435-57116.png  (2.5 MB)
  ...
Done. 7 files saved to ./exports/
```

In `--json` mode: outputs an array of `{ id, file, size }` objects after completion.

## Expected Outcome

- Running against a section URL downloads all frames as files to the output directory
- Running against a single frame URL downloads exactly one file
- Files are named consistently and predictably
- The output directory is created if it doesn't exist
- Format and scale flags are respected
- Parallel downloads -- does not download sequentially
- If any individual download fails, reports the failure but continues with the rest

## Verification

1. Export section `435:51464` as PNG -- 7 files appear in `./exports/`
2. Export a single frame URL -- exactly 1 file downloaded
3. `--format svg` -- files have `.svg` extension, content is valid SVG
4. `--out /tmp/test-out` -- files appear in the specified directory, which is created if missing
5. `--scale 2` -- PNG dimensions are double the frame dimensions in Figma
6. `--json` flag -- outputs a JSON array with file paths and sizes, no progress text
