# Component catalog generation

This private workspace owns discovery for both published UI packages and the package map.
It reuses the root TypeScript installation. It has no dependency on the published UI packages.

Run `pnpm build:packages` to refresh Stencil metadata and React bindings. Then run the root `docs:generate` and read-only `docs:check` commands. Builds do not generate catalogs. `pnpm test:docs` exercises export resolution,
React contracts and deterministic output with temporary fixtures.

`generate-api.mjs` consumes core `docs/docs.json` and each React public source entry.
`react-contracts.mjs` extracts public React components through the TypeScript checker.
`package-map.mjs` owns workspace discovery and the curated purpose descriptions.
Generated outputs are listed in [API discovery](../../docs/api-discovery.md).

Command contracts and source-comment checks: [code quality](../../docs/code-quality.md).
