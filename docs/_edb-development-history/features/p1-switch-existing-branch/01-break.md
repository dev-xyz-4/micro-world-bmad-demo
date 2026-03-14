# Break — p1-switch-existing-branch

## 1) Problem Statement (one paragraph)
- The completed Phase-4 `P1 / Minor Change` continuation path now includes real branch-state hardening and a first bounded branch-mutation slice that can create and switch to a new non-`main` branch from blocked `main`, but it still stops when the intended target branch already exists because switch-existing behavior remains out of scope. The next bounded feature slice must therefore define the smallest implementation-ready step that can switch to an already-existing non-`main` branch after the already-completed `request_branch_change` decision path, while preserving the completed hardening and create-and-switch baselines and without broadening into generalized Git workflow orchestration.

## 2) Goal
- Define the next bounded BMAD feature slice for switching to an already-existing branch after the completed executor-side `P1 / Minor Change` branch-state hardening step and the completed first bounded create-and-switch-from-main slice.
- Keep the slice strictly limited to switch-existing behavior after the already-completed `request_branch_change` decision path.
- Make explicit that the completed branch-state hardening baseline and the completed first branch-mutation baseline remain in force and are not reopened in this slice.
- Make explicit the smallest first implementation target:
- perform bounded switching to an already-existing non-`main` branch when the guarded `P1` path requires branch change
- keep execution on the existing executor-side `P1` path outside the Entry
- do not broaden into generalized Git workflow orchestration
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Reworking the completed branch-state detection and decision baseline from the prior slice.
- Reworking the completed create-and-switch-from-main mutation baseline from the prior slice.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Redesigning target resolution, template-aware generation, multi-file writes, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: has already selected the bounded `request_branch_change` path and now wants to continue on an already-existing non-`main` branch.
- Executor surface: performs the bounded switch-existing action after the hardening layer has already determined that direct continuation is unsafe or not currently desired.
- Reviewer / router: verifies that the slice extends the existing `P1` executor path without reopening Entry placement, hardening-baseline, or create-and-switch-baseline decisions.

## 5) Inputs / Outputs
### Inputs
- A valid executor-ready `P1 / Minor Change` context on top of the completed contract-emission baseline, completed first minimal-write baseline, completed branch-state hardening baseline, and completed first bounded create-and-switch-from-main baseline.
- The completed local planning and implementation continuity basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-switch-existing-branch`, beginning with this break artifact.
- A later deliver contract that makes the first switch-existing implementation slice explicit enough for governed code work.
- `questions.md` entries only for unresolved switch-existing details that this break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this switch-existing slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and preserve the existing path-specific `P1` executor continuity unless a later bounded analysis explicitly proves otherwise.
- Keep the completed branch-state hardening baseline and completed first branch-mutation baseline in force.
- Limit mutation behavior to bounded switching to an already-existing non-`main` branch after `request_branch_change`.
- Do not broaden into generalized Git workflow orchestration.
- Performance:
- No background orchestration, repository-wide workflow automation, or unrelated Git coordination is in scope.
- UX:
- The switch-existing step must remain explicit and bounded rather than implicit or guessed.
- The operator-facing flow must remain understandable after the existing `request_branch_change` result and after the completed first create-and-switch baseline.
- Compatibility:
- The completed `P1` contract-emission baseline, minimal-write baseline, branch-state hardening baseline, and first create-and-switch baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- See `questions.md` for the current open/resolved status.
- At break time, the first bounded switch-existing slice still needs explicit answers for:
- what exact branch-target input shape the executor should consume for the switch-existing path
- whether the first switch-existing slice should remain limited to the blocked `main` path or also allow a bounded branch-change request from an already-safe non-`main` branch
- how the first bounded slice should stop when the requested existing-branch switch cannot be completed safely

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for switching to an already-existing branch after the completed branch-state hardening and first branch-mutation baselines.
- The slice stays explicitly tied to executor-side `P1 / Minor Change` behavior after `request_branch_change`.
- The completed hardening baseline and completed create-and-switch baseline are preserved rather than reopened.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without broadening into generalized Git workflow orchestration.
- The open switch-existing questions are isolated in `questions.md` instead of being guessed inside the break.
