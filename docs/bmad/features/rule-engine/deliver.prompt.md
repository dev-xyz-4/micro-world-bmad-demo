Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/rule-engine/04-deliver.md

Use:
- docs/bmad/templates/deliver.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/bmad/features/rule-engine/01-break.md`
  - `docs/bmad/features/rule-engine/02-model.md`
  - `docs/bmad/features/rule-engine/03-analyze.md`
  - `docs/bmad/features/rule-engine/questions.md`
  - `docs/bmad/features/entity-system/04-deliver.md`
  - `docs/00-project/planning/bmad_micro_world_demo.md`
  - `docs/00-project/project-overview.md`
  - `docs/00-project/architecture-overview.md`
  - `docs/00-project/project-scope.md`

Deliver focus:
- lock the first bounded implementation contract for the `rule-engine` feature
- reflect the chosen analysis outcome:
  - rules are explicit functions applied to entities
  - rules act globally on all entities
  - rules transform velocity, not position directly
  - rule application happens before movement updates and rendering
  - the first rule is a global swirl or turn rule expressed as `applySwirl(entities)`
- make the first implementation slice explicit enough to authorize later code work without broadening into attraction/repulsion, controls, or generalized simulation infrastructure
- preserve the small, demo-oriented rule-engine baseline and keep it clearly separate from the underlying `entity-system`

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
- Do not broaden scope into attraction/repulsion rules, UI controls, rendering polish, deployment setup, or generalized simulation architecture work.
- Do not reopen resolved questions without a new explicit contradiction.

Unknowns must be appended to:
- <feature-root>/rule-engine/questions.md

If the deliver contract introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
