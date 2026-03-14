# Questions — p1-branch-state-check-and-decision

## Open

- None at this stage.

## Resolved

- Documentation-only planning for this break step has `no SemVer change`.
- This feature slice remains limited to branch-state hardening for executor-side `P1 / Minor Change` behavior after the completed first minimal write baseline.
- Real Git branch-state detection now replaces the current confirmation-only safety gate for this path.
- The bounded branch-state classes are `on_main`, `on_non_main_branch`, and `branch_state_unknown`.
- On `main`, refusing branch-change intent must stop the sequence.
- Actual branch creation/switch execution stays out of this first hardening implementation slice.
- The bounded decision/result shape uses:
  - `continue_on_current_branch`
  - `request_branch_change`
  - `stop`
  with resulting executor states:
  - `branch_safe_continue`
  - `awaiting_branch_change`
  - `stopped`
- The first bounded real branch-state detection and branch-dependent decision logic should stay on the existing dedicated path-specific executor surface:
  - `scripts/quality/p1-minor-change-executor.mjs`
- Contracts remain outside the Entry, and execution remains outside the Entry.
