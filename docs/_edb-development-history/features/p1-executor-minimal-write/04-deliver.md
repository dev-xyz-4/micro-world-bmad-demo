# Deliver Spec — p1-executor-minimal-write

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-executor-minimal-write/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-executor-minimal-write/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-executor-minimal-write/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded executor-side `P1 / Minor Change` minimal write slice after the completed contract-emission baseline.
- Keep execution outside the Entry and keep contract definition outside the Entry.
- Introduce one dedicated path-specific executor surface that accepts a valid emitted `P1 / Minor Change` contract, requires branch-confirmed execution, resolves the bounded docs-only target from the contract, writes one simple markdown artifact, and returns a bounded executor result.
- Use the contract's resolved `target_path_hint` directly for the first bounded write proof.
- Make the first implementation slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any execution behavior for `P2`, `P3`, `P4`, or `P5`.
- Any template-aware generation, multi-file writes, review automation, PR-helper execution, or generalized continuation-engine behavior.
- Any change that moves execution back into `scripts/quality/orchestrator-entry.mjs`.
- Any governance, routing-owner, or policy-owner change.
- Any hidden write, hidden branch bypass, or silent fallback behavior.

### Constraints
- Tech:
  - The executor must live on one dedicated path-specific surface outside the Entry.
  - The executor must consume only the already-emitted `P1 / Minor Change` contract shape.
  - Branch-confirmed execution is mandatory before any repo-tracked write.
  - The first write proof must use the bounded contract `target_resolution` directly, including `target_path_hint`.
  - The first slice writes only one simple markdown artifact and returns only `completed` or `stopped`.
- Perf:
  - Keep the first slice bounded and process-local; no background behavior or persistence layer.
- UX:
  - Human confirmation remains explicit at the branch gate with `yes` / `no` only.
  - `no` at the branch gate must stop without writing.
- Backward compatibility:
  - Preserve all behavior outside the new executor slice.
  - Preserve the completed `P1` contract-emission baseline.
- Security/Privacy (if relevant):
  - No external services, remote calls, or new trust boundaries.

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
  - Add one dedicated executor module for the first bounded `P1 / Minor Change` write path.
  - Keep the Entry untouched except where it already emits the `P1` contract.
  - Interpret one already-emitted `P1` contract packet and validate executor eligibility.
  - Require a mandatory branch gate before any repo-tracked write occurs.
  - Resolve one bounded docs-only write target directly from `target_path_hint`.
  - Write one simple markdown artifact with minimal content derived from contract fields.
  - Emit a bounded executor result with only `completed` or `stopped`.
- Out-of-scope notes:
  - No template expansion.
  - No secondary generated files.
  - No generalized executor registry or grouped multi-path executor surface.
  - No branch creation automation or PR-helper execution in this slice.
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

- `scripts/quality/p1-minor-change-executor.mjs`
- `scripts/quality/tests/orchestrator-entry.smoke.mjs`
- `docs/_edb-development-history/features/p1-executor-minimal-write/01-break.md`
- `docs/_edb-development-history/features/p1-executor-minimal-write/02-model.md`
- `docs/_edb-development-history/features/p1-executor-minimal-write/03-analyze.md`
- `docs/_edb-development-history/features/p1-executor-minimal-write/04-deliver.md`
- `docs/_edb-development-history/features/p1-executor-minimal-write/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Dedicated executor module export:
- `executeP1MinorChangeWrite(executorInput, branchConfirmation)`

### Inputs / Outputs
- Inputs:
  - `executorInput` containing:
    - `result_type`
    - `primary_path`
    - `workflow_route`
    - `action_contract`
  - `branchConfirmation` with one bounded response:
    - `yes`
    - `no`
- Outputs:
  - On success:
    - `status: completed`
    - `written_path`
    - `next_human_action`
  - On stop:
    - `status: stopped`
    - `stop_reason`
    - `next_human_action`

### Error behavior
- Any non-`P1 / Minor Change` input packet must be rejected as out of scope.
- Missing or malformed `action_contract` must stop.
- Branch response outside `yes` / `no` must stop.
- If the write target cannot be resolved safely inside docs-only surfaces, stop rather than guess.
- If the file write cannot be completed cleanly, emit explicit stop behavior rather than partial hidden fallback.

---

## 5) Data Model / State (if any)
- Entities:
  - `ExecutorInputPacket`
  - `BranchGate`
  - `WriteTarget`
  - `SimpleDocArtifact`
  - `ExecutorResult`
- Persistence (if any):
  - None required for the first slice beyond the one intended docs write itself.
- Invariants (target-state constraints):
  - The executor activates only for `route-result + P1 + Minor Change + valid action_contract`.
  - Execution remains outside the Entry.
  - The first branch gate is required and must be evaluated before any repo-tracked write.
  - The first write proof uses the contract's `target_path_hint` directly.
  - The first slice writes exactly one simple markdown artifact.
  - The first slice returns only:
    - `completed`
    - `stopped`
- Edge cases:
  - `branchConfirmation = no` -> explicit stop without writing.
  - malformed packet -> explicit stop.
  - target path outside docs-only boundary -> explicit stop.
  - existing file collision may either overwrite in a bounded, deterministic way or stop explicitly, but must not silently fork into broader behavior.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Add one dedicated executor module at `scripts/quality/p1-minor-change-executor.mjs`.
2. Implement bounded executor-input validation for:
   - `route-result`
   - `P1`
   - `Minor Change`
   - valid `p1_docs_only_minor_change` contract
3. Implement the mandatory branch gate with `yes` / `no` only.
4. Implement bounded write-target resolution directly from `action_contract.target_resolution.target_path_hint`.
5. Implement one simple docs-only markdown write using bounded content derived from the contract.
6. Emit a bounded executor result with only:
   - `completed`
   - `stopped`
7. Extend validation coverage so the new executor slice is checked without broadening into unrelated execution behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- A valid emitted `P1 / Minor Change` executor input can be accepted by the dedicated executor surface.
- `branchConfirmation = no` stops without writing.
- `branchConfirmation = yes` allows one bounded docs-only write.
- The write target is taken from the contract's resolved `target_path_hint`.
- Only one simple markdown artifact is written.
- The executor returns only `completed` or `stopped`.
- Non-`P1 / Minor Change` executor inputs are rejected or stopped explicitly.
- No template-aware generation, multi-file write, or generalized executor behavior is introduced.
- `git diff --check` passes.

### Optional checks
- Manual smoke-style check against one real emitted `P1` contract packet.
- Manual review that the first written content remains intentionally simple.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] One dedicated path-specific executor surface exists outside the Entry for the first bounded `P1 / Minor Change` write path.
- [ ] The executor accepts only valid emitted `P1 / Minor Change` contract packets.
- [ ] Branch-confirmed execution is mandatory and `no` stops without writing.
- [ ] The first bounded write proof uses the contract's resolved `target_path_hint` directly.
- [ ] The executor writes one simple docs-only markdown artifact and returns only `completed` or `stopped`.
- [ ] No template-aware generation, grouped/generalized executor behavior, or non-`P1` execution support is introduced.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the dedicated executor module and any narrowly coupled validation updates.
