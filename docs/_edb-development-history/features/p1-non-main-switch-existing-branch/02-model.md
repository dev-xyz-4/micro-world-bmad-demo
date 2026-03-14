# Model — p1-non-main-switch-existing-branch

## 1) System Overview (2–5 bullets)
- This slice adds the next bounded branch-choice layer after the completed executor-side `P1 / Minor Change` branch-state hardening baseline, the completed first create-and-switch-from-main baseline, the completed first switch-existing-from-main baseline, and the completed first safe non-`main` additional-new-branch baseline.
- The safe non-`main` switch-existing layer starts only after a valid executor-ready `P1` context is already on a safe non-`main` branch.
- The layer stays outside the Entry and outside the contract-definition surface.
- The first slice is limited to preserving current-branch continuation, preserving the completed additional-new-branch path, and adding one bounded option to switch to one already-existing safe non-`main` branch from that already-safe non-`main` context.
- Generalized Git workflow orchestration, blocked-`main` redesign, safe non-`main` create-and-switch redesign, and target-resolution redesign remain out of scope for this model.

## 2) Key Concepts / Terms
- `SafeNonMainBranchChoiceRequest`:
  - The bounded executor-side request formed when the current branch is already a safe non-`main` branch and the operator must remain within the three bounded options for that context.
- `SafeNonMainChoiceIntent`:
  - The bounded operator intent describing one of three allowed safe non-`main` actions:
    - continue on the current branch
    - open one additional new branch
    - switch to one already-existing safe non-`main` branch
- `safe_non_main_context`:
  - The already-established executor state in which current repo branch state is safely classified as `on_non_main_branch`.
- `SafeNonMainChoiceSurface`:
  - The conceptual bounded decision surface for the already-safe non-`main` context.
  - In this first slice, the surface preserves the completed safe non-`main` continuation path and the completed safe non-`main` additional-new-branch path, and adds one separate bounded safe non-`main` switch-existing path.
- `SafeNonMainChoiceResult`:
  - The bounded result returned after the safe non-`main` choice surface preserves current-branch continuation, applies the completed bounded additional-new-branch path, applies the new bounded switch-existing path, or stops.
- `branch_choice_applied`:
  - Resulting executor state indicating that the requested bounded safe non-`main` action succeeded.
- `stopped`:
  - Resulting executor state indicating that the safe non-`main` step must stop without guessing or widening behavior.

## 3) Data Structures
- Name:
  - `SafeNonMainBranchChoiceRequest`
  - Fields:
    - `prior_branch_state`
    - `prior_branch_decision_result`
    - `current_branch_name`
    - `safe_non_main_choice_intent`
    - `allowed_choice_actions`
  - Meaning:
    - Captures the minimally required conceptual input surface for the first bounded safe non-`main` choice step after the executor is already on a safe non-`main` branch.
  - Invariants:
    - `prior_branch_state.branch_class` must already be `on_non_main_branch`.
    - The request must remain tied to executor-side `P1 / Minor Change` behavior.
    - The request must not be treated as a generalized Git workflow command surface.
    - The request must preserve the completed `continue_on_current_branch` path and the completed additional-new-branch path while adding one separate bounded switch-existing path.

- Name:
  - `SafeNonMainChoiceIntent`
  - Fields:
    - `selected_choice_action`
    - `target_branch_name` (only when the chosen safe non-`main` path requires it)
  - Meaning:
    - Represents the conceptual bounded operator-approved intent needed to stay on the current safe branch, open one additional new branch, or switch to one already-existing safe non-`main` branch.
  - Invariants:
    - The first slice preserves the completed safe non-`main` continuation path and completed additional-new-branch path as they are, and adds one separate bounded switch-existing path.
    - The allowed conceptual actions are limited to the three bounded safe non-`main` options.
    - Missing, malformed, or unsupported intent data must stop.
    - The first slice does not redesign the existing safe non-`main` continuation path or the completed additional-new-branch path.

- Name:
  - `SafeNonMainChoiceResult`
  - Fields:
    - `selected_choice_action`
    - `resulting_executor_state`
    - `result_branch_state`
    - `next_human_action`
  - Meaning:
    - Encodes the bounded outcome of the first safe non-`main` choice attempt.
  - Invariants:
    - `resulting_executor_state` must stay bounded to explicit success-or-stop outcomes.
    - Unsafe or failed branching must not silently degrade into guessed continuation.
    - The result must preserve the completed hardening baseline, completed blocked-`main` mutation baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline rather than bypass them.
    - The result shape for this first slice should preserve the completed safe non-`main` continuation path and completed additional-new-branch path as they are, and add one separate bounded switch-existing path.

## 4) State Machine (if applicable)
### States
- `safe_non_main_context_detected`
- `safe_non_main_choice_request_formed`
- `awaiting_safe_non_main_choice_resolution`
- `branch_choice_applied`
- `stopped`

