# ORCHESTRATION INDEX

## Purpose

This document is a descriptive startup orientation map for orchestration across the Engineering Delivery Blueprint (EDB).

It clarifies which artifacts are authoritative for routing and policy, and which artifacts are contextual state/briefing helpers.

This index does not replace policy documents.
This document is descriptive, not normative.
This file is not a routing owner and not a policy owner.

---

## Authority Boundary Model

### Routing authority
- `docs/bmad/guides/CODEX_ENTRY.md`
- Role: deterministic entry router for Codex task flow and mode-aware path targeting.

### Policy authority
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- Role: single normative source for Codex behavior.

### State snapshot artifacts
- Live state artifacts are mode-dependent and routed by `docs/bmad/guides/CODEX_ENTRY.md`.
- Role: operational/current-state transfer for new sessions.

### Reusable templates
- BMAD templates: `docs/bmad/templates/*`
- Engineering templates: `docs/engineering/templates/*`
- Role: reusable scaffolds, not authoritative policy or live state.

### Briefing template
- `docs/entry/LLM-bmad-briefing.md`
- Role: contextual briefing scaffold for session startup; not routing/policy authority.

---

## Recommended Startup Path (Descriptive)

1. Read routing entry:
   - `docs/bmad/guides/CODEX_ENTRY.md`
2. Follow routed mandatory reading set:
   - including `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
3. Apply mode-aware target paths from `CODEX_ENTRY.md`:
   - Project Mode or EDB Mode
4. Use handover/baseline artifacts for current state context
5. Use templates only as scaffolds; do not treat templates as live policy/state

---

## Mode Safety

### Project Mode (default)
- Active by default for downstream projects.
- Use mode-specific live targets defined in `docs/bmad/guides/CODEX_ENTRY.md`.

### EDB Mode
- Active only when explicitly enabled (`EDB_MODE=1` or `.planning/EDB_MODE`).
- Use mode-specific live targets defined in `docs/bmad/guides/CODEX_ENTRY.md`.

Do not mix write targets across modes; treat `CODEX_ENTRY.md` as the routing source of truth.

---

## Governance Namespace Clarifier

- Workflow namespace:
  - `Minor Change (workflow)` / `BMAD Feature`
- Version namespace:
  - `SemVer PATCH` / `SemVer MINOR` / `SemVer MAJOR`

These namespaces are orthogonal and must not be conflated.

---

## Related Documents

- `docs/bmad/guides/CODEX_ENTRY.md`
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- `docs/_edb-development-history/ADR-0002-orchestration-entrypoint-architecture.md`
