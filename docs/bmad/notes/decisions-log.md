# Decisions Log

## Purpose

This file captures small but durable project decisions that are useful for future sessions.
It is not the owner of workflow or versioning policy.

## Recorded Decisions

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-17 | Keep the demo app isolated in `micro-world-app/` instead of moving the app to the repository root. | This preserves a clean separation between project documentation, governance material, and the runnable demo application. |
| 2026-03-18 | Treat the first demo core as two BMAD features: `entity-system` and `rule-engine`. | This keeps the initial core behavior small, demonstrable, and aligned with the BMAD workflow. |
| 2026-03-18 | Use a single global swirl rule as the first rule-engine behavior. | It is visually understandable, technically small, and clearly demonstrates explicit rule-driven behavior. |
| 2026-03-18 | Consider `v0.3.0` the first released demo-core baseline. | At this point the repository contains entities, bounded movement, explicit rule application, and supporting visual minors. |
