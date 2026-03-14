# Model — p1-non-main-branch-choice

## 1) System Overview (2–5 bullets)
- This slice adds the next bounded branch-choice layer after the completed executor-side `P1 / Minor Change` branch-state hardening baseline, the completed first create-and-switch-from-main baseline, and the completed first switch-existing baseline.
- The non-`main` branch-choice layer starts only after a valid executor-ready `P1` context is already on a safe non-`main` branch.
- The branch-choice layer stays outside the Entry and outside the contract-definition surface.
- The first non-`main` branch-choice slice is limited to preserving current-branch continuation and adding one bounded option to open one additional new branch from that already-safe non-`main` context.
- Generalized Git workflow orchestration, blocked-`main` redesign, switch-existing redesign, and target-resolution redesign remain out of scope for this model.

## 2) Key Concepts / Terms
- `NonMainBranchChoiceRequest`:
  - The bounded executor-side request formed when the current branch is already a safe non-`main` branch and the operator may either continue there or open one additional new branch.
- `BranchChoiceIntent`:
  - The bounded operator intent describing either continuation on the current safe branch or the request to open one additional new branch.
- `safe_non_main_context`:
  - The already-established executor state in which current repo branch state is safely classified as `on_non_main_branch`.
- `BranchChoiceResult`:
  - The bounded result returned by the first non-`main` branch-choice slice after it preserves current-branch continuation, applies a bounded new-branch action, or stops.
- `branch_choice_applied`:
  - Resulting executor state indicating that the requested bounded branch-choice action succeeded.
- `stopped`:
  - Resulting executor state indicating that the branch-choice step must stop without guessing or widening behavior.

## 3) Data Structures
- Name:
  - `NonMainBranchChoiceRequest`
  - Fields:
    - `prior_branch_state`
    - `prior_branch_decision_result`
    - `current_branch_name`
    - `branch_choice_intent`
    - `allowed_choice_actions`
  - Meaning:
    - Captures the minimally required input surface for the first bounded non-`main` branch-choice step after the executor is already on a safe non-`main` branch.
  - Invariants:
    - `prior_branch_state.branch_class` must already be `on_non_main_branch`.
    - The request must remain tied to executor-side `P1 / Minor Change` behavior.
    - The request must not be treated as a generalized Git workflow command surface.
    - The first slice preserves the existing `continue_on_current_branch` path exactly as-is and adds one separate bounded new-branch path.

- Name:
  - `BranchChoiceIntent`
  - Fields:
    - `selected_choice_action`
    - `target_branch_name` (only when the bounded new-branch path requires it)
  - Meaning:
    - Represents the bounded operator-approved intent needed to either continue on the current safe non-`main` branch or open one additional new branch.
  - Invariants:
    - The first slice remains bounded to current-branch continuation plus one additional new-branch option.
    - Missing, malformed, or unsupported intent data must stop.
    - The first slice does not redesign the existing safe non-`main` continuation path.

- Name:
  - `BranchChoiceResult`
  - Fields:
    - `selected_choice_action`
    - `resulting_executor_state`
    - `result_branch_state`
    - `next_human_action`
  - Meaning:
    - Encodes the bounded outcome of the first non-`main` branch-choice attempt.
  - Invariants:
    - `resulting_executor_state` must stay bounded to explicit success-or-stop outcomes.
    - Unsafe or failed branching must not silently degrade into guessed continuation.
    - The result must preserve the completed hardening baseline, completed create-and-switch baseline, and completed switch-existing baseline rather than bypass them.

## 4) State Machine (if applicable)
### States
- `safe_non_main_context_detected`
- `branch_choice_request_validated`
- `awaiting_non_main_branch_choice`
- `branch_choice_applied`
- `stopped`

