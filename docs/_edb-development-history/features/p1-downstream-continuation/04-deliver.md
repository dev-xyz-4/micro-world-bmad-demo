# Deliver Spec — p1-downstream-continuation

## 0) Status
- Owner: current operator
- Created: 2026-03-13
- Last updated: 2026-03-13
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-downstream-continuation/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-downstream-continuation/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-downstream-continuation/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded executable `P1 / Minor Change` downstream continuation slice under the accepted placement rule.
- Keep `scripts/quality/orchestrator-entry.mjs` as the routing and contract-emission surface.
- Define the first bounded `P1 / Minor Change` `action_contract` in a consistent external contract surface and have the Entry select/load/emit it in the existing `route-result`.
- Preserve the three-gate sequence `gate_save`, `gate_execute`, `gate_review`, explicit stop/completion semantics, docs-only boundary enforcement, and the no-hidden-execution rule.
- Make the first implementation slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics.
- Any continuation behavior for `P2`, `P3`, or `P1 / BMAD Feature`.
- Real docs-artifact creation, saving, or docs-change execution in this slice.
- Automatic branch creation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.
- Governance, routing-owner, or policy-owner changes.
- Hidden execution, implicit file writes, or silent fallback behavior.

### Constraints
- Tech:
  - `scripts/quality/orchestrator-entry.mjs` remains the Entry surface.
  - The `P1 / Minor Change` contract definition must live outside the Entry in one minimal external contract module for this first slice.
  - Preserve route fields as top-level output and continuation detail inside `action_contract`.
  - Support only the modeled step IDs and gate IDs from the active local contract basis.
- Perf:
  - Keep the first slice bounded and process-local; no persistence or background behavior.
- UX:
  - Human confirmation remains explicit with `yes / no / cancel` only.
  - Output must remain deterministic and operator-readable.
- Backward compatibility:
  - Preserve existing Entry behavior outside the new `P1 / Minor Change` continuation path.
- Security/Privacy (if relevant):
  - No external services, background state, or new trust boundary are introduced.

---

## 2) Implementation Notes (Reference)

Use this section to capture implementation boundaries for the feature.
This template does not define workflow policy.

For implementation behavior, stop behavior, and execution gates, see:
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`

For versioning and SemVer ownership, see:
- `docs/engineering/versioning.md`

Suggested capture prompts:
- In-scope implementation notes:
  - Add `action_contract` to the existing `route-result` only for `P1 / Minor Change` outcomes.
  - Define the first `P1 / Minor Change` contract in one external contract module under `scripts/quality/`.
  - Have the Entry select/load that contract and emit it without redefining it inline.
  - Carry `target_resolution`, `required_inputs`, `constraints`, `steps`, `confirm_gates`, and `validation` in the emitted continuation packet.
  - Support explicit bounded states for `awaiting_gate_save`, `awaiting_gate_execute`, `awaiting_gate_review`, `completed_without_review`, `completed_with_review`, and `stopped`.
  - Keep `review_result` optional in the first slice.
- Out-of-scope notes:
  - No second continuation entrypoint.
  - No implementation of real branch automation or PR-stage execution.
  - No expansion into other path/workflow combinations.
  - No real docs-artifact persistence or docs-change execution in this slice.
- Missing-information handling notes (reference `questions.md`):
  - `questions.md` currently has no active open items.
  - If a new contradiction appears during implementation, stop and record it there before continuing.
- For this deliver-drafting step, version classification is `no SemVer change`.

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## 3) Target Files / Folders
List exact paths. No placeholders.

- `scripts/quality/orchestrator-entry.mjs`
- `scripts/quality/p1-minor-change-contract.mjs`
- `docs/_edb-development-history/features/p1-downstream-continuation/01-break.md`
- `docs/_edb-development-history/features/p1-downstream-continuation/02-model.md`
- `docs/_edb-development-history/features/p1-downstream-continuation/03-analyze.md`
- `docs/_edb-development-history/features/p1-downstream-continuation/04-deliver.md`
- `docs/_edb-development-history/features/p1-downstream-continuation/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Existing CLI entrypoint remains the implementation surface:
- `node scripts/quality/orchestrator-entry.mjs --goal "<raw free-text goal>" [--clarify-response "<value>"]...`
- External contract module surface:
- `scripts/quality/p1-minor-change-contract.mjs` exports the first bounded `P1 / Minor Change` contract definition used by the Entry.

### Inputs / Outputs
- Inputs:
  - Existing Entry inputs remain valid.
  - First continuation slice starts only after the Entry has resolved a `route-result` with:
    - `primary_path: P1`
    - `workflow_route: Minor Change`
- Outputs:
  - Existing top-level route fields remain:
    - `result_type`
    - `primary_path`
    - `workflow_route`
    - `next_step_direction`
  - For `P1 / Minor Change`, route output additionally includes:
    - `action_contract.contract_type`
    - `action_contract.execution_mode`
    - `action_contract.target_resolution`
    - `action_contract.required_inputs`
    - `action_contract.constraints`
    - `action_contract.steps`
    - `action_contract.confirm_gates`
    - `action_contract.validation`
  - If a gate response is emitted later in this bounded sequence, it may additionally include:
    - `gate_result.gate_id`
    - `gate_result.response`
    - `gate_result.resulting_state`
    - `gate_result.next_human_action`
  - If the continuation stops explicitly, it must include:
    - `status`
    - `stop_reason`
    - `blocked_step`
    - `next_human_action`

