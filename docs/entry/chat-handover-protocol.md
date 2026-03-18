# CHAT_HANDOVER_PROTOCOL

Reusable project bootstrap scaffold (entry-surface placement for usability).
Non-authoritative: not routing authority, not policy authority.
Use as a starting point for new projects/sessions.

## Purpose

This document is a state snapshot for continuity between chat sessions.
It should contain current project context, not policy definitions.
Mode-specific live write targets are defined in `docs/bmad/guides/CODEX_ENTRY.md` and should not be restated here.

For authoritative routing and governance behavior, use:
- `docs/bmad/guides/CODEX_ENTRY.md`
- `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- `docs/entry/ORCHESTRATION_INDEX.md`

---

# 1. Repository Purpose

This repository is a Rule-Driven Micro World demo built with the BMAD workflow.

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

# 2. Operating References

Use links instead of duplicating governance text:

- Routing and mode-aware targets:
  `docs/bmad/guides/CODEX_ENTRY.md`
- Policy and workflow behavior:
  `docs/bmad/guides/CODEX_WORKFLOW_POLICY.md`
- Startup map and authority boundaries:
  `docs/entry/ORCHESTRATION_INDEX.md`
- Current session bootstrap:
  `docs/entry/LLM-bmad-briefing.md`

---

# 3. Current Repository State

Latest Tag:
v0.3.0

Governance Baseline Includes:

- BMAD project documentation for scope, architecture overview, risk profile, and glossary
- Isolated React + Vite demo app in `micro-world-app/`
- Completed BMAD feature documentation for `entity-system`
- Completed BMAD feature documentation for `rule-engine`

Notes:
- `entity-system` is implemented and included in the released baseline.
- `rule-engine` is implemented and included in the released baseline.
- The current demo baseline now includes:
  - `10` entities
  - delta-based movement
  - simple bounds behavior
  - one explicit global swirl rule applied before movement updates
  - glow-focused rendering with subtle hue variation
  - extracted local simulation parameters
  - small readability refactors in the frame loop
- `npm run build` passes for the current app state.
- `npm run dev -- --host 127.0.0.1` starts successfully in local verification.

---

# 4. Current Focus

- choose the next bounded enhancement after `v0.3.0`
- keep demo-facing minors small and reversible
- use BMAD for the next real behavior extension, such as attraction or repulsion

---

# 5. Instructions for New Chat

When starting a new ChatGPT session:

1. Provide this file.
2. State:
   - Current version
   - Next target
   - Whether change is Minor or Feature
3. Request template-conform BMAD prompt generation if applicable.
