# Model — p1-executor-minimal-write

## 1) System Overview (2–5 bullets)
- This slice models the first bounded executor-side follow-up after the completed `P1 / Minor Change` contract-emission baseline.
- The Entry remains unchanged as the routing and contract-emission surface; execution is modeled strictly outside the Entry.
- The first executor slice is intentionally minimal: accept a valid emitted `P1` contract, require a branch-confirmed execution gate, resolve one docs-only target, write one simple markdown artifact, and emit a bounded result.
- Template expansion, multi-file generation, generalized executor behavior, and other path families remain out of scope.
- Two implementation-placement questions remain explicit at model time: the exact executor surface/file and the exact first repo-tracked docs target.

## 2) Key Concepts / Terms
- `ExecutorInputPacket`: the already-emitted `P1 / Minor Change` route result carrying the bounded `action_contract`.
- `ExecutorSurface`: the later code surface outside the Entry that will interpret and act on the emitted `P1` contract.
- `BranchGate`: the required human confirmation that repo-tracked execution is happening in a valid branch context and not on `main`.
- `WriteTarget`: the bounded docs-only destination resolved from the contract's `target_resolution`.
- `SimpleDocArtifact`: the first minimal markdown file written by the executor, without template expansion.
- `ExecutorResult`: the bounded output of the first executor slice, restricted to `completed` or `stopped`.
- `Docs-Only Boundary`: the rule that the first executor slice may write only inside a docs-only repo surface and must stop instead of guessing outside it.

## 3) Data Structures
- Name: `ExecutorInputPacket`
  - Fields:
  - `result_type`
  - `primary_path`
  - `workflow_route`
  - `action_contract`
  - Meaning:
  - The already-produced route result that qualifies a request for the first executor-side `P1` write path.
  - Invariants:
  - `result_type` must be `route-result`.
  - `primary_path` must be `P1`.
  - `workflow_route` must be `Minor Change`.
  - `action_contract.contract_type` must be `p1_docs_only_minor_change`.
  - Any other route/workflow pair is out of scope.

- Name: `BranchGate`
  - Fields:
  - `required`
  - `gate_id`
  - `allowed_responses`
  - Meaning:
  - The mandatory branch-confirmed execution precondition that must be satisfied before any repo-tracked write occurs.
  - Invariants:
  - `required` must be `true` in the first executor slice.
  - `gate_id` is `branch_gate`.
  - Allowed responses are `yes` and `no` only.
  - `no` must lead to stop without writing.

- Name: `WriteTarget`
  - Fields:
  - `mode`
  - `target_kind`
  - `target_root`
  - `target_path_hint`
  - Meaning:
  - The bounded docs-only write destination derived from the emitted contract's `target_resolution`.
  - Invariants:
  - The resolved target must stay inside a docs-only repo surface.
  - `target_root` must not resolve to `.planning`.
  - The first slice must stop if target resolution cannot remain docs-only and bounded.

- Name: `SimpleDocArtifact`
  - Fields:
  - `artifact_type`
  - `file_path`
  - `content_source`
  - Meaning:
  - One simple markdown artifact written by the executor in the first bounded implementation slice.
  - Invariants:
  - `artifact_type` remains docs-only.
  - Content derives only from existing contract fields and bounded executor metadata.
  - No template expansion occurs.
  - No secondary generated files are required.

- Name: `ExecutorResult`
  - Fields:
  - `status`
  - `written_path` (optional)
  - `stop_reason` (optional)
  - `next_human_action`
  - Meaning:
  - The bounded result returned by the first executor-side slice.
  - Invariants:
  - Allowed `status` values are only `completed` and `stopped`.
  - `written_path` exists only on `completed`.
  - `stop_reason` exists only on `stopped`.
  - No partial-completion state is introduced in the first slice.

- Name: `ExecutorPlacementDecision`
  - Fields:
  - `executor_surface_candidate`
  - `first_target_candidate`
  - Meaning:
  - Explicit decision points that remain open at model time.
  - Invariants:
  - The model must not silently choose either field by assumption.
  - Both decisions must remain compatible with the accepted placement rule and docs-only boundary.

