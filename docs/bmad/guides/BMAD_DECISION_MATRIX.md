# BMAD Decision Matrix  
**BMAD Feature vs. Minor Change**

Use this page **before writing code or prompting Codex**.
It is a routing aid for task classification.

---

## Step 1 — One Question

**Does this change introduce _new structure, new decisions, or new behavior_?**

- [ ] Yes → **BMAD Feature**
- [ ] No  → **Minor Change**

If unsure, refer to:
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`

---

## Step 2 — Classification Guidance

### BMAD Feature (use B/M/A/D)

Common indicators:

- Introduces a new concept, abstraction, or workflow
- Adds or changes public APIs
- Requires architectural or data-model decisions
- Has multiple possible solution approaches
- Affects extensibility or future features
- Changes system behavior in non-local ways
- You need to explain *why* this solution was chosen

**Required output:**
docs/bmad/features/<feature-name>/
├─ 04-deliver.md (mandatory)
├─ 03-analyze.md (if decisions exist)
├─ 02-model.md (if structure exists)
└─ 01-break.md (if scope is unclear)

Path note:
- The feature path shown above is the Project Mode default example.
- Resolve active mode-aware feature-root targets via `docs/bmad/guides/CODEX_ENTRY.md`.

---

### Minor Change (no BMAD)

Common indicators:

- No new concepts or abstractions
- No architectural decisions
- Behavior remains fundamentally the same
- Change is local and easily reversible
- Reason is obvious (bugfix, cleanup, small refactor)

**Required output:**
docs/bmad/notes/minor-change-log.md

---

## Step 3 — Policy Routing

Binding constraints and forbidden combinations are defined in:
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- Mode-aware target-path resolution is owned by:
  - `docs/bmad/guides/CODEX_ENTRY.md`

---

## Step 4 — Codex Interaction

This matrix defines **classification only**.

For Codex behavior, stop rules, and enforcement,
see `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

---

## Authority Note

For versioning and SemVer ownership, refer to:
- `docs/engineering/versioning.md`

Namespace reminder:
- Workflow classification: `Minor Change (workflow)` / `BMAD Feature`
- Version classification: `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`
