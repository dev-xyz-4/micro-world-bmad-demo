#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="$(basename "$0")"

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi
cd "$REPO_ROOT"

TEMPLATE_DIR="docs/bmad/templates"

# Mode-aware governance routing:
# - Project Mode (default): downstream live docs
# - EDB Mode: blueprint self-history docs
MODE="project"
# .planning/EDB_MODE is expected to be gitignored (local development only)
if [[ "${EDB_MODE:-0}" == "1" || -f ".planning/EDB_MODE" ]]; then
  MODE="edb"
fi

if [[ "$MODE" == "edb" ]]; then
  MODE_LABEL="EDB Mode"
  MINOR_LOG_PATH="docs/_edb-development-history/EDB_MINOR_CHANGE_LOG.md"
  HANDOVER_PATH="docs/_edb-development-history/EDB_CHAT_HANDOVER_PROTOCOL.md"
  BASELINE_PATH="docs/_edb-development-history/EDB_ENGINEERING_BASELINE.md"
else
  MODE_LABEL="Project Mode"
  MINOR_LOG_PATH="docs/bmad/notes/minor-change-log.md"
  HANDOVER_PATH="docs/engineering/chat-handover-protocol.md"
  BASELINE_PATH="docs/engineering/engineering-baseline.md"
fi

log() {
  printf '%s\n' "$*"
}

err() {
  printf 'Error: %s\n' "$*" >&2
}

require_clean_git() {
  local allow_dirty="${1:-false}"
  if [[ "$allow_dirty" == "true" ]]; then
    return 0
  fi
  if [[ -n "$(git status --porcelain)" ]]; then
    err "git working tree is not clean. Commit/stash changes or pass --allow-dirty."
    exit 1
  fi
}

require_not_main() {
  local branch
  branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$branch" == "main" ]]; then
    err "current branch is 'main'. Switch to a non-main branch first."
    exit 1
  fi
}

require_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    err "GitHub CLI (gh) is not installed."
    exit 1
  fi
  if ! gh auth status >/dev/null 2>&1; then
    err "gh is not authenticated. Run: gh auth login"
    exit 1
  fi
}

slugify() {
  local raw="$1"
  echo "$raw" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-{2,}/-/g'
}

declare -A WORKFLOW_TEMPLATE=()
declare -A WORKFLOW_FOUND=()

init_workflow_state() {
  WORKFLOW_TEMPLATE=(
    [documentation-only]=""
    [feature-implementation]=""
    [minor-change]=""
  )
  WORKFLOW_FOUND=(
    [documentation-only]="no"
    [feature-implementation]="no"
    [minor-change]="no"
  )
}

detect_templates() {
  init_workflow_state
  if [[ ! -d "$TEMPLATE_DIR" ]]; then
    return 0
  fi

  local file base
  while IFS= read -r file; do
    base="$(basename "$file")"
    case "$base" in
      documentation-only.prompt.md)
        WORKFLOW_TEMPLATE[documentation-only]="$file"
        WORKFLOW_FOUND[documentation-only]="yes"
        ;;
      feature-implementation.prompt.md)
        WORKFLOW_TEMPLATE[feature-implementation]="$file"
        WORKFLOW_FOUND[feature-implementation]="yes"
        ;;
      minor-change.prompt.md)
        WORKFLOW_TEMPLATE[minor-change]="$file"
        WORKFLOW_FOUND[minor-change]="yes"
        ;;
    esac
  done < <(find "$TEMPLATE_DIR" -maxdepth 1 -type f -name '*.prompt.md' | sort)
}

print_template_detection() {
  detect_templates
  log "Detected prompt templates in $TEMPLATE_DIR:"
  local wf
  for wf in documentation-only feature-implementation minor-change; do
    if [[ "${WORKFLOW_FOUND[$wf]}" == "yes" ]]; then
      log "  - $wf -> ${WORKFLOW_TEMPLATE[$wf]}"
    else
      log "  - $wf -> MISSING"
    fi
  done
}

require_workflow() {
  local wf="$1"
  detect_templates
  case "$wf" in
    documentation-only|feature-implementation|minor-change) ;;
    *)
      err "invalid workflow '$wf'. Use: documentation-only | feature-implementation | minor-change"
      exit 1
      ;;
  esac

  if [[ "${WORKFLOW_FOUND[$wf]}" != "yes" ]]; then
    err "workflow '$wf' unavailable: corresponding template not found under $TEMPLATE_DIR"
    print_template_detection
    exit 1
  fi
}

