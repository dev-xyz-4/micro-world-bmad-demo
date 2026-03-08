# Break — p3-flow-contract-scaffold

## 1) Problem Statement (one paragraph)
- The first controlled `P3 - BMAD Feature Implementation` entry currently requires manual startup work across multiple existing contracts (Phase-4 path attributes, Flow Contract visibility, BMAD artifact setup, and stop/clarify boundaries). That startup is drift-prone and can cause inconsistent scope guards or missing routing evidence. This first slice defines a minimal, path-aware P3 starter/Flow-Contract scaffold so startup becomes explicit and repeatable without changing Model A, governance ownership, or authority-layer boundaries.

## 2) Goal
- Define one small, bounded first feature slice for a path-aware P3 starter / Flow-Contract scaffold.
- Make scope, non-scope, required inputs, expected outputs/artifacts, and acceptance criteria explicit enough to draft a later `04-deliver.md` without guessing.
- Keep all behavior within existing Phase-4 and BMAD contracts; do not introduce redesign.

## 3) Non-Goals
- No implementation code or helper/tool redesign.
- No governance redesign, owner-boundary changes, or new workflow categories.
- No broad architecture expansion or multi-slice planning in this step.
- No creation of `02-model.md`, `03-analyze.md`, `04-deliver.md`, `README.md`, or `changelog.md` in this step.

## 4) Users / Actors (if any)
- Planner/operator opening the first controlled P3 feature slice.
- Codex working in Documentation-Only Mode under `CODEX_ENTRY.md` and `CODEX_WORKFLOW_POLICY.md`.
- Reviewer/router validating scope guard, authority boundaries, and closure readiness for next-step planning artifacts.

## 5) Inputs / Outputs
### Inputs
- Feature slug and target path: `docs/bmad/features/p3-flow-contract-scaffold/`.
- Existing controlled-P3 and Work-Unit constraints from:
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_Controlled_P3_Entry_Decision_v0.1.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_Work_Unit_P4-WU-010_P3_Work-Unit Record.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_Deterministic_Flow_Path_Registry_Spec_final.md`
- BMAD routing/policy/template inputs:
  - `docs/bmad/guides/CODEX_ENTRY.md`
  - `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
  - `docs/bmad/templates/break.template.md`
- Documentation-only constraints supplied for this task.

### Outputs
- `docs/bmad/features/p3-flow-contract-scaffold/01-break.md` with explicit bounded scope for the first slice.
- `docs/bmad/features/p3-flow-contract-scaffold/questions.md` with unresolved or blocking points (no silent assumptions).
- Explicit statement that implementation remains blocked until a later explicit `04-deliver.md`.
- Explicit version decision for this planning slice: `no SemVer change`.

## 6) Constraints
- Technical:
  - Preserve Model A as active repo practice; no helper-boundary redesign.
  - Preserve authority separation: routing is delegation-only, logs are historical-only, templates are structural/reference-only.
  - Preserve behavior outside this slice; no cross-domain authority leakage.
  - Keep this as a single bounded first slice for controlled P3 startup.
- Performance:
  - No runtime/system performance changes in this documentation-only slice.
- UX:
  - Reduce startup ambiguity by making required startup contract elements explicit and easy to follow.
- Compatibility:
  - Must stay compatible with existing Phase-4/BMAD workflow classification and controlled-P3 decision boundaries.
- Legal/Compliance (if relevant):
  - None identified for this documentation-only planning slice.

## 7) Unknowns / Open Questions
- Confirm the exact minimum artifact set that the future `04-deliver.md` must require for the starter/scaffold beyond this break and questions file.
- Confirm whether first-slice outputs in later phases are strictly feature-local docs or may include bounded updates to existing planning continuity artifacts.
- Confirm whether optional helper-assisted generation steps are allowed in later phases or must be fully deferred.
- Confirm whether any mode-aware continuity/handover writeback is expected for a docs-only BMAD planning slice when SemVer is unchanged.

## 8) Success Criteria (high level)
- The first slice is explicitly bounded as one small controlled P3 BMAD feature-planning slice.
- Scope and non-scope are explicit and aligned with controlled-P3 constraints.
- Required inputs and expected outputs/artifacts are explicit enough that a later `04-deliver.md` can be drafted without implicit assumptions.
- Boundaries are explicit: no implementation before explicit `04-deliver.md`, no governance/helper/owner-boundary redesign in this slice.
- All unresolved or blocking points are recorded in `questions.md`.

## 9) Classification And Versioning Decision
- Workflow classification: `BMAD Feature`.
- Version classification decision for this step: `no SemVer change` (documentation-only planning artifacts; no implementation/runtime behavior release impact).
- Mode-aware routing note: no version/tag-triggered log or handover update is required for this step; if later work introduces release/tag impact, route via canonical mode targets from `docs/bmad/guides/CODEX_ENTRY.md`.
