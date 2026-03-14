Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-executor-minimal-write/04-deliver.md

Use:
- docs/bmad/templates/deliver.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-executor-minimal-write/01-break.md`
  - `docs/_edb-development-history/features/p1-executor-minimal-write/02-model.md`
  - `docs/_edb-development-history/features/p1-executor-minimal-write/03-analyze.md`
  - `docs/_edb-development-history/features/p1-executor-minimal-write/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-017_P3_P1_Executor_Minimal_Write_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Analysis_v0.1.md`

Deliver focus:
- lock the first bounded implementation contract for executor-side `P1 / Minor Change` minimal write behavior
- reflect the chosen analysis outcome:
  - use one dedicated path-specific executor surface outside the Entry
  - use the contract's resolved `target_path_hint` directly for the first bounded write proof
- preserve the completed `P1` contract-emission baseline, mandatory branch-confirmed execution, explicit stop behavior, and the one-artifact/no-template boundary
- make the first implementation slice explicit enough to authorize later code work without broadening into generalized executor behavior

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
- Do not reopen resolved questions without a new explicit contradiction.

Unknowns must be appended to:
- <feature-root>/p1-executor-minimal-write/questions.md

If the deliver contract introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
