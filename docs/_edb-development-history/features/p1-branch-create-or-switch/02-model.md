# Model — p1-branch-create-or-switch

## 1) System Overview (2–5 bullets)
- This slice adds the first bounded branch-mutation layer after the completed executor-side `P1 / Minor Change` branch-state hardening baseline.
- The mutation layer starts only after a valid executor-ready `P1` context has already reached the bounded `request_branch_change` path.
- The mutation layer stays outside the Entry and outside the contract-definition surface.
- The first mutation slice is limited to one explicit target branch name plus the narrow create-and-switch path needed to leave an unsafe `main` context.
- Generalized Git workflow orchestration, recovery flows, existing-branch switching, and target-resolution redesign remain out of scope for this model.

## 2) Key Concepts / Terms
- `BranchMutationRequest`:
  - The bounded executor-side request to perform branch creation and switching after the already-completed hardening layer has produced `request_branch_change` on `main`.
- `BranchTargetIntent`:
  - The bounded operator-supplied target branch name used by the first mutation slice.
- `awaiting_branch_change`:
  - The already-existing bounded executor state produced by the completed hardening slice when continuation on the current branch must not proceed.
- `BranchMutationResult`:
  - The bounded result returned by the first mutation slice after it attempts the requested branch creation/switch action or stops.
- `branch_mutation_applied`:
  - Resulting executor state indicating that the requested bounded branch mutation succeeded and the executor is no longer blocked by the previous `main` context.
- `stopped`:
  - Resulting executor state indicating that the mutation step must stop without guessing or widening behavior.

## 3) Data Structures
- Name:
  - `BranchMutationRequest`
  - Fields:
    - `prior_branch_state`
    - `prior_branch_decision_result`
    - `target_branch_name`
    - `allowed_mutation_actions`
  - Meaning:
    - Captures the minimally required input surface for the first bounded branch-mutation step after the hardening layer has already refused direct continuation on `main`.
  - Invariants:
    - `prior_branch_decision_result.resulting_executor_state` must already indicate a branch-change path.
    - `prior_branch_state.branch_class` must still represent the blocked `main` path for this first slice.
    - The request must remain tied to executor-side `P1 / Minor Change` behavior.
    - The request must not be treated as a generalized Git workflow command surface.

- Name:
  - `BranchTargetIntent`
  - Fields:
    - `target_branch_name`
  - Meaning:
    - Represents the one explicit operator-approved branch name needed for the executor to leave the blocked `main` context.
  - Invariants:
    - The first slice consumes one explicit target branch name, not a richer structured branch-change intent.
    - Missing, malformed, or unsupported target names must stop.

- Name:
  - `BranchMutationResult`
  - Fields:
    - `selected_mutation_action`
    - `resulting_executor_state`
    - `result_branch_state`
    - `next_human_action`
  - Meaning:
    - Encodes the bounded outcome of the first mutation attempt.
  - Invariants:
    - `resulting_executor_state` must stay bounded to explicit success-or-stop outcomes.
    - Unsafe or failed mutation must not silently degrade into guessed continuation.
    - The result must preserve the completed hardening baseline rather than bypass it.
    - No hidden fallback to switch-existing semantics is allowed.

## 4) State Machine (if applicable)
### States
- `awaiting_branch_change_request`
- `branch_change_request_validated`
- `awaiting_branch_mutation`
- `branch_mutation_applied`
- `stopped`

### Transitions
- `awaiting_branch_change_request` → `branch_change_request_validated`: a bounded branch-mutation request is formed from a prior `request_branch_change` outcome on `main` plus one valid target branch name.
- `awaiting_branch_change_request` → `stopped`: target branch name is missing, malformed, or unsupported.
- `awaiting_branch_change_request` → `stopped`: the current path is not the bounded blocked `main` path supported by this first slice.
- `branch_change_request_validated` → `awaiting_branch_mutation`: the bounded mutation action is selected as create-and-switch from `main`.
- `awaiting_branch_mutation` → `branch_mutation_applied`: bounded branch creation and switching both succeed.
- `awaiting_branch_mutation` → `stopped`: branch already exists.
- `awaiting_branch_mutation` → `stopped`: branch creation fails.
- `awaiting_branch_mutation` → `stopped`: branch switching fails.

## 5) Algorithms / Rules (if applicable)
- Rule:
  - `HardeningBaselinePrecondition`
  - Inputs:
    - executor-ready `P1 / Minor Change` context
    - prior hardening result
  - Output:
    - eligible or ineligible mutation entry
  - Notes:
    - The branch-mutation layer starts only after the completed branch-state hardening baseline.
    - The prior flow must already have reached `request_branch_change` / `awaiting_branch_change`.
    - This first slice is limited to the blocked `main` path and does not reopen branch-state detection semantics.

- Rule:
  - `BranchTargetIntentValidation`
  - Inputs:
    - proposed target branch name
  - Output:
    - bounded valid request or stop
  - Notes:
    - The first slice consumes one explicit target branch name.
    - The first slice must stop rather than infer unsupported or incomplete target intent.

- Rule:
  - `BranchMutationSelection`
  - Inputs:
    - validated mutation request
  - Output:
    - bounded mutation action
  - Notes:
    - The first slice supports only create-and-switch from `main`.
    - Existing-branch switching is not selected in this model.

- Rule:
  - `BranchMutationExecution`
  - Inputs:
    - bounded mutation action
    - current repo branch context
  - Output:
    - `BranchMutationResult`
  - Notes:
    - Successful mutation must result in a new safe branch context rather than a bypass of the existing hardening baseline.
    - Branch-already-exists, creation failure, and switch failure all stop.
    - No generalized recovery, retry orchestration, or multi-step Git workflow handling is introduced.

- Rule:
  - `ExecutionBoundaryPreservation`
  - Inputs:
    - prior hardening result
    - mutation result
  - Output:
    - bounded post-mutation continuation boundary or stop
  - Notes:
    - The Entry is not redefined as the branch-mutation surface.
    - Contract definition remains outside the Entry.
    - Target-resolution redesign and existing-branch switching remain out of scope.

## 6) Failure Modes / Edge Cases
- `request_branch_change` exists but no valid target branch name is supplied:
  - stop
- Target branch name is malformed or unsupported:
  - stop
- The current request is not the bounded blocked `main` path:
  - stop
- The requested target branch already exists:
  - stop
- Branch creation fails:
  - stop
- Branch switching fails:
  - stop
- Mutation appears to succeed but does not yield a safely changed branch context:
  - stop rather than assume continuation
- The mutation layer is pushed toward generalized Git workflow recovery, existing-branch switching, or unrelated repository coordination:
  - stop and defer to a later bounded slice

## 7) Observability (optional)
- Logs:
  - entry into bounded branch-mutation path after prior `request_branch_change`
  - target branch name validation result
  - selected bounded mutation action
  - mutation success or stop reason
- Metrics:
  - optional later counts for successful mutation, stopped-on-invalid-target-name, stopped-on-branch-already-exists, stopped-on-create-failure, and stopped-on-switch-failure
