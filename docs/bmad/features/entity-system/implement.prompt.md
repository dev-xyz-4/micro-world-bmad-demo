Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- entity-system (first bounded micro world movement baseline).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/entity-system/04-deliver.md

Do not implement behavior outside that document.

Problem:
- the demo needs a first real micro world baseline instead of the default scaffold app
- the first slice must establish entities, movement, and visibility without introducing rule-engine behavior
- the implementation must stay tightly bounded so later BMAD features can extend it safely

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - this introduces new user-visible application behavior in the demo app
  - this adds a new bounded feature slice rather than a local cleanup or bugfix
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Baseline entity model
- use `10` baseline entities
- each entity must include `x`, `y`, `vx`, and `vy`
- initialize entities so movement is visually demonstrable

B) Movement and bounds
- update movement using delta-based frame timing
- keep entities visible inside the render area with simple bounds behavior
- keep bounds behavior simple and readable

C) Rendering baseline
- render movement clearly in the existing React + Vite app
- keep rendering sufficient for visible movement only
- do not add rule-engine behavior, controls, or rendering polish

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) create `micro-world-app/src/core/entities.js`
2) create `micro-world-app/src/core/engine.js`
3) update `micro-world-app/src/App.jsx`
4) update `micro-world-app/src/App.css`
5) verify the baseline remains in scope and passes validation

E) Lifecycle and async guards
- use the existing app lifecycle safely for starting and stopping the frame loop
- avoid leaking animation-frame work across component unmounts
- keep state updates predictable and limited to the baseline feature needs

F) Live update and recovery
- the app must continue rendering visible movement across successive frames
- entities must remain recoverable to visible positions through the chosen bounds behavior
- if visibility is weak, only tune initialization or simple styling within the current scope

G) Cache or state namespacing
- keep simulation state local to the `entity-system` implementation
- do not introduce generalized global state infrastructure
- do not introduce rule-processing or cross-feature state abstractions

H) Non-Regression Guarantees
- Do NOT modify:
  - `docs/bmad/features/entity-system/01-break.md`
  - `docs/bmad/features/entity-system/02-model.md`
  - `docs/bmad/features/entity-system/03-analyze.md`
  - `docs/bmad/features/entity-system/04-deliver.md`
- do not widen scope into rule engine, controls, attraction/repulsion, glow, connection lines, or generalized simulation infrastructure

Policy references:
- Workflow governance and implementation constraints:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Versioning and SemVer ownership:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Targets (only these files may change):
- micro-world-app/src/core/entities.js
- micro-world-app/src/core/engine.js
- micro-world-app/src/App.jsx
- micro-world-app/src/App.css

Non-targets:
- micro-world-app/src/main.jsx
- micro-world-app/src/index.css
- docs/

Validation checks:
- `cd micro-world-app && npm run dev`
- `cd micro-world-app && npm run build`

Functional validation matrix:
- `10` entities are visible on screen
- entities move continuously over time
- simple bounds behavior keeps entities visible within the render area
- no rule-engine behavior is introduced
- no UI controls or rendering polish features are introduced

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/entity-system/questions.md

Proceed step-by-step.
Do not widen scope.
