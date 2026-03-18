Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Create:
- <feature-root>/rule-engine/01-break.md

Use:
- docs/bmad/templates/break.template.md

Context:
- Existing behavior/system contracts to consider:
  - `docs/00-project/planning/bmad_micro_world_demo.md`
  - `docs/00-project/project-overview.md`
  - `docs/00-project/architecture-overview.md`
  - `docs/bmad/features/entity-system/04-deliver.md`

Break focus:
- define the next bounded BMAD feature slice for controllable behavior after the `entity-system` baseline
- make explicit the minimum rule-engine concept needed for the demo baseline: rules as functions applied to entities
- keep the slice focused on a first rule pipeline and exclude attraction/repulsion and richer interaction behavior for now
- clarify the relationship between rule application, entity updates, and rendering order without committing to unnecessary infrastructure too early

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

Unknowns must be appended to:
- <feature-root>/rule-engine/questions.md

If the break introduces structural implications (e.g., new workflow categories, new governance areas):
- Stop and request clarification before proceeding.
