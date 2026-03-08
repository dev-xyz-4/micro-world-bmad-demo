# BMAD Setup Guide (Lean Integration)

> **Goal:** Use BMAD as a *process framework* in this repository (workflows + artifacts) with minimal overhead.  
> **Principle:** Thinking/decision-making is versioned as Markdown.  
> Codex behavior is governed by `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

---

## 0) Quick Overview

- **BMAD = structure & artifacts** (Break → Model → Analyze → Deliver)
- **Repo = single source of truth** (docs in Git, not in chat history)
- **VS Code + Codex Plugin = execution** (write code, refactor, test)
- **Optional:** install BMAD CLI to generate assets/workflows faster (not required)

---

## 1) Installation (2 variants)

### Variant A — Minimal (without BMAD CLI) ✅ *recommended to start*
You use BMAD as a **concept + documentation structure**:

1. Create the folder structure under `docs/bmad/` (see section 2).
2. Use the templates (section 3) or create the files manually.
3. VS Code Codex behavior and implementation gating are defined in `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

**Advantage:** no additional tooling overhead, ready immediately.  
**Disadvantage:** you maintain templates/folders yourself initially.

---

### Variant B — With BMAD CLI (optional) ⚙️
If you want to adopt BMAD assets/workflows from the official repository, install the CLI locally.

**Prerequisites**
- Node.js **v20+**
- Terminal in repo root

**Install (project-specific, recommended)**
```bash
npx bmad-method install
```

**Update**
```bash
npx bmad-method update
```

> Note: The CLI is **optional**. For your workflow (docs → implementation), Variant A is often sufficient.  
> If the CLI creates different files/folders than below, use it as a "source",  
> but keep the repository structure in `docs/bmad/` stable.

---

## 2) Suggested `docs/bmad/` Structure

```text
docs/
  bmad/
    README.md
    guides/BMAD_SETUP_Lean_Integration.md
    00-project/
      README.md
      project-overview.md
      architecture-notes.md
      glossary.md
    features/
      <feature-name>/
        README.md
        01-break.md
        02-model.md
        03-analyze.md
        04-deliver.md
        questions.md
        changelog.md
    templates/
      break.template.md
      model.template.md
      analyze.template.md
      deliver.template.md
    notes/
      open-questions.md
      rejected-approaches.md
      decisions-log.md
```

Path note:
This structure is a downstream Project Mode default example.
For active mode-aware feature-root targets, use `docs/bmad/guides/CODEX_ENTRY.md`.

### Meaning of the folders

#### `docs/bmad/00-project/`
**Stable context** about the existing project (brownfield focus):
- What is the repository? Goal/scope?
- Architecture sketch (modules, data flows)
- Glossary (terms, abbreviations)
- Conventions (coding, tests, paths)

**Purpose:** Codex and you share a "baseline truth" without re-explaining everything every time.

---

#### `docs/bmad/features/<feature-name>/` (Project Mode default example)
BMAD artifacts per feature or clearly scoped topic.

- `01-break.md` — **decompose** the problem, no solution
- `02-model.md` — conceptual model (data, states, invariants)
- `03-analyze.md` — options/trade-offs, decisions, risks
- `04-deliver.md` — **implementation contract** (API, steps, acceptance criteria)
- `questions.md` — open points that must not be guessed
- `changelog.md` — what changed in the artifact and why

**Important:** For implementation, `04-deliver.md` is *the* source.

---

#### `docs/bmad/templates/`
Templates to keep documents consistent.  
**Optional**, but very helpful when multiple features follow the same pattern.

---

#### `docs/bmad/notes/`
Cross-cutting notes that do not belong to a single feature:
- major decisions (decision log)
- rejected ideas
- general open questions

**Purpose:** keep feature artifacts lean.

---

## 3) Templates (starting point)

Create these templates (or import them later from BMAD):

### `templates/break.template.md`
- Goal / Non-goals
- Inputs / Outputs
- Constraints
- Risks / Unknowns
- Acceptance: "When is the problem correctly understood?"

### `templates/model.template.md`
- Data model / structures
- States / transitions
- Invariants
- Interfaces (conceptual)
- Failure modes

### `templates/analyze.template.md`
- Approach A/B/C
- Trade-offs (performance, UX, complexity, extensibility)
- Decision + rationale
- What was rejected and why?

### `templates/deliver.template.md`
- Scope (MVP vs later)
- File/folder targets
- API/signatures
- Implementation order
- Tests/checks
- Acceptance criteria (definition of done)

---

## 4) Which parts of the BMAD repo do we use — and why?

### Used (core, entry)
1. **BMAD phases B/M/A/D**  
   - Reason: forces explicit decisions, reduces drift.
2. **Artifact-first** (docs in repo instead of chat)  
   - Reason: versionable, reproducible weeks later.
3. **Quick vs Full planning (principle, not necessarily CLI)**  
   - Quick: small changes with little overhead  
   - Full: larger features with clear deliverables
