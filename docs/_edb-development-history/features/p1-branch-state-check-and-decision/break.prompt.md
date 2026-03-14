Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-branch-state-check-and-decision/01-break.md

Use:
- docs/bmad/templates/break.template.md

Context:
- Existing behavior/system contracts to consider:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Analysis_v0.1.md`

Break focus:
- define the first bounded BMAD feature slice for real branch-state detection before repo-tracked executor-side `P1 / Minor Change` writes
- keep the slice strictly limited to branch-state hardening after the already-completed first executor-side `P1` minimal write baseline
- make explicit that real Git branch-state detection replaces the current confirmation-only safety gate for this path
- make explicit the smallest first implementation target: detect `main` vs non-`main` vs unknown and return branch-dependent continue/stop/branch-change-intent decisions without executing actual branch creation/switch

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
- Do not reopen routing-owner, placement-rule, or policy-owner questions already settled by the current Phase-4 basis.

Unknowns must be appended to:
- <feature-root>/p1-branch-state-check-and-decision/questions.md

If the break introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
