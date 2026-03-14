# CHAT_HANDOVER_PROTOCOL

## Purpose

This document provides the minimal required context for continuing work in a new ChatGPT session without reloading full repository history.

It defines:

- Repository structure
- Governance model
- Versioning discipline
- Workflow rules
- Current system state

This file must be kept up to date when major governance milestones are reached.

---

# 1. Repository Purpose

This repository is an **Engineering Delivery Blueprint (EDB)**.

It separates three structural layers:

1) docs/00-project  
   → Project identity (scope, risk profile, architecture overview, glossary)

2) docs/bmad  
   → BMAD-powered delivery operating model (Break → Model → Analyze → Deliver)  
   → Minor vs Feature classification  
   → Commit conventions  
   → CODEX workflow enforcement

3) docs/engineering  
   → Engineering governance  
   → Security  
   → Testing  
   → Versioning  
   → Release discipline  
   → Templates & Guides

Additionally:
- scripts/quality → quality automation layer

---

# 2. Governance Model

## BMAD Feature Workflow
Used for:
- New features
- Structural changes
- New enforcement mechanisms
- Architectural decisions

## Minor Change Workflow
Used for:
- Documentation updates
- Governance refinements
- Template additions
- Log hygiene
- Placeholder removals

Minor Changes MUST:
- Go through PR
- Append entry to docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md
- Not introduce architecture
- Not expand feature scope

Enforced in:
- docs/bmad/guides/CODEX_WORKFLOW_POLICY.md

---

# 3. Branching & PR Discipline

- main branch protected
- All changes via Pull Request
- Squash merge preferred
- No direct commits to main

Local cleanup required after merge:
- Delete local branch
- Delete remote branch if not auto-deleted

---

# 4. Versioning Discipline

Semantic Versioning strictly applied:

SemVer MAJOR  
→ Structural or architectural change

SemVer MINOR  
→ Governance expansion (new guides, new templates)

SemVer PATCH  
→ Documentation hygiene, log corrections, formatting fixes

Tags are authoritative.
Releases optional for SemVer PATCH, recommended for SemVer MINOR+.

---

# 5. Current Repository State

Latest Tag:
v1.16.0

Governance Baseline Includes:

