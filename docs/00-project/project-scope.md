# Project Scope

## In Scope

This project builds a small rule-driven micro world as a demo application.

The current in-scope baseline is:
- BMAD-driven planning and project documentation
- an isolated React + Vite application in `micro-world-app/`
- a released simulation core baseline
- incremental, demo-friendly extensions

## Current Core Scope

The current core scope includes:
- entities with position and velocity
- a frame-based update loop
- a rule pipeline that influences entity velocity
- a visually understandable simulation surface with glow-focused rendering

## Out of Scope for the Current Release Baseline

The following are not part of the current release baseline:
- attraction or repulsion behavior
- connection lines
- UI controls
- complex interaction design
- production deployment setup
- advanced optimization work
- broad architecture expansion beyond the current demo

## Delivery Boundaries

The project should be developed in small, reviewable steps.

New behavior and new structural decisions should move through BMAD features.
Small, local, reversible documentation or support changes may remain Minor Changes.
