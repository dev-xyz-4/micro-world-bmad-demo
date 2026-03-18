Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/entity-system/04-deliver.md

Use:
- docs/bmad/templates/deliver.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/bmad/features/entity-system/01-break.md`
  - `docs/bmad/features/entity-system/02-model.md`
  - `docs/bmad/features/entity-system/03-analyze.md`
  - `docs/bmad/features/entity-system/questions.md`
  - `docs/00-project/planning/bmad_micro_world_demo.md`
  - `docs/00-project/project-overview.md`
  - `docs/00-project/architecture-overview.md`
  - `docs/00-project/project-scope.md`

Deliver focus:
- lock the first bounded implementation contract for the `entity-system` feature
- reflect the chosen analysis outcome:
  - use a baseline of `10` entities
  - use delta-based frame timing
  - include simple bounds behavior in the first slice
  - keep rendering sufficient for visible movement only
- make the first implementation slice explicit enough to authorize later code work without broadening into rule-engine behavior, UI controls, or rendering polish
- preserve the small, demo-oriented baseline and avoid introducing generalized simulation infrastructure

Constraints:
- Preserve existing behavior outside scope.
- Do not invent new requirements.
- Do not write implementation code.
- Do not modify repository structure beyond the BMAD feature artifacts for this feature.
- Do not modify governance documents unless explicitly instructed.
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md` (do not hardcode local paths in the prompt body).
- Namespace clarifier: workflow classification uses `Minor Change (workflow)` / `BMAD Feature`; version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`.
- If this documentation-only change triggers version/tagging expectations, capture an explicit SemVer decision (`SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR` / `no SemVer change`) and follow canonical log/handover routing via CODEX_ENTRY.md.
- For this planning step, capture: `no SemVer change`.
- Do not broaden scope into rule-engine behavior, attraction/repulsion rules, UI controls, rendering polish, deployment setup, or generalized app architecture work.
- Do not reopen resolved questions without a new explicit contradiction.

Unknowns must be appended to:
- <feature-root>/entity-system/questions.md

If the deliver contract introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
