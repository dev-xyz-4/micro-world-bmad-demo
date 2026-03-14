# Break — p1-branch-create-or-switch

## 1) Problem Statement (one paragraph)
- The completed Phase-4 `P1 / Minor Change` branch-hardening baseline now detects real Git branch state and stops unsafe repo-tracked writes on `main` or unknown branch state, but the bounded flow still ends at `request_branch_change` without any executor-side branch creation/switch execution. The next bounded feature slice must therefore define the smallest implementation-ready step that can create and/or switch branches after that already-completed decision path, so the executor can leave an unsafe `main` context without reopening branch-state hardening and without broadening into generalized Git workflow orchestration.

## 2) Goal
- Define the next bounded BMAD feature slice for actual branch creation/switch execution after the completed executor-side `P1 / Minor Change` branch-state hardening step.
- Keep the slice strictly limited to branch creation/switch behavior after the already-completed `request_branch_change` decision path.
- Make explicit that the completed branch-state hardening baseline remains in force and is not reopened in this slice.
- Make explicit the smallest first implementation target:
- perform bounded branch creation and/or branch switching needed to leave unsafe `main` execution context
- keep execution on the existing executor-side `P1` path outside the Entry
- do not broaden into generalized Git workflow orchestration
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Reworking the completed branch-state detection and decision baseline from the prior slice.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Redesigning target resolution, template-aware generation, multi-file writes, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: triggers the already-bounded `request_branch_change` path and may need to supply branch-target intent.
- Executor surface: performs the bounded branch create/switch action after the hardening layer has already determined that direct continuation is unsafe or not currently desired.
- Reviewer / router: verifies that the slice extends the existing `P1` executor path without reopening Entry placement or hardening-baseline decisions.

## 5) Inputs / Outputs
### Inputs
- A valid executor-ready `P1 / Minor Change` context on top of the completed contract-emission baseline, completed first minimal-write baseline, and completed branch-state hardening baseline.
- The completed local planning and implementation continuity basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-020_P3_P1_Branch_Create_or_Switch_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-branch-create-or-switch`, beginning with this break artifact.
- A later deliver contract that makes the first branch create/switch implementation slice explicit enough for governed code work.
- `questions.md` entries only for unresolved branch-mutation details that this break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this branch-mutation slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and preserve the existing path-specific `P1` executor continuity unless a later bounded analysis explicitly proves otherwise.
- Keep the completed branch-state hardening baseline in force.
- Limit mutation behavior to bounded branch creation and/or switching after `request_branch_change`.
- Do not broaden into generalized Git workflow orchestration.
- Performance:
- No background orchestration, repository-wide workflow automation, or unrelated Git coordination is in scope.
- UX:
- The branch-mutation step must remain explicit and bounded rather than implicit or guessed.
- The operator-facing flow must remain understandable after the existing `request_branch_change` result.
- Compatibility:
- The completed `P1` contract-emission baseline, minimal-write baseline, and branch-state hardening baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- See `questions.md` for the current open/resolved status.
- At break time, the first bounded branch-mutation slice still needs explicit answers for:
- what exact branch-target intent/shape the executor should consume after `request_branch_change`
- whether the first mutation slice should support both branch creation and switching, or only one minimal path first
- how the first bounded slice should stop when the requested branch mutation cannot be completed safely

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for actual branch creation/switch execution after the completed branch-state hardening baseline.
- The slice stays explicitly tied to executor-side `P1 / Minor Change` behavior after `request_branch_change`.
- The completed hardening baseline is preserved rather than reopened.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without broadening into generalized Git workflow orchestration.
- The open branch-mutation questions are isolated in `questions.md` instead of being guessed inside the break.
