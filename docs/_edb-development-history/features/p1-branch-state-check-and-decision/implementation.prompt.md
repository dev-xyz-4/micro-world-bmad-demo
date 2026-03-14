Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- p1-branch-state-check-and-decision (first bounded branch-hardening slice before repo-tracked executor-side `P1 / Minor Change` writes).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/p1-branch-state-check-and-decision/04-deliver.md

Do not implement behavior outside that document.
This first slice implements:
- real Git branch-state detection before repo-tracked executor-side `P1 / Minor Change` writes continue
- bounded branch-state classification for `main`, non-`main`, and unknown states
- bounded branch-dependent decision logic on the existing path-specific executor surface
- explicit hard-stop behavior on unsafe or unknown states

Do not implement:
- actual branch creation automation
- actual branch switch automation
- target-resolution redesign
- template-aware generation
- generalized Git workflow orchestration

Problem:
- The current Phase-4 baseline already has a bounded executor-side `P1 / Minor Change` write path, but that path still relies on a confirmation-only branch gate rather than real Git branch-state detection.
- The next hardening slice must preserve the accepted placement rule by keeping branch-hardening behavior outside the Entry and on the existing path-specific executor surface.
- The slice must stay bounded to real branch-state detection plus branch-dependent decision logic without broadening into actual branch mutation, generalized Git orchestration, or target-resolution redesign.

SemVer Decision (capture):
- SemVer Decision: `SemVer MINOR`
- Rationale:
  - introduces one new bounded safety capability on top of the completed first executor-side `P1` write baseline
  - preserves existing routing semantics and executor placement while materially changing how repo-tracked `P1` writes are gated
- Planned tag: `N/A`

Expected behavior (from deliver contract):

A) Branch-hardening activation and boundary
- Activate the first hardening slice only for the existing executor-side `P1 / Minor Change` path.
- Keep branch-hardening behavior on `scripts/quality/p1-minor-change-executor.mjs`.
- Keep execution outside `scripts/quality/orchestrator-entry.mjs`.
- Do not implement branch-hardening behavior for `P2`, `P3`, `P4`, or `P5`.

B) Branch-state detection and classification
- Detect real Git branch state before repo-tracked `P1` write continuation.
- Classify only:
  - `on_main`
  - `on_non_main_branch`
  - `branch_state_unknown`
- Stop on unknown branch state.

C) Decision and result behavior
- Support only the bounded decision/result shape:
  - `continue_on_current_branch`
  - `request_branch_change`
  - `stop`
- `continue_on_current_branch` is allowed only on non-`main`.
- `on_main` must not allow direct continue-on-current-branch.
- Do not execute actual branch creation/switch in this slice.

D) Implementation sequence (exact ordering)
Implement EXACT ordering:
1) extend `scripts/quality/p1-minor-change-executor.mjs` with real Git branch-state detection before repo-tracked write continuation
2) implement bounded classification into `on_main`, `on_non_main_branch`, and `branch_state_unknown`
3) implement bounded branch-dependent decision logic and result mapping
4) implement hard-stop behavior for `on_main` without `request_branch_change` and for `branch_state_unknown`
5) extend smoke validation for the new hardening layer without broadening into unrelated executor behavior

E) Lifecycle and boundary guards
- Keep the first hardening slice process-local and bounded.
- Do not move branch-hardening behavior back into the Entry.
- Do not introduce actual branch mutation, generalized Git workflow coordination, or target-resolution redesign.

F) Error handling and recovery
- Stop if real Git branch state cannot be determined safely.
- Stop if the bounded operator decision shape is malformed or unsupported.
- Stop rather than guess when branch state or branch decision intent is unclear.
- Keep existing non-`P1 / Minor Change` stop/rejection behavior intact.

G) State / persistence limits
- No persistence layer is introduced for this hardening slice.
- No background behavior or async orchestration.
- No generalized executor-state machine beyond the bounded branch decision/result model.

H) Non-Regression Guarantees
- Do NOT modify:
  - docs/bmad/guides/CODEX_ENTRY.md
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
  - AGENTS.md
- Do not change existing `P1 / P2 / P3` routing semantics or the completed `P1` contract-emission behavior.
- Do not remove the completed first executor-side `P1` write capability; only harden its branch gate behavior.

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
- docs/_edb-development-history/features/p1-branch-state-check-and-decision/01-break.md
- docs/_edb-development-history/features/p1-branch-state-check-and-decision/02-model.md
- docs/_edb-development-history/features/p1-branch-state-check-and-decision/03-analyze.md
- docs/_edb-development-history/features/p1-branch-state-check-and-decision/04-deliver.md
- .planning/

Validation checks:
- node scripts/quality/tests/orchestrator-entry.smoke.mjs
- git diff --check

Functional validation matrix:
- real Git branch-state detection runs before repo-tracked `P1 / Minor Change` write continuation
- `on_main` does not allow direct continue-on-current-branch
- `on_non_main_branch` allows bounded continue on current branch
- `branch_state_unknown` stops
- malformed or unsupported decision shapes stop
- no actual branch creation/switch execution is introduced
- existing non-`P1` stop/rejection behavior remains intact

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/p1-branch-state-check-and-decision/questions.md

Proceed step-by-step.
Do not widen scope.
