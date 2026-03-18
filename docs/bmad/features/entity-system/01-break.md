# Break — entity-system

## 1) Problem Statement (one paragraph)
- The Rule-Driven Micro World demo needs a first bounded core feature that introduces the smallest useful simulation unit before any rule logic is added. This feature must define what an entity is at the demo baseline, how position and velocity relate to visible movement, and what the first movement slice includes, without expanding into rule-engine behavior or broader app architecture decisions.

## 2) Goal
- Define the first BMAD feature slice for movable entities in the micro world demo.
- Establish the minimum baseline entity model: position and velocity.
- Bound the feature to visible per-frame movement as the first demonstrable simulation behavior.
- Clarify the relationship between entity state and the planned simulation loop at a high level.

## 3) Non-Goals
- Designing or implementing the rule engine.
- Defining attraction, repulsion, or other behavior rules.
- Adding UI controls, parameter tuning, or demo controls.
- Expanding rendering polish beyond what is needed to make movement visible.
- Finalizing broader app architecture outside the entity-system slice.

## 4) Users / Actors (if any)
- Demo developer creating the first simulation baseline.
- Demo viewer observing visible movement in the micro world.

## 5) Inputs / Outputs
### Inputs
- Initial entity state for the demo baseline.
- Per-frame update timing from the planned simulation loop.
- A render surface in the existing React + Vite application.

### Outputs
- A defined baseline entity concept for the project.
- A bounded feature scope for visible movement.
- A clear problem frame for later model, analyze, and deliver artifacts.

## 6) Constraints
- Technical: stay within the current React + Vite demo application and avoid introducing rule-engine structure in this feature.
- Performance: the first slice should remain lightweight and suitable for a small demo baseline.
- UX: movement should be visible and understandable enough to support later live demo steps.
- Compatibility: preserve the existing repository and app bootstrap state outside this feature.
- Legal/Compliance (if relevant): none currently identified.

## 7) Unknowns / Open Questions
- How many entities are needed for the first visible movement baseline?
- Should entities move freely without interaction constraints at first, or should basic bounds behavior already be included?
- Should frame updates be expressed in fixed steps, delta-based updates, or left open until the model/analyze phase?
- What is the minimum rendering approach required to make movement clearly demonstrable without broadening scope?

## 8) Success Criteria (high level)
- The feature scope is clearly limited to entity definition and visible movement.
- Position and velocity are established as the minimum baseline entity model.
- Later rule-engine work can build on this feature without reopening the initial entity concept.
- The break artifact leaves enough clarity to proceed to model/analyze without inventing requirements.
