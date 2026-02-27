# Figma CLI - Master Plan

## Status Key
- `[ ]` Pending
- `[~]` In Progress
- `[x]` Done

---

## Phase 1: Foundation

These tasks have no external-facing behavior -- they're the skeleton everything else attaches to. Do them in order.

- [x] [T01 - Project Structure & CLI Entry Point](tasks/done/T01-project-structure.md)
- [x] [T02 - Auth & Config Management](tasks/done/T02-auth.md)
- [x] [T03 - Figma URL Parser](tasks/done/T03-url-parser.md)
- [x] [T04 - API Client Module](tasks/done/T04-api-client.md)

---

## Phase 2: Core Commands

The two commands that cover 80% of use cases. T05 (`frames`) feeds into T06 (`export`).

- [ ] [T05 - `figma frames` Command](tasks/T05-frames-command.md)
- [ ] [T06 - `figma export` Command](tasks/T06-export-command.md)

---

## Phase 3: File Inspection & Output Polish

Round out the read-only API surface. T08 (output formatting) can be done alongside any Phase 2/3 task.

- [ ] [T07 - `figma file` Command](tasks/T07-file-command.md)
- [x] [T08 - Output Formatting & Global Flags](tasks/done/T08-output-formatting.md)

---

## Phase 4: Extended Commands

Non-critical but high-value. Order within this phase is flexible.

- [ ] [T09 - `figma comments` Command](tasks/T09-comments-command.md)
- [ ] [T10 - `figma variables` Command](tasks/T10-variables-command.md)
- [ ] [T11 - `figma components` Command](tasks/T11-components-command.md)
- [ ] [T12 - `figma versions` Command](tasks/T12-versions-command.md)
- [ ] [T13 - `figma projects` Command](tasks/T13-projects-command.md)

---

## Phase 5: Packaging

- [ ] [T14 - Installable Global Binary](tasks/T14-installable-binary.md)

---

## Completed Tasks

Completed task files are moved to `tasks/done/`.

---

## Open Decisions

- [ ] Shell completions (zsh/fish/bash) -- add as T15 if desired
- [ ] `figma variables set` (write-back) -- add as T16 if desired
- [ ] `figma watch` (polling for changes) -- add as T17 if desired

---

## Process Notes

- After completing a task: mark it `[x]`, move the file to `tasks/done/`, update `README.md`
- To inject a new task: add a file in `tasks/`, insert it at the right position in this list
- To reorder: just move the line -- the T-numbers are labels, not strict sequence constraints
