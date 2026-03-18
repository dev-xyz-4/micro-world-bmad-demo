const DEFAULT_SPEED = 96

function velocityFor(index) {
  const angle = (Math.PI * 2 * index) / 10

  return {
    vx: Math.cos(angle) * DEFAULT_SPEED,
    vy: Math.sin(angle) * DEFAULT_SPEED,
  }
}

export function createInitialEntities(count, width, height) {
  const columns = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / columns)
  const paddingX = width * 0.12
  const paddingY = height * 0.18
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingY * 2

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const offsetX = (index % 2) * 12 - 6
    const offsetY = (index % 3) * 8 - 8
    const x =
      paddingX +
      ((column + 0.5) / columns) * usableWidth +
      offsetX
    const y =
      paddingY +
      ((row + 0.5) / rows) * usableHeight +
      offsetY

    return {
      id: `entity-${index}`,
      x,
      y,
      ...velocityFor(index),
    }
  })
}
