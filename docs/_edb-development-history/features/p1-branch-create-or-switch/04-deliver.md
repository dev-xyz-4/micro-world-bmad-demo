# Deliver Spec — p1-branch-create-or-switch

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-branch-create-or-switch/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-branch-create-or-switch/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-branch-create-or-switch/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded branch-mutation slice after the completed executor-side `P1 / Minor Change` branch-state hardening step.
- Keep the mutation behavior on the existing `P1` executor continuity path outside the Entry.
- Consume one explicit target branch name as the bounded branch-target input.
- Support only the narrow create-and-switch path needed to leave `main`.
- Preserve the completed `P1` contract-emission baseline, the completed first executor-side `P1` minimal write baseline, and the completed branch-state hardening baseline.
- Make the first branch-mutation slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any movement of branch-mutation behavior into `scripts/quality/orchestrator-entry.mjs`.
- Any switching to an already-existing branch in this first slice.
- Any voluntary branch mutation from an already-safe non-`main` branch.
- Any target-resolution redesign, template-aware generation, multi-file writes, PR-helper execution, or generalized Git workflow orchestration.
- Any governance, routing-owner, or policy-owner change.
- Any hidden fallback from failed branch creation into switch-existing behavior.

### Constraints
- Tech:
  - The first branch-mutation slice must remain on the existing `P1` executor continuity path.
  - The completed branch-state hardening baseline must remain in force before mutation behavior is reached.
  - The bounded branch-target input is one explicit target branch name.
  - The first supported mutation path is limited to create-and-switch from `main`.
  - If branch creation fails, stop.
  - If branch switching fails, stop.
  - If the requested mutation path is unsupported, stop.
  - Switching to an already-existing branch is not added in this slice.
- Perf:
  - Keep the first mutation slice process-local and bounded; no background behavior or generalized orchestration layer.
- UX:
  - The operator-facing request remains explicit: branch-change has already been selected, and one target branch name must now be provided.
  - Unsupported or unsafe mutation requests must stop rather than degrade into guessed behavior.
- Backward compatibility:
  - Preserve all behavior outside this branch-mutation slice.
  - Preserve the completed `P1` contract-emission baseline, first executor-side write baseline, and branch-state hardening baseline.
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
  - Extend the existing `P1` executor continuity surface with bounded branch creation/switch execution.
  - Accept one explicit target branch name after the already-bounded `request_branch_change` path.
  - Support only create-and-switch from `main`.
  - Re-check or preserve safe branch-state continuity after mutation before any later write continuation is considered.
  - Stop on create failure, switch failure, unsupported target intent, or unsupported mutation path.
- Out-of-scope notes:
  - No switch-to-existing behavior.
  - No branch-existence auto-resolution beyond the narrow create-and-switch contract.
  - No mutation path for already-safe non-`main` branches.
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
- `docs/_edb-development-history/features/p1-branch-create-or-switch/01-break.md`
- `docs/_edb-development-history/features/p1-branch-create-or-switch/02-model.md`
- `docs/_edb-development-history/features/p1-branch-create-or-switch/03-analyze.md`
- `docs/_edb-development-history/features/p1-branch-create-or-switch/04-deliver.md`
- `docs/_edb-development-history/features/p1-branch-create-or-switch/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Path-specific executor export remains on:
  - `executeP1MinorChangeWrite(...)`
- The existing executor surface may extend its bounded input/behavior to accept one explicit target branch name for the branch-mutation path.
- No generalized branch-management API or shared Git-orchestration surface is introduced.

### Inputs / Outputs
- Inputs:
  - executor-ready `P1 / Minor Change` input packet
  - completed branch-state hardening result reaching the bounded `request_branch_change` path
  - one explicit target branch name
- Outputs:
  - bounded branch-mutation result describing:
    - selected mutation action
    - resulting executor state
    - resulting branch state where successful
    - next human action

### Error behavior
- If the current bounded path is not eligible for branch mutation, stop.
- If the target branch name is missing, malformed, or unsupported, stop.
- If create-and-switch from `main` fails at branch creation, stop.
- If create-and-switch from `main` fails at branch switching, stop.
- If the request would require switching to an already-existing branch, stop rather than silently broaden scope.
- If implementation pressure pushes toward generalized Git workflow handling, stop and defer to a later bounded slice.

---

## 5) Data Model / State (if any)
- Entities:
  - `BranchMutationRequest`
  - `BranchTargetIntent` reduced to one explicit target branch name
  - `BranchMutationResult`
  - existing executor-ready `P1 / Minor Change` packet
  - prior `BranchState` / `BranchDecisionResult` from the completed hardening baseline
- Persistence (if any):
  - None required for this first mutation slice.
- Invariants (target-state constraints):
  - Branch mutation starts only after the completed hardening baseline has already produced the bounded branch-change path.
  - The first mutation slice accepts one explicit target branch name.
  - The first mutation slice supports only create-and-switch from `main`.
  - Unsupported mutation paths stop.
  - Failed branch creation or failed branch switching stops.
  - No hidden fallback to switch-existing semantics is introduced.
  - Branch-mutation behavior remains on the existing `P1` executor continuity path outside the Entry.
- Edge cases:
  - branch name already exists -> stop in this first slice
  - target branch name missing or malformed -> stop
  - current context is not the bounded blocked `main` path -> stop
  - mutation appears to succeed but safe post-mutation branch continuity is not established -> stop

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Extend the existing `P1` executor continuity surface with a bounded branch-mutation entry path after the completed hardening result `request_branch_change`.
2. Accept and validate one explicit target branch name as the first bounded mutation input.
3. Restrict eligibility to the blocked `main` path that now needs create-and-switch behavior.
4. Implement bounded branch creation for the requested target branch name.
5. Implement bounded switch to the newly created branch.
6. Return an explicit bounded mutation result describing success or stop.
7. Stop on:
   - missing/malformed target branch name
   - unsupported mutation path
   - branch already exists
   - branch creation failure
   - branch switching failure
8. Extend smoke validation so the mutation layer is covered without broadening into existing-branch switching or unrelated Git workflow behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The branch-mutation path starts only after the completed hardening baseline reaches `request_branch_change`.
- One explicit target branch name is required.
- On blocked `main`, create-and-switch to a new target branch succeeds when the bounded path is valid.
- If the requested target branch already exists, the first slice stops.
- If branch creation fails, the first slice stops.
- If branch switching fails, the first slice stops.
- Requests requiring switch-to-existing behavior stop.
- Existing non-`P1` rejection/stop behavior remains intact.
- Existing branch-state hardening behavior remains intact.
- `git diff --check` passes.

### Optional checks
- Manual local simulation from `main` confirming that the bounded mutation path creates and switches to a new branch.
- Manual verification that unsupported existing-branch switch requests stop cleanly.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] The first bounded branch-mutation slice is added after the completed branch-state hardening path for executor-side `P1 / Minor Change` behavior.
- [ ] The mutation behavior remains on the existing `P1` executor continuity path outside the Entry.
- [ ] The first slice consumes one explicit target branch name.
- [ ] The first slice supports only create-and-switch from `main`.
- [ ] Switching to an already-existing branch is not introduced.
- [ ] Failed or unsupported mutation paths stop explicitly.
- [ ] The completed `P1` contract-emission baseline, first executor-side write baseline, and branch-state hardening baseline remain intact.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first mutation slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the bounded branch-mutation changes in `scripts/quality/p1-minor-change-executor.mjs` and any tightly coupled smoke-test updates.
