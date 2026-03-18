# Questions — entity-system

## Answered

- What is the minimum rendering expectation for proving visible movement in the first demo slice?
  Answer: the first slice only needs a simple render surface that makes movement clearly visible. Visual polish, glow effects, and richer presentation remain out of scope for `entity-system`.

- How many entities are needed for the first visible movement baseline?
  Answer: use a small multi-entity baseline of `10` entities for the first slice. This keeps the demo visually clear while already showing a real micro world instead of a single moving object.

- Should the first entity-system slice include basic bounds behavior, or only free movement?
  Answer: include simple bounds behavior in the first slice so entities remain visible within the demo area. A basic bounce or clamp-style boundary response is sufficient at this stage.

- Should movement timing be treated as delta-based, fixed-step, or intentionally deferred to later feature artifacts?
  Answer: use delta-based timing for the first slice. It fits the planned `requestAnimationFrame` loop, keeps the demo responsive, and avoids introducing fixed-step complexity too early.

## Open
