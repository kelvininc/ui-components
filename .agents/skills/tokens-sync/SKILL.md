---
name: tokens-sync
description: >-
    Sync the design token JSON files in packages/ui-components/tokens/ from the Figma variables
    table via the Figma MCP, without running the Figma plugin, then rebuild the CSS. Use when asked
    to update, sync, import or pull design tokens (or variables) from Figma, when a Figma variable
    changed and the code must follow, or after the Design System Foundations file changed.
---

# Tokens sync (Figma MCP)

Regenerates the variable-based token files from the Figma variables table in **Design System
Foundations** (file key `GCzRjer0v9tPZ4JnRmNpRW`), using `use_figma` to run the same export logic as
the `packages/ui-components/figma-plugin` plugin — collections, light/dark modes and `{alias}`
references included. No Figma Enterprise plan, REST token or manual plugin run needed.

Covers everything that is a Figma **variable**. `tokens/styles/text.json` comes from Figma text
*styles*, which `use_figma` does not export the same way — that file stays on the manual plugin flow
(`figma-plugin/README.md`).

## 1. Read the collections

Load the `figma-use` skill (MANDATORY before `use_figma`), `create_session` on the file key, then:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
return collections.map(c => ({ name: c.name, id: c.id, varCount: c.variableIds.length, modes: c.modes.map(m => ({ id: m.modeId, name: m.name })) }));
```

Collection and mode ids can change if collections are recreated — always read them fresh instead of
reusing the ids from a previous run.

## 2. Export each collection/mode as flat entries

For each output file below, run [export-vars.js](export-vars.js) through `use_figma`, replacing
`__COLLECTION_ID__`, `__MODE_ID__`, `__START__` and `__END__`. Slice big collections (≤300 variables
per call, Rule 21 of figma-use) and run independent calls in parallel. Save each call's JSON return
verbatim to a scratchpad file (one part per call).

| Collection | Mode | Output file |
| --- | --- | --- |
| Foundations (Primitives) | single | `core/foundations_primitives.json` |
| Tipography | single | `core/tipography.json` |
| Spacing | single | `core/spacing.json` |
| Icon | single | `core/icon.json` |
| Color | Dark | `semantic/dark.json` |
| Color | Light | `semantic/light.json` |
| Component Semantics | single | `components/component_semantics.json` |

Every export must come back with `issues: []`. A non-empty `issues` list means an unresolved alias or
an unknown value shape — stop and investigate before writing files (the conversion rules in
`export-vars.js` are a port of `figma-plugin/code.js`; keep the two in sync).

## 3. Assemble the token files

Write a manifest mapping each output file to its part files, then from the repo root:

```bash
node .agents/skills/tokens-sync/build-token-files.mjs <manifest.json>
```

It nests the entries, applies the plugin's leaf shape (`{ value, type, prefix }`, prefix derived from
the collection name) and overwrites the files under `packages/ui-components/tokens/`.

It assembles every file in memory first and writes nothing if any part carries unresolved entries,
comes back empty, or if the parts of a file don't cover their collection exactly once — a missing
slice would otherwise produce a healthy-looking file with half the tokens silently dropped. That
check reads the `total`/`start`/`end` the exporter returns, which is why each part must be saved
verbatim. A failed sync leaves the existing token files untouched rather than half-written.

Keys are written in **canonical natural order** (`localeCompare('en', { numeric: true })`), the same
ordering the figma plugin applies since v2.1.0. Figma enumerates variables in internal creation
order, which drifts over time — without the canonical sort, every export (plugin or skill) would
reorder the whole file and bury the real changes in diff noise.

## 4. Build and review

```bash
cd packages/ui-components && pnpm tokens:build
```

Style Dictionary throws on any broken `{ref}`, so a green build proves alias integrity. Then review
the diff **semantically** (the files are regenerated, so ordering churn is expected — compare
flattened token paths/values, not raw lines) and check two things before calling it done:

- **Removed tokens**: grep `src/**/*.scss` for each removed token's CSS variable name
  (`a.b.c` → `--a-b-c`). A component still using a removed variable keeps compiling but loses its
  value at runtime — report it as a required follow-up, don't silently drop it.
- **Changed values**: list them for the user; they are design-team changes in Figma, not noise.

## 5. Offer the downstream check in Core-UI

This repo's own components are only half the blast radius: the Core-UI app consumes the generated
CSS custom properties directly (`var(--token-name)` across hundreds of files), so a removed token
breaks silently there too — it keeps compiling and loses its value at runtime.

**Before finishing, always ask the user** (with AskUserQuestion) whether to also check the removed
and changed tokens against Core-UI. Ask once, and ask even when this repo's own components came out
clean — Core-UI can be hit by a token this repo never used. Never run the downstream check
unprompted: it reaches into another repository.

The one case to skip the question: step 4 found **no removed and no changed tokens at all**. Then
there is nothing to check downstream, so say so instead of asking about an empty set.

If they say yes, locate the app first — it lives at `apps/kelvin-core-ui` inside a checkout of the
`kelvininc/core-ui-apps` repository, whose location differs per machine (the checkout folder is not
always named after the repo). Look in this order, and never hardcode an absolute path:

1. The session's additional working directories, if one of them is inside that repo.
2. A sibling checkout next to this repository — for each `<dir>` beside this repo's root, test
   `<dir>/apps/kelvin-core-ui/src`.
3. Otherwise ask the user for the path, and skip the check if they don't have it checked out.

Then run the greps read-only against that app's `src`:

- **Removed tokens** — for each one, grep its CSS variable name across `src` (`*.scss`, `*.css`,
  `*.ts`, `*.tsx`; the app uses tokens from TS/TSX too, not just stylesheets). Every hit is a
  runtime breakage that needs the rename applied there as well.
- **Changed values** — grep the same way and report where each one is used, so the user can judge
  whether the new value is acceptable in those screens. A changed value is never an error; it is a
  design decision whose reach the user should see.

Report the findings as a follow-up for the Core-UI repo. Do not edit files in that repo as part of
this skill — the token sync's deliverable is this repository.

Component tokens resolve against `semantic/dark.json` only (style-dictionary config), and the mode
files are hardcoded as `light.json`/`dark.json` — a new Figma mode needs config changes too. For
token naming and how components consume tokens, follow the design-tokens skill.