branch_prefix_for_workflow() {
  local wf="$1"
  if [[ "$wf" == "minor-change" ]]; then
    echo "minor"
  else
    echo "feature"
  fi
}

default_commit_type_for_workflow() {
  local wf="$1"
  case "$wf" in
    minor-change) echo "docs" ;;
    feature-implementation) echo "feat" ;;
    documentation-only) echo "docs" ;;
    *) echo "chore" ;;
  esac
}

default_pr_title_for() {
  local type="$1"
  local scope="$2"
  local summary="$3"
  echo "${type}(${scope}): ${summary}"
}

is_conventional_title() {
  local title="$1"
  [[ "$title" =~ ^[a-z]+\([a-zA-Z0-9._/-]+\):[[:space:]].+ ]]
}

print_help() {
  print_template_detection
  cat <<'USAGE'

Usage:
  pr-helper.sh help
  pr-helper.sh detect
  pr-helper.sh doctor [--workflow <workflow>] [--tag vX.Y.Z]

  pr-helper.sh branch --workflow <workflow> --slug <slug> [--allow-dirty]
  pr-helper.sh commit --workflow <workflow> [--type <type>] [--scope <scope>] (--subject <text> | --message <msg>) [--allow-dirty]
  pr-helper.sh push [--allow-dirty]
  pr-helper.sh pr-create --workflow <workflow> --type <type> --scope <scope> --summary <summary> \
    --rationale <why> --files <file1,file2,...> --out-of-scope <text> --versioning <semver-note> \
    --governance <text> --validation <text> [--base <branch>] [--allow-dirty]
  pr-helper.sh pr-merge [--allow-dirty]
  pr-helper.sh sync-main [--allow-dirty]
  pr-helper.sh tag --tag vX.Y.Z [--allow-dirty]

Workflows:
  - documentation-only
  - feature-implementation
  - minor-change

Examples:
  pr-helper.sh doctor --workflow minor-change
  pr-helper.sh doctor --workflow minor-change --tag v1.8.8
  EDB_MODE=1 pr-helper.sh doctor --workflow minor-change
  pr-helper.sh branch --workflow minor-change --slug handover-baseline-sync
  pr-helper.sh commit --workflow minor-change --subject "sync handover baseline"
  pr-helper.sh push
  pr-helper.sh pr-create --workflow minor-change --type docs --scope governance \
    --summary "align handover baseline with latest patch state" \
    --rationale "prevent drift between handover and minor-change log" \
    --files "docs/engineering/chat-handover-protocol.md,docs/bmad/notes/minor-change-log.md" \
    --out-of-scope "no governance policy changes" \
    --versioning "SemVer PATCH expected (documentation hygiene only)" \
    --governance "minor log updated; handover baseline synchronized" \
    --validation "manual doc review + helper command checks"
  pr-helper.sh pr-merge
  pr-helper.sh sync-main
  pr-helper.sh tag --tag v1.9.0
USAGE
}

DOCTOR_FAIL_COUNT=0

doctor_pass() {
  log "PASS: $*"
}

doctor_warn() {
  log "WARN: $*"
}

doctor_fail() {
  log "FAIL: $*"
  DOCTOR_FAIL_COUNT=$((DOCTOR_FAIL_COUNT + 1))
}

file_is_modified_or_staged() {
  local path="$1"
  [[ -n "$(git status --porcelain -- "$path")" ]]
}

minor_log_version_bump_detected() {
  git diff -- "$MINOR_LOG_PATH" | grep -Eq '^\+\| v[0-9]+\.[0-9]+\.[0-9]+ \|'
}

