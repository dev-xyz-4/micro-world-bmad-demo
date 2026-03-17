# Architecture Overview

## Current State

The repository currently consists of:
- project and BMAD documentation under `docs/`
- governance and workflow support under `docs/engineering/` and `scripts/`
- an isolated demo application under `micro-world-app/`

At this stage, the application exists as a React + Vite scaffold.
The simulation-specific implementation is planned but not yet built.

## Intended Application Shape

The planned application structure inside `micro-world-app/src/` is:
- `core/` for simulation primitives such as engine, entities, and rules
- `features/` for larger BMAD-driven feature slices
- `minors/` for small local improvements
- `App.jsx` as the app entry component

## Architectural Intent

The intended core direction is:
- separate simulation update and rendering responsibilities
- keep rule behavior explicit and composable
- preserve a structure that supports safe live demo extensions

## Current Constraint

This document describes the intended near-term shape only.
It does not imply that the core architecture is already implemented.