4. **Brownfield mindset** (`00-project/` as context baseline)  
   - Reason: mature projects need shared understanding.

### Not used for now
1. **Builder / custom agent system**  
   - Reason: overhead; only useful once you automate repeated workflows.
2. **Enterprise modules (e.g., TEA/test architecture)**  
   - Reason: introduce only when QA/test gates are truly the bottleneck.
3. **Strict role simulation (PM/Architect/QA as separate agents)**  
   - Reason: these roles can be represented as document sections; separate later if needed.
4. **Fully automated workflow chains**  
   - Reason: stabilize manually first, then automate.

---

## 5) Working style with VS Code + Codex Plugin (critical)

### Ground rule
This chapter describes integration with the VS Code plugin.
Normative Codex rules are in `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

**Standard instruction (copy/paste; Project Mode default path example)**
> Implement strictly according to `docs/bmad/features/<feature>/04-deliver.md`.  
> Make no additional assumptions.  
> If information is missing, follow behavior from  
> `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.
>
> Resolve active mode-aware feature-root paths via `docs/bmad/guides/CODEX_ENTRY.md`.

### Practical consequences
- No architecture discussions in plugin chat
- No silent scope expansions
- Every decision goes into `03-analyze.md` (or `notes/decisions-log.md`)
- Every implementation change is reflected in `04-deliver.md` (if it changes the goal)
- For TS error stabilization, optionally use
  `docs/bmad/guides/TS_AUDIT_ROUTINE.md` (diagnostic, not normative)

### "Clean context" trick
When a feature grows large:
- Plugin receives **only** `04-deliver.md` (+ 1–2 referenced files)
- The rest (B/M/A) stays in the repo, not in plugin context

---

## 6) Operating rules (lightweight, but binding)

1. **Single source of truth:** `04-deliver.md`
2. **No assumptions without documentation:** open points → `questions.md`
3. **Plan changes are normal:** but update artifacts, not just your head
4. **Use BMAD where it pays off:** new complexity, real trade-offs, long-term evolution
5. **Commit discipline:** version `docs/bmad/`, otherwise BMAD loses its main value

---

## 7) Start checklist (10 minutes)

- [ ] Commit `docs/bmad/guides/BMAD_SETUP_Lean_Integration.md` (this document)
- [ ] Create `docs/bmad/00-project/` + roughly fill `project-overview.md`
- [ ] Create `docs/bmad/templates/` (4 templates)
- [ ] For the next feature: create `docs/bmad/features/<name>/04-deliver.md` (Project Mode default example; resolve active mode-aware target via `docs/bmad/guides/CODEX_ENTRY.md`)
- [ ] Apply Codex rules from `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`

---

## 8) Troubleshooting & FAQ

### When do I use "Quick" vs "Full" BMAD?

**Quick (minimal):**
- small, clearly scoped changes
- few or no architecture decisions
- existing models are not changed

→ Often **only `04-deliver.md`** is enough (+ maybe a short `01-break.md`).

**Full (B/M/A/D):**
- new structural logic
- multiple solution paths are possible
- future extensibility matters
- risk of bad decisions

→ Document all four phases explicitly.

---

### What to do if information is missing during implementation?

Specific stop/clarification behavior for Codex is defined in
`docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

For documentation:
1. Add missing points to `docs/bmad/features/<feature>/questions.md` (Project Mode default example; resolve active mode-aware target via `docs/bmad/guides/CODEX_ENTRY.md`).
2. Record decisions in `03-analyze.md`.
3. Update `04-deliver.md` if needed.

---

### When must `04-deliver.md` be updated?

Whenever one of these changes:
- scope
- API / signatures
- implementation order
- acceptance criteria
- definition of done

**Rule of thumb:**  
If code does something different than planned → `04-deliver.md` is outdated.

---

### May Codex make decisions in the plugin?

The normative answer is in
`docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`.

This setup guide remains descriptive; decisions are documented in `03-analyze.md`.

---

### What if BMAD feels "too heavy"?

Then it is being **used too broadly**.

BMAD is not a default for:
- bug fixes
- cosmetic changes
- pure renaming

BMAD is a tool for **new complexity**.

---

### Can I remove BMAD later?

Yes.

BMAD creates **Markdown artifacts only**.
No code depends on it.

Worst case:
- You keep good documentation.
- You drop the process.

---

## 9) Commit & Change Rules for BMAD Artifacts

BMAD works only when documents are **versioned, traceable, and stable**.

### Ground rules
1. **Always commit `docs/bmad/`**
2. Artifacts are part of the code review baseline
3. Plan changes are normal - **silent changes are not**

---

### Recommended commit structure

#### Changes to BMAD documents
```text
docs(bmad): clarify deliver scope for <feature>
docs(bmad): add decision on data model trade-offs
docs(bmad): document rejected approach for <feature>
```
