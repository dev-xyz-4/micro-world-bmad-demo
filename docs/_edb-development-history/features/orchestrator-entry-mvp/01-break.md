# Break — orchestrator-entry-mvp

## 1) Problem Statement (one paragraph)
- Current orchestration startup surfaces route correctly but do not yet provide a single bounded Entry MVP that accepts raw free-text goals and deterministically drives the first practical internal path subset (`P1 / P2 / P3`) while preserving separation from visible workflow-family assignment (`Minor Change` / `BMAD Feature`). This slice defines that CLI-first Entry MVP boundary and STOP/Clarify handling so continuation can proceed without collapsing routing, workflow, and authority layers.

## 2) Goal
- Define one bounded CLI-first Orchestrator Entry MVP planning slice for goal intake and path-aware next-step direction.
- Define the bounded clarify loop and explicit STOP/Clarify conditions that prevent guessing.
- Define internal path-resolution scope as `P1 / P2 / P3` while keeping visible workflow-family assignment as `Minor Change` or `BMAD Feature`.
- Define resulting next output/artifact direction per outcome, with `scripts/quality/flow-contract-starter.mjs` treated as a low-level primitive behind the BMAD branch.

## 3) Non-Goals
- No implementation code in this step.
- No UI/Vite surface.
- No `P0`, `P4`, or `P5` support in this MVP slice.
- No governance redesign, no policy restatement, and no second routing/policy source.
- No renaming/relocating `docs/bmad/guides/CODEX_ENTRY.md`.
- No restatement of binding behavior from `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md` into this feature artifact.
- No changes to `AGENTS.md` role as thin startup shim.
- No creation of `02-model.md`, `03-analyze.md`, or `04-deliver.md` in this task.

## 4) Users / Actors (if any)
- Planner/operator defining the bounded Entry MVP contract.
- Codex in Documentation-Only Mode producing feature-local planning artifacts.
- Reviewer/router confirming routing-owner integrity, workflow/policy delegation, and bounded scope.

## 5) Inputs / Outputs
### Inputs
- Work-unit baseline:
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_Work_Unit_P4-WU-012_P3_Orchestrator_Entry_MVP.md`
- Deterministic path contract baseline:
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_Deterministic_Flow_Path_Registry_Spec_final.md`
- Existing low-level primitive:
  - `scripts/quality/flow-contract-starter.mjs`
- Routing/policy owners:
  - `docs/bmad/guides/CODEX_ENTRY.md`
  - `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- Template:
  - `docs/bmad/templates/break.template.md`

### Outputs
- `docs/_edb-development-history/features/orchestrator-entry-mvp/01-break.md`
- `docs/_edb-development-history/features/orchestrator-entry-mvp/questions.md` (for resolved decisions and any future unresolved unknowns)
- Entry MVP v1 output direction is determined by the pair (`primary_path`, `workflow_route`), not by internal path alone:
  - (`P1`, `Minor Change`) -> emit docs-only / Minor Change next-step direction; do not create BMAD feature artifacts.
  - (`P1`, `BMAD Feature`) -> emit BMAD docs-planning next-step direction at the mode-aware feature root.
  - (`P2`, `Minor Change`) -> emit bounded small-code-change next-step direction under Minor Change flow.
  - (`P3`, `BMAD Feature`) -> emit BMAD feature next-step direction; `scripts/quality/flow-contract-starter.mjs` may later be used as a low-level primitive behind this branch.
  - (`P2`, `BMAD Feature`) is not valid in steady state and must be reclassified to `P3`.
- Explicit statement that implementation remains blocked until a later explicit `04-deliver.md`.
- Version note for this documentation planning step: `no SemVer change`.

## 6) Constraints
- Technical:
  - Preserve existing behavior outside scope.
  - Keep routing ownership in `docs/bmad/guides/CODEX_ENTRY.md`.
  - Keep binding behavior ownership in `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.
  - Keep workflow-family labels (`Minor Change`, `BMAD Feature`) separate from internal Primary Path resolution (`P1 / P2 / P3`).
  - Treat `scripts/quality/flow-contract-starter.mjs` as a low-level primitive behind BMAD branch flow, not as routing owner.
- Performance:
  - N/A for documentation-only planning slice.
- UX:
  - Entry intent must remain CLI-first and bounded for v1.
- Compatibility:
  - Must remain compatible with current Phase-4 deterministic flow/path registry model.
- Legal/Compliance (if relevant):
  - None identified.

## 7) Unknowns / Open Questions
- No blocking unknowns remain for this break slice.
- Bounded clarify-loop limit for v1: at most 2 clarify prompts; unresolved ambiguity after that becomes STOP/Clarify.
- No additional local alignment note is required before later deliver-stage drafting; current alignment is carried by `P4-WU-012` plus this `01-break.md`.
- Workflow-family output direction remains explicit:
  - `Minor Change` -> emit Minor-Change next-step direction only; no BMAD feature artifacts.
  - `BMAD Feature` -> emit BMAD next-step direction at the mode-aware feature root.

## 8) Success Criteria (high level)
- Entry MVP scope is bounded as CLI-first goal intake with a bounded clarify loop.
- Layer separation is explicit: internal `P1/P2/P3` resolution vs visible `Minor Change`/`BMAD Feature` workflow-family assignment.
- STOP/Clarify behavior is explicit enough to prevent guessing.
- Resulting next artifact/prompt/output direction is explicit at break level without implementation detail.
- Unresolved items are recorded in `questions.md`.
- No policy/routing owner drift is introduced.

## 9) Classification And Versioning Note
- Workflow classification: `BMAD Feature`.
- Version classification decision for this documentation planning step: `no SemVer change`.
- If later execution introduces release/tag impact, route history/handover updates via mode-aware targets defined in `docs/bmad/guides/CODEX_ENTRY.md`.
