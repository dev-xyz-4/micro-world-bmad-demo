# Prompt-Template: Minor Change (Implementation)

Prompt scaffold (non-authoritative).
Not routing authority, not policy authority.
For day-to-day startup context, prefer `docs/entry/LLM-bmad-briefing.md`.

```text
Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Switch to Implementation Mode.

This task is a Minor Change.

Fix:
- <short-minor-change-title>

Problem:
- <problem-point-1>
- <problem-point-2>

SemVer Decision (capture):
- SemVer Decision: `<SemVer PATCH | SemVer MINOR | SemVer MAJOR | no SemVer change>`
- Rationale:
  - `<rationale-point-1>`
  - `<rationale-point-2>`
- Planned tag: `<vX.Y.Z | N/A>`

Expected behavior:
- When <condition>:
  - <expected-point-1>
  - <expected-point-2>
- Out of scope:
  - <out-of-scope-point>

Policy references:
- For workflow governance and implementation constraints, see:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- For versioning and SemVer ownership, see:
  - docs/engineering/versioning.md

Namespace clarifier:
- workflow classification uses `Minor Change (workflow)` / `BMAD Feature`
- version classification uses `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

Clarification handling:
- If requirements are missing or ambiguous, follow:
  - docs/bmad/guides/CODEX_WORKFLOW_POLICY.md
- Route mode-aware log/handover targets via:
  - docs/bmad/guides/CODEX_ENTRY.md
- Do not use BMAD feature `questions.md` paths for Minor Change workflow.

Targets:
- <primary-target-file>
- <optional-secondary-target-file>

Validation:
- <validation-step-1>
- <validation-step-2>
- <regression-check-1>
- <version-decision-captured>
- <owner-policy-check-completed>

```
