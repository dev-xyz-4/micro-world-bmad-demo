# CODEX Entry

This document is the routing entry point for using Codex in this repository.
It provides startup sequence and owner-document links.

---

## Recommended Reading Order

For authoritative Codex behavior rules, refer to
`docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

Reading order:

1. `docs/bmad/README.md`
2. `docs/bmad/guides/BMAD_DECISION_MATRIX.md`
3. `docs/bmad/guides/BMAD_SETUP_Lean_Integration.md`
4. `docs/bmad/guides/BMAD_COMMIT_CONVENTIONS.md`
5. `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`

This sequence provides operational context.
Binding process behavior is owned by
`docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

---

## What To Do Next

After reading the documents above:

- Classify the task via `BMAD_DECISION_MATRIX.md`.
- Follow `CODEX_WORKFLOW_POLICY.md` for process behavior.
- Follow `BMAD_COMMIT_CONVENTIONS.md` for commit format and review expectations.
- Use `docs/entry/ORCHESTRATION_INDEX.md` as the canonical startup map for authority boundaries and mode-aware context (non-normative helper).

If classified as BMAD Feature:
- Resolve the BMAD feature artifact root via Mode-Aware Routing below.

If classified as Minor Change:
- Route log updates via the active mode target (see Mode-Aware Routing below and owner policy).

## Current Repo Practice - Model A (Execution Boundary)

Current repo practice (Model A): Codex may carry governed execution through `doctor` / `commit` / `push`.
For `pr-create` and later helper-governed PR steps, Codex must either execute the full explicit helper command with all required arguments or present the exact final command for operator execution.
Do not infer missing required helper flags/arguments; interpret the exact helper error first.


---

## Mode-Aware Routing

There are two operating modes:
Routing targets depend on the active mode (Project Mode by default).
Project Mode is the default behavior and requires no additional configuration.

### Project Mode (default)
Used by downstream projects.

Use these canonical targets:
- `docs/bmad/features/<feature-name>/`
- `docs/bmad/notes/minor-change-log.md`
- `docs/entry/chat-handover-protocol.md`
- `docs/engineering/engineering-baseline.md`

### EDB Mode (blueprint development only)
Activated when .planning/EDB_MODE exists locally (gitignored) or EDB_MODE=1 is set.

Use these canonical targets:
- `docs/_edb-development-history/features/<feature-name>/`
- `docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md`
- `docs/_edb-development-history/EDB_CHAT_HANDOVER_PROTOCOL.md`
- `docs/_edb-development-history/EDB_ENGINEERING_BASELINE.md`

If no mode indicator is present, Project Mode applies.

Guides and prompts must resolve canonical targets via this file and must not restate conflicting mode-specific paths.
In Project Mode, downstream live documents are the default targets.
In EDB Mode, `docs/_edb-development-history/` is the blueprint self-development target surface.
`docs/entry/ORCHESTRATION_INDEX.md` is a contextual orchestration map and does not replace policy authority.

Versioning and SemVer ownership route to:
- `docs/engineering/versioning.md`

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## Authority Note

This file is routing-only.
For binding behavior, classification enforcement, and stop rules, see:
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
