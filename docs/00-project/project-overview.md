# Project Overview

## Project Identity

This repository is used to build the Rule-Driven Micro World - BMAD Demo.

The project goal is a small, visually appealing simulation that is developed through the BMAD workflow and can be demonstrated incrementally.

## Delivery Approach

EDB is used here as the delivery method and development strategy.

BMAD provides the structure for:
- breaking down features
- modeling the core concepts
- analyzing decisions and tradeoffs
- delivering implementation in controlled steps

## Current Implementation Direction

The demo application is implemented as an isolated React + Vite app in `micro-world-app/`.

The current released core includes:
- an entity system
- a rule engine
- bounded visual and readability minors

## Working Principle

The project should evolve in small, demonstrable steps.

The current baseline at `v0.3.0` demonstrates:
- `10` moving entities with position and velocity
- a delta-based update loop with simple bounds behavior
- an explicit rule pipeline with a global swirl rule

Core behavior should stay stable while new rules, visuals, and controls can be added through BMAD features and minor changes.
