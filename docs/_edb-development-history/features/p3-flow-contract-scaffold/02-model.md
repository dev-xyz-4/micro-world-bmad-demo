# Model — p3-flow-contract-scaffold

## 1) System Overview (2–5 bullets)
- This model defines the minimal conceptual structure for the first controlled `P3 - BMAD Feature Implementation` starter/scaffold in Documentation-Only Mode.
- Active feature root for this slice is `docs/_edb-development-history/features/p3-flow-contract-scaffold/` (EDB Mode), while mode-aware routing ownership remains in `docs/bmad/guides/CODEX_ENTRY.md`.
- Actors are limited to planner/operator, Codex (Documentation-Only Mode), and reviewer/router.
- Scope is bounded to modeling the starter/scaffold contract; this document is not an implementation contract and does not authorize implementation.
- The next planning-ready state is "ready to draft explicit `04-deliver.md`", not "ready to implement".

## 2) Key Concepts / Terms
- `Feature Root`: mode-resolved BMAD feature artifact root from `CODEX_ENTRY.md`; for this slice: `docs/_edb-development-history/features/p3-flow-contract-scaffold/`.
- `Starter/Scaffold Document Set`: feature-local planning artifacts that make startup deterministic enough for a later explicit `04-deliver.md`.
- `Scope Guard`: explicit in-scope / out-of-scope boundaries that prevent slice expansion.
- `Flow Contract Fields`: required human inputs, stop/clarify triggers, validation evidence minimum, expected outputs, and continuity update expectations.
- `Controlled-P3 Constraints`: "small, bounded, explicit scope" and "no architecture/governance/helper redesign" boundaries inherited from existing Phase-4 decisions.
- `Model-A Boundary`: helper execution boundary remains unchanged; no helper redesign and no silent missing-argument inference.
- `Authority-Layer Separation`: routing is delegation-only, logs are historical-only, templates are structural/reference-only.

## 3) Data Structures
- Name: `ActorSet`
  - Fields:
  - `planner_operator`
  - `codex_docs_only`
  - `reviewer_router`
  - Meaning:
  - Defines who can author, structure-check, and route the first-slice planning artifacts.
  - Invariants:
  - No actor may treat this model as implementation approval.
  - No actor may bypass explicit `04-deliver.md` gating.

- Name: `RequiredInputs`
  - Fields:
  - `feature_slug`
  - `feature_root`
  - `primary_path` (`P3 - BMAD Feature Implementation`)
  - `workflow_classification` (`BMAD Feature`)
  - `controlled_p3_constraints`
  - `flow_contract_minimum_fields`
  - `acceptance_evidence_minimum`
  - `mode_aware_routing_source` (`CODEX_ENTRY.md`)
  - `model_a_boundary`
  - Meaning:
  - Minimal input contract needed to produce bounded starter/scaffold artifacts without guessing.
  - Invariants:
  - `feature_root` is resolved via `CODEX_ENTRY.md`.
  - `primary_path` and workflow classification must remain consistent.
  - Missing required input triggers clarify/stop, not assumption.

- Name: `DerivedOutputs`
  - Fields:
  - `starter_scaffold_docs`
  - `explicit_scope_markers`
  - `explicit_non_scope_markers`
  - `stop_clarify_triggers`
  - `acceptance_evidence_fields`
  - `bounded_continuity_pointers`
  - Meaning:
  - Conceptual outputs this model requires before drafting `04-deliver.md`.
  - Invariants:
  - Outputs stay feature-local unless bounded continuity pointers are explicitly required by execution state changes.
  - Outputs must not redefine routing/policy ownership.

- Name: `StructuralInvariants`
  - Fields:
  - `no_impl_before_deliver`
  - `no_governance_redesign`
  - `no_second_routing_owner`
  - `no_helper_redesign_or_silent_inference`
  - `no_broad_architecture_expansion`
  - `no_cross_domain_authority_leakage`
  - Meaning:
  - Non-negotiable boundaries for this first controlled P3 slice.
  - Invariants:
  - All fields are hard constraints; violation requires stop/clarify.

- Name: `ContinuityPointers`
  - Fields:
  - `feature_local_state` (`01-break.md`, `02-model.md`, `questions.md`)
  - `external_pointer_policy` (only bounded references when state changes require continuity updates)
  - Meaning:
  - Keeps this slice feature-local while allowing explicit, bounded continuity linkage when needed.
  - Invariants:
  - No broad or implicit continuity surface expansion.

## 4) State Machine (if applicable)
### States
- `S0: Controlled-P3-Opened-Unmodeled`
- `S1: Model-Draft-In-Progress`
- `S2: Conceptually-Modeled-And-Bounded`
- `S3: Ready-To-Draft-Explicit-04-Deliver`

### Transitions
- `S0 -> S1`: start `02-model.md` drafting with required input set present.
- `S1 -> S2`: roles, inputs, outputs, invariants, transitions, and failure/drift modes are explicit and bounded.
- `S2 -> S3`: model is consistent with `01-break.md`, no unresolved hidden assumptions, and no new unresolved modeling blockers.
- `S1|S2 -> S1 (rework)`: drift or contradiction found (scope guard gaps, authority leakage risk, or missing evidence fields).
- `Any -> STOP/Clarify`: missing required input or boundary violation that would require unauthorized decisions.

## 5) Algorithms / Rules (if applicable)
- Rule: `FeatureRootResolution`
  - Inputs:
  - active mode context
  - `CODEX_ENTRY.md`
  - Output:
  - concrete feature root path used by this slice
  - Notes:
  - This slice uses EDB Mode feature root; routing ownership is not redefined locally.

- Rule: `ScopeGuardCompletion`
  - Inputs:
  - declared goal/non-goals
  - controlled-P3 constraints
  - Output:
  - explicit bounded scope/non-scope markers
  - Notes:
  - If scope broadens beyond one bounded slice, trigger clarify/stop.

- Rule: `FlowContractFieldCompletion`
  - Inputs:
  - required flow contract fields
  - acceptance/evidence minima
  - Output:
  - starter/scaffold contract skeleton ready for deliver drafting
  - Notes:
  - Missing fields are recorded; do not assume implicit defaults.

- Rule: `ReadinessGateForDeliverDrafting`
  - Inputs:
  - modeled structures + invariants + transition readiness
  - Output:
  - `ready_for_04_deliver_draft` or `not_ready`
  - Notes:
  - `ready_for_04_deliver_draft` does not mean implementation-ready.

## 6) Failure Modes / Edge Cases
- Missing scope guard details cause starter/scaffold drift beyond first bounded slice.
- Required routing evidence is missing or inconsistent with `CODEX_ENTRY.md`.
- Mixed ownership language introduces authority-layer leakage (routing/policy/template/log boundaries blurred).
- Model text implies implementation readiness before explicit `04-deliver.md`.
- Feature-local artifacts drift from active continuity pointers when execution state changes are not reflected.
- Inputs marked resolved in `questions.md` are silently ignored or re-opened without cause.

## 7) Observability (optional)
- Evidence artifacts:
  - Feature-local artifact trail in:
    - `docs/_edb-development-history/features/p3-flow-contract-scaffold/01-break.md`
    - `docs/_edb-development-history/features/p3-flow-contract-scaffold/02-model.md`
    - `docs/_edb-development-history/features/p3-flow-contract-scaffold/questions.md`
- Metrics:
  - `scope_guard_completeness` (explicit in-scope/non-scope present)
  - `invariant_coverage` (all structural invariants explicitly represented)
  - `deliver_draft_readiness` (yes/no based on explicit modeling completeness)
  - `open_modeling_blockers` (count; expected zero for this slice)
