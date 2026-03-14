# Break — p1-executor-minimal-write

## 1) Problem Statement (one paragraph)
- The current Phase-4 baseline can already emit a bounded `P1 / Minor Change` `action_contract`, but there is still no executor-side capability that can consume that contract and perform one real docs-only repo-tracked write safely. The next bounded feature slice must therefore define the smallest implementation-ready executor scope that stays outside the Entry, requires branch-confirmed execution before any repo write, and proves one simple docs-only write path without broadening into template expansion, generalized executor behavior, or other path families.

## 2) Goal
- Define the first bounded BMAD feature slice for executor-side `P1 / Minor Change` minimal write behavior.
- Keep the slice strictly limited to executor behavior after the completed `P1` contract-emission baseline.
- Make explicit that branch-confirmed execution is required before any repo-tracked write occurs.
- Make explicit the smallest first implementation target:
- mandatory branch gate
- one simple docs-only write
- no template expansion
- Preserve the accepted placement rule:
- contracts remain outside the Entry
- execution remains outside the Entry
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Changing `P1 / P2 / P3` routing behavior or the completed `P1` contract-emission baseline.
- Moving execution back into `scripts/quality/orchestrator-entry.mjs`.
- Adding template-aware generation, multi-file writes, review automation, PR-helper execution, or branch automation beyond the required branch-confirmed gate concept.
- Adding executor behavior for `P2`, `P3`, `P4`, or `P5`.
- Reopening routing-owner, placement-rule, or policy-owner decisions already settled in the current Phase-4 basis.

## 4) Users / Actors (if any)
- Operator: confirms or rejects the required branch-confirmed execution gate before repo-tracked writes.
- Executor surface: consumes a valid emitted `P1 / Minor Change` contract and performs one bounded docs-only write if preconditions are met.
- Router / reviewer: verifies that the slice remains outside the Entry and inside the docs-only boundary.

## 5) Inputs / Outputs
### Inputs
- A valid emitted `P1 / Minor Change` route result carrying the bounded `action_contract`.
- The completed local planning basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-017_P3_P1_Executor_Minimal_Write_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Model_v0.2.md`
  - `.planning/MODELS/Phase4-Orchestrator/Phase4_P1_Executor_Minimal_Write_Path_Analysis_v0.1.md`
- Mode-aware routing rules from `docs/bmad/guides/CODEX_ENTRY.md`.

### Outputs
- A bounded feature-local BMAD planning stack for `p1-executor-minimal-write`, beginning with this break artifact.
- A later deliver contract that makes the first executor-side `P1` minimal write slice explicit enough for governed implementation.
- `questions.md` entries only for unresolved issues that the break should not guess.

## 6) Constraints
- Technical:
- Preserve existing behavior outside this executor slice.
- Do not invent new requirements.
- Do not write implementation code in this step.
- Keep execution outside the Entry and keep contract definition outside the Entry.
- Require branch-confirmed execution before any repo-tracked write.
- Keep the first write path bounded to one simple docs-only artifact with no template expansion.
- Performance:
- No generalized executor-engine or background behavior is in scope.
- UX:
- Human confirmation remains explicit; `no` at the branch gate must stop the sequence.
- Compatibility:
- The completed `P1` contract-emission baseline must remain intact and reusable.
- Legal/Compliance (if relevant):
- No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- What exact executor surface/file should host the first bounded `P1` minimal write behavior while remaining outside the Entry?
- What exact repo-tracked docs target should be used for the first simple write proof without prematurely broadening target-resolution logic?

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for executor-side `P1 / Minor Change` minimal write behavior.
- The slice keeps branch-confirmed execution mandatory before repo-tracked writes.
- Scope and non-scope are explicit enough to support the next model/analyze/deliver artifacts without reopening settled placement or routing questions.
- The slice remains limited to one simple docs-only write and does not broaden into template-aware generation, generalized executor behavior, or other path families.
