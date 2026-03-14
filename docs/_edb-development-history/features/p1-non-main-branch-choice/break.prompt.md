Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-non-main-branch-choice/01-break.md

Use:
- docs/bmad/templates/break.template.md

Context:
- Existing behavior/system contracts to consider:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-022_P3_P1_Non_Main_Branch_Choice_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`

Break focus:
- define the next bounded BMAD feature slice for non-`main` branch-choice expansion after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, and the completed first bounded switch-existing slice
- keep the slice strictly limited to the case where execution is already on a safe non-`main` branch
- make explicit that the operator should have two bounded options in that safe non-`main` context:
  - continue writing on the current branch
  - open one additional new branch and continue there
- make explicit that the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, and completed switch-existing baseline remain in force and are not reopened in this slice
- make explicit the smallest first implementation target: add one bounded new-branch option from an already-safe non-`main` branch without broadening into generalized Git workflow orchestration

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
- Do not broaden scope into blocked-`main` redesign, switch-existing redesign, target-resolution redesign, template-aware generation, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Do not reopen routing-owner, placement-rule, or policy-owner questions already settled by the current Phase-4 basis.

Unknowns must be appended to:
- <feature-root>/p1-non-main-branch-choice/questions.md

If the break introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
