# Model — p1-downstream-continuation

## 1) System Overview (2–5 bullets)
- This slice models the first bounded executable continuation surface for already-resolved `P1 / Minor Change` outcomes under the accepted placement rule.
- `scripts/quality/orchestrator-entry.mjs` remains the routing and contract-emission surface, but the `action_contract` definition itself is no longer treated as living inside the Entry.
- The continuation remains contract-carrying and docs-only: it makes the next bounded human-confirmed sequence explicit without introducing hidden execution.
- The active behavioral baseline remains the three-gate sequence: `gate_save`, `gate_execute`, `gate_review`.
- Real downstream execution remains outside the Entry and outside this first slice.

## 2) Key Concepts / Terms
- `P1 Continuation`: the bounded downstream layer that turns a resolved `P1 / Minor Change` route into an explicit next-step contract.
- `Action Contract`: the structured continuation payload that carries target resolution, constraints, ordered steps, confirmation gates, and validation minima.
- `Contract Surface`: the contract-definition layer outside the Entry where path-aware continuation contracts live consistently.
- `Contract Emission`: the act of the Entry selecting/loading the appropriate contract and emitting it in the route result.
- `Target Resolution`: mode-aware identification of the docs-only target surface via `docs/bmad/guides/CODEX_ENTRY.md`.
- `Three-Gate Model`: the explicit confirmation sequence `gate_save`, `gate_execute`, `gate_review`, each with `yes / no / cancel` only.
- `No-Hidden-Execution Boundary`: no file write or docs execution step may occur implicitly; progression beyond a gate requires explicit human confirmation.
- `Executor Surface`: a later layer outside the Entry that may interpret and execute valid continuation contracts.

## 3) Data Structures
- Name: `P1RouteInput`
  - Fields:
  - `result_type`
  - `primary_path`
  - `workflow_route`
  - `next_step_direction`
  - Meaning:
  - The already-resolved Entry output that qualifies a request for this continuation slice.
  - Invariants:
  - `result_type` must be `route-result`.
  - `primary_path` must be `P1`.
  - `workflow_route` must be `Minor Change`.
  - Any other route result is out of scope for this slice.

- Name: `ActionContract`
  - Fields:
  - `contract_type`
  - `execution_mode`
  - `target_resolution`
  - `required_inputs`
  - `constraints`
  - `steps`
  - `confirm_gates`
  - `validation`
  - Meaning:
  - The bounded continuation packet emitted after a valid `P1RouteInput`.
  - Invariants:
  - `execution_mode` remains human-confirmed.
  - `constraints` must preserve docs-only behavior.
  - The contract must not imply branch automation, PR-helper execution, or generalized continuation-engine behavior.
  - The contract is selected/loaded by the Entry, but defined outside the Entry.

- Name: `ContractSurface`
  - Fields:
  - `contract_family`
  - `contract_key`
  - `contract_source`
  - Meaning:
  - The external contract-definition layer that stores path-aware downstream contracts consistently outside the Entry.
  - Invariants:
  - Contract definitions do not accumulate directly inside `scripts/quality/orchestrator-entry.mjs`.
  - Contract organization must remain path-aware and scalable beyond `P1`.

- Name: `TargetResolution`
  - Fields:
  - `mode`
  - `target_kind`
  - `target_root`
  - `target_path_hint`
  - Meaning:
  - Mode-aware resolution of the docs-only continuation destination.
  - Invariants:
  - Routing ownership remains in `docs/bmad/guides/CODEX_ENTRY.md`.
  - `target_root` must resolve to the active mode surface, not a local `.planning` path.
  - `target_kind` remains docs-only for this slice.

- Name: `StepEntry`
  - Fields:
  - `step_id`
  - `required`
  - `status`
  - `confirm_gate` (optional)
  - `output_hint` (optional)
  - Meaning:
  - A bounded unit of continuation work within the action contract.
  - Invariants:
  - Only the modeled first-slice step IDs are valid.
  - Required steps must not end as `skipped_optional`.
  - `blocked_by_gate` requires a matching `confirm_gate`.

- Name: `ConfirmGates`
  - Fields:
  - `active_gate`
  - `entries`
  - Meaning:
  - The currently active human confirmation boundary for the continuation sequence.
  - Invariants:
  - First slice supports exactly one active gate at a time.
  - Allowed gate IDs are `gate_save`, `gate_execute`, `gate_review` only.
  - Allowed responses are `yes`, `no`, `cancel` only.

- Name: `GateResult`
  - Fields:
  - `gate_id`
  - `response`
  - `resulting_state`
  - `next_human_action`
  - Meaning:
  - The explicit result of a human response at one confirmation gate.
  - Invariants:
  - `resulting_state` must map to one bounded next state in the modeled sequence.
  - `cancel` must not masquerade as completion.

- Name: `StopPacket`
  - Fields:
  - `status`
  - `stop_reason`
  - `blocked_step`
  - `next_human_action`
  - Meaning:
  - Explicit stop payload when the continuation cannot proceed safely.
  - Invariants:
  - Stop behavior must remain explicit.
  - A stop packet must not imply hidden retry or fallback execution.

