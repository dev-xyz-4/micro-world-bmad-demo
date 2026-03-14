# Questions — p1-switch-existing-branch

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this step has `no SemVer change`.
- This feature slice remains limited to bounded switch-existing execution for executor-side `P1 / Minor Change` behavior after the completed branch-state hardening baseline and the completed first branch-mutation baseline.
- The completed branch-state hardening baseline and completed create-and-switch-from-main baseline remain in force and are not reopened in this slice.
- Contracts remain outside the Entry, and execution remains outside the Entry.
- The first bounded switch-existing slice should continue to consume one explicit target branch name rather than introducing a richer switch intent shape.
- The first bounded switch-existing slice must stop rather than guess when switch-existing cannot be completed safely.
- The first bounded stop policy therefore covers:
  - missing target branch
  - malformed or unsupported target branch name
  - missing existing branch
  - branch switch failure
  - unsupported switch-existing intent
- No generalized Git workflow recovery or broader Git orchestration is introduced in this slice.
- The first bounded switch-existing slice should remain limited to the blocked `main` path.
- Voluntary switch-existing behavior from an already-safe non-`main` branch is deferred to a later bounded follow-up.
