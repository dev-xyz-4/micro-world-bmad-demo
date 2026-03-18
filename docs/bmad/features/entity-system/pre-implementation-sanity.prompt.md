Read docs/bmad/guides/CODEX_ENTRY.md.
Follow the routing and rules defined there (including the referenced policy).
Work in Documentation-Only Mode.

Perform a pre-implementation sanity check for:
- <feature-root>/entity-system/04-deliver.md

Use:
- `docs/bmad/features/entity-system/01-break.md`
- `docs/bmad/features/entity-system/02-model.md`
- `docs/bmad/features/entity-system/03-analyze.md`
- `docs/bmad/features/entity-system/04-deliver.md`
- `docs/bmad/features/entity-system/questions.md`

Check:
- implementation gates are satisfied for this feature
- `04-deliver.md` is internally consistent with `01-break.md`, `02-model.md`, and `03-analyze.md`
- target files and folders are explicit and minimal
- scope is still tightly bounded to the first `entity-system` slice
- out-of-scope items are explicit enough to prevent rule-engine or UI expansion
- acceptance criteria are objective and testable
- no unresolved product questions remain that should block implementation

Output:
- a short sanity-check note in `<feature-root>/entity-system/pre-implementation-sanity.md`

Constraints:
- Do not write implementation code.
- Do not modify application files.
- Do not modify governance documents unless explicitly instructed.
- Resolve `<feature-root>` via mode-aware routing in `docs/bmad/guides/CODEX_ENTRY.md`.
- If you find a real blocker for implementation, record it clearly and stop before authorizing implementation.
- If no blocker exists, state that the feature is ready for implementation under the current `04-deliver.md`.
