# Deliver Spec — p1-branch-state-check-and-decision

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-branch-state-check-and-decision/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-branch-state-check-and-decision/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-branch-state-check-and-decision/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded branch-hardening slice before repo-tracked executor-side `P1 / Minor Change` writes.
- Keep the hardening behavior on the existing dedicated path-specific executor surface outside the Entry.
- Introduce real Git branch-state detection plus bounded branch-dependent decision logic for `main`, non-`main`, and unknown branch state.
- Preserve the completed `P1` contract-emission baseline and the completed first executor-side `P1` minimal write baseline.
- Make the first hardening slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any movement of branch-hardening behavior into `scripts/quality/orchestrator-entry.mjs`.
- Any actual branch creation automation or branch switch automation in this slice.
- Any target-resolution redesign, template-aware generation, multi-file writes, review automation, PR-helper execution, or generalized Git workflow orchestration.
- Any execution behavior for `P2`, `P3`, `P4`, or `P5`.
- Any governance, routing-owner, or policy-owner change.
- Any hidden branch fallback, hidden write continuation, or silent guesswork on branch state.

### Constraints
- Tech:
  - The first branch-hardening slice must stay on `scripts/quality/p1-minor-change-executor.mjs`.
  - The executor must detect real Git branch state before repo-tracked `P1` write continuation.
  - The bounded branch-state classes are:
    - `on_main`
    - `on_non_main_branch`
    - `branch_state_unknown`
  - The bounded decision/result shape must stay limited to:
    - `continue_on_current_branch`
    - `request_branch_change`
    - `stop`
    with resulting states:
    - `branch_safe_continue`
    - `awaiting_branch_change`
    - `stopped`
  - Actual branch creation/switch execution remains out of scope.
- Perf:
  - Keep the first hardening slice process-local and bounded; no background behavior or generalized orchestration layer.
- UX:
  - On `main`, direct write continuation is not allowed.
  - On non-`main`, continue on current branch remains allowed.
  - Unknown branch state must stop.
- Backward compatibility:
  - Preserve all behavior outside this hardening slice.
  - Preserve the completed `P1` contract-emission baseline and the completed first executor-side write baseline.
- Security/Privacy (if relevant):
  - Prefer explicit stop over unsafe continuation.
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
  - Extend `scripts/quality/p1-minor-change-executor.mjs` with real branch-state detection.
  - Add bounded classification into `on_main`, `on_non_main_branch`, and `branch_state_unknown`.
  - Add bounded operator decision handling based on classified branch state.
  - Prevent repo-tracked `P1` writes from continuing directly on `main`.
  - Prevent repo-tracked `P1` writes from continuing when branch state is unknown.
  - Allow continue on current branch only when already on non-`main`.
- Out-of-scope notes:
  - No actual branch mutation behavior.
  - No branch naming policy.
  - No target-resolution redesign.
  - No generalized Git workflow coordinator.
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
- `docs/_edb-development-history/features/p1-branch-state-check-and-decision/01-break.md`
- `docs/_edb-development-history/features/p1-branch-state-check-and-decision/02-model.md`
- `docs/_edb-development-history/features/p1-branch-state-check-and-decision/03-analyze.md`
- `docs/_edb-development-history/features/p1-branch-state-check-and-decision/04-deliver.md`
- `docs/_edb-development-history/features/p1-branch-state-check-and-decision/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Path-specific executor export remains on:
  - `executeP1MinorChangeWrite(...)`
- The hardened surface may extend this export's behavior or introduce tightly bounded helper exports inside the same file, but must not broaden into a generalized executor registry.

### Inputs / Outputs
- Inputs:
  - executor-ready `P1 / Minor Change` input packet
  - real current repo branch state derived inside the executor surface
  - bounded operator decision response where applicable
- Outputs:
  - `BranchState`
  - bounded `BranchDecisionResult`
  - final continuation or stop result before repo-tracked write execution proceeds

### Error behavior
- If real Git branch state cannot be determined safely, stop.
- If the current state is `on_main` and the operator does not choose `request_branch_change`, stop.
- If the current state is `on_non_main_branch`, allow only the bounded actions modeled for that state.
- If the decision shape is malformed or unsupported, stop rather than infer intent.
- If implementation pressure pushes toward actual branch creation/switch, stop and defer to the later bounded slice.

---

## 5) Data Model / State (if any)
- Entities:
  - `BranchState`
  - `BranchDecisionRequest`
  - `BranchDecisionResult`
  - existing executor-ready `P1 / Minor Change` packet
- Persistence (if any):
  - None required for this hardening slice.
- Invariants (target-state constraints):
  - Real branch-state detection occurs before repo-tracked `P1` write continuation.
  - `on_main` does not permit direct continue-on-current-branch.
  - `branch_state_unknown` does not permit write continuation.
  - `continue_on_current_branch` is valid only for `on_non_main_branch`.
  - Branch-hardening behavior remains on the existing path-specific executor surface.
  - Actual branch creation/switch execution is absent from this slice.
- Edge cases:
  - detached or otherwise unsafe branch state -> `branch_state_unknown` -> stop
  - malformed decision response -> stop
  - non-`P1 / Minor Change` input remains out of scope and must still stop or reject explicitly

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Extend `scripts/quality/p1-minor-change-executor.mjs` with real Git branch-state detection before repo-tracked write continuation.
2. Implement bounded classification into:
   - `on_main`
   - `on_non_main_branch`
   - `branch_state_unknown`
3. Implement bounded decision request/decision result handling for classified branch state.
4. Implement stop behavior for:
   - `on_main` without `request_branch_change`
   - `branch_state_unknown`
   - malformed/unsupported operator decision shapes
5. Allow bounded continuation on current branch only when `branch_class = on_non_main_branch`.
6. Preserve the later write path and existing `P1` executor baseline without adding actual branch creation/switch behavior.
7. Extend smoke validation so the hardening layer is covered without broadening into unrelated executor behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- Real branch-state detection runs before repo-tracked `P1` write continuation.
- `on_main` produces bounded stop-or-branch-change-intent behavior and does not allow direct continue.
- `on_non_main_branch` allows bounded continue on current branch.
- `branch_state_unknown` stops.
- Malformed or unsupported operator decision shapes stop.
- Existing non-`P1` rejection/stop behavior remains intact.
- No actual branch creation/switch execution is introduced.
- `git diff --check` passes.

### Optional checks
- Manual local simulation of representative branch states where feasible.
- Manual review that the hardened surface remains path-specific and bounded.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] Real Git branch-state detection is added before repo-tracked executor-side `P1 / Minor Change` writes continue.
- [ ] The hardening logic remains on the existing dedicated path-specific executor surface outside the Entry.
- [ ] `main`, non-`main`, and unknown branch states are explicitly distinguished.
- [ ] `main` does not allow direct continue-on-current-branch and unknown branch state stops.
- [ ] Actual branch creation/switch execution is not introduced.
- [ ] The completed first executor-side `P1` write baseline remains intact aside from the new hardening gate.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first hardening slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the bounded branch-hardening changes in `scripts/quality/p1-minor-change-executor.mjs` and any tightly coupled smoke-test updates.
