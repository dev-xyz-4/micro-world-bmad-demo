# Break — p1-non-main-branch-choice

## 1) Problem Statement (one paragraph)
- The completed Phase-4 `P1 / Minor Change` continuation path now includes real branch-state hardening, bounded create-and-switch from blocked `main`, and bounded switch-existing from blocked `main`, but once execution is already on a safe non-`main` branch the bounded flow currently supports only direct continuation on that current branch. The next bounded feature slice must therefore define the smallest implementation-ready step that preserves current-branch continuation while adding one explicit option to open one additional new branch from that already-safe non-`main` context, without reopening the completed baselines or broadening into generalized Git workflow orchestration.

## 2) Goal
- Define the next bounded BMAD feature slice for non-`main` branch-choice expansion after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, and the completed first bounded switch-existing slice.
- Keep the slice strictly limited to the case where execution is already on a safe non-`main` branch.
- Make explicit that the operator should have two bounded options in that safe non-`main` context:
- continue writing on the current branch
- open one additional new branch and continue there
- Make explicit that the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, and completed switch-existing baseline remain in force and are not reopened in this slice.
- Make explicit the smallest first implementation target:
- preserve the existing continue-on-current-branch path on safe non-`main`
- add one bounded new-branch option from an already-safe non-`main` branch
- do not broaden into generalized Git workflow orchestration
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Reworking the completed branch-state detection and decision baseline from the prior slices.
- Reworking the completed create-and-switch-from-main mutation baseline from the prior slice.
- Reworking the completed switch-existing baseline from the prior slice.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Redesigning target resolution, template-aware generation, multi-file writes, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: is already on a safe non-`main` branch and wants either to continue writing there or to open one additional new branch for the bounded `P1` write.
- Executor surface: preserves the bounded continue-on-current-branch path and may later perform one bounded new-branch action from safe non-`main`.
- Reviewer / router: verifies that the slice extends the existing `P1` executor path without reopening Entry placement, blocked-`main` baselines, or switch-existing decisions.

## 5) Inputs / Outputs
### Inputs
- A valid executor-ready `P1 / Minor Change` context on top of the completed contract-emission baseline, completed first minimal-write baseline, completed branch-state hardening baseline, completed first bounded create-and-switch-from-main baseline, and completed first bounded switch-existing baseline.
- The completed local planning and implementation continuity basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-022_P3_P1_Non_Main_Branch_Choice_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-non-main-branch-choice`, beginning with this break artifact.
- A later deliver contract that makes the first non-`main` branch-choice implementation slice explicit enough for governed code work.
- `questions.md` entries only for unresolved non-`main` branch-choice details that this break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this non-`main` branch-choice slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and preserve the existing path-specific `P1` executor continuity unless a later bounded analysis explicitly proves otherwise.
- Keep the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, and completed switch-existing baseline in force.
- Limit behavior to bounded branch choice while already on a safe non-`main` branch.
- Do not broaden into generalized Git workflow orchestration.
- Performance:
- No background orchestration, repository-wide workflow automation, or unrelated Git coordination is in scope.
- UX:
- The non-`main` branch-choice step must remain explicit and bounded rather than implicit or guessed.
- The operator-facing flow must remain understandable in the already-safe non-`main` context.
- Compatibility:
- The completed `P1` contract-emission baseline, minimal-write baseline, branch-state hardening baseline, create-and-switch baseline, and switch-existing baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- See `questions.md` for the current open/resolved status.
- At break time, the first bounded non-`main` branch-choice slice still needs explicit answers for:
- what exact input/decision shape should represent the bounded choice between current-branch continue and opening one additional new branch
- whether the first slice should add only the new-branch option while preserving existing `continue_on_current_branch` as-is, or also reshape the bounded decision model
- how the first bounded slice should stop when the requested additional new-branch action cannot be completed safely from the current non-`main` branch

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for non-`main` branch-choice expansion after the completed branch-state hardening, create-and-switch, and switch-existing baselines.
- The slice stays explicitly tied to executor-side `P1 / Minor Change` behavior while already on a safe non-`main` branch.
- The completed baselines are preserved rather than reopened.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without broadening into generalized Git workflow orchestration.
- The open non-`main` branch-choice questions are isolated in `questions.md` instead of being guessed inside the break.
