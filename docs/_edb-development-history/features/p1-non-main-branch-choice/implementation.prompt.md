Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-non-main-branch-choice (first bounded non-main branch-choice slice after completed executor-side `P1 / Minor Change` branch-state hardening, create-and-switch-from-main, and switch-existing behavior).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-non-main-branch-choice/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- bounded non-`main` branch-choice behavior after the completed hardening and blocked-`main` follow-up paths
- preservation of the current `continue_on_current_branch` path on safe non-`main`
- one explicit target branch name only for one additional new-branch path from safe non-`main`
- explicit hard-stop behavior on unsupported or unsafe additional-new-branch paths

Do not implement:
- blocked-`main` redesign
- switch-existing redesign
- target-resolution redesign
- template-aware generation
- generalized Git workflow orchestration

Problem:
- The current Phase-4 baseline supports bounded continuation on the current safe non-`main` branch, but once execution is already on that safe branch it still does not offer one bounded option to open an additional new branch and continue there.
- The next bounded slice must preserve the accepted placement rule by keeping this non-`main` branch-choice behavior outside the Entry and on the existing `P1` executor continuity path.
- The slice must stay limited to preserving current-branch continuation plus one additional new-branch path from safe non-`main`, without broadening into blocked-`main` redesign, switch-existing redesign, or generalized Git workflow automation.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded executor-side capability on top of the completed branch-state hardening, create-and-switch, and switch-existing baselines
  - preserves existing routing semantics and executor placement while materially extending what the guarded `P1` path can do from an already-safe non-`main` branch
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Non-main branch-choice activation and boundary
- Activate the first non-`main` branch-choice slice only for the existing executor-side `P1 / Minor Change` path.
- Keep branch-choice behavior on the existing `P1` executor continuity surface.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement branch-choice behavior for `P2`, `P3`, `P4`, or `P5`.

B) Choice input and eligibility
- Preserve `continue_on_current_branch` on safe non-`main` exactly as-is.
- Consume one explicit target branch name only for the bounded additional-new-branch path.
- Restrict the additional-new-branch path to the already-safe non-`main` branch context.

C) Choice behavior and result handling
- Support only one additive new path beyond the current baseline:
  - create-and-switch to one additional new branch from the current safe non-`main` branch
- Do not redesign the existing `continue_on_current_branch` path.
- Stop if target branch name is missing, malformed, unsupported, already exists, or if branching fails.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) extend `scripts/quality/p1-minor-change-executor.mjs` with one bounded additional-new-branch path while preserving the completed `continue_on_current_branch` path on safe non-`main` exactly as-is
2) accept and validate one explicit target branch name only for that additional-new-branch path
3) restrict eligibility for that additional-new-branch path to the already-safe non-`main` branch context
4) implement bounded create-and-switch to one additional new branch from the current safe non-`main` branch
5) extend smoke validation for the non-`main` branch-choice layer without broadening into blocked-`main` redesign, switch-existing redesign, or unrelated Git workflow behavior

E) Lifecycle and boundary guards
- Keep the first non-`main` branch-choice slice process-local and bounded.
- Do not move branch-choice behavior into the Entry.
- Do not introduce generalized Git workflow coordination, hidden fallback behavior, or target-resolution redesign.

F) Error handling and recovery
- Stop if the current path is not eligible for this first non-`main` branch-choice slice.
- Stop if the target branch name is missing, malformed, or unsupported for the additional-new-branch path.
- Stop if the target branch already exists.
- Stop if branch creation fails.
- Stop if branch switching fails.
- Stop rather than guess or silently fall back to broader branch-management behavior.

G) State / persistence limits
- No persistence layer is introduced for this non-`main` branch-choice slice.
- No background behavior or async orchestration.
- No generalized branch-management API beyond the bounded additional-new-branch path.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.
- Do not remove the completed first executor-side `P1` write capability, the completed branch-state hardening baseline, the completed create-and-switch-from-main baseline, or the completed switch-existing baseline; only extend the guarded path with the first bounded non-`main` branch-choice capability.

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
- docs/_edb-development-history/features/p1-non-main-branch-choice/01-break.md
- docs/_edb-development-history/features/p1-non-main-branch-choice/02-model.md
- docs/_edb-development-history/features/p1-non-main-branch-choice/03-analyze.md
- docs/_edb-development-history/features/p1-non-main-branch-choice/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- the additional-new-branch path starts only after the executor is already on a safe non-`main` branch
- `continue_on_current_branch` on safe non-`main` remains unchanged
- one explicit target branch name is required only for the additional-new-branch path
- on safe non-`main`, create-and-switch to one additional new target branch succeeds when the bounded path is valid
- if the requested target branch already exists, the first slice stops
- if branch creation fails, the first slice stops
- if branch switching fails, the first slice stops
- existing non-`P1` stop/rejection behavior remains intact
- existing branch-state hardening behavior remains intact
- existing create-and-switch-from-main behavior remains intact
- existing switch-existing behavior remains intact

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-non-main-branch-choice/questions.md

Proceed step-by-step.
Do not widen scope.
