# Analyze — p1-switch-existing-branch

## 1) Options Considered
### Option A: Keep the first switch-existing slice limited to the blocked `main` path
- Summary:
  - Add bounded switch-to-existing-branch behavior only for the path left intentionally open after `WU-020`: blocked `main` plus `request_branch_change`, using one explicit target branch name.
- Pros:
  - Smallest credible extension of the existing branch-mutation baseline.
  - Directly complements the completed create-and-switch-from-main slice without reopening its decisions.
  - Keeps the first switch-existing slice tightly aligned with the already-implemented hard-stop on `main`.
  - Avoids broadening the mutation surface into a general branch-management capability too early.
- Cons:
  - Does not yet cover voluntary branch-change requests from an already-safe non-`main` branch.
- Risks:
  - Operators may expect the new switch-existing capability to work from non-`main` contexts as well.
- Complexity:
  - Low

### Option B: Let the first switch-existing slice cover both blocked `main` and already-safe non-`main` branch-change requests
- Summary:
  - Add bounded switch-existing behavior for both the blocked `main` path and optional branch-change requests from a current non-`main` branch.
- Pros:
  - Covers more practical branch-change cases in one step.
  - Reduces immediate pressure for a later non-`main` follow-up.
- Cons:
  - Broadens the first switch-existing slice beyond the gap left by `WU-020`.
  - Reopens the scope boundary between safety-driven branch change and voluntary branch-management behavior.
  - Adds more decision-space and validation paths than the next bounded gap strictly requires.
- Risks:
  - The slice starts drifting toward a broader branch-management surface rather than a tight follow-up to the blocked `main` path.
- Complexity:
  - Medium

### Option C (optional): Defer switch-existing entirely and jump straight to the broader non-`main` branch-management goal
- Summary:
  - Skip the narrow switch-existing follow-up and instead combine it later with broader non-`main` branch-opening behavior.
- Pros:
  - Reduces the number of intermediate slices.
- Cons:
  - Leaves the current `main`-blocked gap partially unresolved.
  - Wastes the already-opened and well-bounded follow-up path.
  - Increases the chance that the next slice becomes too broad.
- Risks:
  - Scope creep and weaker continuity with the completed mutation baseline.
- Complexity:
  - Medium, and mis-sequenced

---

## 2) Decision
- Chosen option:
  - **Option A**
- Rationale (short):
  - The thinnest credible next step is to keep the first switch-existing slice limited to the blocked `main` path. That directly complements the completed create-and-switch-from-main baseline, closes the most immediate remaining branch-change gap, and avoids prematurely mixing safety-driven branch change with broader non-`main` branch-management behavior.
- Assumptions (explicit):
  - The next bounded gap after `WU-020` is specifically the inability to switch to an already-existing non-`main` branch when the guarded path is blocked on `main` and `request_branch_change` has been selected.
  - One explicit target branch name remains sufficient for the first switch-existing slice; no richer switch intent shape is needed.
  - Voluntary branch switching from an already-safe non-`main` branch can safely remain out of scope for a later bounded follow-up.
- Out-of-scope impacts:
  - No switch-existing behavior from an already-safe non-`main` branch in this first slice.
  - No redesign of the completed create-and-switch-from-main baseline.
  - No generalized Git workflow orchestration.
  - No target-resolution redesign.

---

## 3) Risk Register (minimal)
- Risk:
  - Operators may expect switch-existing to work from non-`main` immediately.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Make the first-slice contract explicit: switch-existing is limited to the blocked `main` path; broader non-`main` behavior is deferred.

- Risk:
  - The target branch may exist but resolve to an unsafe branch context or fail during switch.
  - Likelihood:
    - Medium
  - Impact:
    - Medium
  - Mitigation:
    - Preserve explicit bounded stops for missing existing branch, unsafe target branch, and switch failure.

- Risk:
  - The implementation could still drift toward broader branch-management behavior.
  - Likelihood:
    - Low
  - Impact:
    - High
  - Mitigation:
    - Keep the deliver contract limited to blocked `main` plus explicit target branch name plus switch-existing only.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option B
  - Why rejected:
    - It broadens the first switch-existing slice beyond the smallest remaining gap after `WU-020` and starts mixing safety-driven branch change with broader non-`main` behavior too early.

- Approach:
  - Option C
  - Why rejected:
    - It leaves the current bounded follow-up incomplete and increases the risk that the next mutation slice becomes unnecessarily broad.
