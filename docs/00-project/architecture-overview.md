# Architecture Overview

## Current State

The repository currently consists of:
- project and BMAD documentation under `docs/`
- governance and workflow support under `docs/engineering/` and `scripts/`
- an isolated demo application under `micro-world-app/`

The current application baseline is implemented and consists of:
- `src/core/entities.js` for entity initialization
- `src/core/engine.js` for movement updates and bounds handling
- `src/core/rules.js` for explicit rule application
- `src/App.jsx` and `src/App.css` for rendering and presentation

## Current Application Shape

The implemented structure inside `micro-world-app/src/` currently uses:
- `core/` for simulation primitives such as engine, entities, and rules
- `App.jsx` as the app entry component
- `App.css` for the current visual surface

Additional `features/` or `minors/` folders remain optional future structure and are not required by the current release baseline.

## Architectural Intent

The current core direction is:
- keep entity creation, rule application, and movement updates separate
- apply rules explicitly before movement updates and rendering
- preserve a structure that supports safe live demo extensions without generalized infrastructure too early

## Current Constraint

The current architecture is intentionally demo-oriented.
It is not yet a generalized simulation platform and should stay small until new bounded features require expansion.
