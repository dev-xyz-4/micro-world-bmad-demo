# BMAD Documentation

## Guides
- guides/BMAD_SETUP_Lean_Integration.md
- guides/BMAD_DECISION_MATRIX.md
- guides/BMAD_COMMIT_CONVENTIONS.md
- guides/CODEX_WORKFLOW_POLICY.md
- guides/TS_AUDIT_ROUTINE.md

## Project Context
- 00-project/project-overview.md
- 00-project/architecture-notes.md
- 00-project/glossary.md

## Features
- features/<feature-name>/ (Project Mode default example; resolve active mode-aware feature root via `docs/bmad/guides/CODEX_ENTRY.md`)

## Templates
- templates/break.template.md
- templates/model.template.md
- templates/analyze.template.md
- templates/deliver.template.md

## Notes
- notes/open-questions.md
- notes/rejected-approaches.md
- notes/decisions-log.md

## How to add a new BMAD feature (short)

1. Create a folder: `docs/bmad/features/<feature-name>/` (Project Mode default example; for EDB Mode, resolve the feature root via `docs/bmad/guides/CODEX_ENTRY.md`).
2. Add `04-deliver.md` before any implementation (implementation contract).
3. If decisions or trade-offs exist, add `03-analyze.md`.
4. If the problem is non-trivial, add `02-model.md`.
5. If scope or constraints are unclear, add `01-break.md`.
6. Do **not** implement anything before `04-deliver.md` exists.
7. Codex (VS Code plugin) must implement **only** from `04-deliver.md`.
8. Missing information goes into `questions.md`, never guessed.
9. If implementation diverges, update `04-deliver.md` first.
10. A feature is done only when code **and** deliver spec match.
