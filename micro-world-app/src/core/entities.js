const DEFAULT_SPEED = 96
const CIRCLE_RADIANS = Math.PI * 2
const HORIZONTAL_PADDING_RATIO = 0.12
const VERTICAL_PADDING_RATIO = 0.18
const HORIZONTAL_OFFSET_STEP = 12
const HORIZONTAL_OFFSET_CENTER = 6
const VERTICAL_OFFSET_STEP = 8
const VERTICAL_OFFSET_CENTER = 8

function velocityFor(index) {
  const angle = (CIRCLE_RADIANS * index) / 10

  return {
    vx: Math.cos(angle) * DEFAULT_SPEED,
    vy: Math.sin(angle) * DEFAULT_SPEED,
  }
}

export function createInitialEntities(count, width, height) {
  const columns = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / columns)
  const paddingX = width * HORIZONTAL_PADDING_RATIO
  const paddingY = height * VERTICAL_PADDING_RATIO
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingY * 2

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const offsetX =
      (index % 2) * HORIZONTAL_OFFSET_STEP - HORIZONTAL_OFFSET_CENTER
    const offsetY =
      (index % 3) * VERTICAL_OFFSET_STEP - VERTICAL_OFFSET_CENTER
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
