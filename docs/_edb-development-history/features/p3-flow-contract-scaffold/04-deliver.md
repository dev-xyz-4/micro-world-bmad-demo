# Deliver Spec — p3-flow-contract-scaffold

## 0) Status
- Owner: current operator
- Created: 2026-03-08
- Last updated: 2026-03-08
- Related docs:
  - Break: `docs/_edb-development-history/features/p3-flow-contract-scaffold/01-break.md`
  - Model: `docs/_edb-development-history/features/p3-flow-contract-scaffold/02-model.md`
  - Analyze: `docs/_edb-development-history/features/p3-flow-contract-scaffold/03-analyze.md`

---

## 1) Scope

### Goal (target outcome)
- Deliver the first controlled P3 slice as a **feature-local, path-aware starter / Flow-Contract scaffold** in EDB Mode.
- Encode Option B from `03-analyze.md`: feature-local contract artifacts plus **bounded continuity-link expectations** (reference-only, no new continuity surfaces).
- Make scope, non-scope, inputs, outputs, stop/clarify gates, and acceptance/evidence criteria explicit enough that governed execution does not require guesswork.

### Non-Goals (explicitly out of scope)
- Any implementation code change.
- Helper/tool redesign, new helper semantics, or silent helper-argument inference.
- Governance redesign, routing-owner duplication, or policy rewrites.
- Repo-wide reusable starter framework or automation surface.
- Requiring local `.planning` paths as repo-tracked artifact targets for this slice.

### Constraints
- Tech:
  - Feature-local default surface: `docs/_edb-development-history/features/p3-flow-contract-scaffold/`.
  - Mode-aware target ownership stays in `docs/bmad/guides/CODEX_ENTRY.md`.
  - Preserve Model-A execution boundary (no PR-stage automation expansion).
- Perf:
  - N/A (documentation-only slice).
- UX:
  - Keep the contract concise, explicit, and operational for the next governed step.
- Backward compatibility:
  - No behavior change outside this feature-local planning slice.
- Security/Privacy (if relevant):
  - N/A for this documentation-only slice.

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
  - Documentation-only completion of the first controlled-P3 starter/scaffold contract.
  - Explicit bounded continuity-link expectations (reference-only) when execution state changes require continuity alignment.
- Out-of-scope notes:
  - No code implementation or helper/policy/routing-owner updates.
  - No requirement to create/update repo-external or local-only continuity artifact targets.
- Missing-information handling notes (reference `questions.md`):
  - Treat `questions.md` "Resolved" and "Open / Blocking" as the active baseline.
  - Historical unchecked items under "Initial Questions (Historical State)" are historical trace, not active blockers.
  - Add to `questions.md` only if a genuinely new unresolved delivery blocker appears.

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

---

## 3) Target Files / Folders
List exact paths. No placeholders.

- `docs/_edb-development-history/features/p3-flow-contract-scaffold/01-break.md`
- `docs/_edb-development-history/features/p3-flow-contract-scaffold/02-model.md`
- `docs/_edb-development-history/features/p3-flow-contract-scaffold/03-analyze.md`
- `docs/_edb-development-history/features/p3-flow-contract-scaffold/04-deliver.md`
- `docs/_edb-development-history/features/p3-flow-contract-scaffold/questions.md` (only if new unresolved blockers are discovered)

---

## 4) Public API (if any)
Describe final API as it should exist after implementation.

### Exports / Signatures
- None (documentation-only slice).

### Inputs / Outputs
- Inputs:
  - feature slug/root, path classification, controlled-P3 constraints, mode-aware routing source, Model-A boundary constraints.
- Outputs:
  - explicit feature-local starter/scaffold deliver contract with bounded continuity-link expectations.

### Error behavior
- N/A.

---

## 5) Data Model / State (if any)
- Entities:
  - `StarterScaffoldDeliverContract`
  - `BoundedContinuityLinkExpectation`
  - `StopClarifyTriggerSet`
- Persistence (if any):
  - Markdown artifacts only.
- Invariants (target-state constraints):
  - No implementation before governed execution path and implementation gates.
  - No second routing owner outside `CODEX_ENTRY.md`.
  - No governance/helper redesign or cross-domain authority leakage.
  - Feature-local by default; bounded continuity references only when needed.
- Edge cases:
  - Historical questions text still present in `01-break.md` must not override resolved baseline in `questions.md`.

---

## 6) Implementation Plan (ordered)
Write as an ordered sequence. Each step should be checkable.

1. Confirm option baseline: Option B from `03-analyze.md` is the active shape for this slice.
2. Ensure feature-local contract artifacts (`01-break`, `02-model`, `03-analyze`, `04-deliver`) are mutually consistent on scope, invariants, and boundaries.
3. Encode bounded continuity-link expectations as reference-only guidance:
   - allowed only when execution state changes require continuity alignment,
   - must not introduce new continuity surfaces,
   - must not require local `.planning` paths as repo-tracked targets.
4. Verify stop/clarify triggers and acceptance/evidence checklist are explicit and objective.
5. Re-check `questions.md` baseline:
   - keep unchanged if no new unresolved blockers exist,
   - append only genuinely new unresolved blockers.

STOP / Clarify triggers (hard gate):
- Stop if scope expands beyond one bounded first slice.
- Stop if any step implies helper redesign or silent helper-argument inference.
- Stop if routing ownership is restated outside `CODEX_ENTRY.md`.
- Stop if the contract requires new continuity surfaces or non-repo/local-only artifact targets.
- Stop if wording implies implementation readiness without the normal governed execution path.

---

## 7) Tests / Validation
Specify how correctness is verified.

### Must-have checks
- Cross-doc consistency review: `01-break.md`, `02-model.md`, `03-analyze.md`, `04-deliver.md`, `questions.md`.
- Option alignment check: `04-deliver.md` explicitly reflects Option B.
- Boundary check:
  - no governance/routing-owner/helper changes implied,
  - no implementation authorization implied by this doc alone.
- Continuity check: no required repo-tracked target outside feature-local scope for this slice.
- Hygiene check: `git diff --check` passes.

### Optional checks
- Peer readability pass focused on "no guesswork" handoff quality for later governed execution.

---

## 8) Acceptance Criteria (Definition of Done)
Must be objective and testable.

- [ ] `04-deliver.md` explicitly codifies Option B (feature-local starter/scaffold + bounded continuity-link expectations).
- [ ] In-scope, non-scope, required inputs, required outputs, stop/clarify triggers, and validation/evidence expectations are explicit.
- [ ] Contract remains feature-local by default and does not require new continuity surfaces or local `.planning` artifact targets.
- [ ] Model-A and authority-layer boundaries are preserved (no helper redesign, no second routing owner, no governance redesign).
- [ ] No new unresolved blocker is introduced silently; `questions.md` remains unchanged unless genuinely new blockers appear.

---

## 9) Rollback / Safety (if relevant)
- Feature flags:
  - N/A.
- Migration steps:
  - N/A.
- Revert steps:
  - Revert this feature-local documentation set to last valid bounded state if boundary violations are introduced.

---

## 10) Deferred Follow-Up (Out of Scope For This Slice)
- Any code implementation work beyond this documentation-only deliver contract.
- Any reusable cross-feature scaffold/automation framework.
- Any helper/path-policy/guidance redesign outside this feature-local contract.
