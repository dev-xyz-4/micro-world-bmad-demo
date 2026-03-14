Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-executor-minimal-write (first bounded executor-side `P1 / Minor Change` minimal write slice).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-executor-minimal-write/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- one dedicated path-specific executor surface outside the Entry
- executor-side validation of the emitted `P1 / Minor Change` contract packet
- a mandatory branch gate
- one simple docs-only markdown write using the contract's resolved `target_path_hint`

Do not implement:
- template-aware generation
- multi-file writes
- review automation
- generalized executor behavior

Problem:
- The current Phase-4 baseline can emit a bounded `P1 / Minor Change` `action_contract`, but there is still no executor-side capability that can consume that contract and perform one real docs-only repo-tracked write safely.
- The first executor slice must preserve the accepted placement rule by keeping execution outside the Entry and outside the contract-definition surface.
- The slice must stay bounded to mandatory branch-confirmed execution plus one simple docs-only write, without broadening into template expansion or generalized continuation-engine behavior.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded executor capability after the completed `P1` contract-emission baseline
  - preserves existing routing semantics and keeps execution outside the Entry while adding one minimal real write path
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Executor activation and boundary
- Activate the first executor slice only for valid emitted `route-result + P1 + Minor Change + p1_docs_only_minor_change`.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement executor behavior for `P2`, `P3`, `P4`, or `P5`.

B) Executor placement and target use
- Define the first bounded executor in `scripts/quality/p1-minor-change-executor.mjs`.
- Keep the Entry untouched except for using the already-emitted contract as input to later execution.
- Use the contract's resolved `target_path_hint` directly for the first bounded write proof.

C) Branch gate and result behavior
- Require branch-confirmed execution before any repo-tracked write.
- Support only `yes` / `no` for the branch gate.
- Return only `completed` or `stopped`.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) add `scripts/quality/p1-minor-change-executor.mjs`
2) implement bounded executor-input validation for valid emitted `P1 / Minor Change` packets
3) implement the mandatory branch gate with `yes` / `no` only
4) implement bounded write-target resolution directly from `action_contract.target_resolution.target_path_hint`
5) implement one simple docs-only markdown write and bounded executor result emission

E) Lifecycle and boundary guards
- Keep the first slice process-local and bounded.
- Do not move execution back into the Entry.
- Do not introduce template expansion, grouped executor registries, or generalized continuation-engine behavior.

F) Error handling and recovery
- Reject or stop on any non-`P1 / Minor Change` executor input.
- Stop if the `action_contract` is missing or malformed.
- Stop if branch confirmation is `no`.
- Stop if the write target cannot remain inside docs-only surfaces.

G) State / persistence limits
- No persistence layer beyond the intended bounded docs write.
- No background behavior or async orchestration.
- No partial-completion state; only `completed` or `stopped`.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.

Policy references:
- Workflow governance and implementation constraints:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Versioning and SemVer ownership:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Targets (only these files may change):
- scripts/quality/p1-minor-change-executor.mjs
- scripts/quality/tests/orchestrator-entry.smoke.mjs

Non-targets:
- docs/bmad/guides/CODEX_ENTRY.md
- docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- AGENTS.md
- scripts/quality/orchestrator-entry.mjs
- scripts/quality/p1-minor-change-contract.mjs
- scripts/quality/flow-contract-starter.mjs
- docs/_edb-development-history/features/p1-executor-minimal-write/01-break.md
- docs/_edb-development-history/features/p1-executor-minimal-write/02-model.md
- docs/_edb-development-history/features/p1-executor-minimal-write/03-analyze.md
- docs/_edb-development-history/features/p1-executor-minimal-write/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- a valid emitted `P1 / Minor Change` contract packet can be accepted by the executor surface
- `branchConfirmation = no` stops without writing
- `branchConfirmation = yes` allows one bounded docs-only write
- the write target is taken from the contract's resolved `target_path_hint`
- the executor returns only `completed` or `stopped`
- no template-aware generation, multi-file write, or generalized executor behavior is introduced

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-executor-minimal-write/questions.md

Proceed step-by-step.
Do not widen scope.
