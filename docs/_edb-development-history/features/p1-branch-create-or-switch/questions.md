# Questions — p1-branch-create-or-switch

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this step has `no SemVer change`.
- This feature slice remains limited to bounded branch creation/switch execution for executor-side `P1 / Minor Change` behavior after the completed branch-state hardening baseline.
- The completed branch-state hardening baseline remains in force and is not reopened in this slice.
- Contracts remain outside the Entry, and execution remains outside the Entry.
- The first bounded branch-mutation slice must stop rather than guess when branch mutation cannot be completed safely.
- The first bounded stop policy therefore covers:
  - branch-creation failure
  - branch-switch failure
  - unsupported branch-target intent
- No generalized Git workflow recovery or broader Git orchestration is introduced in this slice.
- The first bounded mutation slice should consume one explicit target branch name rather than a richer structured branch-change intent.
- The first bounded mutation slice should support only the narrow create-and-switch path needed to leave `main`.
- Switching to an already-existing branch is deferred to a later bounded follow-up.
- Voluntary branch mutation from an already-safe non-`main` branch is deferred to a later bounded follow-up.