run_doctor() {
  local wf="" planned_tag=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --workflow) wf="$2"; shift 2 ;;
      --tag) planned_tag="$2"; shift 2 ;;
      *) err "unknown option for doctor: $1"; exit 1 ;;
    esac
  done

  DOCTOR_FAIL_COUNT=0

  log "Repo root: $REPO_ROOT"
  log "Mode: $MODE_LABEL"
  log "Mode targets: log=$MINOR_LOG_PATH handover=$HANDOVER_PATH baseline=$BASELINE_PATH"
  if [[ "$MODE" == "edb" && ! -d ".planning" ]]; then
    doctor_warn "EDB_MODE active but .planning directory missing."
  fi
  log "Current branch: $(git rev-parse --abbrev-ref HEAD)"
  if [[ -n "$(git status --porcelain)" ]]; then
    doctor_warn "git working tree is DIRTY"
  else
    doctor_pass "git working tree is CLEAN"
  fi

  if command -v gh >/dev/null 2>&1; then
    if gh auth status >/dev/null 2>&1; then
      doctor_pass "gh is installed and authenticated"
    else
      doctor_warn "gh is installed but NOT authenticated"
    fi
  else
    doctor_warn "gh is NOT installed"
  fi

  print_template_detection

  if [[ -n "$wf" ]]; then
    require_workflow "$wf"
  fi

  log "Governance diagnostics:"

  if [[ -f "$MINOR_LOG_PATH" ]]; then
    doctor_pass "mode target exists: $MINOR_LOG_PATH"
  else
    doctor_fail "mode target missing: $MINOR_LOG_PATH"
  fi
  if [[ -f "$HANDOVER_PATH" ]]; then
    doctor_pass "mode target exists: $HANDOVER_PATH"
  else
    doctor_fail "mode target missing: $HANDOVER_PATH"
  fi
  if [[ -f "$BASELINE_PATH" ]]; then
    doctor_pass "mode target exists: $BASELINE_PATH"
  else
    doctor_warn "mode target missing (optional in some repositories): $BASELINE_PATH"
  fi

  if [[ "$wf" == "minor-change" ]]; then
    if file_is_modified_or_staged "$MINOR_LOG_PATH"; then
      doctor_pass "minor-change workflow ($MODE_LABEL): $MINOR_LOG_PATH is modified/staged"
    else
      doctor_fail "minor-change workflow ($MODE_LABEL): $MINOR_LOG_PATH is not modified/staged"
    fi
  else
    doctor_warn "minor-change governance check skipped (use --workflow minor-change to enforce)"
  fi

  local version_bump_detected="false"
  if minor_log_version_bump_detected; then
    version_bump_detected="true"
    doctor_warn "SemVer version bump detected in $MINOR_LOG_PATH"
  else
    doctor_pass "no SemVer version bump detected in $MINOR_LOG_PATH"
  fi

  if [[ -n "$planned_tag" || "$version_bump_detected" == "true" ]]; then
    if file_is_modified_or_staged "$HANDOVER_PATH"; then
      doctor_pass "SemVer/tag governance ($MODE_LABEL): $HANDOVER_PATH is modified"
    else
      if [[ -n "$planned_tag" ]]; then
        doctor_fail "planned SemVer tag '$planned_tag' requires $HANDOVER_PATH modification ($MODE_LABEL)"
      else
        doctor_fail "detected SemVer version bump requires $HANDOVER_PATH modification ($MODE_LABEL)"
      fi
    fi
    if [[ -f "$BASELINE_PATH" ]]; then
      if file_is_modified_or_staged "$BASELINE_PATH"; then
        doctor_pass "SemVer/tag context ($MODE_LABEL): $BASELINE_PATH is modified"
      else
        doctor_warn "SemVer/tag context ($MODE_LABEL): $BASELINE_PATH not modified"
      fi
    fi
  else
    doctor_warn "handover update check skipped (no --tag and no detected version bump)"
  fi

  if [[ "$DOCTOR_FAIL_COUNT" -gt 0 ]]; then
    err "doctor found $DOCTOR_FAIL_COUNT FAIL condition(s)."
    exit 1
  fi
}

cmd_branch() {
  local wf="" slug="" allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --workflow) wf="$2"; shift 2 ;;
      --slug) slug="$2"; shift 2 ;;
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for branch: $1"; exit 1 ;;
    esac
  done

  [[ -n "$wf" ]] || { err "--workflow is required"; exit 1; }
  [[ -n "$slug" ]] || { err "--slug is required"; exit 1; }

  require_clean_git "$allow_dirty"
  require_workflow "$wf"

  local safe_slug prefix target
  safe_slug="$(slugify "$slug")"
  prefix="$(branch_prefix_for_workflow "$wf")"
  target="$prefix/$safe_slug"

  git checkout -b "$target"
  log "Created branch: $target"
  log "Next: $SCRIPT_NAME commit --workflow $wf --subject \"<summary>\""
}

