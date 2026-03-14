Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-executor-minimal-write/02-model.md

Use:
- docs/bmad/templates/model.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-executor-minimal-write/01-break.md`
  - `docs/_edb-development-history/features/p1-executor-minimal-write/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-017_P3_P1_Executor_Minimal_Write_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Analysis_v0.1.md`

Model focus:
- model the first bounded executor-side `P1 / Minor Change` minimal write slice after the completed contract-emission baseline
- make explicit the key concepts, data structures, state transitions, branch-gate semantics, stop/completion semantics, and simple docs-write behavior needed for the first slice
- preserve the accepted placement rule:
  - execution remains outside the Entry
  - contract definition remains outside the Entry
  - the Entry is not redefined as the executor surface
- keep branch-confirmed execution mandatory before any repo-tracked write
- keep the first write target and executor-surface questions explicit where they are not yet safely decided

Constraints:
- Preserve existing behavior outside scope.
- Do not invent new requirements.
- Do not write implementation code.
- Do not modify repository structure.
- Do not modify governance documents unless explicitly instructed.
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md` (do not hardcode local paths in the prompt body).
- Namespace clarifier: workflow classification uses `Minor Change (workflow)` / `BMAD Feature`; version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`.
- If this documentation-only change triggers version/tagging expectations, capture an explicit SemVer decision (`SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR` / `no SemVer change`) and follow canonical log/handover routing via CODEX_ENTRY.md.
- For this planning step, capture: `no SemVer change`.
- Do not broaden scope into `P2`, `P3`, template-aware generation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.
- Do not resolve currently open executor-surface or first-target questions by assumption; model them as explicit decision points where necessary.

Unknowns must be appended to:
- <feature-root>/p1-executor-minimal-write/questions.md

If the model introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
