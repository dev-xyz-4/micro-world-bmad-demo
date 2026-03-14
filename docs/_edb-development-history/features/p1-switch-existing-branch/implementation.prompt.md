Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-switch-existing-branch (first bounded switch-existing slice after completed executor-side `P1 / Minor Change` branch-state hardening and first bounded create-and-switch-from-main behavior).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-switch-existing-branch/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- bounded switch-existing behavior after the completed `request_branch_change` path
- one explicit target branch name as input
- switch to an already-existing non-`main` branch from blocked `main` only
- explicit hard-stop behavior on unsupported or unsafe switch-existing paths

Do not implement:
- voluntary switch-existing behavior from an already-safe non-`main` branch
- redesign of the completed create-and-switch-from-main baseline
- target-resolution redesign
- template-aware generation
- generalized Git workflow orchestration

Problem:
- The current Phase-4 baseline now hard-stops unsafe repo-tracked executor-side `P1 / Minor Change` writes on `main` and can create-and-switch to a new branch, but it still stops when the intended non-`main` target branch already exists.
- The next bounded slice must preserve the accepted placement rule by keeping switch-existing behavior outside the Entry and on the existing `P1` executor continuity path.
- The slice must stay limited to one explicit target branch name plus switch-existing from blocked `main`, without broadening into voluntary non-`main` branch switching, create-and-switch redesign, or generalized Git workflow automation.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded executor-side capability on top of the completed branch-state hardening and create-and-switch baselines
  - preserves existing routing semantics and executor placement while materially extending what the guarded `P1` path can do after `request_branch_change`
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Switch-existing activation and boundary
- Activate the first switch-existing slice only for the existing executor-side `P1 / Minor Change` path.
- Keep switch-existing behavior on the existing `P1` executor continuity surface.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement switch-existing behavior for `P2`, `P3`, `P4`, or `P5`.

B) Switch input and eligibility
- Consume one explicit target branch name.
- Start switch-existing only after the completed hardening baseline reaches the bounded `request_branch_change` path.
- Restrict the first switch-existing slice to the blocked `main` path.

C) Switch behavior and result handling
- Support only the narrow switch-existing path needed to leave blocked `main` for an already-existing non-`main` branch.
- Do not implement voluntary switch-existing behavior from an already-safe non-`main` branch.
- Stop if target branch name is missing, malformed, unsupported, missing in the repo, unsafe, or if switching fails.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) extend `scripts/quality/p1-minor-change-executor.mjs` with a bounded switch-existing entry path after the completed hardening result `request_branch_change`
2) accept and validate one explicit target branch name as switch-existing input
3) restrict eligibility to the blocked `main` path only
4) implement bounded validation that the requested target branch already exists and resolves to a safe non-`main` branch, then switch to that branch
5) extend smoke validation for the switch-existing layer without broadening into voluntary non-`main` switching or unrelated Git workflow behavior

E) Lifecycle and boundary guards
- Keep the first switch-existing slice process-local and bounded.
- Do not move switch-existing behavior into the Entry.
- Do not introduce generalized Git workflow coordination, hidden fallback behavior, or target-resolution redesign.

F) Error handling and recovery
- Stop if the current path is not eligible for this first switch-existing slice.
- Stop if the target branch name is missing, malformed, or unsupported.
- Stop if the target branch does not exist.
- Stop if the target branch resolves to `main` or another unsafe branch context.
- Stop if branch switching fails.
- Stop rather than guess or silently fall back to broader branch-management behavior.

G) State / persistence limits
- No persistence layer is introduced for this switch-existing slice.
- No background behavior or async orchestration.
- No generalized branch-management API beyond the bounded switch-existing path.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.
- Do not remove the completed first executor-side `P1` write capability, the completed branch-state hardening baseline, or the completed create-and-switch-from-main baseline; only extend the guarded path with the first bounded switch-existing capability.

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
- docs/_edb-development-history/features/p1-switch-existing-branch/01-break.md
- docs/_edb-development-history/features/p1-switch-existing-branch/02-model.md
- docs/_edb-development-history/features/p1-switch-existing-branch/03-analyze.md
- docs/_edb-development-history/features/p1-switch-existing-branch/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- switch-existing starts only after the completed hardening path reaches `request_branch_change`
- one explicit target branch name is required
- on blocked `main`, switching to an already-existing non-`main` target branch succeeds when the bounded path is valid
- if the requested target branch does not exist, the first slice stops
- if the requested target branch resolves to `main` or unsafe context, the first slice stops
- if branch switching fails, the first slice stops
- requests requiring voluntary non-`main` switch-existing behavior stop
- existing non-`P1` stop/rejection behavior remains intact
- existing branch-state hardening behavior remains intact
- existing create-and-switch-from-main behavior remains intact

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-switch-existing-branch/questions.md

Proceed step-by-step.
Do not widen scope.
