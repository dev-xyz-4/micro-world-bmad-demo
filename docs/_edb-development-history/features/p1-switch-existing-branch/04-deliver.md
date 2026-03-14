# Deliver Spec — p1-switch-existing-branch

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-switch-existing-branch/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-switch-existing-branch/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-switch-existing-branch/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded switch-existing slice after the completed executor-side `P1 / Minor Change` branch-state hardening step and the completed first bounded create-and-switch-from-main slice.
- Keep the switch-existing behavior on the existing `P1` executor continuity path outside the Entry.
- Consume one explicit target branch name as the bounded branch-target input.
- Support switch-existing only on the blocked `main` path.
- Preserve the completed `P1` contract-emission baseline, the completed first executor-side `P1` minimal write baseline, the completed branch-state hardening baseline, and the completed create-and-switch-from-main baseline.
- Make the first switch-existing slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any movement of switch-existing behavior into `scripts/quality/orchestrator-entry.mjs`.
- Any voluntary switch-existing behavior from an already-safe non-`main` branch in this first slice.
- Any redesign of the completed create-and-switch-from-main baseline.
- Any target-resolution redesign, template-aware generation, multi-file writes, PR-helper execution, or generalized Git workflow orchestration.
- Any governance, routing-owner, or policy-owner change.
- Any hidden fallback from failed switch-existing behavior into broader branch-management logic.

### Constraints
- Tech:
  - The first switch-existing slice must remain on the existing `P1` executor continuity path.
  - The completed branch-state hardening baseline and completed create-and-switch-from-main baseline must remain in force before switch-existing behavior is reached.
  - The bounded branch-target input is one explicit target branch name.
  - The first supported switch-existing path is limited to the blocked `main` path.
  - The target branch must already exist and must resolve to a safe non-`main` branch context.
  - If the target branch does not exist, stop.
  - If branch switching fails, stop.
  - If the requested switch-existing path is unsupported, stop.
  - Voluntary non-`main` switch-existing behavior is not added in this slice.
- Perf:
  - Keep the first switch-existing slice process-local and bounded; no background behavior or generalized orchestration layer.
- UX:
  - The operator-facing request remains explicit: branch-change has already been selected, and one target branch name must now be provided.
  - Unsupported or unsafe switch requests must stop rather than degrade into guessed behavior.
- Backward compatibility:
  - Preserve all behavior outside this switch-existing slice.
  - Preserve the completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, and create-and-switch-from-main baseline.
- Security/Privacy (if relevant):
  - Prefer explicit stop over unsafe or broadened branch mutation.
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
  - Extend the existing `P1` executor continuity surface with bounded switch-existing execution.
  - Accept one explicit target branch name after the already-bounded `request_branch_change` path.
  - Support switch-existing only on the blocked `main` path.
  - Re-check or preserve safe branch-state continuity after switching before any later write continuation is considered.
  - Stop on missing target branch, unsafe target branch, switch failure, unsupported target intent, or unsupported path.
