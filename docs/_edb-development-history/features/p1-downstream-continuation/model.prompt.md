# Model Prompt — `p1-downstream-continuation`

Derived from:
- `docs/bmad/templates/documentation-only.prompt.md`

```text
Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/p1-downstream-continuation/02-model.md

Use:
- docs/bmad/templates/model.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/_edb-development-history/features/p1-downstream-continuation/01-break.md`
  - `docs/_edb-development-history/features/p1-downstream-continuation/questions.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-014_P3_P1_Downstream_Continuation_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/p1-downstream-contract/Phase4_P1_Downstream_Action_Contract_Model_v0.3.md`
  - `.planning/MODELS/Phase4-Orchestrator/p1-downstream-contract/Phase4_P1_Downstream_Action_Implementation_Note_v0.1.md`

Model focus:
- model the first bounded executable `P1 / Minor Change` downstream continuation slice as a contract-carrying continuation surface
- make explicit the key concepts, data structures, state machine, gate rules, stop/completion semantics, target-resolution behavior, and Entry-vs-contract-surface split needed for the first slice
- preserve the three-gate model (`gate_save`, `gate_execute`, `gate_review`) and the docs-only / no-hidden-execution boundary
- reflect the accepted placement rule:
  - the Entry selects/loads/emits the contract
  - the contract definition lives outside the Entry
  - execution remains outside the Entry for this slice

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
- Do not broaden scope into `P2`, `P3`, branch automation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.
- Do not invent new placement or execution layers beyond the accepted rule; keep later executor detail bounded and conceptual only.

Unknowns must be appended to:
- <feature-root>/p1-downstream-continuation/questions.md

If the model introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
```
