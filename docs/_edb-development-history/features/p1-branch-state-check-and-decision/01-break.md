# Break — p1-branch-state-check-and-decision

## 1) Problem Statement (one paragraph)
- The current Phase-4 baseline already supports a bounded executor-side `P1 / Minor Change` write path, but that path still relies on a confirmation-only branch gate rather than real Git branch-state detection. The next bounded feature slice must therefore define the smallest implementation-ready hardening step that detects whether execution is on `main`, on a non-`main` branch, or in an unknown branch state before any repo-tracked `P1` write proceeds, while staying outside the Entry and explicitly deferring actual branch creation/switch execution.

## 2) Goal
- Define the first bounded BMAD feature slice for real branch-state detection before repo-tracked executor-side `P1 / Minor Change` writes.
- Keep the slice strictly limited to branch-state hardening after the completed first executor-side `P1` minimal write baseline.
- Make explicit that real Git branch-state detection replaces the current confirmation-only safety gate for this path.
- Make explicit the smallest first implementation target:
- detect `main` vs non-`main` vs unknown
- return branch-dependent continue/stop/branch-change-intent decisions
- do not execute actual branch creation/switch in this slice
- Preserve the accepted placement rule:
- contracts remain outside the Entry
- execution remains outside the Entry
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Changing the completed first executor-side `P1` minimal write behavior beyond the new branch-hardening guard layer.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Adding actual branch creation/switch automation in this slice.
- Adding target-resolution redesign, template-aware generation, multi-file writes, `P2`/`P3`/`P4`/`P5` behavior, PR-helper execution, UI/Vite work, or generalized Git workflow orchestration.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: receives branch-state-dependent choices and must decide whether to continue, request branch change, or stop.
- Executor surface: evaluates real branch state before any repo-tracked `P1` write proceeds.
- Router / reviewer: verifies that the hardening slice stays outside the Entry and remains bounded to `P1 / Minor Change`.

## 5) Inputs / Outputs
### Inputs
- A valid executor-ready `P1 / Minor Change` context after the completed contract-emission and first minimal-write baseline.
- The completed local planning basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-019_P3_P1_Branch_State_Check_and_Decision_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Branch_State_and_Branch_Flow_Analysis_v0.1.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-branch-state-check-and-decision`, beginning with this break artifact.
- A later deliver contract that makes the first branch-hardening implementation slice explicit enough for governed code work.
- `questions.md` entries only for unresolved issues that this break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this hardening slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and keep contract definition outside the Entry.
- Detect real Git branch state rather than relying only on manual confirmation.
- Stop on unknown branch state.
- Do not execute branch creation/switch in this slice.
- Performance:
- No generalized Git workflow automation or background behavior is in scope.
- UX:
- Branch-state-dependent human choices must remain explicit.
- On `main`, refusing branch-change intent must stop the sequence.
- Compatibility:
- The completed `P1` contract-emission baseline and first executor-side write baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- See `questions.md` for the current resolved/open status.
- At break time, two bounded questions were intentionally left open:
- exact executor-side surface for the first branch-hardening slice
- exact operator-facing response shape for bounded continue/stop/branch-change-intent handling

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for real branch-state detection before repo-tracked executor-side `P1 / Minor Change` writes.
- The slice keeps scope limited to branch-state hardening after the completed first executor-side `P1` write baseline.
- `main`, non-`main`, and unknown branch states are explicitly recognized as distinct bounded cases.
- Actual branch creation/switch remains explicitly out of scope for this first hardening implementation.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without reopening settled routing or placement decisions.
