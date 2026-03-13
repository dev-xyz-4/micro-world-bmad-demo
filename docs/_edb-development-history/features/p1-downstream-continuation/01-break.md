# Break — p1-downstream-continuation

## 1) Problem Statement (one paragraph)
- The current Orchestrator Entry MVP can deterministically route a docs-only goal to `primary_path: P1` and `workflow_route: Minor Change`, but it does not yet provide an executable downstream continuation contract for that outcome under the now-accepted placement rule. The next bounded feature slice must define the smallest implementation-ready BMAD feature scope in which the Entry can select/load/emit the first structured `P1` continuation packet while the contract definition itself lives outside the Entry, without changing `P1 / P2 / P3` routing semantics, expanding into branch/PR automation, or weakening the current docs-only and no-hidden-execution boundaries.

## 2) Goal
- Define the first bounded BMAD feature slice for executable `P1 / Minor Change` downstream continuation.
- Keep the slice strictly limited to `P1` continuation behavior and preserve current `P1 / P2 / P3` routing semantics.
- Make explicit the smallest first implementation target, required inputs/outputs, and non-goals for the continuation packet and gate behavior under the accepted split:
- the Entry emits the contract
- the contract definition lives outside the Entry
- Preserve the three-gate model, explicit stop/completion semantics, docs-only boundary enforcement, and the no-hidden-execution rule.
- Capture `no SemVer change` for this documentation-only break step.

## 3) Non-Goals
- Implementing code in this step.
- Changing current `P1 / P2 / P3` routing logic or normalization rules.
- Implementing continuation behavior for `P2`, `P3`, or `P1 / BMAD Feature`.
- Introducing automatic branch creation, PR-helper execution, UI/Vite scope, or generalized continuation-engine behavior.
- Reopening routing-owner or policy-owner questions governed by `CODEX_ENTRY.md` and `CODEX_WORKFLOW_POLICY.md`.
- Modifying governance documents or repository structure beyond this feature-local artifact set.

## 4) Users / Actors (if any)
- Operator: reviews the proposed continuation and answers `yes / no / cancel` at explicit gates.
- Orchestrator Entry continuation layer: produces the bounded `P1` continuation packet and stop/completion semantics.
- Reviewer / router: checks that the slice stays inside docs-only, `P1 / Minor Change`, and existing authority boundaries.

## 5) Inputs / Outputs
### Inputs
- A resolved Entry result with `result_type: route-result`, `primary_path: P1`, and `workflow_route: Minor Change`.
- Active mode-aware target resolution from `docs/bmad/guides/CODEX_ENTRY.md`.
- The local contract basis:
  - `.planning/MODELS/Phase4-Orchestrator/work-units/P4-WU-014_P3_P1_Downstream_Continuation_Implementation.md`
  - `.planning/MODELS/Phase4-Orchestrator/p1-downstream-contract/Phase4_P1_Downstream_Action_Contract_Model_v0.3.md`
  - `.planning/MODELS/Phase4-Orchestrator/p1-downstream-contract/Phase4_P1_Downstream_Action_Implementation_Note_v0.1.md`

### Outputs
- A bounded feature-local BMAD planning stack for `p1-downstream-continuation`, beginning with this break artifact.
- A later deliver contract that makes the first executable `P1` continuation slice explicit enough for governed implementation.
- A later deliver contract that reflects the accepted placement rule rather than assuming the contract is defined inside `scripts/quality/orchestrator-entry.mjs`.
- `questions.md` entries only for genuine unresolved issues that the break cannot safely decide.

## 6) Constraints
- Technical:
  - Preserve existing behavior outside the new `P1` continuation slice.
  - Do not invent new requirements.
  - Do not write implementation code in this step.
  - Keep the first slice small enough to fit one bounded implementation target.
  - Preserve the three-gate model: `gate_save`, `gate_execute`, `gate_review`.
  - Preserve explicit stop/completion semantics and docs-only boundary enforcement.
- Performance:
  - No performance expansion or generalized execution engine work is in scope.
- UX:
  - Human confirmation remains explicit; no hidden execution is allowed.
- Compatibility:
  - Current Entry MVP routing outputs and mode-aware routing ownership must remain stable.
- Legal/Compliance (if relevant):
  - No additional legal/compliance scope is introduced in this slice.

## 7) Unknowns / Open Questions
- Historical break-stage unknowns were recorded here and are now resolved in `03-analyze.md` and `questions.md`.
- The first bounded `action_contract` is emitted from the existing `route-result` for `P1 / Minor Change`.
- Contract definition placement now follows the accepted Phase-4 placement rule: the Entry selects/loads/emits the contract, while the contract definition itself lives outside the Entry.

## 8) Success Criteria (high level)
- The break defines one bounded BMAD feature slice for executable `P1 / Minor Change` downstream continuation.
- Scope and non-scope are explicit enough to support the next BMAD planning artifacts without reopening routing or governance questions.
- The slice remains strictly limited to `P1` continuation behavior and does not broaden into `P2`, `P3`, branch automation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.
- Genuine unresolved issues are captured explicitly in `questions.md` rather than guessed.
