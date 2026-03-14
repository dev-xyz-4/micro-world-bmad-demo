# Analyze — p1-branch-create-or-switch

## 1) Options Considered
### Option A: Explicit branch name input plus create-and-switch from `main` only
- Summary:
  - Accept one explicit target branch name after `request_branch_change`, and support only the narrowest mutation path needed to leave an unsafe `main` context: create the requested branch and switch to it.
- Pros:
  - Smallest credible step that directly addresses the currently blocked `main` case.
  - Keeps the first mutation slice tightly aligned with the already-implemented hard-stop on `main`.
  - Avoids introducing branch-mode polymorphism or broader branch-management semantics too early.
  - Keeps the operator input surface minimal and easy to validate.
- Cons:
  - Does not support switching to an already-existing branch in the first slice.
  - Does not satisfy voluntary branch-change requests from a non-`main` branch.
- Risks:
  - Operators may expect existing-branch switching and hit a bounded stop instead.
  - Branch-name validation and collision handling still need to be explicit.
- Complexity:
  - Low

### Option B: Explicit branch name input plus `switch-if-exists / create-if-missing`
- Summary:
  - Accept one explicit branch name and let the first slice decide whether to switch to an existing branch or create and switch if it does not exist.
- Pros:
  - Operator input remains simple.
  - Covers more practical cases in one step.
  - Reduces immediate follow-up pressure for an existing-branch switch slice.
- Cons:
  - Introduces branch-existence probing and split mutation semantics in the very first mutation slice.
  - Starts drifting toward broader branch-management behavior rather than the thinnest `main` escape path.
  - Makes failure handling more complex because create and switch branches now share one overloaded command surface.
- Risks:
  - The slice begins to look like generalized branch orchestration rather than a bounded follow-up to `request_branch_change`.
- Complexity:
  - Medium

### Option C (optional): Structured branch-change intent with explicit `create` vs `switch` modes
- Summary:
  - Introduce a small structured input object after `request_branch_change` that carries both target branch reference and requested mutation mode.
- Pros:
  - Semantics are explicit.
  - Later expansion can stay cleaner if more mutation paths are added.
- Cons:
  - Adds a new operator/executor protocol shape before the first mutation slice proves value.
  - More input-surface design than the immediate bounded problem requires.
  - Prematurely broadens the modeling burden for a still-small slice.
- Risks:
  - The slice spends more effort on abstraction shape than on the immediate `main` escape need.
- Complexity:
  - Medium

---

## 2) Decision
- Chosen option:
  - **Option A**
- Rationale (short):
  - The thinnest credible next step is to accept one explicit target branch name and support only create-and-switch from `main`. That directly extends the completed hardening baseline where `main` is now the unsafe blocked state, preserves the existing `P1` executor continuity path, and avoids prematurely turning the first mutation slice into a general branch-management surface.
- Assumptions (explicit):
  - The most urgent blocked case after `WU-019` is the inability to leave `main` once `request_branch_change` has been selected or is required.
  - An explicit branch name is sufficient for the first bounded mutation slice; richer branch-intent objects are not yet necessary.
  - Requests to switch to an already-existing branch, or requests to mutate from non-`main` contexts, can safely remain out of scope for this first mutation implementation.
- Out-of-scope impacts:
  - No switching to an already-existing branch in this first slice.
  - No mutation support for voluntary branch changes from an already-safe non-`main` branch.
  - No branch-existence auto-resolution beyond the narrow create-and-switch contract.
  - No generalized Git workflow orchestration.

---

## 3) Risk Register (minimal)
- Risk:
  - Operators may expect the first mutation slice to switch to an already-existing branch.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Make the first-slice contract explicit: only explicit branch-name input plus create-and-switch from `main`; unsupported mutation requests stop.

- Risk:
  - The requested branch name may already exist, making the narrow create-and-switch path fail.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Preserve the bounded stop policy on create failure rather than silently falling back to switch semantics.

- Risk:
  - The first slice could still drift into broader Git behavior during implementation.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Keep the deliver contract limited to explicit branch name intake, create-and-switch from `main`, and stop-on-unsupported-path behavior only.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option B
  - Why rejected:
    - It adds branch-existence resolution and dual create/switch semantics too early, which broadens the first mutation slice beyond the smallest `main` escape path.

- Approach:
  - Option C
  - Why rejected:
    - It introduces a richer intent protocol before the first bounded mutation slice has proven that anything beyond an explicit branch name is required.
