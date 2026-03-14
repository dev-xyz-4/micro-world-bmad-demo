Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-branch-state-check-and-decision/02-model.md

Use:
- docs/bmad/templates/model.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/01-break.md`
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Analysis_v0.1.md`

Model focus:
- model the first bounded branch-hardening slice before repo-tracked executor-side `P1 / Minor Change` writes
- make explicit the key concepts, branch-state classes, data structures, state transitions, operator-decision semantics, and stop/continue behavior needed for the first slice
- preserve the accepted placement rule:
  - execution remains outside the Entry
  - contract definition remains outside the Entry
  - the Entry is not redefined as the branch-hardening surface
- keep real Git branch-state detection mandatory before repo-tracked `P1` writes continue
- keep actual branch creation/switch execution explicitly out of scope for this model
- keep the exact executor-surface question explicit where it is not yet safely decided

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
- Do not broaden scope into actual branch creation/switch automation, target-resolution redesign, template-aware generation, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Do not resolve the current executor-surface question by assumption; model it as an explicit decision point where necessary.

Unknowns must be appended to:
- <feature-root>/p1-branch-state-check-and-decision/questions.md

If the model introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
