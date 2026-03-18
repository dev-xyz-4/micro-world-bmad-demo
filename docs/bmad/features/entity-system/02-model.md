# Model — entity-system

## 1) System Overview (2–5 bullets)
- The `entity-system` feature defines the smallest simulation baseline for the micro world demo.
- An entity is modeled by position and velocity and is updated on each frame.
- The feature is limited to visible movement and does not include rule-engine behavior.
- Rendering only needs to make movement observable; visual polish is explicitly out of scope for this slice.
- The baseline uses `10` entities and includes simple bounds behavior so movement remains visible inside the demo area.

## 2) Key Concepts / Terms
- Entity:
  - A simulated object in the micro world baseline.
- Position:
  - The current spatial location of an entity, modeled as `x` and `y`.
- Velocity:
  - The movement vector of an entity, modeled as `vx` and `vy`.
- Frame update:
  - A single simulation step that advances entity state over time.
- Visible movement:
  - The minimum observable result of applying per-frame updates to entity state on a render surface.

## 3) Data Structures
- Name:
  - Entity
  - Fields:
    - `x`
    - `y`
    - `vx`
    - `vy`
  - Meaning:
    - Represents one movable object in the first demo slice.
  - Invariants:
    - `x` and `y` describe the current position.
    - `vx` and `vy` describe the current movement direction and magnitude.
    - The entity model remains limited to movement-related baseline fields in this feature.

- Name:
  - EntityCollection
  - Fields:
    - `entities[]`
  - Meaning:
    - Holds the current set of entities participating in the baseline movement slice.
  - Invariants:
    - Each element follows the `Entity` structure.
    - The initial baseline contains `10` entities.

- Name:
  - ViewBounds
  - Fields:
    - `width`
    - `height`
  - Meaning:
    - Represents the visible area in which the first entity-system slice keeps entities on screen.
  - Invariants:
    - Bounds describe the active render area.
    - Baseline bounds behavior must keep visible entities within this area.

## 4) State Machine (if applicable)
### States
- Initialized:
  - Entity exists with starting position and velocity inside the visible area.
- Updating:
  - Entity position is advanced during a frame update.
- Bounds-adjusted:
  - Entity movement is checked against the visible area and corrected if necessary.
- Rendered:
  - Entity state is presented on the render surface after the update step.

### Transitions
- Initialized → Updating: first simulation frame begins.
- Updating → Bounds-adjusted: a frame update produces the next entity position.
- Bounds-adjusted → Rendered: visible position is finalized for display.
- Rendered → Updating: next frame update begins.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - Baseline movement update
  - Inputs:
    - current entity position
    - current entity velocity
    - frame timing signal
  - Output:
    - updated entity position for the next rendered frame
  - Notes:
    - This is movement-only behavior.
    - The baseline timing approach is delta-based to match the planned frame loop while keeping the first slice simple.

- Rule:
  - Baseline bounds handling
  - Inputs:
    - updated entity position
    - current entity velocity
    - view bounds
  - Output:
    - corrected visible position and boundary-adjusted movement state
  - Notes:
    - The first slice includes only simple bounds behavior.
    - The exact choice between bounce and clamp-style handling remains an implementation-level detail for later artifacts unless explicitly decided earlier.

- Rule:
  - Baseline rendering projection
  - Inputs:
    - current entity positions
    - render surface
  - Output:
    - visible representation of movement
  - Notes:
    - Rendering must be sufficient to prove motion, not to finalize visual design.

## 6) Failure Modes / Edge Cases
- No visible movement because velocity is zero or visually insignificant.
- Movement is technically updating but not understandable because rendering is too weak.
- Ten entities could still feel visually crowded if spacing and speed are poorly chosen.
- Bounds handling may feel unnatural if the later chosen boundary response is too abrupt or visually noisy.
- A timing approach chosen too early could overconstrain later implementation decisions.
- Delta-based updates may still need normalization or speed tuning to keep perceived motion stable.

## 7) Observability (optional)
- Logs:
  - Optional debug output may report entity count and current frame progression during development.
- Metrics:
  - No formal metrics are required for this feature model yet.
