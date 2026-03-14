# Questions — p1-non-main-switch-existing-branch

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this step has `no SemVer change`.
- This feature slice remains limited to bounded safe non-`main` switch-existing behavior for executor-side `P1 / Minor Change` after the completed branch-state hardening, create-and-switch-from-main, blocked-`main` switch-existing, and safe non-`main` additional-new-branch baselines.
- The completed branch-state hardening baseline, completed create-and-switch-from-main baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline remain in force and are not reopened in this slice.
- Contracts remain outside the Entry, and execution remains outside the Entry.
- The safe non-`main` operator context in this slice must expose exactly three bounded options:
  - continue writing on the current branch
  - open one additional new branch and continue there
  - switch to one already-existing safe non-`main` branch and continue there
- The smallest first implementation target is additive:
  - preserve the existing continue-on-current-branch path on safe non-`main`
  - preserve the existing additional-new-branch path on safe non-`main`
  - add one bounded switch-existing option from an already-safe non-`main` branch
- This slice must build on the existing branch-state classes, branch-dependent decision results, and target-branch input handling rather than redesigning them.
- No generalized Git workflow recovery or broader Git orchestration is introduced in this slice.
- The first bounded stop policy for safe non-`main` switch-existing must stop rather than guess when the requested switch cannot be completed safely.
- The first bounded stop policy therefore covers:
  - missing target branch input where the safe non-`main` switch-existing path requires it
  - malformed or unsupported target branch name
  - missing existing target branch
  - target branch resolving to `main` or another unsafe branch context
  - branch switching failure
  - unsupported safe non-`main` switch-existing intent or path
  - apparent switch success without a safely established post-switch branch context
- The first bounded decision/result shape should preserve the completed safe non-`main` continuation path and the completed safe non-`main` additional-new-branch path as they are, and add one separate bounded safe non-`main` switch-existing path.
- The first slice should not introduce one newly unified three-option branch-choice envelope for the safe non-`main` context.
- Existing target-branch input handling remains sufficient for the first bounded safe non-`main` switch-existing path; no richer intent structure is required in this slice.
