const SWIRL_RATE = 1.1
const MAX_RULE_DELTA_MS = 48

export function applySwirl(entities, deltaMs) {
  const rotation = SWIRL_RATE * Math.min(deltaMs, MAX_RULE_DELTA_MS) / 1000
  const sin = Math.sin(rotation)
  const cos = Math.cos(rotation)

  return entities.map((entity) => ({
    ...entity,
    vx: entity.vx * cos - entity.vy * sin,
    vy: entity.vx * sin + entity.vy * cos,
  }))
}

export function applyRules(entities, rules, deltaMs) {
  return rules.reduce(
    (currentEntities, rule) => rule(currentEntities, deltaMs),
    entities,
  )
}
