# Analyze — rule-engine

## 1) Options Considered
### Option A: Implicit single-rule behavior inside the movement update
- Summary:
  - Add swirl-like behavior directly into the existing movement logic without an explicit rule pipeline abstraction.
- Pros:
  - Smallest short-term implementation surface.
  - Fastest path to visible curved motion.
- Cons:
  - Weakens the distinction between `entity-system` and `rule-engine`.
  - Makes the demo less convincing as an example of explicit rule-driven behavior.
  - Creates a poorer base for later rule additions.
- Risks:
  - Behavioral logic becomes mixed into the wrong feature boundary.
  - Follow-up features would likely need early restructuring.
- Complexity:
  - Low

### Option B: Explicit small rule pipeline with one global swirl rule
- Summary:
  - Introduce a small rule pipeline that applies a single global swirl rule before movement updates and rendering.
- Pros:
  - Clearly demonstrates the difference between movement infrastructure and behavior rules.
  - Keeps the first rule-engine slice small and understandable.
  - Creates a direct path for adding later rules without redesigning the baseline immediately.
  - Makes the demo visually interesting through curved motion.
- Cons:
  - Slightly more structure than directly embedding the behavior.
  - Requires keeping rule sequencing explicit from the start.
- Risks:
  - If swirl intensity is poorly tuned, the effect may be either too subtle or too chaotic.
  - A too-generic first abstraction could still tempt future scope growth.
- Complexity:
  - Low to moderate

### Option C (optional): Multi-rule generalized behavior system
- Summary:
  - Start immediately with a more flexible rule system that supports multiple rule types and broader composition.
- Pros:
  - Stronger long-term extensibility from day one.
  - Could reduce some later restructuring.
- Cons:
  - Too broad for the first rule-engine slice.
  - Shifts attention away from the smallest clear demo outcome.
  - Increases the risk of premature architecture.
- Risks:
  - Scope expansion into generalized simulation infrastructure.
  - Slower delivery of the first visible rule-driven behavior.
- Complexity:
  - Moderate to high

---

## 2) Decision
- Chosen option:
  - Option B: Explicit small rule pipeline with one global swirl rule
- Rationale (short):
  - It is the thinnest credible slice that clearly demonstrates rule-driven behavior as a separate concern from the movement baseline while still producing a visually interesting result.
- Assumptions (explicit):
  - Rules are explicit functions applied to entities.
  - The first rule acts globally on all entities.
  - The first rule transforms velocity, not position directly.
  - Rule application happens before movement updates and rendering.
  - The first visible rule behavior is a slight swirl or turn effect.
- Out-of-scope impacts:
  - No attraction/repulsion logic is introduced.
  - No controls, toggles, or parameter editing are introduced.
  - No rendering polish or richer visual effects are introduced.
  - No generalized multi-rule infrastructure is introduced beyond what the first pipeline needs.

---

## 3) Risk Register (minimal)
- Risk:
  - The swirl effect may be too weak to visibly justify the feature.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Keep the first rule explicit and tune the velocity rotation so curved motion is clearly observable.

- Risk:
  - The swirl effect may be too strong and make movement feel noisy or uncontrolled.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Keep the rotation slight and preserve readability over novelty.

- Risk:
  - Rule-pipeline structure may grow broader than needed in the first slice.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Limit the first implementation to one global rule and explicit ordering only.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Embedding swirl behavior directly inside movement updates
  - Why rejected:
    - It obscures the boundary between baseline movement and the new rule-engine feature.

- Approach:
  - Starting with a generalized multi-rule framework
  - Why rejected:
    - It expands scope too early and delays the smallest clear rule-engine demonstration.
