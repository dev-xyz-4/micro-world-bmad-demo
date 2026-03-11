# Deliver Spec — orchestrator-entry-mvp

## 0) Status
- Owner: current operator
- Created: 2026-03-11
- Last updated: 2026-03-11
- Related docs:
  - Break: `docs/_edb-development-history/features/orchestrator-entry-mvp/01-break.md`
  - Model: `docs/_edb-development-history/features/orchestrator-entry-mvp/02-model.md`
  - Analyze: `docs/_edb-development-history/features/orchestrator-entry-mvp/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Implement the first bounded Orchestrator Entry MVP code slice as a CLI-first deterministic routing surface that:
- accepts raw free-text goal intake,
- runs a bounded clarify loop (maximum 2 prompts),
- resolves internal primary-path subset `P1 / P2 / P3`,
- assigns visible workflow family `Minor Change` or `BMAD Feature`,
- emits deterministic next-step direction output only,
- returns explicit STOP/Clarify output when ambiguity remains after the bounded clarify limit.

### Non-Goals (explicitly out of scope)
- UI/Vite entry surface.
- Support for primary paths outside `P1 / P2 / P3`.
- New workflow families beyond `Minor Change` and `BMAD Feature`.
- Any second routing owner or policy owner.
- Governance or workflow-policy rewrites.
- Replacing the existing governed Git-/PR execution path.
- Expanding `scripts/quality/flow-contract-starter.mjs` into routing ownership.
- Direct PR/merge execution behavior.

### Constraints
- Tech:
- Entry behavior must remain routing-centered and emit next-step direction only.
- Clarify loop is deterministic and bounded to at most 2 prompts.
- Supported steady-state outcomes are limited to:
  - (`P1`, `Minor Change`)
  - (`P1`, `BMAD Feature`)
  - (`P2`, `Minor Change`)
  - (`P3`, `BMAD Feature`)
- (`P2`, `BMAD Feature`) is invalid in steady state and must be reclassified to (`P3`, `BMAD Feature`) before final result emission.
- `scripts/quality/flow-contract-starter.mjs` remains a low-level primitive behind the (`P3`, `BMAD Feature`) branch only; it is not the Entry and not a routing owner.
- Routing ownership remains in `docs/bmad/guides/CODEX_ENTRY.md`; behavior ownership remains in `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.
- Perf:
- Keep first slice small, deterministic, and single-surface to reduce complexity.
- UX:
- CLI-first output must be explicit and operator-readable for continuation without guesswork.
- Backward compatibility:
- Preserve existing behavior outside this new Entry surface.
- Security/Privacy (if relevant):
- No external service dependency is required for correct v1 routing behavior.

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
- Build one standalone CLI entry script that performs: `goal -> bounded clarify -> primary_path -> workflow_route -> output`.
- Accept raw free-text goal input.
- Maintain explicit separation between internal `primary_path` and visible `workflow_route`.
- Emit one of two result classes only:
  - `route-result` for resolved continuation.
  - `stop-result` for bounded ambiguity handoff.
- Include explicit next-step direction text per supported steady-state outcome pair.
- For (`P3`, `BMAD Feature`), next-step direction may reference `scripts/quality/flow-contract-starter.mjs` as downstream primitive usage, without turning it into routing owner.
- Out-of-scope notes:
- No UI surface.
- No helper redesign.
- No route/policy ownership duplication.
- No broad architecture expansion.
- Missing-information handling notes (reference `questions.md`):
- If a new ambiguity appears that would require new path families, new workflow families, or authority-boundary changes, stop and record it in `docs/_edb-development-history/features/orchestrator-entry-mvp/questions.md` before implementation continues.
- For this deliver-drafting step, version classification is `no SemVer change`.

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## 3) Target Files / Folders
List exact paths. No placeholders.

- `scripts/quality/orchestrator-entry.mjs` (new; bounded first implementation surface)
- `scripts/quality/flow-contract-starter.mjs` (read-only dependency surface; no ownership change)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- CLI entrypoint:
- `node scripts/quality/orchestrator-entry.mjs --goal "<raw free-text goal>" [--clarify-response "<value>"]...`
- Optional deterministic input mode for tests/non-interactive use:
- `--clarify-response` repeatable argument for supplying bounded clarify answers.

### Inputs / Outputs
- Inputs:
  - Required raw goal text (`--goal`).
  - Optional bounded clarify responses (0..2) via repeatable `--clarify-response`.
