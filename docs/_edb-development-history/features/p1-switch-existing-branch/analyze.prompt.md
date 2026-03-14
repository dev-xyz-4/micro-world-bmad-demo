Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-switch-existing-branch/03-analyze.md

Use:
- docs/bmad/templates/analyze.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-switch-existing-branch/01-break.md`
  - `docs/_edb-development-history/features/p1-switch-existing-branch/02-model.md`
  - `docs/_edb-development-history/features/p1-switch-existing-branch/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`

Analyze focus:
- compare the smallest credible implementation shapes for the first bounded switch-existing slice after the completed executor-side `P1 / Minor Change` branch-state hardening step and the completed first bounded create-and-switch-from-main slice
- explicitly evaluate the currently open question:
  - should the first switch-existing slice remain limited to the blocked `main` path, or also allow a bounded branch-change request from an already-safe non-`main` branch
- preserve the accepted placement rule, the completed hardening baseline, the completed create-and-switch baseline, explicit stop behavior, and the explicit exclusion of generalized Git workflow orchestration
- recommend the thinnest implementation shape that adds bounded switch-existing behavior on the existing `P1` executor continuity path without reopening target-resolution redesign or wider Git workflow automation

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
- Do not resolve the open path-scope question by hand-waving; compare real bounded options and document the recommendation explicitly.

Unknowns must be appended to:
- <feature-root>/p1-switch-existing-branch/questions.md

If the analysis introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
