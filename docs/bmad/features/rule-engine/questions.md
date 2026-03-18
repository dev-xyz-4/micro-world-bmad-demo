# Questions — rule-engine

## Answered

- What is the first concrete rule behavior that should be included in the initial rule pipeline?
  Answer: use a global swirl or turn rule, expressed as `applySwirl(entities)`. The rule should rotate entity velocity slightly on each frame so the demo shows visibly rule-driven curved motion instead of only straight-line movement.

- Should rules transform velocity, position, or both in the first slice?
  Answer: the first slice should transform velocity, not position directly. This keeps the rule engine aligned with the existing movement baseline and preserves a clean separation between rule application and position updates.

- Should rules be applied globally to all entities, or should entity-level selection already be considered?
  Answer: the first slice should apply rules globally to all entities. Entity-level selection would broaden the first pipeline unnecessarily.

- In the first pipeline, should rule application happen strictly before movement updates, or is another ordering needed?
  Answer: yes, rule application should happen before movement updates. The intended flow remains `applyRules(entities)`, then movement update, then render.