- Minor Change governance formalized (policy-backed)
- Mandatory Minor log enforcement (policy-backed)
- SECURITY_SCOPE_GUIDE.md
- security.template.md
- TESTING_SCOPE_GUIDE.md
- VERSIONING_GUIDE.md
- RELEASE_GUIDE.md
- PERFORMANCE_GUIDE.md
- OBSERVABILITY_SCOPE_GUIDE.md
- GOVERNANCE_MODEL.md
- ORCHESTRATION_INDEX.md
- EDB_ENGINEERING_BASELINE.md
- ADR-0001-identity.md (EDB identity declaration)
- ADR-0002-orchestration-entrypoint-architecture.md
- EDB_CHAT_HANDOVER_PROTOCOL.md
- EDB_MINOR_CHANGE_LOG.md
- BRANCH_WORKFLOW.md
- testing-strategy.template.md
- Prompt templates in docs/bmad/templates (*.prompt.md)
- chat-handover.template.md
- engineering-baseline.template.md
- minor-change-log.template.md
- adr.template.md
- LLM-bmad-briefing-template.md repository tree sync
- Repository governance documentation standardized to English
- PR helper CLI for standardized workflow execution (branch/commit/PR/merge/sync/tag)
- Deterministic PR metadata flow (Conventional titles + narrative body + squash subject/body parity)
- PR helper usage formally documented in PR_HELPER_GUIDE.md
- PR helper doctor strengthened with governance PASS/WARN/FAIL validation checks
- PR helper commit corrected to staged-only behavior with explicit unstaged/no-staged failure conditions
- PR_HELPER_GUIDE clarified staged-only prerequisites and explicit doctor exit semantics
- Terminology separation clarified: Minor Change (workflow) vs SemVer PATCH/MINOR/MAJOR
- BMAD implementation prompts require explicit SemVer Decision, rationale, planned tag, and decision-bound canonical log/handover updates via CODEX_ENTRY routing
- Phase 2B hybrid orchestration model implemented (entry role layered on guides + canonical orchestration startup map)
- Branch protection enabled
- PR-based workflow verified
- Self-history/template separation for handover, baseline, and minor-change log
- Versioning authority contract enforcement: `docs/engineering/versioning.md` is explicit sole normative owner and `docs/engineering/guides/VERSIONING_GUIDE.md` is informational-only
- Core governance kernel refactor consolidation (C2-C5): routing docs are delegation-only, minor-change logs are historical-only, templates are structural/reference-only, and non-owner artifacts delegate governance authority to `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md` and `docs/engineering/versioning.md`
- Phase-2C release boundary refactor (minimal wording-level): `RELEASE_GUIDE.md` removed local versioning-owner assertions and now delegates SemVer authority to `docs/engineering/versioning.md` while preserving release-domain matrix/criteria structure
- Phase-2D project-classification refactor (wording-level): non-owner guides/templates removed local taxonomy duplication and now delegate canonical project-type authority to `docs/engineering/guides/PROJECT_CLASSIFICATION.md` without changing workflow or SemVer ownership
- Root `AGENTS.md` introduced as a thin Codex startup surface pointing only to durable repo-tracked entry/orientation and owner documents (`CODEX_ENTRY.md`, `ORCHESTRATION_INDEX.md`, `CODEX_WORKFLOW_POLICY.md`, and engineering owner guides) without creating a second policy, routing, or execution source
- Root `AGENTS.md` clarified to remain startup-only and not an execution tracker; governed execution truth remains in the active workflow carrier
- Model-A helper autonomy boundary established: Codex may execute through doctor/commit/push; PR-stage helper commands must be executed explicitly or surfaced as final operator commands
- PR helper `pr-create` missing-required-parameter diagnostics improved to aggregate missing flags and emit explicit full-command guidance without changing helper workflow semantics
- First controlled P3 BMAD Feature slice opened (`p3-flow-contract-scaffold`) with break-stage artifacts (`01-break.md`, `questions.md`) stored under docs/_edb-development-history/features/ as part of the EDB self-development path (no governance-model or SemVer rule changes)
- Mode-aware BMAD feature-path clarification patch (docs-only, included in v1.12.29): `CODEX_ENTRY.md` explicitly owns BMAD feature-root routing for Project Mode vs EDB Mode, while policy/templates delegate feature-root resolution to CODEX_ENTRY without introducing a second routing authority or template-family split
- `pr-helper.sh` Project Mode handover path defect fixed (included in v1.12.29): helper now targets canonical `docs/entry/chat-handover-protocol.md` for Project Mode governance checks, aligned with `docs/bmad/guides/CODEX_ENTRY.md` without workflow redesign
- Reader-guidance UX clarification patch (docs-only, included in v1.12.29): first-read/reference docs now label `docs/bmad/features/...` examples as Project Mode defaults and delegate active mode-aware target resolution to `docs/bmad/guides/CODEX_ENTRY.md` without adding a second routing owner
- First controlled P3 scaffold slice completed: `p3-flow-contract-scaffold` established a feature-local Flow-Contract starter with bounded continuity expectations (01-break / 02-model / 03-analyze / 04-deliver) under EDB Mode paths without introducing code implementation, governance redesign, helper changes, or routing-owner duplication.
- First bounded P3 code slice implemented: `flow-contract-starter.mjs` CLI introduced under `scripts/quality/`, enabling deterministic creation of feature-local BMAD starter artifacts (`01-break.md`, `questions.md`) while preserving Model-A execution boundary and CODEX_ENTRY routing ownership.
- Tiny entry-surface clarification patch applied (docs-only, SemVer PATCH planned): role boundaries are now explicitly sharpened among `CODEX_ENTRY.md` (routing owner), `CODEX_WORKFLOW_POLICY.md` (policy owner), `ORCHESTRATION_INDEX.md` (descriptive map), and `AGENTS.md` (startup shim), with minimal wording-only drift fixes in secondary BMAD guides.
- Phase-4 System-Orchestrator architecture set
- Deterministic Flow / Path Registry
- Agent / State / Extension Architecture
- scripts/quality/orchestrator-entry.mjs (CLI-first Orchestrator Entry MVP)
- scripts/quality/tests/orchestrator-entry.smoke.mjs (bounded smoke validation)
- Orchestrator Entry JSON output contract documented and smoke-test contract shape hardened (route-result / stop-result structure, clarify_packet validation, normalization-case enforcement) without CLI behavior or field-name changes
- Lightweight CI smoke-test guard for Orchestrator Entry MVP (`.github/workflows/orchestrator-entry-smoke.yml`) ensuring automatic validation of the CLI JSON output contract
- First bounded `P1 / Minor Change` downstream continuation slice implemented under the accepted placement rule:
  - `scripts/quality/orchestrator-entry.mjs` remains the Entry/routing surface
  - `scripts/quality/p1-minor-change-contract.mjs` now defines the external `P1` contract
  - the Entry selects/loads/emits that contract only for `route-result + P1 + Minor Change`
  - execution remains outside the Entry and outside this bounded slice
  - smoke coverage now validates the emitted `P1` `action_contract` shape and confirms that `P2` / `P3` outputs do not emit it
