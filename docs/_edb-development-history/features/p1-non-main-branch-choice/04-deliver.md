# Deliver Spec — p1-non-main-branch-choice

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-non-main-branch-choice/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-non-main-branch-choice/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-non-main-branch-choice/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded non-`main` branch-choice slice after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, and the completed first bounded switch-existing slice.
- Keep the branch-choice behavior on the existing `P1` executor continuity path outside the Entry.
- Preserve the current `continue_on_current_branch` path on safe non-`main` exactly as-is.
- Consume one explicit target branch name only for the bounded additional-new-branch path from safe non-`main`.
- Preserve the completed `P1` contract-emission baseline, the completed first executor-side `P1` minimal write baseline, the completed branch-state hardening baseline, the completed create-and-switch-from-main baseline, and the completed switch-existing baseline.
- Make the first non-`main` branch-choice slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any movement of branch-choice behavior into `scripts/quality/orchestrator-entry.mjs`.
- Any redesign of the completed `continue_on_current_branch` path on safe non-`main`.
- Any redesign of the completed create-and-switch-from-main baseline.
- Any redesign of the completed switch-existing baseline.
- Any target-resolution redesign, template-aware generation, multi-file writes, PR-helper execution, or generalized Git workflow orchestration.
- Any governance, routing-owner, or policy-owner change.
- Any hidden fallback from failed additional-new-branch behavior into broader branch-management logic.

### Constraints
- Tech:
  - The first non-`main` branch-choice slice must remain on the existing `P1` executor continuity path.
  - The completed branch-state hardening baseline, completed create-and-switch-from-main baseline, and completed switch-existing baseline must remain in force before non-`main` branch-choice behavior is reached.
  - The existing `continue_on_current_branch` path on safe non-`main` must remain intact.
  - The bounded branch-target input is one explicit target branch name only for the additional-new-branch path.
  - The first additional-new-branch path is limited to the already-safe non-`main` context.
  - The requested target branch must be new, valid, and safe.
  - If the target branch already exists, stop.
  - If branch creation fails, stop.
  - If branch switching fails, stop.
  - If the requested branch-choice path is unsupported, stop.
- Perf:
  - Keep the first non-`main` branch-choice slice process-local and bounded; no background behavior or generalized orchestration layer.
- UX:
  - The operator-facing request remains explicit: safe non-`main` continuation remains available, and one explicit target branch name is required only when the additional-new-branch path is chosen.
  - Unsupported or unsafe branch-choice requests must stop rather than degrade into guessed behavior.
- Backward compatibility:
  - Preserve all behavior outside this non-`main` branch-choice slice.
  - Preserve the completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, create-and-switch-from-main baseline, and switch-existing baseline.
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
  - Extend the existing `P1` executor continuity surface with one bounded additional-new-branch path from a safe non-`main` branch.
  - Preserve the existing `continue_on_current_branch` path on safe non-`main` exactly as-is.
  - Accept one explicit target branch name only when the additional-new-branch path is selected.
  - Support the additional-new-branch path only while already on a safe non-`main` branch.
  - Re-check or preserve safe branch-state continuity after branching before any later write continuation is considered.
  - Stop on missing target branch input, malformed target branch, branch-already-exists, branch creation failure, branch switching failure, unsupported target intent, or unsupported path.
