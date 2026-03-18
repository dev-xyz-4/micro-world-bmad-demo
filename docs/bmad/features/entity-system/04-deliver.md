# Deliver Spec — entity-system

## 0) Status
- Owner:
  - Project team
- Created:
  - 2026-03-18
- Last updated:
  - 2026-03-18
- Related docs:
  - Break:
    - `docs/bmad/features/entity-system/01-break.md`
  - Model:
    - `docs/bmad/features/entity-system/02-model.md`
  - Analyze:
    - `docs/bmad/features/entity-system/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded micro world baseline with `10` visible moving entities.
- Use position and velocity as the minimum entity model.
- Update movement with delta-based frame timing.
- Keep entities visible with simple bounds behavior inside the render area.
- Render movement clearly in the existing React + Vite application.

### Non-Goals (explicitly out of scope)
- Rule-engine behavior of any kind.
- Attraction, repulsion, or inter-entity influence.
- UI controls, sliders, toggles, or interaction modes.
- Rendering polish such as glow, connection lines, or special effects.
- Generalized simulation infrastructure beyond what this first slice needs.

### Constraints
- Tech:
  - Stay within the existing `micro-world-app/` React + Vite app.
  - Keep the first implementation in plain JavaScript/JSX using the planned `src/core/` structure.
- Perf:
  - The baseline must remain lightweight for a small scene of `10` entities.
- UX:
  - Movement must be clearly visible and stable enough for demo use.
- Backward compatibility:
  - Preserve the current app bootstrap outside the files listed below.
- Security/Privacy (if relevant):
  - No special concerns in this slice.

---

## 2) Implementation Notes (Reference)

Use this section to capture implementation boundaries for the feature.
This template does not define workflow policy.

For implementation behavior, stop behavior, and execution gates, see:
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`

For versioning and SemVer ownership, see:
- `docs/engineering/versioning.md`

Suggested capture prompts:
- In-scope implementation notes:
  - Create the first simulation baseline around a small entity collection, movement updates, and simple viewport bounds handling.
  - Keep rendering simple and use the existing app shell as the display surface.
- Out-of-scope notes:
  - Do not add rule-engine files or rule-processing behavior in this feature.
  - Do not add controls, visual effects, or feature flags.
- Missing-information handling notes (reference `questions.md`):
  - All currently known product questions for this slice are resolved in `questions.md`.
  - If implementation reveals new ambiguity, update `questions.md` before broadening scope.

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## 3) Target Files / Folders
List exact paths. No placeholders.

- `micro-world-app/src/core/engine.js`
- `micro-world-app/src/core/entities.js`
- `micro-world-app/src/App.jsx`
- `micro-world-app/src/App.css`

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- `micro-world-app/src/core/entities.js`
  - `createInitialEntities(count, width, height)`
- `micro-world-app/src/core/engine.js`
  - `updateEntities(entities, deltaMs, width, height)`

### Inputs / Outputs
- `createInitialEntities(count, width, height)`
  - Inputs:
    - entity count
    - render width
    - render height
  - Output:
    - array of `10` baseline entity objects when called with the feature default count
- `updateEntities(entities, deltaMs, width, height)`
  - Inputs:
    - current entity array
    - frame delta in milliseconds
    - render width
    - render height
  - Output:
    - next entity array with updated positions and simple bounds response applied

### Error behavior
- The feature does not need a formal public error surface.
- Invalid dimensions or empty entity inputs may be handled defensively but should not expand into generalized validation infrastructure.

---

## 5) Data Model / State (if any)
- Entities:
  - Each entity must include `x`, `y`, `vx`, and `vy`.
- Persistence (if any):
  - None.
- Invariants (target-state constraints):
  - The rendered baseline uses `10` entities.
  - Entity movement is driven by delta-based frame updates.
  - Bounds behavior keeps entities visible within the render area.
  - Rendering remains movement-focused and visually simple.
- Edge cases:
  - Zero or near-zero movement should be avoided in the initial entity setup.
  - Initial placement should avoid unreadable overlap where practical.
  - Bounds behavior must remain simple and readable.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Create `micro-world-app/src/core/entities.js` and implement initial entity creation for a `10`-entity baseline using position and velocity.
2. Create `micro-world-app/src/core/engine.js` and implement delta-based position updates plus simple bounds handling.
3. Update `micro-world-app/src/App.jsx` to initialize the baseline entities, run a frame loop, and render the moving entities on screen.
4. Adjust `micro-world-app/src/App.css` only as needed to make the movement area clear and readable.
5. Verify the baseline stays in scope: visible movement, no rule engine, no controls, no rendering polish work.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The app runs with `npm run dev`.
- `10` entities are visible on screen.
- Entities move continuously over time.
- Entities remain visible because bounds behavior prevents them from permanently leaving the render area.
- No rule-engine behavior or UI controls are introduced in this slice.

### Optional checks
- Run a production build to confirm the baseline compiles successfully.
- Tune initial speed and placement if movement visibility is weak.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] `micro-world-app/src/core/entities.js` and `micro-world-app/src/core/engine.js` exist and implement the bounded baseline responsibilities described above.
- [ ] `micro-world-app/src/App.jsx` renders a movement-only baseline of `10` entities using delta-based frame updates.
- [ ] Simple bounds behavior keeps entities visible within the render area.
- [ ] No rule-engine behavior, controls, or visual polish features are introduced.
- [ ] The feature runs successfully in the existing React + Vite app.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None.
- Migration steps:
  - None.
- Revert steps:
  - Revert the files listed in Section 3 to restore the pre-feature app state.