- First bounded executor-side `P1 / Minor Change` minimal write slice implemented:
  - `scripts/quality/p1-minor-change-executor.mjs` now consumes valid emitted `P1` contract packets outside the Entry
  - the executor enforces a mandatory branch-confirmation gate (`yes` / `no`) before any repo-tracked write
  - the first bounded write proof uses the contract's resolved `target_path_hint` directly
  - the executor writes one simple docs-only markdown artifact and returns only `completed` or `stopped`
  - smoke coverage now validates executor-side `branchConfirmation = no` stop behavior, `branchConfirmation = yes` bounded write behavior, and rejection of non-`P1` packets
- First bounded branch-state hardening slice implemented on the existing executor-side `P1 / Minor Change` surface:
  - `scripts/quality/p1-minor-change-executor.mjs` now performs real Git branch-state detection before repo-tracked `P1` write continuation
  - bounded branch-state classes are now explicit:
    - `on_main`
    - `on_non_main_branch`
    - `branch_state_unknown`
  - bounded branch-dependent decision logic now returns:
    - `continue_on_current_branch`
    - `request_branch_change`
    - `stop`
  - direct continuation on `main` is blocked, unknown branch state stops, and actual branch creation/switch execution is still deferred
  - smoke coverage now validates `on_main`, `on_non_main_branch`, `branch_state_unknown`, malformed decision shapes, and preserved non-`P1` stop behavior

Minor Change log is complete and enforced.

---

# 6. Current Focus

# 6. Current Focus

Phase-4 continuation growth after the completed first bounded `P1 / Minor Change` contract-emission slice, the completed first bounded executor-side minimal write slice, and the completed first bounded branch-state hardening slice.

The current executable entry and continuation baseline is:

goal → bounded clarify → primary_path → workflow_route → result

Current focus areas:

- keep the Entry MVP and the new bounded `P1` contract-emission behavior stable
- keep the first bounded executor-side `P1` minimal write behavior stable
- keep the completed branch-state hardening behavior stable on the existing path-specific executor surface
- preserve the accepted placement rule:
  - Entry selects/loads/emits contracts
  - contract definitions live outside the Entry
  - execution remains outside the Entry
- decide the next bounded follow-up without reopening completed `P1` contract-emission or first branch-hardening work
- choose whether the next bounded follow-up is:
  - actual branch creation/switch execution after the now-completed branch-state hardening slice
  - or finer `P1` target resolution toward meaningful project-doc destinations

---

# 7. Instructions for New Chat

When starting a new ChatGPT session:

1. Provide this file.
2. State:
   - Current version
   - Next target
   - Whether change is Minor or Feature
3. Request template-conform BMAD prompt generation if applicable.

No need to restate:
- Branch protection rules
- Versioning logic
- Minor log requirement
- Repository structure

All governance rules are defined above.
