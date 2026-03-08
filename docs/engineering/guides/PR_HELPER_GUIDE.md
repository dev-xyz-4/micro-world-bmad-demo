# PR Helper Guide

## 1) Overview

`scripts/quality/pr-helper.sh` standardizes governance-oriented PR operations in this repository.

Purpose:
- Reduce manual mistakes in branch/commit/PR/merge flows
- Keep PR metadata consistent with Conventional Commits
- Ensure deterministic squash metadata (PR title/body parity on main)
- Support governance hygiene through explicit workflow steps

### Codex-App-Hinweis

Bei governed Git-/PR-Flows in diesem Repo bleibt `scripts/quality/pr-helper.sh` der führende Ausführungsweg.
Die Codex App darf Code ändern, Diffs vorbereiten und Texte vorschlagen, aber Branch-/Commit-/PR-/Merge-Schritte sollen über den Helper bzw. dessen Guardrails laufen.

---

## 2) Prerequisites

Before running helper commands:
- Run from repository context (the helper resolves repo root automatically)
- Ensure no unstaged changes before `commit` (stage intended files explicitly with `git add`)
- Ensure `gh` is installed
- Ensure `gh` is authenticated: `gh auth status`
- Do not run commit/PR actions from `main`

---

## 3) Supported Workflows

Detected from `docs/bmad/templates/*.prompt.md`:
- `minor-change`
- `documentation-only`
- `feature-implementation`

Use:
```bash
scripts/quality/pr-helper.sh detect
```

---

## 4) Subcommands

- `help`:
  Show usage and examples.
- `detect`:
  Print detected workflow-template mappings.
- `doctor`:
  Print environment/guardrail status plus governance validation diagnostics.
  Supports:
  - `--workflow <workflow>`
  - `--tag vX.Y.Z` (planned tag context)
- `branch`:
  Create a workflow-aligned branch name (`minor/<slug>` or `feature/<slug>`).
- `commit`:
  Create a conventional commit message and commit staged changes only.
  `commit` does not auto-stage files.
- `push`:
  Push current branch to origin with upstream tracking.
- `pr-create`:
  Create PR with Conventional Commit title and narrative governance body.
- `pr-merge`:
  Squash-merge PR with explicit subject/body matching PR metadata.
- `sync-main`:
  Checkout/pull `main` and delete previous local branch.
- `tag`:
  Create and push tag only when explicit `--tag vX.Y.Z` is provided.

---

## 5) Required `pr-create` Parameters

`pr-create` requires all of the following:
- `--type`
- `--scope`
- `--summary`
- `--rationale`
- `--files`
- `--out-of-scope`
- `--versioning`
- `--governance`
- `--validation`

Minimal shape:
```bash
scripts/quality/pr-helper.sh pr-create \
  --workflow <minor-change|documentation-only|feature-implementation> \
  --type <docs|chore|feat|...> \
  --scope <scope> \
  --summary "<human summary>" \
  --rationale "<why>" \
  --files "<comma-separated file list>" \
  --out-of-scope "<non-goals>" \
  --versioning "<semver expectation>" \
  --governance "<governance notes>" \
  --validation "<checks done / planned>"
```

---

## 5.1) Doctor Governance Checks

Run before `pr-create`:
```bash
scripts/quality/pr-helper.sh doctor --workflow minor-change
```

For planned tagging/version finalization:
```bash
scripts/quality/pr-helper.sh doctor --workflow minor-change --tag vX.Y.Z
```

### Mode-Aware Enforcement

`doctor` resolves mode before governance checks:
Project Mode is the default behavior and applies to all downstream users.
Canonical mode-aware target ownership remains in `docs/bmad/guides/CODEX_ENTRY.md`.
The path lists below are convenience mirrors of that routing owner.

- Project Mode (default):
  - Active when neither `EDB_MODE=1` nor `.planning/EDB_MODE` is present.
  - Targets:
    - `docs/bmad/notes/minor-change-log.md`
    - `docs/entry/chat-handover-protocol.md`
    - `docs/engineering/engineering-baseline.md`

- EDB Mode (blueprint development):
  - Active when `EDB_MODE=1` is set or `.planning/EDB_MODE` exists.
  - Targets:
    - `docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md`
    - `docs/_edb-development-history/EDB_CHAT_HANDOVER_PROTOCOL.md`
    - `docs/_edb-development-history/EDB_ENGINEERING_BASELINE.md`

Checks performed:
- Verifies mode target files are present.
- For `--workflow minor-change`:
  - Verifies mode-specific minor-change log is modified/staged.
- If `--tag` is provided or a SemVer version bump is detected in the mode-specific log:
  - Verifies mode-specific chat-handover document is modified.
  - Evaluates mode-specific engineering baseline document (warning-level if unchanged).

Examples:
```bash
# Default Project Mode
scripts/quality/pr-helper.sh doctor --workflow minor-change

# Explicit EDB Mode via env
EDB_MODE=1 scripts/quality/pr-helper.sh doctor --workflow minor-change

# EDB Mode via local marker file
touch .planning/EDB_MODE
scripts/quality/pr-helper.sh doctor --workflow minor-change
```

Diagnostic levels:
- `PASS`: governance condition satisfied
- `WARN`: recommended or contextual check not enforced
- `FAIL`: required governance condition missing (doctor exits non-zero)

