Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/entity-system/02-model.md

Use:
- docs/bmad/templates/model.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/bmad/features/entity-system/01-break.md`
  - `docs/bmad/features/entity-system/questions.md`
  - `docs/00-project/planning/bmad_micro_world_demo.md`
  - `docs/00-project/project-overview.md`
  - `docs/00-project/architecture-overview.md`
  - `docs/00-project/project-scope.md`

Model focus:
- model the first bounded micro world core slice around movable entities
- make explicit the minimum entity concept for the baseline: position and velocity
- describe the relationship between entity state, per-frame updates, and visible movement
- keep the model limited to entity-system concerns and exclude the rule engine from this feature
- keep unresolved decisions explicit where they are not yet safely determined, especially bounds behavior and the exact baseline entity count

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
- Do not resolve still-open product decisions by assumption; keep them explicit in the model where needed.

Unknowns must be appended to:
- <feature-root>/entity-system/questions.md

If the model introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
