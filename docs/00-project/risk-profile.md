# Risk Profile

## Current Risk Level

Current overall risk is low to moderate.

The project is still in an early setup phase, so the main risks are structural drift and premature complexity rather than production instability.

## Primary Risks

- Scope drift from demo setup into unplanned feature work
- Mixing minor bootstrap changes with real architectural decisions
- Overdesign before the simulation core is proven
- Performance issues once entity interaction rules become more complex
- Visual changes that reduce clarity during live demonstration

## Mitigations

- Keep bootstrap and documentation changes separate from core feature implementation
- Use BMAD for new structure, behavior, and decision-heavy work
- Prefer small, reviewable increments
- Validate demo behavior early in the browser
- Treat performance-sensitive rules as explicit follow-up work

## Near-Term Watchpoints

- Keep the app scaffold clean and minimal
- Introduce simulation folders and files only when the corresponding feature is ready
- Maintain alignment between planning docs and implemented state
