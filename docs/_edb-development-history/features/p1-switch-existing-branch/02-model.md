# Model — p1-switch-existing-branch

## 1) System Overview (2–5 bullets)
- This slice adds the next bounded branch-mutation layer after the completed executor-side `P1 / Minor Change` branch-state hardening baseline and the completed first create-and-switch-from-main baseline.
- The switch-existing layer starts only after a valid executor-ready `P1` context has already reached the bounded `request_branch_change` path.
- The switch-existing layer stays outside the Entry and outside the contract-definition surface.
- The first switch-existing slice is limited to one explicit target branch name plus bounded switching to an already-existing non-`main` branch.
- Generalized Git workflow orchestration, recovery flows, create-and-switch baseline redesign, and target-resolution redesign remain out of scope for this model.

## 2) Key Concepts / Terms
- `BranchSwitchRequest`:
  - The bounded executor-side request to switch to an already-existing non-`main` branch after the already-completed hardening layer has produced `request_branch_change`.
- `BranchTargetIntent`:
  - The bounded operator-supplied target branch name used by the first switch-existing slice.
- `awaiting_branch_change`:
  - The already-existing bounded executor state produced by the completed hardening slice when continuation on the current branch must not proceed.
- `BranchSwitchResult`:
  - The bounded result returned by the first switch-existing slice after it attempts the requested existing-branch switch or stops.
- `branch_switch_applied`:
  - Resulting executor state indicating that the requested bounded switch to an already-existing non-`main` branch succeeded.
- `stopped`:
  - Resulting executor state indicating that the switch-existing step must stop without guessing or widening behavior.

## 3) Data Structures
- Name:
  - `BranchSwitchRequest`
  - Fields:
    - `prior_branch_state`
    - `prior_branch_decision_result`
    - `target_branch_name`
    - `allowed_switch_actions`
  - Meaning:
    - Captures the minimally required input surface for the first bounded switch-existing step after the hardening layer has already refused direct continuation.
  - Invariants:
    - `prior_branch_decision_result.resulting_executor_state` must already indicate a branch-change path.
    - The request must remain tied to executor-side `P1 / Minor Change` behavior.
    - The request must not be treated as a generalized Git workflow command surface.
    - The first switch-existing slice is limited to the blocked `main` path.

- Name:
  - `BranchTargetIntent`
  - Fields:
    - `target_branch_name`
  - Meaning:
    - Represents the one explicit operator-approved branch name needed for the executor to switch to an already-existing non-`main` branch.
  - Invariants:
    - The first slice continues to consume one explicit target branch name, not a richer structured switch intent.
    - Missing, malformed, or unsupported target names must stop.

- Name:
  - `BranchSwitchResult`
  - Fields:
    - `selected_switch_action`
    - `resulting_executor_state`
    - `result_branch_state`
    - `next_human_action`
  - Meaning:
    - Encodes the bounded outcome of the first switch-existing attempt.
  - Invariants:
    - `resulting_executor_state` must stay bounded to explicit success-or-stop outcomes.
    - Unsafe or failed switching must not silently degrade into guessed continuation.
    - The result must preserve the completed hardening baseline and completed create-and-switch baseline rather than bypass them.

## 4) State Machine (if applicable)
### States
- `awaiting_branch_change_request`
- `branch_change_request_validated`
- `awaiting_existing_branch_switch`
- `branch_switch_applied`
- `stopped`

### Transitions
- `awaiting_branch_change_request` → `branch_change_request_validated`: a bounded switch-existing request is formed from a prior `request_branch_change` outcome plus one valid target branch name.
- `awaiting_branch_change_request` → `stopped`: target branch name is missing, malformed, or unsupported.
- `awaiting_branch_change_request` → `stopped`: the current path is outside the first bounded switch-existing scope.
- `branch_change_request_validated` → `awaiting_existing_branch_switch`: the bounded mutation action is selected as switch to an already-existing non-`main` branch.
- `awaiting_existing_branch_switch` → `branch_switch_applied`: bounded existing-branch switch succeeds.
- `awaiting_existing_branch_switch` → `stopped`: target branch does not exist.
- `awaiting_existing_branch_switch` → `stopped`: target branch resolves to `main` or otherwise unsafe branch context.
- `awaiting_existing_branch_switch` → `stopped`: branch switching fails.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - `HardeningAndMutationBaselinePrecondition`
  - Inputs:
    - executor-ready `P1 / Minor Change` context
    - prior hardening result
    - prior mutation baseline rules
  - Output:
    - eligible or ineligible switch-existing entry
  - Notes:
    - The switch-existing layer starts only after the completed branch-state hardening baseline.
    - The prior flow must already have reached `request_branch_change` / `awaiting_branch_change`.
    - The first switch-existing slice is limited to the blocked `main` path.

- Rule:
  - `BranchTargetIntentValidation`
  - Inputs:
    - proposed target branch name
  - Output:
    - bounded valid switch request or stop
  - Notes:
    - The first switch-existing slice consumes one explicit target branch name.
    - The slice must stop rather than infer unsupported or incomplete target intent.

- Rule:
  - `ExistingBranchEligibilityCheck`
  - Inputs:
    - validated target branch name
    - current repo branch context
  - Output:
    - eligible switch-existing action or stop
  - Notes:
    - The target branch must already exist.
    - The target branch must resolve to a safe non-`main` branch context.
    - The first switch-existing slice does not add voluntary switching from an already-safe non-`main` branch.

- Rule:
  - `ExistingBranchSwitchExecution`
  - Inputs:
    - bounded switch-existing action
    - current repo branch context
  - Output:
    - `BranchSwitchResult`
  - Notes:
    - Successful switching must result in a new safe branch context rather than a bypass of the existing hardening baseline.
    - Missing target branch and switch failure both stop.
    - No generalized recovery, retry orchestration, or multi-step Git workflow handling is introduced.

- Rule:
  - `ExecutionBoundaryPreservation`
  - Inputs:
    - prior hardening result
    - switch-existing result
  - Output:
    - bounded post-switch continuation boundary or stop
  - Notes:
    - The Entry is not redefined as the branch-mutation surface.
    - Contract definition remains outside the Entry.
    - Create-and-switch baseline redesign and target-resolution redesign remain out of scope.

## 6) Failure Modes / Edge Cases
- `request_branch_change` exists but no valid target branch name is supplied:
  - stop
- Target branch name is malformed or unsupported:
  - stop
- The current request is outside the first bounded switch-existing path scope:
  - stop
- The requested target branch does not exist:
  - stop
- The requested target branch resolves to `main` or another unsafe branch context:
  - stop
- Branch switching fails:
  - stop
- Switching appears to succeed but does not yield a safely changed branch context:
  - stop rather than assume continuation
- The switch-existing layer is pushed toward generalized Git workflow recovery or unrelated repository coordination:
  - stop and defer to a later bounded slice

## 7) Observability (optional)
- Logs:
  - entry into bounded switch-existing path after prior `request_branch_change`
  - target branch name validation result
  - existing-branch eligibility result
  - switch success or stop reason
- Metrics:
  - optional later counts for successful switch-existing, stopped-on-missing-branch, stopped-on-unsafe-target-branch, and stopped-on-switch-failure
