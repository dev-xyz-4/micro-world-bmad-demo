# Codex Workflow Policy

This document defines the binding rules for Codex behavior in this repository.

---

## 1) Authority

This file is the single normative source for:
- what Codex may and may not do
- mode behavior
- stop behavior
- implementation gates
- Codex duties

If another document appears to conflict with Codex behavior rules, this policy is authoritative.

---

## 2) Role of Codex

Codex is a tool, not an autonomous decision-maker.

Codex may:
- create and update documentation
- implement code strictly from explicit specifications

Codex may not:
- invent requirements
- make architectural decisions
- expand scope implicitly

---

## 3) Required Context Before Work

Before starting any task, Codex must read:

1. `docs/bmad/README.md`
2. `docs/bmad/guides/BMAD_DECISION_MATRIX.md`
3. `docs/bmad/guides/BMAD_SETUP_Lean_Integration.md`
4. `docs/bmad/guides/BMAD_COMMIT_CONVENTIONS.md`

For feature-specific work, Codex must additionally read:

Feature artifact path rule:
- Resolve `<feature-root>` via `docs/bmad/guides/CODEX_ENTRY.md` mode-aware routing.

1. `<feature-root>/<feature-name>/01-break.md` (if present)
2. `<feature-root>/<feature-name>/questions.md` (if present)
3. `docs/bmad/templates/<relevant-template>.md` (for documentation creation)

---

## 4) Modes

### Documentation-Only Mode (Planning)

This mode may occur before `04-deliver.md` exists.

Codex may:
- create `01-break.md`
- create `02-model.md`
- create `03-analyze.md`
- draft `04-deliver.md`
- update `questions.md`

Codex must not:
- implement or modify application code
- finalize unresolved decisions when alternatives still exist

### Implementation Mode (Execution)

Codex may implement code only when all implementation gates in section 5 are satisfied.

---

## 5) Implementation Gates (Mandatory)

Implementation is allowed only if all conditions are true:

- `<feature-root>/<feature-name>/04-deliver.md` exists and is valid for the task (`<feature-root>` resolved via `docs/bmad/guides/CODEX_ENTRY.md`)
- scope, APIs, and acceptance criteria are explicit
- blocking open questions are resolved or explicitly marked as blocking for stop behavior

If any gate fails, Codex must not implement.

---

## 6) Minor Change Rules

For tasks classified as Minor Change:

- do not create BMAD feature documentation
- resolve canonical log / handover / baseline targets via `docs/bmad/guides/CODEX_ENTRY.md` mode-aware routing
- every Minor Change MUST append a row to the active mode minor-change log target
- each row MUST include: Version, Date (YYYY-MM-DD), Scope, Short description, PR reference (if available)
- if the required mode-aware history entry cannot be completed, stop and request clarification before proceeding
- keep changes local and reversible
- do not restate or override mode-aware routing outside `docs/bmad/guides/CODEX_ENTRY.md`

Terminology separation:
- `Minor Change` refers to workflow classification.
- `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR` refer to version classification.

---

## 7) Stop Behavior

Codex must stop and wait for clarification when:

- required information is missing or ambiguous
- implementation gates are not satisfied
- uncertainty would require Codex to make a decision it is not allowed to make

If Codex is unsure whether a task is BMAD Feature or Minor Change:

- classify as BMAD Feature (per Decision Matrix)
- document the uncertainty
- stop and wait for clarification

---

## 8) Codex Duties

Codex must:

- follow `04-deliver.md` strictly during implementation
- avoid scope expansion and unrelated refactors
- record missing information in `questions.md` (feature) or ask for clarification (minor scope)
- reflect process and documentation updates required by the chosen path
- follow commit conventions in `BMAD_COMMIT_CONVENTIONS.md`

---

## Final Rule

> Codex follows the documented process.  
> The process does not adapt to Codex.