cmd_commit() {
  local wf="" type="" scope="" subject="" message="" allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --workflow) wf="$2"; shift 2 ;;
      --type) type="$2"; shift 2 ;;
      --scope) scope="$2"; shift 2 ;;
      --subject) subject="$2"; shift 2 ;;
      --message) message="$2"; shift 2 ;;
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for commit: $1"; exit 1 ;;
    esac
  done

  [[ -n "$wf" ]] || { err "--workflow is required"; exit 1; }
  require_workflow "$wf"
  require_not_main

  if ! git diff --quiet; then
    err "Unstaged changes detected. Run git add before commit."
    exit 1
  fi

  if git diff --cached --quiet; then
    err "No staged changes to commit."
    exit 1
  fi

  if [[ -z "$message" ]]; then
    [[ -n "$subject" ]] || { err "--subject is required when --message is not provided"; exit 1; }
    if [[ -z "$type" ]]; then
      type="$(default_commit_type_for_workflow "$wf")"
    fi
    if [[ -n "$scope" ]]; then
      message="$type($scope): $subject"
    else
      message="$type: $subject"
    fi
  fi

  git commit -m "$message"

  log "Committed: $message"
  log "Next: $SCRIPT_NAME push"
}

cmd_push() {
  local allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for push: $1"; exit 1 ;;
    esac
  done
  require_clean_git "$allow_dirty"
  require_not_main

  local branch
  branch="$(git rev-parse --abbrev-ref HEAD)"
  git push -u origin "$branch"

  log "Pushed branch: $branch"
  log "Next: $SCRIPT_NAME pr-create --workflow <workflow> --slug <slug>"
}

cmd_pr_create() {
  local wf="" slug="" type="" scope="" summary="" rationale="" files="" out_of_scope="" versioning_note="" governance_note="" validation_note="" base="main" title="" allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --workflow) wf="$2"; shift 2 ;;
      --slug) slug="$2"; shift 2 ;;
      --type) type="$2"; shift 2 ;;
      --scope) scope="$2"; shift 2 ;;
      --summary) summary="$2"; shift 2 ;;
      --rationale) rationale="$2"; shift 2 ;;
      --files) files="$2"; shift 2 ;;
      --out-of-scope) out_of_scope="$2"; shift 2 ;;
      --versioning) versioning_note="$2"; shift 2 ;;
      --governance) governance_note="$2"; shift 2 ;;
      --validation) validation_note="$2"; shift 2 ;;
      --base) base="$2"; shift 2 ;;
      --title) title="$2"; shift 2 ;;
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for pr-create: $1"; exit 1 ;;
    esac
  done

  [[ -n "$wf" ]] || { err "--workflow is required"; exit 1; }

  local missing_required=()
  [[ -n "$summary" ]] || missing_required+=("--summary")
  [[ -n "$rationale" ]] || missing_required+=("--rationale")
  [[ -n "$files" ]] || missing_required+=("--files")
  [[ -n "$out_of_scope" ]] || missing_required+=("--out-of-scope")
  [[ -n "$versioning_note" ]] || missing_required+=("--versioning")
  [[ -n "$governance_note" ]] || missing_required+=("--governance")
  [[ -n "$validation_note" ]] || missing_required+=("--validation")

  if [[ ${#missing_required[@]} -gt 0 ]]; then
    err "pr-create missing required argument(s): ${missing_required[*]}"
    log "Use the full explicit helper command with all required arguments."
    log "Required set: --workflow --type --scope --summary --rationale --files --out-of-scope --versioning --governance --validation"
    log "Example:"
    log "  $SCRIPT_NAME pr-create --workflow <workflow> --type <type> --scope <scope> --summary \"<human summary>\" --rationale \"<why>\" --files \"<file1,file2,...>\" --out-of-scope \"<non-goals>\" --versioning \"<semver note>\" --governance \"<governance notes>\" --validation \"<checks done / planned>\""
    print_help
    exit 1
  fi

  require_clean_git "$allow_dirty"
  require_gh
  require_workflow "$wf"
  require_not_main

  local head body_file safe_scope
  head="$(git rev-parse --abbrev-ref HEAD)"
  if [[ -z "$scope" && -n "$slug" ]]; then
    scope="$(slugify "$slug")"
    log "Note: --slug is deprecated for pr-create; use --scope explicitly."
  fi
  [[ -n "$scope" ]] || {
    err "--scope is required (or provide --slug to derive it)."
    log "Use explicit --scope for deterministic PR title generation."
    print_help
    exit 1
  }
  safe_scope="$(slugify "$scope")"

  if [[ -z "$type" ]]; then
    type="$(default_commit_type_for_workflow "$wf")"
  fi
  if [[ -z "$title" ]]; then
    title="$(default_pr_title_for "$type" "$safe_scope" "$summary")"
  fi
  if ! is_conventional_title "$title"; then
    err "PR title must match Conventional Commits format: <type>(<scope>): <summary>"
    exit 1
  fi

  body_file="$(mktemp)"
  cat > "$body_file" <<EOF_BODY
## Rationale
$rationale

## Scope
- Workflow: $wf
- Key files: $files
- Branch: $head

## Out of scope
$out_of_scope

## Versioning
$versioning_note

## Governance
$governance_note

## Validation
$validation_note
EOF_BODY

  gh pr create --base "$base" --head "$head" --title "$title" --body-file "$body_file"
  rm -f "$body_file"

  log "PR created from $head -> $base"
  log "Next: $SCRIPT_NAME pr-merge"
}

cmd_pr_merge() {
  local allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --allow-dirty) allow_dirty="true"; shift ;;
      --tag)
        err "tagging requires explicit command: $SCRIPT_NAME tag --tag vX.Y.Z"
        exit 1
        ;;
      *) err "unknown option for pr-merge: $1"; exit 1 ;;
    esac
  done

  require_clean_git "$allow_dirty"
  require_gh
  require_not_main

  local pr_title pr_body
  pr_title="$(gh pr view --json title --jq .title)"
  pr_body="$(gh pr view --json body --jq .body)"
  if [[ -z "$pr_title" || -z "$pr_body" ]]; then
    err "could not resolve PR title/body for deterministic squash commit."
    exit 1
  fi

  gh pr merge --squash --delete-branch --subject "$pr_title" --body "$pr_body"

  log "PR merged with deterministic squash subject/body and remote branch deletion."
  log "Next: $SCRIPT_NAME sync-main"
}

