import { useEffect, useRef, useState } from 'react'
import { createInitialEntities } from './core/entities'
import { updateEntities } from './core/engine'
import './App.css'

const ENTITY_COUNT = 10
const WORLD_WIDTH = 720
const WORLD_HEIGHT = 420

function App() {
  const [entities, setEntities] = useState(() =>
    createInitialEntities(ENTITY_COUNT, WORLD_WIDTH, WORLD_HEIGHT),
  )
  const frameRef = useRef(0)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    function tick(timestamp) {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp
      }

      const deltaMs = timestamp - lastFrameRef.current
      lastFrameRef.current = timestamp

      setEntities((currentEntities) =>
        updateEntities(currentEntities, deltaMs, WORLD_WIDTH, WORLD_HEIGHT),
      )

      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameRef.current)
      lastFrameRef.current = 0
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="app-copy">
        <p className="eyebrow">Entity System</p>
        <h1>Rule-Driven Micro World</h1>
        <p className="lede">
          First bounded baseline: ten entities, delta-based movement, and simple
          on-screen bounds.
        </p>
      </section>

      <section className="world-panel" aria-label="Micro world simulation">
        <div className="world-stats">
          <span>{ENTITY_COUNT} entities</span>
          <span>delta timing</span>
          <span>simple bounds</span>
        </div>

        <div className="world" role="img" aria-label="Moving entities in a micro world">
          {entities.map((entity, index) => (
            <div
              key={entity.id}
              className="entity"
              style={{
                left: `${(entity.x / WORLD_WIDTH) * 100}%`,
                top: `${(entity.y / WORLD_HEIGHT) * 100}%`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
