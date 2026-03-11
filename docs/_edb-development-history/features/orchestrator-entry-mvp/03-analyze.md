# Analyze — orchestrator-entry-mvp

## 1) Options Considered
### Option A: CLI-first deterministic Entry MVP with bounded clarify and explicit STOP/Clarify
- Summary:
- Keep v1 as a bounded CLI-first Entry that accepts raw goal text, applies deterministic clarify behavior (max 2 prompts), resolves internal `P1/P2/P3`, assigns visible workflow family (`Minor Change` or `BMAD Feature`), enforces steady-state outcome rules, and emits explicit route-result or stop-result packets.
- Pros:
- Highest routing clarity and deterministic continuation for the smallest implementation surface.
- Preserves explicit separation between internal `primary_path` and visible `workflow_route`.
- Strong authority-boundary safety: no second routing/policy source, no governance drift, no role drift from `CODEX_ENTRY.md` or `CODEX_WORKFLOW_POLICY.md`.
- Fits current Phase-4 extension points (human-first v1, machine-ready structure later) without introducing presentation-layer overhead.
- Creates practical operator value beyond prompt-only flow by standardizing bounded classify/clarify/emit behavior.
- Keeps `scripts/quality/flow-contract-starter.mjs` correctly positioned as low-level primitive behind (`P3`, `BMAD Feature`) only.
- Cons:
- No enhanced clarify assistance beyond deterministic rule-based prompts in v1.
- CLI-only presentation may be less discoverable than UI for some operators.
- Risks:
- If deterministic clarify prompts are underspecified later, STOP frequency may be higher than expected.
- If separation of path vs workflow is communicated poorly in later implementation, operators may still conflate labels.
- Complexity:
- Low and bounded; best fit for first practical Entry MVP slice.

### Option B: CLI-first Entry MVP with optional bounded AI-assisted clarify helper (non-authoritative)
- Summary:
- Keep the same CLI-first deterministic core as Option A, but allow an optional helper for clarify phrasing/support. Routing correctness still depends on deterministic core rules; helper output is advisory only and bounded.
- Pros:
- Can improve operator ergonomics in ambiguous goal phrasing without changing authoritative routing logic.
- Maintains path/route separation if helper remains non-authoritative.
- Could reduce clarify friction while retaining explicit STOP behavior.
- Cons:
- Adds governance and implementation guardrails to prevent helper from becoming implicit routing authority.
- Increases surface area for v1 testing and boundary enforcement.
- Raises failure-mode complexity around helper suggestions vs deterministic decision trace.
- Risks:
- High drift risk if “optional helper” is interpreted as required for correct routing.
- Elevated risk of accidental second policy/routing semantics through prompt behavior.
- Complexity:
- Medium; bounded only if helper remains strictly optional and non-authoritative.

### Option C (optional): UI-first / Vite-style Entry surface
- Summary:
- Build v1 around a UI-first entry experience with interactive clarify and routing presentation.
- Pros:
- Potentially higher initial usability for interactive onboarding and visualization.
- Could later support richer state display.
- Cons:
- Significantly larger presentation-layer scope than the bounded MVP objective.
- Weak fit for current CLI-first Work Unit boundary and current non-UI scope constraints.
- Adds substantial implementation complexity before core routing contract is hardened.
- Risks:
- High risk of scope expansion, timeline slip, and boundary drift.
- Higher chance of introducing duplicate entry semantics between UI flows and routing-owner documents.
- Complexity:
- High; not appropriate for first bounded v1 slice.

---

## 2) Decision
- Chosen option:
- Option A (CLI-first deterministic Entry MVP with bounded clarify and explicit STOP/Clarify).
- Rationale (short):
- Option A is the smallest shape that creates real routing gain now: deterministic continuation, explicit ambiguity handling, preserved `primary_path` vs `workflow_route` separation, and clear authority-boundary safety.
- Option B is viable only as a later bounded extension after deterministic core behavior is implemented and proven.
- Option C is a presentation-layer expansion that violates the bounded first-slice intent.
- Assumptions (explicit):
- Supported v1 internal primary-path subset remains `P1`, `P2`, `P3` only.
- Visible workflow families remain `Minor Change` and `BMAD Feature` only.
- Supported steady-state outcomes remain:
  - (`P1`, `Minor Change`)
  - (`P1`, `BMAD Feature`)
  - (`P2`, `Minor Change`)
  - (`P3`, `BMAD Feature`)
- (`P2`, `BMAD Feature`) remains invalid in steady state and must reclassify to `P3`.
- `scripts/quality/flow-contract-starter.mjs` remains a low-level primitive behind (`P3`, `BMAD Feature`), not the Entry and not a routing owner.
- Version classification for this documentation-only analysis step: `no SemVer change`.
- Out-of-scope impacts:
- No code implementation in this step.
- No new routing owner, policy owner, workflow family, or primary path.
- No UI/Vite scope in v1.
- No replacement of the existing governed Git-/PR execution path; the Entry remains routing-centered and emits next-step direction only.

---

## 3) Risk Register (minimal)
- Risk:
  - Deterministic clarify prompts may still leave some real-world goals unresolved within 2 prompts.
  - Likelihood:
  - Medium.
  - Impact:
  - Medium (more STOP/Clarify outcomes).
  - Mitigation:
  - Keep stop-result packet explicit and actionable; refine clarify prompts in later bounded slices without changing authority boundaries.
- Risk:
  - Path/route label conflation during implementation communication.
  - Likelihood:
  - Medium.
  - Impact:
  - High (misrouting and policy confusion).
  - Mitigation:
  - Enforce explicit dual-field outputs (`primary_path`, `workflow_route`) and keep invalid pair normalization rule visible.
- Risk:
  - Optional helper concept (Option B) could be introduced too early as de facto authority.
  - Likelihood:
  - Low (if deferred), Medium (if prematurely added).
  - Impact:
  - High.
  - Mitigation:
  - Defer helper to later slice; require deterministic core-first acceptance before any assistive extension.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option C as v1 default (UI-first / Vite-first Entry).
  - Why rejected:
  - Too broad for bounded v1 scope; adds presentation-layer complexity before core deterministic routing contract is stabilized.
- Approach:
  - Option B as mandatory v1 behavior (AI-assisted clarify required for correct routing).
  - Why rejected:
  - Creates avoidable authority/boundary risk and larger initial surface; conflicts with deterministic core-first objective.