- Name: `ExecutorSurface`
  - Fields:
  - `executor_kind`
  - `supported_contracts`
  - Meaning:
  - A later execution-capable layer outside the Entry that may interpret and act on valid continuation contracts.
  - Invariants:
  - Executor behavior remains outside the first bounded slice.
  - Low-level helpers sit behind the executor rather than replacing continuation semantics.

## 4) State Machine (if applicable)
### States
- `route_accepted`
- `contract_selected`
- `contract_emitted`
- `awaiting_gate_save`
- `awaiting_gate_execute`
- `awaiting_gate_review`
- `completed_without_review`
- `completed_with_review`
- `stopped`

### Transitions
- `route_accepted` -> `contract_selected`: valid `P1RouteInput` is accepted and the Entry selects/loads the correct external contract definition.
- `contract_selected` -> `contract_emitted`: the selected contract is emitted as the bounded `action_contract` in the existing `route-result`.
- `contract_emitted` -> `awaiting_gate_save`: prompt/spec artifact is prepared conceptually and save confirmation is required.
- `awaiting_gate_save` -> `contract_emitted`: `gate_save = no`; return to the contract-emitted/preparation state.
- `awaiting_gate_save` -> `awaiting_gate_execute`: `gate_save = yes`; prompt/spec artifact is now conceptually persisted.
- `awaiting_gate_save` -> `stopped`: `gate_save = cancel`.
- `awaiting_gate_execute` -> `completed_without_review`: `gate_execute = no`; bounded sequence ends cleanly without docs execution.
- `awaiting_gate_execute` -> `awaiting_gate_review`: `gate_execute = yes`; docs-only change result is conceptually available for optional review.
- `awaiting_gate_execute` -> `stopped`: `gate_execute = cancel`.
- `awaiting_gate_review` -> `completed_with_review`: `gate_review = yes`.
- `awaiting_gate_review` -> `completed_without_review`: `gate_review = no`; optional review is skipped.
- `awaiting_gate_review` -> `stopped`: `gate_review = cancel`.

## 5) Algorithms / Rules (if applicable)
- Rule: `P1RouteQualification`
  - Inputs:
  - `P1RouteInput`
  - Output:
  - `qualified` or `out_of_scope`
  - Notes:
  - This slice starts only from `route-result + P1 + Minor Change`.
  - The rule must not reinterpret or recalculate routing.

- Rule: `ContractSelectionRule`
  - Inputs:
  - `P1RouteInput`
  - active contract surface
  - Output:
  - `ActionContract`
  - Notes:
  - The Entry selects/loads the matching contract from a consistent external contract surface.
  - The rule must not define the contract inline as the long-term placement model.

- Rule: `TargetResolutionRule`
  - Inputs:
  - active mode
  - `change_goal`
  - target doc scope hints
  - Output:
  - `TargetResolution`
  - Notes:
  - Target selection must remain mode-aware through `docs/bmad/guides/CODEX_ENTRY.md`.
  - The resolved destination must stay in docs-only surfaces.

- Rule: `ContractEmissionRule`
  - Inputs:
  - `P1RouteInput`
  - selected `ActionContract`
  - Output:
  - `route-result` enriched with `action_contract`
  - Notes:
  - Top-level route fields remain separate from continuation fields.
  - Emission happens in the Entry; contract definition does not.

- Rule: `GateProgression`
  - Inputs:
  - current state
  - `GateResult`
  - Output:
  - next bounded state or `StopPacket`
  - Notes:
  - `yes / no / cancel` semantics must stay explicit.
  - `no` and `cancel` are not interchangeable.
  - Only one active gate may exist at a time in the first slice.

- Rule: `ContinuationVsExecutionBoundary`
  - Inputs:
  - emitted `ActionContract`
  - later executor availability
  - Output:
  - continuation remains declarative in this slice
  - Notes:
  - The first slice stops at contract emission plus declarative continuation state/gate semantics.
  - Real execution remains a later executor-surface concern.

## 6) Failure Modes / Edge Cases
- A route result that is not `P1 / Minor Change` is passed into this continuation model -> out of scope and must stop.
- Contract definitions accumulate directly in the Entry -> placement drift.
- Target resolution points to a non-docs or local-only surface -> boundary violation.
- A gate response outside `yes / no / cancel` appears -> invalid state.
- `no` at `gate_execute` is treated as failure instead of clean bounded completion -> semantic drift.
- `cancel` at any gate is treated as silent retry or implicit fallback -> boundary violation.
- `review_result` is made mandatory in the first slice -> unintended scope expansion.
- Later executor behavior leaks back into the Entry contract-emission layer -> architectural leakage.

## 7) Observability (optional)
- Logs:
- Qualification outcome for incoming `P1RouteInput`.
- Contract selection/emission outcome.
- Resolved `target_kind`, `target_root`, and `target_path_hint`.
- Active gate, gate response, and resulting bounded state.
- Explicit completion or stop reason.
- Metrics:
- Count of accepted vs out-of-scope `P1RouteInput` packets.
- Contract-emission count for `P1 / Minor Change`.
- Gate distribution across `gate_save`, `gate_execute`, `gate_review`.
- Clean completion rate vs explicit stop rate.
