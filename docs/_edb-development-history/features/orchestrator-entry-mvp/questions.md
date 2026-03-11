# Questions — orchestrator-entry-mvp

## Resolved
- [x] Feature root is mode-resolved via `docs/bmad/guides/CODEX_ENTRY.md` (EDB Mode target: `docs/_edb-development-history/features/`).
- [x] This bounded planning/drafting sequence is documentation-only and now includes `01-break.md`, `02-model.md`, `03-analyze.md`, `04-deliver.md`, and `questions.md`.
- [x] `CODEX_ENTRY.md` remains routing owner; `CODEX_WORKFLOW_POLICY.md` remains behavior owner; `AGENTS.md` remains startup shim only.
- [x] Entry MVP v1 scope excludes UI/Vite and excludes `P0`, `P4`, `P5` support.
- [x] Bounded clarify-loop limit is fixed for v1 at maximum 2 clarify prompts; unresolved ambiguity after that is explicit STOP/Clarify.
- [x] Supported steady-state outcome logic is keyed by (`primary_path`, `workflow_route`) with supported pairs:
  - (`P1`, `Minor Change`)
  - (`P1`, `BMAD Feature`)
  - (`P2`, `Minor Change`)
  - (`P3`, `BMAD Feature`)
- [x] (`P2`, `BMAD Feature`) is not valid in steady state and must be reclassified to `P3` before outcome emission.
- [x] No additional local alignment note is required before implementation authorization; alignment is already captured by WU-012 plus feature-local artifacts.
- [x] `scripts/quality/flow-contract-starter.mjs` is treated as a low-level primitive behind the `P3`/`BMAD Feature` branch and is not routing owner.
- [x] Analyze decision: Option A (CLI-first deterministic Entry MVP with bounded clarify and explicit STOP/Clarify) is the chosen v1 shape.
- [x] Option B (optional bounded AI-assisted clarify helper) is deferred and not part of the initial v1 implementation contract.
- [x] Option C (UI-first / Vite-first Entry) is rejected for v1 as too broad for the bounded first slice.
- [x] The Entry remains routing-centered and emits next-step direction only; it does not replace the existing governed Git-/PR execution path.
- [x] The bounded first implementation surface is:
  - `scripts/quality/orchestrator-entry.mjs` (new)
  - `scripts/quality/flow-contract-starter.mjs` (read-only downstream primitive; no ownership change)
- [x] `stop-result` must carry a structured `clarify_packet` with:
  - trigger
  - missing/conflicting input
  - 1–3 valid options
  - recommendation
  - next action / decider
  - blocker pointer if applicable
- [x] This documentation-only planning/drafting sequence records: `no SemVer change`.

## Open / Blocking
- none