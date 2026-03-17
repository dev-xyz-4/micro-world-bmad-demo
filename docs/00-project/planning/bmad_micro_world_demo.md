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
/src
  /core
    engine.js
    entities.js
    rules.js
  /features
  /minors
  App.jsx
```

---

## 4. Core Architecture (what you should build)

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

---

### Feature 2: "Rule Engine"
- Break: Behavior should be controllable
- Model: Rules as functions
- Analyze: Order + effect
- Deliver: Rule Pipeline

---

### Minor Examples in the Core
- Improve rendering (glow)
- Extract parameters
- Small refactors

---

## 6. Live Demo Extensions

### 🟢 Minor 1: Glow Rendering
- Canvas Alpha + Blur
- Effect: immediate visual upgrade

---

### 🟢 Minor 2: Connection Lines
- Lines between nearby entities
- Distance-based transparency

---

### 🟢 Minor 3: UI Controls
- Slider for speed
- Toggle for rules

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

### Day 2
- Rule Engine
- Visual improvements
- Prepare demo

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
