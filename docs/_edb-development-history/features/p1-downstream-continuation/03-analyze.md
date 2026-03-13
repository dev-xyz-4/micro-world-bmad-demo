# Analyze — p1-downstream-continuation

## 1) Options Considered
### Option A: Entry emits the `P1` contract, but the contract definition lives outside the Entry
- Summary:
- Keep `scripts/quality/orchestrator-entry.mjs` as the routing and contract-emission surface, but move the actual `P1 / Minor Change` contract definition into a consistent external contract surface. The Entry selects/loads the contract and emits it in the existing `route-result`.
- Pros:
- Best fit for the accepted Phase-4 placement rule.
- Preserves the routing-first role of the Entry while keeping contract definitions reusable and centrally organized outside the Entry.
- Avoids turning the Entry into a long inlined contract registry as more path families appear.
- Keeps the first `P1` slice bounded while still allowing later `P2–P5` growth to remain structurally clean.
- Preserves the existing decision that the first `P1` contract is emitted by the Entry.
- Cons:
- Slightly broader first implementation surface than “one file only”, because contract definition placement is now external.
- Requires a minimal contract-selection/loading boundary even for the first slice.
- Risks:
- If contract grouping is underspecified later, contract surfaces could still become inconsistent.
- Complexity:
- Low to medium; still bounded and cleanly aligned to the accepted placement model.

### Option B: Entry both defines and emits the `P1` contract inline
- Summary:
- Keep the first executable slice entirely inside `scripts/quality/orchestrator-entry.mjs`, with the contract definition and contract emission both living in the Entry.
- Pros:
- Smallest short-term implementation surface in pure file-count terms.
- No extra contract-loading boundary is needed in the first slice.
- Cons:
- Directly conflicts with the accepted placement rule that contracts should live outside the Entry.
- Creates structural precedent that later contracts might also accumulate inside the Entry.
- Makes the first slice look simpler than it really is, while increasing long-term drift risk.
- Risks:
- High risk that the Entry becomes the de facto storage location for downstream contracts.
- Complexity:
- Low now, but structurally expensive later.

### Option C (optional): Entry routes only; a separate continuation surface defines and emits the `P1` contract
- Summary:
- Keep the Entry restricted to routing output and push both contract definition and contract emission into a second bounded continuation surface.
- Pros:
- Strongest separation between routing and continuation.
- Keeps the Entry maximally thin.
- Cons:
- Reopens the already-accepted bounded decision that the first `P1 / Minor Change` contract is emitted by the Entry.
- Adds another operational surface too early for the first slice.
- Produces more structure than the current bounded `P1` slice needs.
- Risks:
- Higher handoff complexity and duplication risk between route result and continuation input.
- Complexity:
- Medium to high for the first slice.

---

## 2) Decision
- Chosen option:
- Option A.
- Rationale (short):
- Option A is the thinnest implementation shape that remains consistent with the accepted placement decision. It keeps the Entry as the front door and contract-emission surface, but stops short of embedding the contract definitions inside `scripts/quality/orchestrator-entry.mjs`.
- Assumptions (explicit):
- The first executable slice remains limited to `P1 / Minor Change` only.
- The Entry remains the place where the `P1` contract is emitted.
- The contract definition itself should be treated as an external, path-aware artifact/surface rather than as in-Entry structure.
- Real downstream execution remains outside the Entry and outside this first bounded slice.
- Version classification for this documentation-only analysis step remains `no SemVer change`.
- Out-of-scope impacts:
- No continuation behavior for `P2`, `P3`, or `P1 / BMAD Feature`.
- No branch automation, PR-helper execution, UI/Vite work, or generalized continuation-engine behavior.
- No governance or routing-owner changes.

---

## 3) Risk Register (minimal)
- Risk:
  - Contract definition grouping remains under-specified after this first revision.
  - Likelihood:
  - Medium.
  - Impact:
  - Medium.
  - Mitigation:
  - Keep the first slice minimal and define only the smallest external contract location needed for `P1`.
- Risk:
  - The Entry still grows too much by carrying too much continuation logic beyond emission.
  - Likelihood:
  - Medium.
  - Impact:
  - High.
  - Mitigation:
  - Keep the Entry limited to selection/loading/emission of the contract and preserve execution outside the Entry.
- Risk:
  - Later work reintroduces inline contract definitions inside the Entry for convenience.
  - Likelihood:
  - Medium.
  - Impact:
  - High.
  - Mitigation:
  - Treat external contract placement as the accepted rule and review future slices against it.

---

## 4) Rejected Approaches (if any)
- Approach:
  - Option B.
  - Why rejected:
  - It contradicts the accepted placement rule by keeping the contract definition inside the Entry and would create the wrong structural precedent.
- Approach:
  - Option C.
  - Why rejected:
  - It separates emission from the Entry too early and reopens a bounded decision that should remain stable for the first slice.
