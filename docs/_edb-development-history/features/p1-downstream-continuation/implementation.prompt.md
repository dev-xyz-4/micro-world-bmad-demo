Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-downstream-continuation (first bounded executable `P1 / Minor Change` downstream continuation slice).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-downstream-continuation/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- external `P1 / Minor Change` contract definition
- Entry-side contract selection/loading/emission

Do not implement:
- real docs-artifact creation
- real docs-artifact saving
- real docs-change execution

Problem:
- The current Orchestrator Entry MVP can resolve `P1 / Minor Change`, but it does not yet emit the first bounded downstream `action_contract` for that outcome under the accepted placement rule.
- The first executable continuation slice must preserve routing-first behavior while keeping the contract definition outside the Entry.
- The slice must stay docs-only, human-confirmed, and bounded to the existing three-gate model without introducing real downstream execution.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded continuation capability on the existing Entry surface
  - adds one external contract module while preserving existing routing semantics and behavior outside the scoped `P1 / Minor Change` continuation path
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) `P1 / Minor Change` continuation activation
- Activate the first continuation slice only for `route-result + P1 + Minor Change`.
- Emit the first bounded `action_contract` immediately inside the existing `route-result`.
- Do not emit this continuation packet for `P2`, `P3`, or `P1 / BMAD Feature`.

B) External contract placement
- Define the first bounded `P1 / Minor Change` contract in `scripts/quality/p1-minor-change-contract.mjs`.
- Keep the contract definition outside `scripts/quality/orchestrator-entry.mjs`.
- Have the Entry select/load that contract and emit it without redefining it inline.

C) Contract and gate behavior
- Preserve top-level route fields and place continuation detail inside `action_contract`.
- Include: `contract_type`, `execution_mode`, `target_resolution`, `required_inputs`, `constraints`, `steps`, `confirm_gates`, and `validation`.
- Preserve the three-gate model: `gate_save`, `gate_execute`, `gate_review` with `yes / no / cancel` only.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) add `scripts/quality/p1-minor-change-contract.mjs` with the bounded `P1 / Minor Change` contract definition
2) extend `scripts/quality/orchestrator-entry.mjs` only for the `P1 / Minor Change` path
3) have the existing `route-result` select/load and emit the external contract
4) ensure emitted contract content preserves the modeled step/state and three-gate semantics
5) add explicit completion/stop handling without hidden retry, fallback, or real downstream execution

E) Lifecycle and boundary guards
- The Entry remains routing-centered even after the bounded `P1` continuation packet is added.
- Do not define the `P1` contract inline inside the Entry.
- Do not introduce a second continuation CLI/surface for this first slice.
- Do not broaden into branch automation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.

F) Error handling and recovery
- Do not emit the `P1` continuation packet for any non-`P1 / Minor Change` route result.
- If the Entry cannot load/select the external `P1` contract correctly, stop rather than falling back to an inline contract definition.
- Reject invalid gate IDs or responses outside `yes / no / cancel`.
- If target resolution cannot remain inside docs-only surfaces, stop rather than guess.

G) State / persistence limits
- Keep the first slice process-local and bounded.
- Do not introduce persistence, cache, or background behavior.
- Keep `review_result` optional in this first slice.
- Keep continuation state declarative; execution remains later and external.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change `P1 / P2 / P3` routing semantics or add continuation behavior for other path/workflow combinations.

Policy references:
- Workflow governance and implementation constraints:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Versioning and SemVer ownership:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Targets (only these files may change):
- scripts/quality/orchestrator-entry.mjs
- scripts/quality/p1-minor-change-contract.mjs

Non-targets:
- docs/bmad/guides/CODEX_ENTRY.md
- docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- AGENTS.md
- scripts/quality/flow-contract-starter.mjs
- docs/_edb-development-history/features/p1-downstream-continuation/01-break.md
- docs/_edb-development-history/features/p1-downstream-continuation/02-model.md
- docs/_edb-development-history/features/p1-downstream-continuation/03-analyze.md
- docs/_edb-development-history/features/p1-downstream-continuation/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/orchestrator-entry.mjs --goal "draft a docs-only clarification update"
- git diff --check

Functional validation matrix:
- a `P1 / Minor Change` route result emits the first bounded `action_contract` immediately
- the emitted `P1` contract is selected/loaded from `scripts/quality/p1-minor-change-contract.mjs`
- non-`P1 / Minor Change` results do not emit this continuation packet
- emitted `action_contract` includes `target_resolution`, `required_inputs`, `constraints`, `steps`, `confirm_gates`, and `validation`
- `gate_save`, `gate_execute`, and `gate_review` preserve `yes / no / cancel` only
- no real docs-artifact creation, saving, or docs-change execution is introduced in this slice

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-downstream-continuation/questions.md

Proceed step-by-step.
Do not widen scope.
