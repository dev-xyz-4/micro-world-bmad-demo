# Model — orchestrator-entry-mvp

## 1) System Overview (2–5 bullets)
- MVP contract is a bounded CLI-first orchestration surface: `goal -> bounded clarify -> primary_path -> workflow_route -> output`.
- Raw goal intake is free-text input only; v1 supports internal primary-path resolution subset `P1 / P2 / P3`.
- Visible workflow-family assignment is a separate layer from internal path resolution: `Minor Change` or `BMAD Feature`.
- Clarify behavior is deterministic and bounded to at most 2 prompts; unresolved ambiguity after that must return explicit STOP/Clarify.
- `scripts/quality/flow-contract-starter.mjs` is treated as a low-level primitive behind the (`P3`, `BMAD Feature`) branch, not as routing owner and not as the Entry itself.

## 2) Key Concepts / Terms
- `Goal Input`: raw free-text user goal provided to the Entry.
- `Bounded Clarify Loop`: short deterministic clarification cycle with maximum 2 prompts before forced STOP/Clarify.
- `Primary Path (internal)`: orchestration routing decision for v1 subset (`P1`, `P2`, `P3`).
- `Workflow Route (visible)`: workflow-family assignment shown to operator (`Minor Change`, `BMAD Feature`).
- `Outcome Pair`: deterministic result keyed by (`primary_path`, `workflow_route`).
- `Route Result`: minimal success packet for deterministic continuation.
- `Stop Result`: minimal ambiguity packet that explains why continuation cannot proceed without human clarification.
- `Clarify Packet`: minimal structured prompt payload used during bounded clarify.
- `SemVer Note`: this modeling step is documentation-only and records `no SemVer change`.

## 3) Data Structures
- Name: EntryInput
  - Fields:
  - `goal_text` (raw free-text goal)
  - `context_hints` (optional bounded hints supplied by operator)
  - Meaning:
  - Minimal input contract for deterministic v1 intake.
  - Invariants:
  - `goal_text` must be non-empty.
  - Input is interpreted without introducing new workflow families, new primary paths, or new authority owners.
- Name: ClarifyState
  - Fields:
  - `clarify_count` (0..2)
  - `open_ambiguities` (remaining unresolved routing ambiguities)
  - `last_clarify_packet` (last prompt/response bundle)
  - Meaning:
  - Tracks bounded clarify progress and stop threshold.
  - Invariants:
  - `clarify_count` never exceeds 2.
  - If ambiguities remain when `clarify_count` reaches 2, transition must be STOP/Clarify.
- Name: ClarifyPacket
  - Fields:
  - `trigger` (what caused STOP / Clarify)
  - `missing_or_conflicting` (explicit missing/conflicting input or decision)
  - `valid_options` (1..3 valid routing options)
  - `recommendation` (recommended next choice)
  - `next_action_or_decider` (who must decide / what happens next)
  - `blocker_pointer` (optional pointer if blocker tracking exists)
  - Meaning:
  - Minimal structured clarification payload used when bounded clarify cannot safely continue without human input.
  - Invariants:
  - Must not invent new workflow families, new primary paths, or new authority owners.
  - Must provide a resolution path rather than a generic stop only.
- Name: RoutingDecision
  - Fields:
  - `primary_path` (`P1` | `P2` | `P3`)
  - `workflow_route` (`Minor Change` | `BMAD Feature`)
  - `decision_basis` (short rationale trace)
  - Meaning:
  - Internal routing decision separated from visible workflow-family assignment.
  - Invariants:
  - (`P2`, `BMAD Feature`) is invalid in steady state and must be reclassified to (`P3`, `BMAD Feature`) before output.
  - No routing ownership is created outside `docs/bmad/guides/CODEX_ENTRY.md`.
- Name: RouteResult
  - Fields:
  - `result_type` (`route`)
  - `primary_path`
  - `workflow_route`
  - `next_direction` (conceptual next artifact/prompt/output direction)
  - `continuation_requirements` (minimum explicit next-step constraints)
  - Meaning:
  - Minimal deterministic continuation payload when routing is resolved.
  - Invariants:
  - `next_direction` must map to one supported steady-state outcome pair only.
