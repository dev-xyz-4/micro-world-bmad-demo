import { useEffect, useRef, useState } from 'react'
import { createInitialEntities } from './core/entities'
import { updateEntities } from './core/engine'
import { applyRules, applySwirl } from './core/rules'
import './App.css'

const ENTITY_COUNT = 10
const WORLD_WIDTH = 720
const WORLD_HEIGHT = 420
const ACTIVE_RULES = [applySwirl]
const ENTITY_HUES = [195, 205, 215, 186, 225]
const ENTITY_ANIMATION_STAGGER_MS = 90
const WORLD_STAT_LABELS = ['swirl rule', 'delta timing']
const WORLD_ARIA_LABEL = 'Moving entities in a micro world'

function resolveDeltaMs(timestamp, lastFrameRef) {
  if (lastFrameRef.current === 0) {
    lastFrameRef.current = timestamp
  }

  const deltaMs = timestamp - lastFrameRef.current
  lastFrameRef.current = timestamp

  return deltaMs
}

function advanceEntities(currentEntities, deltaMs) {
  return updateEntities(
    applyRules(currentEntities, ACTIVE_RULES, deltaMs),
    deltaMs,
    WORLD_WIDTH,
    WORLD_HEIGHT,
  )
}

function App() {
  const [entities, setEntities] = useState(() =>
    createInitialEntities(ENTITY_COUNT, WORLD_WIDTH, WORLD_HEIGHT),
  )
  const frameRef = useRef(0)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    function tick(timestamp) {
      const deltaMs = resolveDeltaMs(timestamp, lastFrameRef)

      setEntities((currentEntities) => advanceEntities(currentEntities, deltaMs))

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
        <p className="eyebrow">Rule Engine</p>
        <h1>Rule-Driven Micro World</h1>
        <p className="lede">
          Swirl rule active: ten entities, explicit rule application, and curved
          motion on top of the bounded baseline.
        </p>
      </section>

      <section className="world-panel" aria-label="Micro world simulation">
        <div className="world-stats">
          <span>{ENTITY_COUNT} entities</span>
          {WORLD_STAT_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="world" role="img" aria-label={WORLD_ARIA_LABEL}>
          {entities.map((entity, index) => (
            <div
              key={entity.id}
              className="entity"
              style={{
                left: `${(entity.x / WORLD_WIDTH) * 100}%`,
                top: `${(entity.y / WORLD_HEIGHT) * 100}%`,
                animationDelay: `${index * ENTITY_ANIMATION_STAGGER_MS}ms`,
                '--entity-hue': ENTITY_HUES[index % ENTITY_HUES.length],
              }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
