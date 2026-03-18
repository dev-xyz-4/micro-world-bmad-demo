Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- rule-engine (first bounded rule-driven behavior baseline).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/rule-engine/04-deliver.md

Do not implement behavior outside that document.

Problem:
- the demo needs a first explicit rule pipeline so behavior is no longer fixed inside the movement baseline
- the first slice must demonstrate rule-driven curved motion without broadening into richer interaction features
- the implementation must stay tightly bounded so later rules can extend the system safely

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - this introduces a new user-visible behavior feature on top of the existing demo baseline
  - this adds a new bounded BMAD feature slice rather than a local refactor or bugfix
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Rule pipeline baseline
- introduce rules as explicit functions applied to entities
- apply rules globally to all entities in the first slice
- keep rule application before movement updates and rendering

B) First rule behavior
- implement a single global swirl or turn rule expressed as `applySwirl(entities)`
- have the rule transform velocity, not position directly
- keep the swirl effect slight, readable, and visually demonstrable

C) Existing baseline preservation
- preserve the existing `10`-entity movement baseline from `entity-system`
- keep existing bounds behavior functional
- do not introduce controls, attraction/repulsion, or rendering polish

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) create `micro-world-app/src/core/rules.js`
2) update `micro-world-app/src/core/engine.js` only as needed
3) update `micro-world-app/src/App.jsx`
4) verify visible swirl-driven motion for the existing `10` entities
5) verify the feature remains in scope and passes validation

E) Lifecycle and async guards
- preserve safe frame-loop behavior in the existing app lifecycle
- avoid introducing frame-loop leaks or duplicate rule application across renders
- keep state updates limited to the first rule-engine feature needs

F) Live update and recovery
- rule-driven motion must remain continuous across successive frames
- bounds behavior must still recover entities to visible positions
- if the swirl effect is too subtle or too noisy, tune only within the current bounded scope

G) Cache or state namespacing
- keep rule-engine state local to the explicit first pipeline
- do not introduce generalized global rule-management infrastructure
- do not introduce cross-feature state abstractions beyond the first rule-engine slice

H) Non-Regression Guarantees
- Do NOT modify:
  - `docs/bmad/features/rule-engine/01-break.md`
  - `docs/bmad/features/rule-engine/02-model.md`
  - `docs/bmad/features/rule-engine/03-analyze.md`
  - `docs/bmad/features/rule-engine/04-deliver.md`
- do not widen scope into attraction/repulsion, UI controls, rendering polish, or generalized multi-rule infrastructure

Policy references:
- Workflow governance and implementation constraints:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Versioning and SemVer ownership:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Targets (only these files may change):
- micro-world-app/src/core/rules.js
- micro-world-app/src/core/engine.js
- micro-world-app/src/App.jsx

Non-targets:
- micro-world-app/src/core/entities.js
- micro-world-app/src/App.css
- docs/

Validation checks:
- `cd micro-world-app && npm run dev`
- `cd micro-world-app && npm run build`

Functional validation matrix:
- the existing `10` entities are still visible on screen
- motion remains continuous over time
- swirl-driven motion is visibly different from the straight-line baseline
- existing bounds behavior still keeps entities visible
- no controls, extra rules, or rendering polish features are introduced

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/rule-engine/questions.md

Proceed step-by-step.
Do not widen scope.
