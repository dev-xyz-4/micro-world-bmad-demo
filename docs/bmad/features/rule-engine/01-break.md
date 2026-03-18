# Break — rule-engine

## 1) Problem Statement (one paragraph)
- The micro world demo now has a first movement baseline through the `entity-system` feature, but behavior is still fixed and not explicitly controllable. The next bounded feature must introduce the smallest useful rule-engine concept so entity behavior can be shaped through rules, while staying narrow enough to avoid broadening into attraction/repulsion, UI controls, or generalized simulation infrastructure.

## 2) Goal
- Define the next BMAD feature slice for controllable behavior after the `entity-system` baseline.
- Establish the minimum rule-engine concept for the demo baseline: rules as functions applied to entities.
- Bound the feature to a first explicit rule pipeline.
- Clarify the high-level relationship between rule application, entity updates, and rendering order.

## 3) Non-Goals
- Implementing attraction, repulsion, or other richer interaction rules.
- Adding UI controls, toggles, or parameter editors.
- Expanding rendering polish or visual effects.
- Redesigning the existing `entity-system` baseline.
- Building generalized simulation architecture beyond what a first rule pipeline needs.

## 4) Users / Actors (if any)
- Demo developer extending the baseline from movement-only behavior to controlled behavior.
- Demo viewer observing that entity behavior can be changed through explicit rules.

## 5) Inputs / Outputs
### Inputs
- The existing entity-system baseline and its entity state.
- A set of rules that can be applied to entities.
- The existing frame loop and rendering path from the app baseline.

### Outputs
- A bounded problem frame for a first rule-engine feature.
- A clarified feature scope for rule application before entity updates and rendering.
- A basis for later model, analyze, and deliver artifacts for the rule pipeline.

## 6) Constraints
- Technical:
  - Build on the existing `entity-system` baseline and stay within the current React + Vite app.
- Performance:
  - The first rule-engine slice should remain lightweight for the demo baseline.
- UX:
  - Rule-driven behavior should stay understandable and demo-friendly.
- Compatibility:
  - Preserve the working movement baseline outside the scope of the first rule-engine slice.
- Legal/Compliance (if relevant):
  - None currently identified.

## 7) Unknowns / Open Questions
- What is the first concrete rule behavior that should be included in the initial rule pipeline?
- Should rules transform velocity, position, or both in the first slice?
- Should rules be applied globally to all entities, or should entity-level selection already be considered?
- In the first pipeline, should rule application happen strictly before movement updates, or is another ordering needed?

## 8) Success Criteria (high level)
- The feature scope is clearly limited to a first explicit rule pipeline.
- Rules are framed as functions that influence entity behavior.
- The feature can extend `entity-system` without reopening its bounded baseline unnecessarily.
- The break artifact leaves enough clarity to continue into model/analyze without inventing requirements.
