Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-branch-state-check-and-decision/04-deliver.md

Use:
- docs/bmad/templates/deliver.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/01-break.md`
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/02-model.md`
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/03-analyze.md`
  - `docs/_edb-development-history/features/p1-branch-state-check-and-decision/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Analysis_v0.1.md`

Deliver focus:
- lock the first bounded implementation contract for real branch-state detection before repo-tracked executor-side `P1 / Minor Change` writes
- reflect the chosen analysis outcome:
  - keep the first branch-hardening slice on the existing dedicated path-specific executor surface outside the Entry
  - use real Git branch-state detection plus bounded branch-dependent decision logic there
- preserve the completed `P1` contract-emission baseline, the completed first executor-side `P1` minimal write baseline, explicit stop behavior, and the explicit deferral of actual branch creation/switch execution
- make the first hardening implementation slice explicit enough to authorize later code work without broadening into generalized Git workflow orchestration, target-resolution redesign, or branch mutation behavior

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
- Do not reopen resolved questions without a new explicit contradiction.

Unknowns must be appended to:
- <feature-root>/p1-branch-state-check-and-decision/questions.md

If the deliver contract introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
