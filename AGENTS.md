# AGENTS

Purpose: thin repository-root execution-instruction surface for Codex startup.
This file is non-normative and points only to canonical repo-tracked sources.

## Start Here

1. Read `docs/bmad/guides/CODEX_ENTRY.md`.
2. Use `docs/entry/ORCHESTRATION_INDEX.md` as the startup orientation map.
3. Follow `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md` for binding Codex behavior.
4. Treat this file as a thin startup surface only; all routing, workflow, and authority rules live in the referenced documents.

## Owner Boundaries

- Workflow owner: `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- Versioning owner: `docs/engineering/versioning.md`
- Project classification owner: `docs/engineering/guides/PROJECT_CLASSIFICATION.md`

## Governed Execution Boundary

For repo-changing execution, use the existing governed repository execution path.
Treat `scripts/quality/pr-helper.sh` as an external helper surface where available.
Do not duplicate policy content or helper mechanics here.

## Note

This file must remain thin and must not become a second policy, routing, or evidence source.
Do not use this file as an execution tracker; active execution truth belongs in the governed carrier for the current workflow.
