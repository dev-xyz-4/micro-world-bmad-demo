const ENTITY_RADIUS = 9

function applyBounds(position, velocity, limit) {
  if (position <= ENTITY_RADIUS) {
    return {
      position: ENTITY_RADIUS,
      velocity: Math.abs(velocity),
    }
  }

  if (position >= limit - ENTITY_RADIUS) {
    return {
      position: limit - ENTITY_RADIUS,
      velocity: -Math.abs(velocity),
    }
  }

  return { position, velocity }
}

export function updateEntities(entities, deltaMs, width, height) {
  const deltaSeconds = Math.min(deltaMs, 48) / 1000

  return entities.map((entity) => {
    const nextX = entity.x + entity.vx * deltaSeconds
    const nextY = entity.y + entity.vy * deltaSeconds
    const boundedX = applyBounds(nextX, entity.vx, width)
    const boundedY = applyBounds(nextY, entity.vy, height)

    return {
      ...entity,
      x: boundedX.position,
      y: boundedY.position,
      vx: boundedX.velocity,
      vy: boundedY.velocity,
    }
  })
}