- Outputs:
  - `route-result` output containing:
    - resolved `primary_path`
    - resolved `workflow_route`
    - deterministic next-step direction
    - explicit steady-state normalization note when (`P2`, `BMAD Feature`) was reclassified to `P3`
  - `stop-result` output containing:
    - explicit unresolved ambiguity
    - clarify-attempt count
    - `clarify_packet` with:
      - trigger
      - missing/conflicting input
      - 1–3 valid options
      - recommendation
      - next action / decider
      - blocker pointer if applicable
    - deterministic next action

### Error behavior
- Missing/invalid required input returns non-zero exit with explicit usage/error.
- Clarify attempts beyond 2 are rejected.
- Unsupported or invalid routing pair emission returns non-zero exit unless normalized to supported steady state.
- If ambiguity remains unresolved after 2 clarify prompts, emit `stop-result` and exit non-zero.

---

## 5) Data Model / State (if any)
- Entities:
- Goal input, bounded clarify state, routing decision, clarify packet, route-result packet, stop-result packet.
- Persistence (if any):
- None required for v1 first slice.
- Invariants (target-state constraints):
- Clarify loop count never exceeds 2.
- `primary_path` and `workflow_route` remain separate fields.
- Supported emitted steady-state outcomes are only:
  - (`P1`, `Minor Change`)
  - (`P1`, `BMAD Feature`)
  - (`P2`, `Minor Change`)
  - (`P3`, `BMAD Feature`)
- (`P2`, `BMAD Feature`) is not emitted as steady-state; it must be normalized to (`P3`, `BMAD Feature`).
- Entry script never becomes routing owner or policy owner.
- Edge cases:
- Ambiguous goals that remain unresolved after bounded clarify.
- Goals that suggest unsupported path families (`P0`, `P4`, `P5`) for this v1 slice.
- Conflicting signals that imply invalid steady-state pair before normalization.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Create `scripts/quality/orchestrator-entry.mjs` as a standalone Node CLI entry surface for raw goal intake and deterministic routing output.
2. Implement bounded clarify and routing logic:
   - max 2 clarify prompts,
   - internal path resolution constrained to `P1/P2/P3`,
   - visible workflow assignment constrained to `Minor Change`/`BMAD Feature`,
   - invalid (`P2`, `BMAD Feature`) normalization to (`P3`, `BMAD Feature`),
   - explicit STOP/Clarify when unresolved after 2 prompts.
3. Implement deterministic output behavior and verify:
   - route-result output for each supported steady-state pair,
   - stop-result output for unresolved ambiguity,
   - explicit next-step direction that preserves existing governed Git-/PR execution path.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- CLI rejects missing required goal input with explicit error/usage.
- Clarify loop is bounded to 2 prompts and emits `stop-result` on unresolved ambiguity after bound.
- `stop-result` carries a structured `clarify_packet` containing: trigger, missing/conflicting input, 1–3 valid options, recommendation, next action / decider, and blocker pointer if applicable.
- Supported steady-state outputs are validated for:
  - (`P1`, `Minor Change`)
  - (`P1`, `BMAD Feature`)
  - (`P2`, `Minor Change`)
  - (`P3`, `BMAD Feature`)
- Invalid (`P2`, `BMAD Feature`) case is normalized to (`P3`, `BMAD Feature`) before final emission.
- `scripts/quality/flow-contract-starter.mjs` remains unmodified and referenced only as downstream primitive for (`P3`, `BMAD Feature`) direction.
- `git diff --check` passes.

### Optional checks
- Deterministic repeatability check: same inputs produce same route-result/stop-result.
- Manual operator readability check for next-step direction text.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] A new CLI entry surface exists at `scripts/quality/orchestrator-entry.mjs` and performs raw goal intake with deterministic routing behavior.
- [ ] Clarify behavior is bounded to at most 2 prompts; unresolved ambiguity after bound emits explicit STOP/Clarify output.
- [ ] STOP/Clarify output includes a structured `clarify_packet` with trigger, missing/conflicting input, 1–3 valid options, recommendation, next action / decider, and blocker pointer if applicable.
- [ ] Output preserves path/route separation and supports only the steady-state outcome pairs defined in scope.
- [ ] (`P2`, `BMAD Feature`) is never emitted as steady state and is reclassified to (`P3`, `BMAD Feature`) before output.
- [ ] Entry output remains next-step direction only and does not replace the existing governed Git-/PR execution path.
- [ ] `scripts/quality/flow-contract-starter.mjs` remains a low-level primitive behind (`P3`, `BMAD Feature`) and does not become routing owner.
- [ ] No governance/policy/routing-owner documents are changed to implement this slice.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
- Not required for the bounded first CLI slice.
- Migration steps:
- None required; additive entry surface only.
- Revert steps:
- Remove `scripts/quality/orchestrator-entry.mjs` and revert related invocation/documentation changes if acceptance criteria are not met.
