# Deliver Spec — rule-engine

## 0) Status
- Owner:
  - Project team
- Created:
  - 2026-03-18
- Last updated:
  - 2026-03-18
- Related docs:
  - Break:
    - `docs/bmad/features/rule-engine/01-break.md`
  - Model:
    - `docs/bmad/features/rule-engine/02-model.md`
  - Analyze:
    - `docs/bmad/features/rule-engine/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded rule-engine baseline on top of the existing `entity-system` feature.
- Introduce rules as explicit functions applied to entities before movement updates.
- Add a first global swirl or turn rule, expressed as `applySwirl(entities)`.
- Keep the first rule pipeline small, globally applied, and visually understandable.
- Preserve the existing movement baseline while making behavior visibly rule-driven.

### Non-Goals (explicitly out of scope)
- Attraction, repulsion, or other richer interaction rules.
- Entity-level rule targeting or filtering.
- UI controls, toggles, or rule editors.
- Rendering polish such as glow, connection lines, or special effects.
- Generalized multi-rule infrastructure beyond what the first pipeline needs.

### Constraints
- Tech:
  - Stay within the existing `micro-world-app/` React + Vite app.
  - Build on the `entity-system` implementation rather than replacing it.
  - Keep rules in plain JavaScript and preserve the existing frame loop shape.
- Perf:
  - The first rule-engine slice must remain lightweight for the small `10`-entity baseline.
- UX:
  - The swirl effect must be clearly visible but still readable and controlled.
- Backward compatibility:
  - Preserve the `entity-system` movement baseline outside the explicit rule-engine additions.
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
  - Introduce an explicit rule pipeline before movement updates.
  - Implement a single global swirl rule that slightly rotates entity velocity each frame.
  - Preserve the existing movement and bounds baseline from `entity-system`.
- Out-of-scope notes:
  - Do not add additional rules, controls, rendering effects, or generalized rule-management infrastructure.
  - Do not redesign the existing `entity-system` model.
- Missing-information handling notes (reference `questions.md`):
  - All currently known product questions for this slice are resolved in `questions.md`.
  - If implementation reveals new ambiguity, update `questions.md` before widening scope.

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## 3) Target Files / Folders
List exact paths. No placeholders.

- `micro-world-app/src/core/rules.js`
- `micro-world-app/src/core/engine.js`
- `micro-world-app/src/App.jsx`

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- `micro-world-app/src/core/rules.js`
  - `applySwirl(entities, deltaMs)`
  - `applyRules(entities, rules, deltaMs)`
- `micro-world-app/src/core/engine.js`
  - `updateEntities(entities, deltaMs, width, height)`

### Inputs / Outputs
- `applySwirl(entities, deltaMs)`
  - Inputs:
    - current entity array
    - frame delta in milliseconds
  - Output:
    - entities with slightly rotated velocity vectors
- `applyRules(entities, rules, deltaMs)`
  - Inputs:
    - current entity array
    - ordered rule list
    - frame delta in milliseconds
  - Output:
    - entities after sequential rule application
- `updateEntities(entities, deltaMs, width, height)`
  - Inputs:
    - rule-adjusted entity array
    - frame delta in milliseconds
    - render width
    - render height
  - Output:
    - next entity array with movement and bounds behavior applied

### Error behavior
- The feature does not need a formal public error surface.
- Empty rule lists should behave safely and leave entity state unchanged before movement updates.

---

## 5) Data Model / State (if any)
- Entities:
  - Reuse the existing entity model with `x`, `y`, `vx`, and `vy`.
- Persistence (if any):
  - None.
- Invariants (target-state constraints):
  - Rule application happens before movement updates and rendering.
  - The first rule-engine slice uses a single global swirl rule.
  - Rules modify velocity, not position directly.
  - The baseline remains readable with `10` entities and simple bounds behavior.
- Edge cases:
  - Swirl strength must not be so weak that the feature is visually indistinguishable.
  - Swirl strength must not be so strong that the scene becomes chaotic.
  - Empty or missing rules should not break baseline movement.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Create `micro-world-app/src/core/rules.js` and implement `applySwirl(entities, deltaMs)` plus `applyRules(entities, rules, deltaMs)`.
2. Update `micro-world-app/src/core/engine.js` only as needed so the existing movement step can consume rule-adjusted entities without widening scope.
3. Update `micro-world-app/src/App.jsx` to run the rule pipeline before movement updates in the frame loop.
4. Verify the app still renders the same `10` entities while movement now shows visible swirl-driven curvature.
5. Verify the feature remains in scope: one global swirl rule, no controls, no attraction/repulsion, no rendering polish work.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The app runs with `npm run dev`.
- The existing `10` entities still render on screen.
- Motion remains continuous over time.
- The swirl rule visibly changes motion away from purely straight-line movement.
- Bounds behavior still keeps entities visible.
- No controls, extra rules, or rendering polish features are introduced.

### Optional checks
- Run a production build to confirm the updated baseline compiles successfully.
- Tune swirl strength if the rule effect is too subtle or too noisy.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] `micro-world-app/src/core/rules.js` exists and implements `applySwirl(entities, deltaMs)` and `applyRules(entities, rules, deltaMs)`.
- [ ] `micro-world-app/src/App.jsx` applies the rule pipeline before movement updates in the frame loop.
- [ ] The first rule-engine slice visibly produces curved, rule-driven motion for the existing `10` entities.
- [ ] Existing movement and bounds behavior remain functional.
- [ ] No attraction/repulsion, controls, or rendering polish features are introduced.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None.
- Migration steps:
  - None.
- Revert steps:
  - Revert the files listed in Section 3 to restore the pre-rule-engine baseline.