### Transitions
- `safe_non_main_context_detected` → `branch_choice_request_validated`: a bounded non-`main` branch-choice request is formed from a safe current branch plus one bounded operator intent.
- `safe_non_main_context_detected` → `stopped`: bounded branch-choice intent is missing, malformed, or unsupported.
- `safe_non_main_context_detected` → `stopped`: the current path is outside the first bounded non-`main` branch-choice scope.
- `branch_choice_request_validated` → `awaiting_non_main_branch_choice`: the bounded choice action is selected as either continue on current branch or open one additional new branch.
- `awaiting_non_main_branch_choice` → `branch_choice_applied`: bounded current-branch continuation or bounded new-branch action succeeds.
- `awaiting_non_main_branch_choice` → `stopped`: requested new target branch already exists where a new branch is required.
- `awaiting_non_main_branch_choice` → `stopped`: requested new target branch name is invalid or unsafe.
- `awaiting_non_main_branch_choice` → `stopped`: bounded branch creation or switching fails.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - `SafeNonMainContextPrecondition`
  - Inputs:
    - executor-ready `P1 / Minor Change` context
    - prior hardening result
    - prior blocked-`main` mutation baselines
  - Output:
    - eligible or ineligible non-`main` branch-choice entry
  - Notes:
    - The branch-choice layer starts only after the completed branch-state hardening baseline.
    - The current branch must already be safely classified as non-`main`.
    - The first slice preserves the existing current-branch continuation path and adds one separate bounded additional-new-branch path.

- Rule:
  - `BranchChoiceIntentValidation`
  - Inputs:
    - proposed bounded branch-choice intent
  - Output:
    - bounded valid branch-choice request or stop
  - Notes:
    - The first non-`main` branch-choice slice stays bounded to two options only.
    - The slice must stop rather than infer unsupported or incomplete operator intent.

- Rule:
  - `CurrentBranchContinuationPreservation`
  - Inputs:
    - validated continue-on-current-branch intent
    - safe current non-`main` branch context
  - Output:
    - eligible bounded continuation result
  - Notes:
    - The completed `continue_on_current_branch` path must remain intact.
    - This slice must not weaken the already-implemented safe non-`main` continuation path.

- Rule:
  - `AdditionalNewBranchEligibilityCheck`
  - Inputs:
    - validated new-branch intent
    - current safe non-`main` branch context
  - Output:
    - eligible bounded new-branch action or stop
  - Notes:
    - The requested new branch must be new, valid, and safe.
    - The additional-new-branch path is additive and does not reshape the existing safe non-`main` continuation path.

- Rule:
  - `AdditionalNewBranchExecution`
  - Inputs:
    - bounded new-branch action
    - current safe non-`main` branch context
  - Output:
    - `BranchChoiceResult`
  - Notes:
    - Successful execution must establish the requested new non-`main` branch safely before later write continuation is considered.
    - Branch-exists, creation failure, and switch failure all stop.
    - No generalized recovery, retry orchestration, or multi-step Git workflow handling is introduced.

- Rule:
  - `ExecutionBoundaryPreservation`
  - Inputs:
    - prior hardening result
    - branch-choice result
  - Output:
    - bounded post-choice continuation boundary or stop
  - Notes:
    - The Entry is not redefined as the branch-mutation surface.
    - Contract definition remains outside the Entry.
    - Blocked-`main` redesign, switch-existing redesign, and target-resolution redesign remain out of scope.

## 6) Failure Modes / Edge Cases
- The current branch is not safely classified as non-`main`:
  - stop
- Branch-choice intent is missing, malformed, or unsupported:
  - stop
- The current request is outside the first bounded non-`main` branch-choice scope:
  - stop
- The requested new target branch already exists:
  - stop
- The requested new target branch name is malformed or unsupported:
  - stop
- Branch creation fails:
  - stop
- Branch switching fails:
  - stop
- Branching appears to succeed but does not yield a safely changed branch context:
  - stop rather than assume continuation
- The branch-choice layer is pushed toward generalized Git workflow recovery or unrelated repository coordination:
  - stop and defer to a later bounded slice

## 7) Observability (optional)
- Logs:
  - entry into bounded non-`main` branch-choice path from safe current branch context
  - branch-choice intent validation result
  - current-branch continuation preservation result
  - bounded new-branch eligibility result
  - branch-choice success or stop reason
- Metrics:
  - optional later counts for continue-on-current-branch, successful additional-new-branch, stopped-on-branch-exists, stopped-on-invalid-target, and stopped-on-branch-failure
