# Deliver Spec — p1-non-main-switch-existing-branch

## 0) Status
- Owner: current operator
- Created: 2026-03-14
- Last updated: 2026-03-14
- Related docs:
  - Break: `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/01-break.md`
  - Model: `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded safe non-`main` switch-existing slice after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, the completed first bounded switch-existing-from-main slice, and the completed first bounded non-`main` branch-choice slice.
- Keep the safe non-`main` switch-existing behavior on the existing `P1` executor continuity path outside the Entry.
- Preserve the completed `continue_on_current_branch` path on safe non-`main` exactly as-is.
- Preserve the completed additional-new-branch path on safe non-`main` exactly as-is.
- Add one separate bounded switch-existing path from an already-safe non-`main` branch to one already-existing safe non-`main` branch.
- Continue to use one explicit target branch name via the existing target-branch input handling rather than introducing a richer intent structure.
- Preserve the completed `P1` contract-emission baseline, the completed first executor-side `P1` minimal write baseline, the completed branch-state hardening baseline, the completed create-and-switch-from-main baseline, the completed blocked-`main` switch-existing baseline, and the completed safe non-`main` additional-new-branch baseline.
- Make the first safe non-`main` switch-existing slice explicit enough that later code work does not require guesswork or architectural reinterpretation.

### Non-Goals (explicitly out of scope)
- Any change to `P1 / P2 / P3` routing semantics or to the completed `P1` contract-emission behavior in the Entry.
- Any movement of safe non-`main` switch-existing behavior into `scripts/quality/orchestrator-entry.mjs`.
- Any redesign of the completed `continue_on_current_branch` path on safe non-`main`.
- Any redesign of the completed additional-new-branch path on safe non-`main`.
- Any redesign of the completed create-and-switch-from-main baseline.
- Any redesign of the completed blocked-`main` switch-existing baseline.
- Any newly unified three-option branch-choice envelope for the safe non-`main` context in this first slice.
- Any target-resolution redesign, template-aware generation, multi-file writes, PR-helper execution, or generalized Git workflow orchestration.
- Any governance, routing-owner, or policy-owner change.
- Any hidden fallback from failed safe non-`main` switch-existing behavior into broader branch-management logic.

### Constraints
- Tech:
  - The first safe non-`main` switch-existing slice must remain on the existing `P1` executor continuity path.
  - The completed branch-state hardening baseline, completed create-and-switch-from-main baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline must remain in force before safe non-`main` switch-existing behavior is reached.
  - The completed `continue_on_current_branch` path on safe non-`main` must remain intact.
  - The completed additional-new-branch path on safe non-`main` must remain intact.
  - The bounded branch-target input remains one explicit target branch name for the safe non-`main` switch-existing path.
  - The first safe non-`main` switch-existing path is limited to the already-safe non-`main` context.
  - The target branch must already exist and must resolve to a safe non-`main` branch context.
  - If the target branch input is missing, malformed, or unsupported, stop.
  - If the target branch does not exist, stop.
  - If the target branch resolves to `main` or another unsafe branch context, stop.
  - If branch switching fails, stop.
  - If the requested safe non-`main` switch-existing path is unsupported, stop.
- Perf:
  - Keep the first safe non-`main` switch-existing slice process-local and bounded; no background behavior or generalized orchestration layer.
- UX:
  - The operator-facing request remains explicit: while already on a safe non-`main` branch, continuation and the completed additional-new-branch path remain available, and one explicit target branch name is required for the switch-existing path.
  - Unsupported or unsafe safe non-`main` switch requests must stop rather than degrade into guessed behavior.
- Backward compatibility:
  - Preserve all behavior outside this safe non-`main` switch-existing slice.
  - Preserve the completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, create-and-switch-from-main baseline, blocked-`main` switch-existing baseline, and safe non-`main` additional-new-branch baseline.
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
  - Extend the existing `P1` executor continuity surface with one bounded safe non-`main` switch-existing path.
  - Preserve the existing `continue_on_current_branch` path on safe non-`main` exactly as-is.
  - Preserve the completed safe non-`main` additional-new-branch path exactly as-is.
  - Accept one explicit target branch name for the safe non-`main` switch-existing path using the existing target-branch input handling.
  - Support the safe non-`main` switch-existing path only while already on a safe non-`main` branch.
  - Re-check or preserve safe branch-state continuity after switching before any later write continuation is considered.
  - Stop on missing target branch input, malformed target branch, missing existing target branch, unsafe target branch, branch switch failure, unsupported target intent, unsupported path, or unsafe post-switch continuity.
- Out-of-scope notes:
  - No redesign of the completed `continue_on_current_branch` path.
  - No redesign of the completed safe non-`main` additional-new-branch path.
  - No blocked-`main` redesign.
  - No safe non-`main` create-and-switch redesign.
  - No newly unified three-option branch-choice envelope in this first slice.
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
- `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/01-break.md`
- `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/02-model.md`
- `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/03-analyze.md`
- `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/04-deliver.md`
- `docs/_edb-development-history/features/p1-non-main-switch-existing-branch/questions.md` (only if a new blocker appears during later implementation)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- Path-specific executor export remains on:
  - `executeP1MinorChangeWrite(...)`
- The existing executor surface may extend its bounded input/behavior to accept one explicit target branch name for the safe non-`main` switch-existing path.
- No generalized branch-management API or shared Git-orchestration surface is introduced.

### Inputs / Outputs
- Inputs:
  - executor-ready `P1 / Minor Change` input packet
  - safe current non-`main` branch state
  - existing `continue_on_current_branch` intent, existing additional-new-branch intent, or one explicit target branch name for the safe non-`main` switch-existing path
- Outputs:
  - bounded branch-choice result describing:
    - selected choice action
    - resulting executor state
    - resulting branch state where successful
    - next human action

### Error behavior
- If the current bounded path is not eligible for the first safe non-`main` switch-existing slice, stop.
- If the target branch name is missing, malformed, or unsupported for the safe non-`main` switch-existing path, stop.
- If the target branch does not exist, stop.
- If the target branch resolves to `main` or another unsafe branch context, stop.
- If switching to the existing branch fails, stop.
- If switching appears to succeed but safe post-switch branch continuity is not established, stop.
- If implementation pressure pushes toward blocked-`main` redesign, safe non-`main` create-and-switch redesign, unified choice-envelope redesign, or generalized Git workflow handling, stop and defer to a later bounded slice.

---

## 5) Data Model / State (if any)
- Entities:
  - `SafeNonMainBranchChoiceRequest`
  - `SafeNonMainChoiceIntent`
  - `SafeNonMainChoiceResult`
  - existing executor-ready `P1 / Minor Change` packet
  - prior `BranchState` / `BranchDecisionResult` from the completed hardening baseline
  - prior create-and-switch baseline from the completed first mutation slice
  - prior blocked-`main` switch-existing baseline from the completed second mutation slice
  - prior safe non-`main` additional-new-branch baseline from the completed non-`main` branch-choice slice
- Persistence (if any):
  - None required for this first safe non-`main` switch-existing slice.
- Invariants (target-state constraints):
  - Safe non-`main` switch-existing starts only after the completed hardening baseline has already established a safe non-`main` context.
  - The completed `continue_on_current_branch` path on safe non-`main` remains intact.
  - The completed additional-new-branch path on safe non-`main` remains intact.
  - The first safe non-`main` switch-existing path accepts one explicit target branch name.
  - The first safe non-`main` switch-existing path supports only the already-safe non-`main` context.
  - The target branch must already exist and resolve to a safe non-`main` branch.
  - Unsupported safe non-`main` switch-existing paths stop.
  - Failed switching stops.
  - No hidden fallback to broader branch-management semantics is introduced.
  - Safe non-`main` switch-existing behavior remains on the existing `P1` executor continuity path outside the Entry.
- Edge cases:
  - target branch does not exist -> stop in this first slice
  - target branch name missing or malformed -> stop
  - current context is outside the bounded safe non-`main` path -> stop
  - target branch resolves to `main` or other unsafe context -> stop
  - switch appears to succeed but safe post-switch branch continuity is not established -> stop

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Extend the existing `P1` executor continuity surface with a bounded safe non-`main` switch-existing entry path while preserving the completed `continue_on_current_branch` path and completed additional-new-branch path exactly as-is.
2. Accept and validate one explicit target branch name for the safe non-`main` switch-existing path using the existing target-branch input handling.
3. Restrict eligibility for that switch-existing path to the already-safe non-`main` branch context.
4. Validate that the requested target branch already exists and resolves to a safe non-`main` branch context.
5. Implement bounded switch to that already-existing safe non-`main` branch from the current safe non-`main` branch.
6. Return an explicit bounded branch-choice result describing success or stop.
7. Stop on:
   - missing/malformed target branch name
   - unsupported path
   - missing existing branch
   - unsafe target branch
   - branch switch failure
   - unsafe post-switch continuity
8. Extend smoke validation so the safe non-`main` switch-existing layer is covered without broadening into blocked-`main` redesign, safe non-`main` create-and-switch redesign, unified choice-envelope redesign, or unrelated Git workflow behavior.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- The safe non-`main` switch-existing path starts only after the executor is already on a safe non-`main` branch.
- `continue_on_current_branch` on safe non-`main` remains unchanged.
- The completed safe non-`main` additional-new-branch path remains unchanged.
- One explicit target branch name is required for the safe non-`main` switch-existing path.
- On safe non-`main`, switching to one already-existing safe non-`main` target branch succeeds when the bounded path is valid.
- If the requested target branch does not exist, the first slice stops.
- If the requested target branch resolves to `main` or unsafe context, the first slice stops.
- If branch switching fails, the first slice stops.
- Requests requiring blocked-`main` redesign or safe non-`main` create-and-switch redesign stop or remain unchanged according to the completed baselines.
- Existing non-`P1` rejection/stop behavior remains intact.
- Existing branch-state hardening behavior remains intact.
- Existing create-and-switch-from-main behavior remains intact.
- Existing blocked-`main` switch-existing behavior remains intact.
- Existing safe non-`main` additional-new-branch behavior remains intact.
- `git diff --check` passes.

### Optional checks
- Manual local simulation from a safe non-`main` branch confirming that the bounded switch-existing path succeeds.
- Manual verification that plain `continue_on_current_branch` on safe non-`main` remains unchanged.
- Manual verification that the completed safe non-`main` additional-new-branch path remains unchanged.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] The first bounded safe non-`main` switch-existing slice is added after the completed branch-state hardening path, completed create-and-switch-from-main path, completed blocked-`main` switch-existing path, and completed safe non-`main` additional-new-branch path for executor-side `P1 / Minor Change` behavior.
- [ ] The safe non-`main` switch-existing behavior remains on the existing `P1` executor continuity path outside the Entry.
- [ ] The completed `continue_on_current_branch` path on safe non-`main` remains unchanged.
- [ ] The completed safe non-`main` additional-new-branch path remains unchanged.
- [ ] The first safe non-`main` switch-existing path consumes one explicit target branch name.
- [ ] The first safe non-`main` switch-existing path supports only the already-safe non-`main` context.
- [ ] Failed or unsupported safe non-`main` switch-existing paths stop explicitly.
- [ ] The completed `P1` contract-emission baseline, first executor-side write baseline, branch-state hardening baseline, create-and-switch-from-main baseline, blocked-`main` switch-existing baseline, and safe non-`main` additional-new-branch baseline remain intact.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - None in this first safe non-`main` switch-existing slice.
- Migration steps:
  - None.
- Revert steps:
  - Revert the bounded safe non-`main` switch-existing changes in `scripts/quality/p1-minor-change-executor.mjs` and any tightly coupled smoke-test updates.