- Name: StopResult
  - Fields:
  - `result_type` (`stop_clarify`)
  - `stop_reason` (explicit ambiguity reason)
  - `required_human_clarification` (specific missing decision)
  - `observed_state` (`goal`, clarify attempts, unresolved ambiguity)
  - `clarify_packet` (`ClarifyPacket`)
  - Meaning:
  - Minimal deterministic stop payload when bounded clarify cannot safely resolve.
  - Invariants:
  - Must not guess missing requirements.
  - Must not imply implementation authorization.

## 4) State Machine (if applicable)
### States
- `intake_received`
- `clarify_active`
- `routing_resolved`
- `stop_clarify`
- `outcome_emitted`
### Transitions
- `intake_received` -> `clarify_active`: goal has ambiguity affecting path/route selection.
- `intake_received` -> `routing_resolved`: goal has enough signal for deterministic v1 routing.
- `clarify_active` -> `clarify_active`: ambiguity remains and `clarify_count < 2`.
- `clarify_active` -> `routing_resolved`: clarify response resolves ambiguity within 2-prompt bound.
- `clarify_active` -> `stop_clarify`: ambiguity remains after second clarify prompt.
- `routing_resolved` -> `routing_resolved`: invalid (`P2`, `BMAD Feature`) pair detected and normalized to (`P3`, `BMAD Feature`).
- `routing_resolved` -> `outcome_emitted`: supported steady-state outcome pair is emitted with next direction.

## 5) Algorithms / Rules (if applicable)
- Rule: Bounded clarify loop
  - Inputs:
  - `EntryInput`, current `ClarifyState`
  - Output:
  - Updated `ClarifyState` or `StopResult`
  - Notes:
  - At most 2 clarify prompts are allowed.
  - On unresolved ambiguity after prompt 2, emit `StopResult` and halt continuation.
- Rule: Internal path + visible workflow decision
  - Inputs:
  - Clarified goal interpretation
  - Output:
  - `RoutingDecision`
  - Notes:
  - Internal Primary Path subset is limited to `P1`, `P2`, `P3`.
  - Visible workflow-family assignment remains `Minor Change` or `BMAD Feature`.
  - Layers must stay separate and must not be collapsed into one label.
- Rule: Steady-state outcome normalization
  - Inputs:
  - `RoutingDecision`
  - Output:
  - Normalized outcome pair for emission
  - Notes:
  - Supported emitted pairs:
  - (`P1`, `Minor Change`) -> docs-only / Minor Change next-step direction.
  - (`P1`, `BMAD Feature`) -> BMAD docs-planning next-step direction at mode-aware feature root.
  - (`P2`, `Minor Change`) -> bounded small-code-change / Minor Change next-step direction.
  - (`P3`, `BMAD Feature`) -> BMAD feature next-step direction; `flow-contract-starter.mjs` may be used as low-level primitive behind this branch.
  - (`P2`, `BMAD Feature`) is not emitted; it must be reclassified to (`P3`, `BMAD Feature`).
- Rule: Result packet emission
  - Inputs:
  - Normalized outcome pair or unresolved ambiguity state
  - Output:
  - `RouteResult` or `StopResult`
  - Notes:
  - Emitted payload must provide deterministic continuation without introducing policy/routing owner duplication.
  - When the emitted result is `StopResult`, it must carry a `ClarifyPacket` with: trigger, missing/conflicting input, 1–3 valid options, recommendation, next action / decider, and blocker pointer if applicable.

## 6) Failure Modes / Edge Cases
- Raw goal remains materially ambiguous after two clarify prompts -> mandatory `stop_clarify`.
- Attempt to collapse workflow-family labels into primary-path labels -> reject and stop for clarification.
- Attempt to emit unsupported steady-state pair (`P2`, `BMAD Feature`) without reclassification -> invalid; normalize to (`P3`, `BMAD Feature`) first.
- Treating `flow-contract-starter.mjs` as routing owner or as Entry surface -> boundary violation.
- Any proposed expansion to UI/Vite or `P0/P4/P5` within v1 model -> out of scope and stop.

## 7) Observability (optional)
- Logs:
- Deterministic decision trace fields: intake received, clarify count, unresolved ambiguity reason, chosen (`primary_path`, `workflow_route`), emitted result type (`route` or `stop_clarify`).
- Metrics:
- Clarify prompt count distribution (0, 1, 2), stop rate due to unresolved ambiguity after 2 prompts, outcome-pair distribution across supported steady-state results.
