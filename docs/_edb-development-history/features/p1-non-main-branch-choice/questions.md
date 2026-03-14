# Questions — p1-non-main-branch-choice

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this step has `no SemVer change`.
- This feature slice remains limited to bounded non-`main` branch-choice behavior for executor-side `P1 / Minor Change` after the completed branch-state hardening, create-and-switch-from-main, and switch-existing baselines.
- The completed branch-state hardening baseline, completed create-and-switch-from-main baseline, and completed switch-existing baseline remain in force and are not reopened in this slice.
- Contracts remain outside the Entry, and execution remains outside the Entry.
- Generalized Git workflow recovery or broader Git orchestration is not introduced in this slice.
- The first bounded stop policy must stop rather than guess when the requested additional new-branch action cannot be completed safely from the current non-`main` branch.
- The first bounded stop policy therefore covers:
  - missing target branch input where the new-branch path requires it
  - malformed or unsupported target branch name
  - branch already exists where the first slice expects a new branch
  - branch creation failure
  - branch switching failure
  - unsupported branch-choice intent
- The first bounded implementation shape should preserve the existing `continue_on_current_branch` path on safe non-`main` exactly as-is.
- The first bounded implementation shape should add one separate bounded new-branch path from the current safe non-`main` branch using one explicit target branch name.
- The first slice should not reshape the safe non-`main` decision model beyond what is required to add that one new bounded capability.
