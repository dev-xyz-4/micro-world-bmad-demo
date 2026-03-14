Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-executor-minimal-write/01-break.md

Use:
- docs/bmad/templates/break.template.md

Context:
- Existing behavior/system contracts to consider:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-017_P3_P1_Executor_Minimal_Write_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Analysis_v0.1.md`

Break focus:
- define the first bounded BMAD feature slice for executor-side `P1 / Minor Change` minimal write behavior
- keep the slice strictly limited to executor behavior after the already-completed `P1` contract-emission baseline
- make explicit that branch-confirmed execution is required before any repo-tracked write occurs
- make explicit the smallest first implementation target: mandatory branch gate plus one simple docs-only write with no template expansion

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
- Do not reopen routing-owner, placement-rule, or policy-owner questions already settled by the current Phase-4 basis.

Unknowns must be appended to:
- <feature-root>/p1-executor-minimal-write/questions.md

If the break introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
