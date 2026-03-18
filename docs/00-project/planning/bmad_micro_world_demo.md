# Rule-Driven Micro World – BMAD Demo Setup

## 1. Goal
You are building a small, visually appealing simulation (Micro World) that is created entirely through your BMAD workflow and can be demonstrated.

Goal:
- Implement the core in 1–2 BMAD features plus minors if needed
- Show live extensibility (without risk)
- Clearly structured architecture

---

## 2. Tooling (recommended)

### Setup (implemented)
- Node.js LTS verified locally (`v24.12.0`, `npm 11.6.2`)
- VS Code workspace in use
- React + Vite app initialized in `micro-world-app/`

### Optional (Deployment)
- Vercel (for a stable demo)
- StackBlitz (for quick sharing)

---

## 3. Project Structure (BMAD-compatible)

```
micro-world-app/src/
  /core
    engine.js
    entities.js
    rules.js
  App.jsx
  App.css
```

Status:
- `core/` is implemented for the current release baseline
- dedicated `features/` and `minors/` app folders remain optional and can be added later if needed

---

## 4. Core Architecture (what you should build)

Status:
- baseline implemented and released

### Engine
- Game Loop (requestAnimationFrame)
- Separate update and render

### Entities
- Position (x, y)
- Velocity (vx, vy)

### Rule System
- List of rules
- Each rule manipulates entities

Example conceptual model:
- applyRules(entities)
- updatePositions()
- render()

---

## 5. BMAD Breakdown (Core)

### Feature 1: "Entity System"
- Break: We need movable objects
- Model: Entities + Position + Velocity
- Analyze: Update per frame
- Deliver: Implement movement
- Status: implemented and released in `v0.2.0`

---

### Feature 2: "Rule Engine"
- Break: Behavior should be controllable
- Model: Rules as functions
- Analyze: Order + effect
- Deliver: Rule Pipeline
- Status: implemented and released in `v0.3.0`

---

### Minor Examples in the Core
- Improve rendering (glow) - implemented
- Extract parameters - implemented
- Small refactors - implemented

---

## 6. Live Demo Extensions

### 🟢 Minor 1: Glow Rendering
- Implemented for the current baseline
- Effect: immediate visual upgrade

---

### 🟢 Minor 2: Connection Lines
- Lines between nearby entities
- Distance-based transparency
- Status: open candidate

---

### 🟢 Minor 3: UI Controls
- Slider for speed
- Toggle for rules
- Status: open candidate

---

### 🔵 BMAD Feature: Attraction / Repulsion Rule

#### Break
Entities should influence each other

#### Model
- Distance calculation
- Force vector

#### Analyze
- Avoid instability
- Limit forces

#### Deliver
- Implement a new rule:
  - applyAttraction()
  - optional: applyRepulsion()

#### Pre-Sanity-Check
- Avoid explosions (clamp)
- Performance (watch out for O(n²))

Status:
- not started

---

## 7. Interactivity

- Mouse = force source
- Click = new entities
- Buttons = modes

---

## 8. Timeline

### Day 1
- Setup
- Entity System
- Basic Movement
- Status: completed

### Day 2
- Rule Engine
- Visual improvements
- Prepare demo
- Status: completed for the current baseline

---

## 9. Demo Principle

- Only small steps live
- Core is prepared in a stable way
- Changes are immediately visible

---

## 10. Intended Effect

- Shows structured work (BMAD)
- Shows iteration (minors)
- Shows live feature development