## 4) State Machine (if applicable)
### States
- `contract_received`
- `eligibility_validated`
- `awaiting_branch_confirmation`
- `write_target_resolved`
- `artifact_written`
- `completed`
- `stopped`

### Transitions
- `contract_received` -> `eligibility_validated`: incoming packet is confirmed as `route-result + P1 + Minor Change + valid action_contract`.
- `eligibility_validated` -> `awaiting_branch_confirmation`: docs-only and first-slice executor eligibility hold.
- `awaiting_branch_confirmation` -> `write_target_resolved`: branch gate response is `yes`.
- `awaiting_branch_confirmation` -> `stopped`: branch gate response is `no`.
- `write_target_resolved` -> `artifact_written`: one bounded docs-only target is resolved and one simple markdown artifact is written.
- `write_target_resolved` -> `stopped`: target cannot be resolved safely within the docs-only boundary.
- `artifact_written` -> `completed`: bounded executor result is emitted successfully.

## 5) Algorithms / Rules (if applicable)
- Rule: `ExecutorEligibilityRule`
  - Inputs:
  - `ExecutorInputPacket`
  - Output:
  - `eligible` or `out_of_scope`
  - Notes:
  - The first executor slice starts only from the already-emitted `P1 / Minor Change` packet.
  - It must reject contracts for `P2`, `P3`, `P1 / BMAD Feature`, or malformed `action_contract` packets.

- Rule: `BranchConfirmedExecutionRule`
  - Inputs:
  - `BranchGate`
  - operator response
  - Output:
  - continue or stop
  - Notes:
  - The rule exists because repo-tracked writes must not proceed on an unconfirmed branch context.
  - `yes` allows the write sequence to continue.
  - `no` stops immediately without writing.

- Rule: `WriteTargetResolutionRule`
  - Inputs:
  - `action_contract.target_resolution`
  - active mode
  - Output:
  - `WriteTarget`
  - Notes:
  - The first slice should use the contract's bounded target-resolution fields rather than inventing a broader targeting mechanism.
  - The exact first repo-tracked target remains a decision point and must not be guessed by the model.

- Rule: `SimpleDocWriteRule`
  - Inputs:
  - `WriteTarget`
  - bounded contract fields such as `change_goal` and target scope
  - Output:
  - `SimpleDocArtifact`
  - Notes:
  - The write is limited to one simple markdown artifact.
  - No template expansion, multi-file generation, or secondary orchestration output is allowed.

- Rule: `ExecutorResultRule`
  - Inputs:
  - write outcome or explicit stop condition
  - Output:
  - `ExecutorResult`
  - Notes:
  - The first slice stays intentionally narrow and returns only `completed` or `stopped`.
  - Richer executor metadata or partial-state handling is deferred.

- Rule: `PlacementBoundaryRule`
  - Inputs:
  - executor implementation choice
  - Output:
  - valid or invalid against the accepted Phase-4 placement rule
  - Notes:
  - The executor must live outside `scripts/quality/orchestrator-entry.mjs`.
  - The contract definition remains outside the Entry.
  - The Entry is not redefined as the write executor.

## 6) Failure Modes / Edge Cases
- A non-`P1 / Minor Change` route result is passed into the executor surface -> stop as out of scope.
- The `action_contract` is missing or has the wrong `contract_type` -> stop.
- Branch gate is bypassed or treated as optional -> invalid model drift.
- Branch gate response is anything other than `yes` or `no` -> stop.
- Write target cannot be resolved safely within docs-only surfaces -> stop.
- The first write path implies template expansion or secondary artifact generation -> scope violation.
- Executor logic starts accumulating inside the Entry rather than outside it -> placement violation.
- The model begins assuming a concrete executor file or concrete first write target without analysis/deliver confirmation -> decision leakage.

## 7) Observability (optional)
- Logs:
- executor packet eligibility outcome
- branch gate prompt/response
- resolved target kind/root/path hint
- write success path or explicit stop reason
- Metrics:
- accepted vs rejected executor packets
- branch gate `yes` vs `no`
- completed vs stopped executor results
