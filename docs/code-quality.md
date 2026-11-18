# Authored code quality

Apply these rules to new and changed authored code, including build and code-generation tools. Keep generated outputs under their generator's ownership. Preserve the owning repository's folders, declaration style and test conventions.

## Documentation

Use TSDoc-compatible `/** */` comments in TypeScript/TSX and JSDoc in JavaScript/MJS/CJS. Document named functions, hooks, components, classes and methods, plus public types, members and constants at their owning declaration. One useful sentence is enough for a simple unit.

For utility functions, include `@param name - description` for each parameter, `@returns` when a value is returned, and a useful `@example`. These are inline source docblocks, not separate Markdown descriptions.

Describe the contract beyond its signature: purpose, meaningful defaults, units, assumptions, mutation, ordering, errors and callback timing where relevant. Add examples when they clarify use. TypeScript already declares parameter/return types; do not repeat them in tags. Preserve documented generator-specific tags; `tsdoc.json` declares the supported extensions.

Local variables, anonymous callbacks and individual test cases do not each need a block. Named reusable test helpers follow this policy. Re-exports use the original declaration's documentation; generated code gets comments from its source/template/spec. Never hand-edit generated documentation.

Use short section comments for a non-obvious constraint or required order. Keep blank lines between cohesive blocks; avoid mandatory State/Effects/Handlers banners or comments that repeat the next statement.

## Enforcement and adoption

`lint:docs` checks comment presence and supported syntax for changed authored units. `docs:check` checks generated-document freshness; it does not establish source documentation quality. The documentation inventory records existing gaps separately. Enforce new/changed units and keep the remaining backlog visible until full coverage is achieved.

Review the accuracy of comments against implementation and callers. Passing syntax or presence checks cannot prove a useful, truthful explanation. Do not add placeholders merely to satisfy a rule.

## Review

Reuse existing platform, repository and installed-library capabilities before adding helpers. Keep frontend interactions and error handling in the client; backend transaction guarantees remain backend-owned. Review the reachable trigger, observable impact and owning layer before accepting an automated finding. Keep unrelated cleanup outside the change.

## Checker dependencies

The source-comment checks use eslint-plugin-jsdoc 61.5.0 and eslint-plugin-tsdoc 0.5.4 as development dependencies. The JSDoc version supports the declared Node 24 range and respects the seven-day release-age policy. Scoped overrides replace minimatch in typescript-estree 8.56.1 and fast-uri in Ajv 8.18.0 to address advisories in the new checker dependency tree. The minimatch override crosses a major version; keep the checker regressions passing and remove the override when the upstream dependency adopts a patched release. These overrides do not set the versions of other TypeScript parser/Ajv releases.

## Commands

| Command             | Contract                                                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs:generate`     | Write generated discovery catalogs from their owning sources.                                                                                                                 |
| `docs:check`        | Compare expected catalogs with current source without writing files.                                                                                                          |
| `docs:tracked`      | Require every expected output to be tracked and identical to HEAD, including the index and worktree. Run after generation in CI. Uncommitted catalog edits deliberately fail. |
| `test:docs`         | Run generator and catalog-check regressions; no implicit package build.                                                                                                       |
| `lint:docs`         | Check inline documentation for changed authored units against `HEAD~0` by default. Use `--base origin/<branch>` for the PR scope.                                             |
| `docs:inventory`    | Report existing inline documentation gaps as JSON without failing the command.                                                                                                |
| `test:docs:quality` | Test source-comment coverage, syntax and incremental selection.                                                                                                               |

`docs:api` remains a compatibility alias where it already existed. Source-comment quality and generated catalog freshness have separate checks. Commit generated changes with their source; CI regenerates them and uses `docs:tracked` to detect omissions.

`test:unit` selects Stencil spec tests and React unit tests. `test:e2e` selects core browser tests; Stencil compiles its browser fixture for that command. `test` runs both.

Build packages before documentation commands that read Stencil metadata and before `test:unit` or `react:check`. CI runs Lint and Build independently; Documentation, Unit tests and React/browser consumers reuse Build artifacts. Summary requires every job to succeed. `lint:tools` checks authored JavaScript tooling. Releases generate and verify catalogs explicitly before publishing.

## Adoption baseline

The 2026-11-17 inventory, taken from the implementation worktree based on `db7c9d79aacf`, checked 717 authored files. It reported 3,593 documentation diagnostics across 510 files. These are presence and syntax findings, not a count of undocumented functions or a coverage percentage.

Run `pnpm docs:inventory` for the current per-file backlog. Address the owning contracts when those units change; do not add bulk placeholder comments. The PR-base check enforces changed units while this inventory keeps untouched legacy gaps visible.