cmd_sync_main() {
  local allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for sync-main: $1"; exit 1 ;;
    esac
  done

  require_clean_git "$allow_dirty"

  local current
  current="$(git rev-parse --abbrev-ref HEAD)"

  git checkout main
  git pull --ff-only origin main

  if [[ "$current" != "main" ]]; then
    git branch -d "$current" || true
  fi

  log "Local main synced."
  if [[ "$current" != "main" ]]; then
    log "Attempted local branch cleanup: $current"
  fi
  log "Optional next step: $SCRIPT_NAME tag --tag vX.Y.Z"
}

cmd_tag() {
  local tag="" allow_dirty="false"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --tag) tag="$2"; shift 2 ;;
      --allow-dirty) allow_dirty="true"; shift ;;
      *) err "unknown option for tag: $1"; exit 1 ;;
    esac
  done

  require_clean_git "$allow_dirty"

  if [[ -z "$tag" ]]; then
    err "refusing to tag without explicit --tag vX.Y.Z"
    exit 1
  fi

  if ! [[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    err "tag must match vX.Y.Z"
    exit 1
  fi

  git tag "$tag"
  git push origin "$tag"

  log "Created and pushed tag: $tag"
}

main() {
  local cmd="${1:-help}"
  shift || true

  case "$cmd" in
    help|-h|--help) print_help ;;
    detect) print_template_detection ;;
    doctor) run_doctor "$@" ;;
    branch) cmd_branch "$@" ;;
    commit) cmd_commit "$@" ;;
    push) cmd_push "$@" ;;
    pr-create) cmd_pr_create "$@" ;;
    pr-merge) cmd_pr_merge "$@" ;;
    sync-main) cmd_sync_main "$@" ;;
    tag) cmd_tag "$@" ;;
    *)
      err "unknown command: $cmd"
      print_help
      exit 1
      ;;
  esac
}

main "$@"
