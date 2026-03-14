Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-non-main-switch-existing-branch (first bounded safe non-`main` switch-existing slice after completed executor-side `P1 / Minor Change` branch-state hardening, create-and-switch-from-main, blocked-`main` switch-existing, and safe non-`main` additional-new-branch behavior).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-non-main-switch-existing-branch/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- bounded safe non-`main` switch-existing behavior on the existing `P1` executor continuity path
- preservation of the completed `continue_on_current_branch` path on safe non-`main`
- preservation of the completed safe non-`main` additional-new-branch path
- one explicit target branch name for one additive switch-existing path from an already-safe non-`main` branch
- explicit hard-stop behavior on unsupported or unsafe safe non-`main` switch-existing paths

Do not implement:
- blocked-`main` redesign
- safe non-`main` create-and-switch redesign
- unified three-option branch-choice-envelope redesign
- target-resolution redesign
- template-aware generation
- generalized Git workflow orchestration

Problem:
- The current Phase-4 baseline supports bounded continuation on the current safe non-`main` branch and bounded create-and-switch to one additional new branch from that same safe non-`main` context, but it still lacks one bounded way to switch to one already-existing safe non-`main` branch from that context.
- The next bounded slice must preserve the accepted placement rule by keeping this safe non-`main` switch-existing behavior outside the Entry and on the existing `P1` executor continuity path.
- The slice must stay limited to preserving the completed safe non-`main` paths and adding one additive switch-existing path, without broadening into blocked-`main` redesign, safe non-`main` create-and-switch redesign, or generalized Git workflow automation.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded executor-side capability on top of the completed hardening, create-and-switch-from-main, blocked-`main` switch-existing, and safe non-`main` additional-new-branch baselines
  - preserves existing routing semantics and executor placement while materially extending what the guarded `P1` path can do from an already-safe non-`main` branch
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Safe non-`main` switch-existing activation and boundary
- Activate the first safe non-`main` switch-existing slice only for the existing executor-side `P1 / Minor Change` path.
- Keep safe non-`main` switch-existing behavior on the existing `P1` executor continuity surface.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement branch behavior for `P2`, `P3`, `P4`, or `P5`.

B) Switch input and eligibility
- Preserve `continue_on_current_branch` on safe non-`main` exactly as-is.
- Preserve the completed safe non-`main` additional-new-branch path exactly as-is.
- Consume one explicit target branch name for the bounded safe non-`main` switch-existing path.
- Restrict the safe non-`main` switch-existing path to the already-safe non-`main` branch context.

C) Switch behavior and result handling
- Support only one additive new path beyond the current safe non-`main` baseline:
  - switch to one already-existing safe non-`main` branch from the current safe non-`main` branch
- Do not redesign the existing `continue_on_current_branch` path.
- Do not redesign the completed additional-new-branch path.
- Stop if target branch name is missing, malformed, unsupported, missing in the repo, unsafe, or if switching fails.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) extend `scripts/quality/p1-minor-change-executor.mjs` with a bounded safe non-`main` switch-existing entry path while preserving the completed `continue_on_current_branch` path and completed additional-new-branch path exactly as-is
2) accept and validate one explicit target branch name for that safe non-`main` switch-existing path using existing target-branch input handling
3) restrict eligibility for that switch-existing path to the already-safe non-`main` branch context
4) implement bounded validation that the requested target branch already exists and resolves to a safe non-`main` branch, then switch to that branch
5) extend smoke validation for the safe non-`main` switch-existing layer without broadening into blocked-`main` redesign, safe non-`main` create-and-switch redesign, or unrelated Git workflow behavior

E) Lifecycle and boundary guards
- Keep the first safe non-`main` switch-existing slice process-local and bounded.
- Do not move branch-choice behavior into the Entry.
- Do not introduce generalized Git workflow coordination, hidden fallback behavior, or target-resolution redesign.

F) Error handling and recovery
- Stop if the current path is not eligible for this first safe non-`main` switch-existing slice.
- Stop if the target branch name is missing, malformed, or unsupported.
- Stop if the target branch does not exist.
- Stop if the target branch resolves to `main` or another unsafe branch context.
- Stop if branch switching fails.
- Stop if switching appears to succeed but safe post-switch branch continuity is not established.
- Stop rather than guess or silently fall back to broader branch-management behavior.

G) State / persistence limits
- No persistence layer is introduced for this safe non-`main` switch-existing slice.
- No background behavior or async orchestration.
- No generalized branch-management API beyond the bounded safe non-`main` switch-existing path.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.
- Do not remove the completed first executor-side `P1` write capability, the completed branch-state hardening baseline, the completed create-and-switch-from-main baseline, the completed blocked-`main` switch-existing baseline, or the completed safe non-`main` additional-new-branch baseline; only extend the guarded path with the first bounded safe non-`main` switch-existing capability.

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
- docs/_edb-development-history/features/p1-non-main-switch-existing-branch/01-break.md
- docs/_edb-development-history/features/p1-non-main-switch-existing-branch/02-model.md
- docs/_edb-development-history/features/p1-non-main-switch-existing-branch/03-analyze.md
- docs/_edb-development-history/features/p1-non-main-switch-existing-branch/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- the safe non-`main` switch-existing path starts only after the executor is already on a safe non-`main` branch
- `continue_on_current_branch` on safe non-`main` remains unchanged
- the completed safe non-`main` additional-new-branch path remains unchanged
- one explicit target branch name is required for the safe non-`main` switch-existing path
- on safe non-`main`, switching to one already-existing safe non-`main` target branch succeeds when the bounded path is valid
- if the requested target branch does not exist, the first slice stops
- if the requested target branch resolves to `main` or unsafe context, the first slice stops
- if branch switching fails, the first slice stops
- existing non-`P1` stop/rejection behavior remains intact
- existing branch-state hardening behavior remains intact
- existing create-and-switch-from-main behavior remains intact
- existing blocked-`main` switch-existing behavior remains intact
- existing safe non-`main` additional-new-branch behavior remains intact

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-non-main-switch-existing-branch/questions.md

Proceed step-by-step.
Do not widen scope.
