# Model — p1-branch-state-check-and-decision

## 1) System Overview (2–5 bullets)
- This slice adds the first real branch-hardening layer before repo-tracked executor-side `P1 / Minor Change` writes.
- The hardening layer starts from an already valid executor-ready `P1` context after routing, contract emission, and the completed first minimal-write baseline.
- The hardening layer stays outside the Entry and outside the contract-definition surface.
- The first hardening slice detects current Git branch state, classifies it, presents bounded operator choices, and returns continue/stop/branch-change-intent outcomes.
- Actual branch creation/switch execution remains out of scope for this model and is deferred to a following bounded slice.

## 2) Key Concepts / Terms
- `BranchState`:
  - The bounded representation of the current Git branch situation before any repo-tracked `P1` write continues.
- `on_main`:
  - Branch-state class indicating that the current Git branch is exactly `main`.
- `on_non_main_branch`:
  - Branch-state class indicating that the current Git branch exists and is not `main`.
- `branch_state_unknown`:
  - Branch-state class indicating that the system cannot determine branch state safely.
- `BranchDecisionRequest`:
  - The bounded decision surface presented to the operator after branch-state classification.
- `BranchDecisionResult`:
  - The bounded result of operator choice, used to decide whether the executor may continue or must stop.
- `request_branch_change`:
  - A bounded decision meaning that continuation on the current branch is not accepted and later branch-change handling is required.
- `branch_safe_continue`:
  - Resulting executor state indicating that the repo-tracked `P1` write may continue on the current non-`main` branch.
- `awaiting_branch_change`:
  - Resulting executor state indicating that execution must not continue until later branch-change handling occurs.
- `stopped`:
  - Resulting executor state indicating that the current sequence must stop and not proceed to repo-tracked write behavior.

## 3) Data Structures
- Name:
  - `BranchState`
  - Fields:
    - `branch_name`
    - `branch_class`
  - Meaning:
    - Captures the minimally required branch-state output before the executor can decide whether repo-tracked `P1` writing may continue.
  - Invariants:
    - `branch_class` must be one of `on_main`, `on_non_main_branch`, or `branch_state_unknown`.
    - `branch_state_unknown` must not be treated as safe-to-continue.

- Name:
  - `BranchDecisionRequest`
  - Fields:
    - `branch_state`
    - `allowed_actions`
    - `operator_prompt_hint`
  - Meaning:
    - Encodes the bounded operator-facing decision surface after branch-state classification.
  - Invariants:
    - `allowed_actions` must depend on `branch_class`.
    - `on_main` must not allow direct continue on current branch.
    - `branch_state_unknown` must allow only stop.

- Name:
  - `BranchDecisionResult`
  - Fields:
    - `selected_action`
    - `resulting_executor_state`
    - `next_human_action`
  - Meaning:
    - Encodes the bounded result used by the later executor path to continue safely or stop before repo-tracked write behavior.
  - Invariants:
    - `selected_action` must be one of `continue_on_current_branch`, `request_branch_change`, or `stop`.
    - `resulting_executor_state` must be one of `branch_safe_continue`, `awaiting_branch_change`, or `stopped`.
    - `continue_on_current_branch` is valid only when `branch_class = on_non_main_branch`.

## 4) State Machine (if applicable)
### States
- `awaiting_branch_state_detection`
- `branch_state_classified`
- `awaiting_operator_decision`
- `branch_safe_continue`
- `awaiting_branch_change`
- `stopped`

### Transitions
- `awaiting_branch_state_detection` → `branch_state_classified`: real Git branch-state detection succeeds and produces `BranchState`.
- `awaiting_branch_state_detection` → `stopped`: branch state cannot be determined safely.
- `branch_state_classified` → `awaiting_operator_decision`: bounded allowed actions are derived from the classified branch state.
- `awaiting_operator_decision` → `branch_safe_continue`: operator selects `continue_on_current_branch` while already on non-`main`.
- `awaiting_operator_decision` → `awaiting_branch_change`: operator selects `request_branch_change`.
- `awaiting_operator_decision` → `stopped`: operator selects `stop`.
- `awaiting_operator_decision` → `stopped`: operator refuses branch-change intent while on `main`.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - `BranchStateDetection`
  - Inputs:
    - current repo context
  - Output:
    - `BranchState`
  - Notes:
    - Must detect real Git branch state.
    - Must not rely only on manual confirmation.
    - Must stop on uncertainty.

- Rule:
  - `BranchStateClassification`
  - Inputs:
    - detected branch name or detection failure
  - Output:
    - `on_main`, `on_non_main_branch`, or `branch_state_unknown`
  - Notes:
    - `main` is treated as a distinct unsafe-for-direct-write state.
    - Any safe-detection failure maps to `branch_state_unknown`.

- Rule:
  - `OnMainDecisionRule`
  - Inputs:
    - `BranchState` where `branch_class = on_main`
    - operator response
  - Output:
    - `BranchDecisionResult`
  - Notes:
    - Repo-tracked writes cannot continue directly on `main`.
    - Allowed actions are `request_branch_change` or `stop`.
    - Refusing branch-change intent must stop.

- Rule:
  - `OnNonMainDecisionRule`
  - Inputs:
    - `BranchState` where `branch_class = on_non_main_branch`
    - operator response
  - Output:
    - `BranchDecisionResult`
  - Notes:
    - Continuing on the current branch is allowed.
    - Requesting branch change remains a bounded follow-up choice.
    - Stop remains allowed.

- Rule:
  - `UnknownBranchStateRule`
  - Inputs:
    - `BranchState` where `branch_class = branch_state_unknown`
  - Output:
    - `BranchDecisionResult` with `selected_action = stop`
  - Notes:
    - No guessing.
    - No repo-tracked write continuation.

- Rule:
  - `ExecutionBoundaryPreservation`
  - Inputs:
    - executor-ready `P1 / Minor Change` context
    - branch-hardening outcome
  - Output:
    - safe continuation boundary for later write behavior, or stop
  - Notes:
    - The Entry is not redefined as the branch-hardening surface.
    - Contract definition remains outside the Entry.
    - Actual branch creation/switch execution is not performed in this model.

## 6) Failure Modes / Edge Cases
- Real Git branch state cannot be determined:
  - classify as `branch_state_unknown`
  - stop
- Operator is on `main` and rejects branch-change intent:
  - stop
- Operator is on non-`main` but chooses stop:
  - stop
- Decision shape is malformed or contains an unsupported action:
  - stop rather than infer intent
- The hardening layer is asked to perform actual branch creation/switch:
  - reject as out of scope for this slice
- The hardening layer is pushed toward target-resolution redesign or generalized workflow orchestration:
  - stop and route to later bounded planning instead of widening this model

## 7) Observability (optional)
- Logs:
  - branch-state classification result
  - bounded selected action
  - resulting executor state
- Metrics:
  - optional later counts for `on_main`, `on_non_main_branch`, `branch_state_unknown`, and stop vs continue outcomes

