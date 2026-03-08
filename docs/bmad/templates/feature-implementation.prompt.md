# Prompt-Template: BMAD Feature (Implementation)

Prompt scaffold (non-authoritative).
Not routing authority, not policy authority.
For day-to-day startup context, prefer `docs/entry/LLM-bmad-briefing.md`.

```text
Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This is a BMAD Feature Implementation:
- <feature-slug> (<short-feature-intent>).
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.

Implementation scope:
Implement strictly according to:
- <feature-root>/<feature-slug>/04-deliver.md

Do not implement behavior outside that document.

Problem:
- <problem-point-1>
- <problem-point-2>
- <problem-point-3>

SemVer Decision (capture):
- SemVer Decision: `<SemVer PATCH | SemVer MINOR | SemVer MAJOR | no SemVer change>`
- Rationale:
  - `<rationale-point-1>`
  - `<rationale-point-2>`
- Planned tag: `<vX.Y.Z | N/A>`

Expected behavior (from deliver contract):

A) <contract-block-a>
- <rule-a1>
- <rule-a2>
- <rule-a3>

B) <contract-block-b>
- <rule-b1>
- <rule-b2>
- <rule-b3>

C) <contract-block-c>
- <rule-c1>
- <rule-c2>
- <rule-c3>

D) <normative-sequence-name> (exact ordering)
Implement EXACT ordering:
1) <step-1>
2) <step-2>
3) <step-3>
4) <step-4>
5) <step-5>

E) <lifecycle-and-async-guards>
- <lifecycle-rule-1>
- <lifecycle-rule-2>
- <lifecycle-rule-3>

F) <live-update-and-recovery>
- <recovery-rule-1>
- <recovery-rule-2>
- <recovery-rule-3>

G) <cache-or-state-namespacing>
- <namespace-rule-1>
- <namespace-rule-2>
- <namespace-rule-3>

H) Non-Regression Guarantees
- Do NOT modify:
  - <protected-area-1>
  - <protected-area-2>
  - <protected-area-3>
- <additional-non-regression-rule>

Policy references:
- Workflow governance and implementation constraints:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Versioning and SemVer ownership:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Targets (only these files may change):
- <target-file-1>
- <target-file-2>
- <target-file-3>

Non-targets:
- <non-target-path-1>
- <non-target-path-2>

Validation checks:
- <typecheck-command>
- <build-or-test-command>

Functional validation matrix:
- <behavior-check-1>
- <behavior-check-2>
- <behavior-check-3>
- <regression-check-1>
- <regression-check-2>

Clarification handling:
- If requirements are unclear, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Write clarification request to:
  - <feature-root>/<feature-slug>/questions.md

Proceed step-by-step.
Do not widen scope.

```