### Transitions
- `safe_non_main_context_detected` → `safe_non_main_choice_request_formed`: a bounded safe non-`main` choice request is formed from a safe current branch plus one bounded operator intent.
- `safe_non_main_context_detected` → `stopped`: the current path is outside the first bounded safe non-`main` switch-existing scope.
- `safe_non_main_choice_request_formed` → `awaiting_safe_non_main_choice_resolution`: the conceptual choice surface exposes only the three bounded safe non-`main` options.
- `safe_non_main_choice_request_formed` → `stopped`: the safe non-`main` choice intent is missing, malformed, unsupported, or too ambiguous to map safely.
- `awaiting_safe_non_main_choice_resolution` → `branch_choice_applied`: bounded current-branch continuation succeeds unchanged.
- `awaiting_safe_non_main_choice_resolution` → `branch_choice_applied`: bounded additional-new-branch execution succeeds under the completed baseline.
- `awaiting_safe_non_main_choice_resolution` → `branch_choice_applied`: bounded switch to an already-existing safe non-`main` branch succeeds.
- `awaiting_safe_non_main_choice_resolution` → `stopped`: the requested existing target branch does not exist.
- `awaiting_safe_non_main_choice_resolution` → `stopped`: the requested target branch resolves to `main` or another unsafe branch context.
- `awaiting_safe_non_main_choice_resolution` → `stopped`: branch switching fails.
- `awaiting_safe_non_main_choice_resolution` → `stopped`: branching appears to succeed but does not establish a safe post-action branch context.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - `SafeNonMainBaselinePrecondition`
  - Inputs:
    - executor-ready `P1 / Minor Change` context
    - prior hardening result
    - prior blocked-`main` mutation baselines
    - prior safe non-`main` additional-new-branch baseline
  - Output:
    - eligible or ineligible safe non-`main` choice entry
  - Notes:
    - The layer starts only after the completed branch-state hardening baseline.
    - The current branch must already be safely classified as non-`main`.
    - The completed `continue_on_current_branch` path and completed additional-new-branch path remain mandatory preserved baselines.

- Rule:
  - `SafeNonMainChoiceSurfaceFormation`
  - Inputs:
    - safe current non-`main` branch context
    - proposed safe non-`main` operator intent
  - Output:
    - conceptual bounded choice surface or stop
  - Notes:
    - The model must expose exactly three conceptual options in the safe non-`main` context.
    - The first slice should preserve the completed safe non-`main` continuation path and completed additional-new-branch path as they are, and add one separate bounded switch-existing path.
    - The slice must stop rather than infer unsupported or incomplete choice semantics.

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
  - `AdditionalNewBranchPathPreservation`
  - Inputs:
    - validated additional-new-branch intent
    - safe current non-`main` branch context
  - Output:
    - eligible bounded additional-new-branch action or stop
  - Notes:
    - The completed additional-new-branch path remains additive and in force.
    - This slice must not redesign the already-implemented safe non-`main` additional-new-branch behavior.

- Rule:
  - `ExistingSafeNonMainSwitchEligibilityCheck`
  - Inputs:
    - validated existing-branch target intent
    - current safe non-`main` branch context
  - Output:
    - eligible switch-existing action or stop
  - Notes:
    - The target branch must already exist.
    - The target branch must resolve to a safe non-`main` branch context.
    - The first slice adds only one bounded switch-existing option from the already-safe non-`main` context.

- Rule:
  - `ExistingSafeNonMainSwitchExecution`
  - Inputs:
    - bounded switch-existing action
    - current safe non-`main` branch context
  - Output:
    - `SafeNonMainChoiceResult`
  - Notes:
    - Successful switching must result in a safe non-`main` branch context rather than a bypass of the existing hardening baseline.
    - Missing existing branch, unsafe target branch, switch failure, and unsafe post-switch continuity all stop.
    - No generalized recovery, retry orchestration, or multi-step Git workflow handling is introduced.

- Rule:
  - `ExecutionBoundaryPreservation`
  - Inputs:
    - prior hardening result
    - safe non-`main` choice result
  - Output:
    - bounded post-choice continuation boundary or stop
  - Notes:
    - The Entry is not redefined as the branch-mutation surface.
    - Contract definition remains outside the Entry.
    - Blocked-`main` redesign, safe non-`main` create-and-switch redesign, and target-resolution redesign remain out of scope.

## 6) Failure Modes / Edge Cases
- The current branch is not safely classified as non-`main`:
  - stop
- The current request is outside the first bounded safe non-`main` switch-existing scope:
  - stop
- Safe non-`main` choice intent is missing, malformed, or unsupported:
  - stop
- The requested existing target branch does not exist:
  - stop
- The requested target branch resolves to `main` or another unsafe branch context:
  - stop
- Branch switching fails:
  - stop
- Switching appears to succeed but does not yield a safely changed branch context:
  - stop rather than assume continuation
- The layer is pushed toward generalized Git workflow recovery or unrelated repository coordination:
  - stop and defer to a later bounded slice

## 7) Observability (optional)
- Logs:
  - entry into bounded safe non-`main` choice path from safe current branch context
  - formation/validation outcome for the conceptual safe non-`main` choice surface
  - preservation outcome for current-branch continuation
  - preservation outcome for the completed additional-new-branch path
  - existing-branch eligibility result for the new safe non-`main` switch-existing path
  - branch-choice success or stop reason
- Metrics:
  - optional later counts for continue-on-current-branch
  - optional later counts for successful additional-new-branch
  - optional later counts for successful safe non-`main` switch-existing
  - optional later counts for stopped-on-missing-existing-branch, stopped-on-unsafe-target-branch, and stopped-on-switch-failure
