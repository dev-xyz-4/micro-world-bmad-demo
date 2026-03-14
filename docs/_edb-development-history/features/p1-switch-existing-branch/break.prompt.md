Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-switch-existing-branch/01-break.md

Use:
- docs/bmad/templates/break.template.md

Context:
- Existing behavior/system contracts to consider:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`

Break focus:
- define the next bounded BMAD feature slice for switching to an already-existing branch after the completed executor-side `P1 / Minor Change` branch-state hardening step and the completed first bounded create-and-switch-from-main slice
- keep the slice strictly limited to switch-existing behavior after the already-completed `request_branch_change` decision path
- make explicit that the completed branch-state hardening baseline and the completed first branch-mutation baseline remain in force and are not reopened in this slice
- make explicit the smallest first implementation target: perform bounded switching to an already-existing non-`main` branch when the current guarded `P1` path requires branch change, without broadening into generalized Git workflow orchestration

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
- Do not broaden scope into create-and-switch-from-main redesign, target-resolution redesign, template-aware generation, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Do not reopen routing-owner, placement-rule, or policy-owner questions already settled by the current Phase-4 basis.

Unknowns must be appended to:
- <feature-root>/p1-switch-existing-branch/questions.md

If the break introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
