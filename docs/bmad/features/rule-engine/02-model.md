# Model — rule-engine

## 1) System Overview (2–5 bullets)
- The `rule-engine` feature extends the existing `entity-system` baseline with the first explicit behavior pipeline.
- A rule is modeled as a function that transforms entity behavior before movement updates are applied.
- The first slice is limited to global rules acting on entity velocity rather than direct position mutation.
- The first concrete rule is a global swirl or turn rule, expressed as `applySwirl(entities)`.
- Rendering remains downstream of rule application and movement updates, and no UI controls or richer interaction logic are introduced in this feature.

## 2) Key Concepts / Terms
- Rule:
  - A function that changes entity behavior in a controlled and explicit way.
- Rule pipeline:
  - The ordered application of rules before movement updates and rendering.
- Global rule:
  - A rule that applies to all entities in the current baseline.
- Swirl rule:
  - A rule that rotates entity velocity slightly on each frame so motion curves instead of remaining purely linear.
- Rule phase:
  - The frame stage in which rules are applied before movement and render.

## 3) Data Structures
- Name:
  - Rule
  - Fields:
    - `name`
    - `apply`
  - Meaning:
    - Represents one explicit behavior rule in the first rule-engine slice.
  - Invariants:
    - `apply` transforms entity behavior without introducing unrelated side systems.
    - The first slice uses rules that operate on velocity.

- Name:
  - RulePipeline
  - Fields:
    - `rules[]`
  - Meaning:
    - Holds the ordered set of rules applied before movement updates.
  - Invariants:
    - Rules are applied in sequence.
    - The first baseline may contain a single active rule: `applySwirl`.

- Name:
  - Entity
  - Fields:
    - `x`
    - `y`
    - `vx`
    - `vy`
  - Meaning:
    - Reuses the baseline entity model from `entity-system`.
  - Invariants:
    - Position update remains separate from rule application.
    - Rule effects in this slice are expressed through velocity changes.

## 4) State Machine (if applicable)
### States
- Pre-rule:
  - Entity state exists before rule processing in the current frame.
- Rule-adjusted:
  - Entity velocity has been modified by the current rule pipeline.
- Updated:
  - Position has been advanced using the rule-adjusted velocity.
- Rendered:
  - The current frame is displayed after movement update and bounds handling.

### Transitions
- Pre-rule → Rule-adjusted: rule pipeline runs for the current frame.
- Rule-adjusted → Updated: movement update applies velocity to position.
- Updated → Rendered: the current entity state is displayed.
- Rendered → Pre-rule: next frame begins.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - Rule pipeline application
  - Inputs:
    - current entities
    - ordered rules
  - Output:
    - rule-adjusted entities for the current frame
  - Notes:
    - The first slice applies rules before movement updates.
    - Rule order is explicit even if the initial pipeline is small.

- Rule:
  - `applySwirl(entities)`
  - Inputs:
    - current entities
    - current entity velocity
  - Output:
    - entities with slightly rotated velocity vectors
  - Notes:
    - The purpose is visible, rule-driven curved motion.
    - Rotation remains slight to preserve readability and demo control.

- Rule:
  - Movement update after rules
  - Inputs:
    - rule-adjusted entities
    - frame timing
  - Output:
    - updated positions for rendering
  - Notes:
    - This phase remains owned by the baseline movement model from `entity-system`.

## 6) Failure Modes / Edge Cases
- Swirl strength may be too weak to look meaningfully different from straight-line motion.
- Swirl strength may be too strong and make the demo feel chaotic.
- Multiple rules later could create ordering sensitivity if sequencing is not kept explicit.
- Direct position mutation could blur the separation between rules and movement if scope drifts.
- Rule processing could reduce readability if it broadens beyond the small first slice.

## 7) Observability (optional)
- Logs:
  - Optional debug output may report which rules are active in the pipeline.
- Metrics:
  - No formal metrics are required for this feature model yet.
