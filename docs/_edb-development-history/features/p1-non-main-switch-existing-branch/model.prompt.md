Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-non-main-switch-existing-branch/02-model.md

Use:
- docs/bmad/templates/model.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/01-break.md`
  - `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-023_P3_P1_Non_Main_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-022_P3_P1_Non_Main_Branch_Choice_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`

Model focus:
- model the first bounded safe non-`main` switch-existing slice after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, the completed first bounded switch-existing-from-main slice, and the completed first bounded non-`main` branch-choice slice
- make explicit the key concepts, safe non-`main` branch-choice states, data structures, state transitions, operator-intent semantics, and stop behavior needed for the first slice
- preserve the accepted placement rule:
  - execution remains outside the Entry
  - contract definition remains outside the Entry
  - the Entry is not redefined as the branch-mutation surface
- keep the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline mandatory before any bounded safe non-`main` switch-existing execution is considered
- keep generalized Git workflow orchestration explicitly out of scope for this model
- keep the still-unresolved question about the exact three-option decision/result shape explicit where it is not yet safely decided

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
- Do not broaden scope into blocked-`main` redesign, safe non-`main` create-and-switch redesign, target-resolution redesign, template-aware generation, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Do not resolve the open question about the exact three-option decision/result shape by assumption; model it as an explicit decision point where necessary.

Unknowns must be appended to:
- <feature-root>/p1-non-main-switch-existing-branch/questions.md

If the model introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