- Out-of-scope notes:
  - No redesign of the completed `continue_on_current_branch` path.
  - No blocked-`main` redesign.
  - No switch-existing redesign.
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
- `docs/_edb-development-history/features/p1-non-main-branch-choice/01-break.md`
- `docs/_edb-development-history/features/p1-non-main-branch-choice/02-model.md`
- `docs/_edb-development-history/features/p1-non-main-branch-choice/03-analyze.md`
- `docs/_edb-development-history/features/p1-non-main-branch-choice/04-deliver.md`
- `docs/_edb-development-history/features/p1-non-main-branch-choice/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Path-specific executor export remains on:
  - `executeP1MinorChangeWrite(...)`
- The existing executor surface may extend its bounded input/behavior to accept one explicit target branch name for the additional-new-branch path from safe non-`main`.
- No generalized branch-management API or shared Git-orchestration surface is introduced.

### Inputs / Outputs
- Inputs:
  - executor-ready `P1 / Minor Change` input packet
  - safe current non-`main` branch state
  - existing `continue_on_current_branch` intent or one explicit target branch name for the additional-new-branch path
- Outputs:
  - bounded branch-choice result describing:
    - selected choice action
    - resulting executor state
    - resulting branch state where successful
    - next human action

### Error behavior
- If the current bounded path is not eligible for the first non-`main` branch-choice slice, stop.
- If the target branch name is missing, malformed, or unsupported for the additional-new-branch path, stop.
- If the target branch already exists, stop.
- If branch creation fails, stop.
- If branch switching fails, stop.
- If implementation pressure pushes toward blocked-`main` redesign, switch-existing redesign, or generalized Git workflow handling, stop and defer to a later bounded slice.

---

## 5) Data Model / State (if any)
- Entities:
  - `NonMainBranchChoiceRequest`
  - `BranchChoiceIntent`
  - `BranchChoiceResult`
  - existing executor-ready `P1 / Minor Change` packet
  - prior `BranchState` / `BranchDecisionResult` from the completed hardening baseline
  - prior create-and-switch baseline from the completed first mutation slice
  - prior switch-existing baseline from the completed second mutation slice
- Persistence (if any):
  - None required for this first non-`main` branch-choice slice.
- Invariants (target-state constraints):
  - Non-`main` branch-choice starts only after the completed hardening baseline has already established a safe non-`main` context.
  - The completed `continue_on_current_branch` path on safe non-`main` remains intact.
  - The first additional-new-branch path accepts one explicit target branch name.
  - The first additional-new-branch path supports only the already-safe non-`main` context.
  - The target branch must be new and resolve to a safe non-`main` branch.
  - Unsupported branch-choice paths stop.
  - Failed branching stops.
  - No hidden fallback to broader branch-management semantics is introduced.
  - Branch-choice behavior remains on the existing `P1` executor continuity path outside the Entry.
- Edge cases:
  - target branch already exists -> stop in this first slice
  - target branch name missing or malformed -> stop
  - current context is outside the bounded safe non-`main` path -> stop
  - branch creation fails -> stop
  - branch switching fails -> stop
  - branching appears to succeed but safe post-branch continuity is not established -> stop

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Extend the existing `P1` executor continuity surface with a bounded additional-new-branch entry path while preserving the completed `continue_on_current_branch` path on safe non-`main` exactly as-is.
2. Accept and validate one explicit target branch name only for the bounded additional-new-branch path.
3. Restrict eligibility for that additional-new-branch path to the already-safe non-`main` branch context.
4. Validate that the requested target branch is new, valid, and safe before branching.
5. Implement bounded create-and-switch to that additional new branch from the current safe non-`main` branch.
6. Return an explicit bounded branch-choice result describing success or stop.
7. Stop on:
   - missing/malformed target branch name
   - unsupported path
   - branch already exists
   - branch creation failure
   - branch switching failure
8. Extend smoke validation so the non-`main` branch-choice layer is covered without broadening into blocked-`main` redesign, switch-existing redesign, or unrelated Git workflow behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The additional-new-branch path starts only after the executor is already on a safe non-`main` branch.
- `continue_on_current_branch` on safe non-`main` remains unchanged.
- One explicit target branch name is required only for the additional-new-branch path.
- On safe non-`main`, create-and-switch to one additional new target branch succeeds when the bounded path is valid.
- If the requested target branch already exists, the first slice stops.
- If branch creation fails, the first slice stops.
- If branch switching fails, the first slice stops.
- Requests requiring blocked-`main` redesign or switch-existing redesign stop or remain unchanged according to the completed baselines.
- Existing non-`P1` rejection/stop behavior remains intact.
- Existing branch-state hardening behavior remains intact.
- Existing create-and-switch-from-main behavior remains intact.
- Existing switch-existing behavior remains intact.
- `git diff --check` passes.

### Optional checks
- Manual local simulation from a safe non-`main` branch confirming that the bounded additional-new-branch path succeeds.
- Manual verification that plain `continue_on_current_branch` on safe non-`main` remains unchanged.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] The first bounded non-`main` branch-choice slice is added after the completed branch-state hardening path, completed create-and-switch-from-main path, and completed switch-existing path for executor-side `P1 / Minor Change` behavior.
- [ ] The branch-choice behavior remains on the existing `P1` executor continuity path outside the Entry.
- [ ] The completed `continue_on_current_branch` path on safe non-`main` remains unchanged.
- [ ] The first additional-new-branch path consumes one explicit target branch name.
- [ ] The first additional-new-branch path supports only the already-safe non-`main` context.
- [ ] Failed or unsupported additional-new-branch paths stop explicitly.
- [ ] The completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, create-and-switch-from-main baseline, and switch-existing baseline remain intact.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first non-`main` branch-choice slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the bounded non-`main` branch-choice changes in `scripts/quality/p1-minor-change-executor.mjs` and any tightly coupled smoke-test updates.