Doctor exit-code semantics:
- `PASS` only -> exit code `0`
- `WARN` (with or without `PASS`) -> exit code `0`
- any `FAIL` present -> exit code non-zero

---

## 6) Conventional Commit Title Rules

PR title format:
- `<type>(<scope>): <summary>`

Examples:
- `docs(governance): align handover baseline with latest minor change log (workflow)`
- `chore(quality): make PR metadata deterministic in pr-helper`
- `feat(pr-helper): add deterministic squash metadata flow`

Notes:
- `--summary` must be human-readable text and should not repeat `type(scope):`
- The helper validates title format before creating a PR

---

## 7) End-to-End Flows

### A) Minor Change Lifecycle

Project Mode default example (downstream live targets):

```bash
# 1) Create branch
scripts/quality/pr-helper.sh branch --workflow minor-change --slug handover-baseline-sync

# 2) Stage intended files
git add docs/entry/chat-handover-protocol.md docs/bmad/notes/minor-change-log.md

# 3) Commit (staged-only)
scripts/quality/pr-helper.sh commit --workflow minor-change --subject "sync handover baseline"

# 4) Push
scripts/quality/pr-helper.sh push

# 5) Create PR
scripts/quality/pr-helper.sh pr-create \
  --workflow minor-change \
  --type docs \
  --scope governance \
  --summary "align handover baseline with latest patch state" \
  --rationale "prevent drift between handover protocol and minor-change log" \
  --files "docs/entry/chat-handover-protocol.md,docs/bmad/notes/minor-change-log.md" \
  --out-of-scope "no governance policy changes" \
  --versioning "SemVer PATCH expected: documentation hygiene" \
  --governance "minor log and handover updates included" \
  --validation "manual review + helper guardrail checks"

# 6) Merge deterministically
scripts/quality/pr-helper.sh pr-merge

# 7) Sync local main
scripts/quality/pr-helper.sh sync-main

# 8) Optional tag (explicit only)
scripts/quality/pr-helper.sh tag --tag vX.Y.Z
```

### B) Feature Implementation Lifecycle

Project Mode default example for feature artifact paths.
Resolve the active mode-aware BMAD feature root via `docs/bmad/guides/CODEX_ENTRY.md`.

```bash
# 1) Create branch
scripts/quality/pr-helper.sh branch --workflow feature-implementation --slug data-export

# 2) Stage intended files
git add src/... docs/bmad/features/data-export/04-deliver.md

# 3) Commit (staged-only)
scripts/quality/pr-helper.sh commit --workflow feature-implementation --scope data-export --subject "implement deliver contract"

# 4) Push
scripts/quality/pr-helper.sh push

# 5) Create PR
scripts/quality/pr-helper.sh pr-create \
  --workflow feature-implementation \
  --type feat \
  --scope data-export \
  --summary "implement deliver contract for export flow" \
  --rationale "execute approved BMAD deliver specification" \
  --files "src/...,docs/bmad/features/data-export/04-deliver.md" \
  --out-of-scope "no unrelated architecture changes" \
  --versioning "SemVer MINOR expected if new behavior is introduced" \
  --governance "deliver/spec alignment verified" \
  --validation "tests + review checklist complete"

# 6) Merge
scripts/quality/pr-helper.sh pr-merge

# 7) Sync
scripts/quality/pr-helper.sh sync-main
```

---

## 8) Troubleshooting

### Dirty working tree
Error pattern:
- `git working tree is not clean...`

Resolution:
- Commit/stash changes first, or use `--allow-dirty` only when intentionally required.

Doctor behavior:
- Usually reported as `WARN` in diagnostics mode.

### Commit staging enforcement
Error patterns:
- `Unstaged changes detected. Run git add before commit.`
- `No staged changes to commit.`

Resolution:
- Stage intended files first, then run commit:
```bash
git add <intended-files>
scripts/quality/pr-helper.sh commit --workflow <workflow> --subject "<summary>"
```

### `gh` auth issues
Error pattern:
- `gh is not authenticated. Run: gh auth login`

Resolution:
```bash
gh auth login
gh auth status
```

Doctor behavior:
- Reported as `WARN` until authenticated.

### Title validation failures
Error pattern:
- `PR title must match Conventional Commits format: <type>(<scope>): <summary>`

Resolution:
- Ensure `--type`, `--scope`, and `--summary` are valid.
- Keep `--summary` human-readable; do not prefix with `type(scope):`.

### Governance check failures (doctor)
Error patterns:
- `FAIL: minor-change workflow (Project Mode): docs/bmad/notes/minor-change-log.md is not modified/staged`
- `FAIL: minor-change workflow (EDB Mode): docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md is not modified/staged`
- `FAIL: planned SemVer tag ... requires <mode-specific chat-handover path> modification`
- `FAIL: detected SemVer version bump requires <mode-specific chat-handover path> modification`

Resolution:
- Update required governance documents before `pr-create`.
- Re-run:
```bash
scripts/quality/pr-helper.sh doctor --workflow minor-change [--tag vX.Y.Z]
```

### Squash title drift (historical)
Historical risk:
- Squash commit message differed from PR metadata.

Current behavior:
- `pr-merge` resolves PR title/body and passes explicit `--subject` and `--body` to squash merge.
- Result: main history stays aligned with PR metadata.
