# Risk Profile

## Current Risk Level

Current overall risk is low to moderate.

The demo now has a working released core, so the main risks are scope growth, premature generalization, and clarity loss during live extension work rather than bootstrap uncertainty.

## Primary Risks

- Scope drift from demo setup into unplanned feature work
- Mixing small minors with new architectural commitments
- Overdesign before the next behavior slice is truly needed
- Performance issues once entity interaction rules become more complex
- Visual changes that reduce clarity during live demonstration

## Mitigations

- Keep local visual and readability minors separate from new behavior work
- Use BMAD for new structure, behavior, and decision-heavy work
- Prefer small, reviewable increments
- Validate demo behavior early in the browser
- Treat performance-sensitive rules as explicit follow-up work

## Near-Term Watchpoints

- Keep the released core small and understandable
- Introduce additional simulation folders and files only when the corresponding feature is ready
- Maintain alignment between planning docs and implemented state
