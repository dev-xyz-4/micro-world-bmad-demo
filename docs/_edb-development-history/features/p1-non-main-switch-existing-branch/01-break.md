# Break — p1-non-main-switch-existing-branch

## 1) Problem Statement (one paragraph)
- The completed Phase-4 `P1 / Minor Change` continuation path now includes real branch-state hardening, bounded create-and-switch from blocked `main`, bounded switch-existing from blocked `main`, and one bounded additional-new-branch path from an already-safe non-`main` branch, but that safe non-`main` context still lacks a bounded way to switch to one already-existing safe non-`main` branch. The next bounded feature slice must therefore define the smallest implementation-ready step that preserves the current safe non-`main` continuation and additional-new-branch baselines while adding one explicit switch-existing option from that already-safe non-`main` context, without reopening the completed baselines or broadening into generalized Git workflow orchestration.

## 2) Goal
- Define the next bounded BMAD feature slice for safe non-`main` switch-existing expansion after the completed executor-side `P1 / Minor Change` branch-state hardening step, the completed first bounded create-and-switch-from-main slice, the completed first bounded switch-existing-from-main slice, and the completed first bounded non-`main` branch-choice slice.
- Keep the slice strictly limited to the case where execution is already on a safe non-`main` branch.
- Make explicit that the operator should have three bounded options in that safe non-`main` context:
- continue writing on the current branch
- open one additional new branch and continue there
- switch to one already-existing safe non-`main` branch and continue there
- Make explicit that the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline remain in force and are not reopened in this slice.
- Make explicit the smallest first implementation target:
- preserve the existing continue-on-current-branch path on safe non-`main`
- preserve the existing additional-new-branch path on safe non-`main`
- add one bounded switch-existing option from an already-safe non-`main` branch
- do not broaden into generalized Git workflow orchestration
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Reworking the completed branch-state detection and decision baseline from the prior slices.
- Reworking the completed create-and-switch-from-main mutation baseline from the prior slice.
- Reworking the completed blocked-`main` switch-existing baseline from the prior slice.
- Reworking the completed safe non-`main` additional-new-branch baseline from the prior slice.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Redesigning blocked-`main` behavior, safe non-`main` create-and-switch behavior, target resolution, template-aware generation, multi-file writes, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: is already on a safe non-`main` branch and needs one bounded choice among continuing there, opening one additional new branch, or switching to one already-existing safe non-`main` branch.
- Executor surface: preserves the bounded safe non-`main` continuation and additional-new-branch paths and may later perform one bounded switch-existing action from that same safe non-`main` context.
- Reviewer / router: verifies that the slice extends the existing `P1` executor path without reopening Entry placement, blocked-`main` baselines, or the completed safe non-`main` additional-new-branch baseline.

## 5) Inputs / Outputs
### Inputs
- A valid executor-ready `P1 / Minor Change` context on top of the completed contract-emission baseline, completed first minimal-write baseline, completed branch-state hardening baseline, completed first bounded create-and-switch-from-main baseline, completed first bounded switch-existing-from-main baseline, and completed first bounded safe non-`main` additional-new-branch baseline.
- The completed local planning and implementation continuity basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-023_P3_P1_Non_Main_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-022_P3_P1_Non_Main_Branch_Choice_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-021_P3_P1_Switch_Existing_Branch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-non-main-switch-existing-branch`, beginning with this break artifact.
- A later deliver contract that makes the first safe non-`main` switch-existing implementation slice explicit enough for governed code work.
- `questions.md` entries only for unresolved safe non-`main` switch-existing details that this break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this safe non-`main` switch-existing slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and preserve the existing path-specific `P1` executor continuity unless a later bounded analysis explicitly proves otherwise.
- Keep the completed branch-state hardening baseline, completed create-and-switch-from-main baseline, completed blocked-`main` switch-existing baseline, and completed safe non-`main` additional-new-branch baseline in force.
- Limit behavior to the already-safe non-`main` context and the three bounded operator options defined for that context.
- Build on the existing branch-state classes, branch-dependent decision results, and target-branch input handling rather than redesigning them.
- Do not broaden into generalized Git workflow orchestration.
- Performance:
- No background orchestration, repository-wide workflow automation, or unrelated Git coordination is in scope.
- UX:
- The safe non-`main` branch-choice step must remain explicit and bounded rather than implicit or guessed.
- The operator-facing flow must remain understandable while presenting exactly the three bounded options for an already-safe non-`main` branch.
- Compatibility:
- The completed `P1` contract-emission baseline, minimal-write baseline, branch-state hardening baseline, create-and-switch-from-main baseline, blocked-`main` switch-existing baseline, and safe non-`main` additional-new-branch baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- See `questions.md` for the current open/resolved status.
- At break time, the first bounded safe non-`main` switch-existing slice still needs explicit answers for:
- what exact decision/result shape should expose the three bounded safe non-`main` options without reshaping the broader branch model
- what exact stop/result behavior should apply when the requested switch to an already-existing safe non-`main` branch cannot be completed safely using the existing target-branch handling

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for safe non-`main` switch-existing expansion after the completed branch-state hardening, create-and-switch-from-main, blocked-`main` switch-existing, and safe non-`main` additional-new-branch baselines.
- The slice stays explicitly tied to executor-side `P1 / Minor Change` behavior while execution is already on a safe non-`main` branch.
- The three bounded safe non-`main` operator options are explicit.
- The completed baselines remain in force rather than being reopened.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without broadening into generalized Git workflow orchestration.
- The open safe non-`main` switch-existing questions are isolated in `questions.md` instead of being guessed inside the break.