### Error behavior
- Any route result outside `P1 / Minor Change` must not emit this first continuation packet.
- If the Entry cannot load/select the external `P1` contract correctly, stop rather than falling back to an inline contract definition.
- Invalid gate IDs or responses outside `yes / no / cancel` must be rejected.
- A stop state must be emitted explicitly; no hidden retry or fallback is allowed.
- If target resolution cannot remain in docs-only surfaces, stop rather than guessing.

---

## 5) Data Model / State (if any)
- Entities:
  - `P1RouteInput`
  - `ActionContract`
  - `ContractSurface`
  - `TargetResolution`
  - `StepEntry`
  - `ConfirmGates`
  - `GateResult`
  - `StopPacket`
- Persistence (if any):
  - None required for the first slice.
- Invariants (target-state constraints):
  - The first slice activates only for `route-result + P1 + Minor Change`.
  - `action_contract` is emitted immediately in the existing `route-result` for that path/workflow pair.
  - The contract definition is external to the Entry and loaded/selected by it.
  - Top-level routing fields remain separate from continuation fields.
  - Allowed step IDs are limited to:
    - `resolve_target_surface`
    - `prepare_docs_prompt_artifact`
    - `save_prompt_artifact`
    - `execute_docs_change`
    - `review_result`
  - Allowed step statuses are limited to:
    - `not_ready`
    - `awaiting_confirmation`
    - `completed`
    - `blocked_by_gate`
    - `skipped_optional`
    - `stopped`
  - Allowed gate IDs are limited to:
    - `gate_save`
    - `gate_execute`
    - `gate_review`
  - Allowed gate responses are limited to:
    - `yes`
    - `no`
    - `cancel`
  - `review_result` remains optional.
- Edge cases:
  - `gate_save = no` returns to prompt/spec preparation rather than stopping.
  - `gate_execute = no` completes cleanly without docs execution.
  - `gate_review = no` completes cleanly without optional review.
  - `cancel` at any gate produces explicit stop behavior.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Add the first bounded external contract module at `scripts/quality/p1-minor-change-contract.mjs`.
2. Define the first-slice `P1 / Minor Change` `action_contract` structure there with:
   - `contract_type`
   - `execution_mode`
   - `target_resolution`
   - `required_inputs`
   - `constraints`
   - `steps`
   - `confirm_gates`
   - `validation`
3. Extend `scripts/quality/orchestrator-entry.mjs` only for the `P1 / Minor Change` path so that the existing `route-result` selects/loads and emits the external contract.
4. Ensure the emitted contract preserves the modeled step/state baseline:
   - `resolve_target_surface`
   - `prepare_docs_prompt_artifact`
   - `save_prompt_artifact`
   - `execute_docs_change`
   - `review_result`
5. Implement the explicit three-gate progression semantics in the emitted packet:
   - `gate_save`
   - `gate_execute`
   - `gate_review`
   with `yes / no / cancel` only and no hidden execution.
6. Implement explicit completion/stop handling so the first slice can end only in:
   - `completed_without_review`
   - `completed_with_review`
   - `stopped`
7. Validate that all other Entry paths remain unchanged and that no real execution, second continuation surface, or extra path support has been introduced.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- `P1 / Minor Change` route output contains the new bounded `action_contract` immediately in the existing `route-result`.
- The emitted `P1` contract is loaded from the external contract module rather than defined inline in the Entry.
- Route outputs for non-`P1 / Minor Change` cases do not accidentally emit this first continuation packet.
- Emitted `action_contract` contains the required sections:
  - `target_resolution`
  - `required_inputs`
  - `constraints`
  - `steps`
  - `confirm_gates`
  - `validation`
- Step IDs, statuses, gate IDs, and gate responses stay within the allowed first-slice sets.
- `gate_save`, `gate_execute`, and `gate_review` preserve explicit `yes / no / cancel` semantics.
- `gate_execute = no` completes cleanly without execution; `cancel` produces explicit stop behavior.
- `review_result` remains optional.
- No real docs-artifact creation, saving, or docs-change execution is introduced in this slice.
- `git diff --check` passes.

### Optional checks
- Manual packet readability review against the local example packets and implementation note.
- Deterministic repeat check for the same `P1 / Minor Change` input.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] `scripts/quality/orchestrator-entry.mjs` remains the only Entry/routing surface for the first executable `P1 / Minor Change` continuation slice.
- [ ] The first bounded `P1 / Minor Change` contract definition exists at `scripts/quality/p1-minor-change-contract.mjs`.
- [ ] The existing `route-result` for `P1 / Minor Change` emits the first bounded `action_contract` immediately by selecting/loading it from the external contract module.
- [ ] The emitted contract preserves docs-only boundary enforcement, no-hidden-execution behavior, and the modeled three-gate sequence.
- [ ] Step IDs, statuses, gate IDs, gate responses, and completion/stop outcomes remain within the bounded first-slice model.
- [ ] No continuation behavior is added for `P2`, `P3`, or `P1 / BMAD Feature`.
- [ ] No real execution, branch automation, PR-helper execution, UI/Vite scope, or generalized continuation-engine behavior is introduced.
- [ ] No governance, routing-owner, or policy-owner documents are modified to implement this slice.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - Not required for the first bounded slice.
- Migration steps:
  - None required; additive bounded extension of the existing Entry surface plus one external contract module.
- Revert steps:
  - Revert the `P1 / Minor Change` continuation additions in `scripts/quality/orchestrator-entry.mjs` and remove `scripts/quality/p1-minor-change-contract.mjs` if acceptance criteria are not met or the surface broadens beyond the agreed slice.
