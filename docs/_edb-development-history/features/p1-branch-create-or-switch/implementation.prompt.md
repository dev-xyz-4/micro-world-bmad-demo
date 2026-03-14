Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-branch-create-or-switch (first bounded branch-mutation slice after completed executor-side `P1 / Minor Change` branch-state hardening).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-branch-create-or-switch/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- bounded branch-mutation behavior after the completed `request_branch_change` path
- one explicit target branch name as input
- create-and-switch from `main` only
- explicit hard-stop behavior on unsupported or unsafe mutation paths

Do not implement:
- switching to an already-existing branch
- voluntary branch mutation from an already-safe non-`main` branch
- target-resolution redesign
- template-aware generation
- generalized Git workflow orchestration

Problem:
- The current Phase-4 baseline now hard-stops unsafe repo-tracked executor-side `P1 / Minor Change` writes on `main`, but the bounded flow still stops at `request_branch_change` without any actual branch-mutation execution.
- The next bounded slice must preserve the accepted placement rule by keeping branch-mutation behavior outside the Entry and on the existing `P1` executor continuity path.
- The slice must stay limited to one explicit target branch name plus create-and-switch from `main`, without broadening into switch-existing behavior, richer branch-intent protocols, or generalized Git workflow automation.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded executor-side capability on top of the completed branch-state hardening baseline
  - preserves existing routing semantics and executor placement while materially extending what the guarded `P1` path can do after `request_branch_change`
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Branch-mutation activation and boundary
- Activate the first mutation slice only for the existing executor-side `P1 / Minor Change` path.
- Keep branch-mutation behavior on the existing `P1` executor continuity surface.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement mutation behavior for `P2`, `P3`, `P4`, or `P5`.

B) Mutation input and eligibility
- Consume one explicit target branch name.
- Start mutation only after the completed hardening baseline reaches the bounded `request_branch_change` path.
- Restrict the first mutation slice to the blocked `main` path.

C) Mutation behavior and result handling
- Support only the narrow create-and-switch path needed to leave `main`.
- Do not implement switch-to-existing behavior.
- Stop if target branch name is missing, malformed, unsupported, already exists, or if mutation fails.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) extend `scripts/quality/p1-minor-change-executor.mjs` with a bounded branch-mutation entry path after the completed hardening result `request_branch_change`
2) accept and validate one explicit target branch name as mutation input
3) restrict eligibility to the blocked `main` path only
4) implement bounded branch creation for the requested target branch name and bounded switch to that newly created branch
5) extend smoke validation for the mutation layer without broadening into existing-branch switching or unrelated Git workflow behavior

E) Lifecycle and boundary guards
- Keep the first mutation slice process-local and bounded.
- Do not move branch-mutation behavior into the Entry.
- Do not introduce generalized Git workflow coordination, hidden fallback behavior, or target-resolution redesign.

F) Error handling and recovery
- Stop if the current path is not eligible for this first mutation slice.
- Stop if the target branch name is missing, malformed, or unsupported.
- Stop if the target branch already exists.
- Stop if branch creation fails.
- Stop if branch switching fails.
- Stop rather than guess or silently fall back to switch-existing behavior.

G) State / persistence limits
- No persistence layer is introduced for this mutation slice.
- No background behavior or async orchestration.
- No generalized branch-management API beyond the bounded mutation path.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.
- Do not remove the completed first executor-side `P1` write capability or the completed branch-state hardening baseline; only extend the guarded path with the first bounded branch-mutation capability.

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
- docs/_edb-development-history/features/p1-branch-create-or-switch/01-break.md
- docs/_edb-development-history/features/p1-branch-create-or-switch/02-model.md
- docs/_edb-development-history/features/p1-branch-create-or-switch/03-analyze.md
- docs/_edb-development-history/features/p1-branch-create-or-switch/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- branch mutation starts only after the completed hardening path reaches `request_branch_change`
- one explicit target branch name is required
- on blocked `main`, create-and-switch to a new target branch succeeds when the bounded path is valid
- if the requested target branch already exists, the first slice stops
- if branch creation fails, the first slice stops
- if branch switching fails, the first slice stops
- requests requiring switch-to-existing behavior stop
- existing non-`P1` stop/rejection behavior remains intact
- existing branch-state hardening behavior remains intact

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-branch-create-or-switch/questions.md

Proceed step-by-step.
Do not widen scope.
