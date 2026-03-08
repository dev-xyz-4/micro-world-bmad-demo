# BMAD Commit Conventions

This document defines **commit message conventions**
that reflect the decision made in  
`BMAD_DECISION_MATRIX.md`.

Commits must make it **immediately visible**
whether a change followed **BMAD** or was a **Minor Change**.

---

## 1) Core Principle

**Process choice must be visible in Git history.**

- BMAD Features → commits reference **feature deliver specs**
- Minor Changes → commits reference **minor-changes log**

---

## 2) Commit Prefixes (Mandatory)

### BMAD Features

Use when the change is classified as a **BMAD Feature**.

feat(<feature-name>): <short description>

Examples:  
feat(user-profiles): add profile activation flow  
feat(data-export): introduce CSV export pipeline

Requirements:
- `<feature-name>` must match the active mode BMAD feature root resolved via `docs/bmad/guides/CODEX_ENTRY.md` (for Project Mode, this is `docs/bmad/features/<feature-name>/`)
- `04-deliver.md` must exist **before** or **in the same commit**
- If architecture changed, related BMAD docs must be updated

---

### Minor Changes

Use when the change is classified as a **Minor Change**.

minor(<type>): <short description>

Note:
- `minor(...)` is a workflow/commit prefix and is **not** a SemVer `MINOR` classification.

Allowed `<type>` values:
- bugfix
- refactor
- cleanup
- perf
- docs
- chore

Examples:  
minor(bugfix): fix null handling in settings form  
minor(refactor): simplify request validation helper  
minor(perf): reduce repeated list re-rendering

Requirements:
- Entry must be added to `docs/bmad/notes/minor-change-log.md`
  (Project Mode default example; resolve active mode-aware log target via `docs/bmad/guides/CODEX_ENTRY.md`)
- No BMAD feature docs are created
- No new abstractions introduced

---

## 3) Mixed Commits (Docs + Code)

Mixed commits are allowed if they respect the process choice.

### BMAD Feature — Mixed Commit

feat(<feature-name>): implement according to deliver spec

- update `<feature-root>/<feature-name>/04-deliver.md` (resolve `<feature-root>` via `docs/bmad/guides/CODEX_ENTRY.md`; Project Mode default is `docs/bmad/features/`)
- implement changes in src/...

### Minor Change — Mixed Commit

minor(refactor): clean up shared module utils

- update docs/bmad/notes/minor-change-log.md
- refactor src/<module>/utils.ts

---

## 4) Forbidden Commit Patterns

The following are **not allowed**:

- feat without a BMAD feature folder
- minor commits that introduce new structure
- code changes without matching documentation update
- vague messages (update stuff, fix things, wip)

---

## 5) Review Rules

During review, verify:

- Commit prefix matches Decision Matrix classification
- Required documentation exists and is updated
- `04-deliver.md` still matches implemented behavior
- Minor changes remain local and reversible

If any check fails → request changes.

---

## 6) Codex Usage

This document defines **commit conventions only**.

All Codex behavior rules (modes, stop behavior, gates)
are defined in:

`docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

---

## Final Rule

Commits document not just **what** changed,  
but **how the decision to change was made**.

If the prefix feels unclear → revisit the Decision Matrix.