- Out-of-scope notes:
  - No voluntary switch-existing behavior from an already-safe non-`main` branch.
  - No redesign of the completed create-and-switch-from-main behavior.
  - No generalized Git workflow coordinator.
  - No target-resolution redesign.
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
- `docs/_edb-development-history/features/p1-switch-existing-branch/01-break.md`
- `docs/_edb-development-history/features/p1-switch-existing-branch/02-model.md`
- `docs/_edb-development-history/features/p1-switch-existing-branch/03-analyze.md`
- `docs/_edb-development-history/features/p1-switch-existing-branch/04-deliver.md`
- `docs/_edb-development-history/features/p1-switch-existing-branch/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Path-specific executor export remains on:
  - `executeP1MinorChangeWrite(...)`
- The existing executor surface may extend its bounded input/behavior to accept one explicit target branch name for the switch-existing path.
- No generalized branch-management API or shared Git-orchestration surface is introduced.

### Inputs / Outputs
- Inputs:
  - executor-ready `P1 / Minor Change` input packet
  - completed branch-state hardening result reaching the bounded `request_branch_change` path
  - one explicit target branch name
- Outputs:
  - bounded switch-existing result describing:
    - selected switch action
    - resulting executor state
    - resulting branch state where successful
    - next human action

### Error behavior
- If the current bounded path is not eligible for switch-existing, stop.
- If the target branch name is missing, malformed, or unsupported, stop.
- If the target branch does not exist, stop.
- If the target branch resolves to `main` or another unsafe branch context, stop.
- If switching to the existing branch fails, stop.
- If implementation pressure pushes toward generalized Git workflow handling or non-`main` voluntary switching, stop and defer to a later bounded slice.

---

## 5) Data Model / State (if any)
- Entities:
  - `BranchSwitchRequest`
  - `BranchTargetIntent` reduced to one explicit target branch name
  - `BranchSwitchResult`
  - existing executor-ready `P1 / Minor Change` packet
  - prior `BranchState` / `BranchDecisionResult` from the completed hardening baseline
  - prior create-and-switch baseline from the completed first mutation slice
- Persistence (if any):
  - None required for this first switch-existing slice.
- Invariants (target-state constraints):
  - Switch-existing starts only after the completed hardening baseline has already produced the bounded branch-change path.
  - The first switch-existing slice accepts one explicit target branch name.
  - The first switch-existing slice supports only the blocked `main` path.
  - The target branch must already exist and resolve to a safe non-`main` branch.
  - Unsupported switch-existing paths stop.
  - Failed switching stops.
  - No hidden fallback to broader branch-management semantics is introduced.
  - Switch-existing behavior remains on the existing `P1` executor continuity path outside the Entry.
- Edge cases:
  - target branch does not exist -> stop in this first slice
  - target branch name missing or malformed -> stop
  - current context is outside the bounded blocked `main` path -> stop
  - target branch resolves to `main` or other unsafe context -> stop
  - switch appears to succeed but safe post-switch branch continuity is not established -> stop

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Extend the existing `P1` executor continuity surface with a bounded switch-existing entry path after the completed hardening result `request_branch_change`.
2. Accept and validate one explicit target branch name as the first bounded switch-existing input.
3. Restrict eligibility to the blocked `main` path that now needs switch-existing behavior.
4. Validate that the requested target branch already exists and resolves to a safe non-`main` branch context.
5. Implement bounded switch to that already-existing branch.
6. Return an explicit bounded switch-existing result describing success or stop.
7. Stop on:
   - missing/malformed target branch name
   - unsupported path
   - missing existing branch
   - unsafe target branch
   - branch switch failure
8. Extend smoke validation so the switch-existing layer is covered without broadening into non-`main` voluntary switching or unrelated Git workflow behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The switch-existing path starts only after the completed hardening baseline reaches `request_branch_change`.
- One explicit target branch name is required.
- On blocked `main`, switching to an already-existing non-`main` target branch succeeds when the bounded path is valid.
- If the requested target branch does not exist, the first slice stops.
- If the requested target branch resolves to `main` or unsafe context, the first slice stops.
- If branch switching fails, the first slice stops.
- Requests requiring non-`main` voluntary switch-existing behavior stop.
- Existing non-`P1` rejection/stop behavior remains intact.
- Existing branch-state hardening behavior remains intact.
- Existing create-and-switch-from-main behavior remains intact.
- `git diff --check` passes.

### Optional checks
- Manual local simulation from `main` confirming that the bounded switch-existing path switches to an already-existing non-`main` branch.
- Manual verification that unsupported non-`main` voluntary switch-existing requests stop cleanly.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] The first bounded switch-existing slice is added after the completed branch-state hardening path and completed create-and-switch-from-main path for executor-side `P1 / Minor Change` behavior.
- [ ] The switch-existing behavior remains on the existing `P1` executor continuity path outside the Entry.
- [ ] The first slice consumes one explicit target branch name.
- [ ] The first slice supports switch-existing only on the blocked `main` path.
- [ ] Voluntary switch-existing behavior from an already-safe non-`main` branch is not introduced.
- [ ] Failed or unsupported switch-existing paths stop explicitly.
- [ ] The completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, and create-and-switch-from-main baseline remain intact.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first switch-existing slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the bounded switch-existing changes in `scripts/quality/p1-minor-change-executor.mjs` and any tightly coupled smoke-test updates.
