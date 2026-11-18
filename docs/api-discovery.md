# API discovery

Build the core package before looking up changed component contracts. Its `docs/docs.json`
is Stencil's metadata source. `pnpm docs:generate` generates
`API.md` and `manifest.json` for both core and React packages. `docs:check` compares the
outputs with that metadata and the current React exports and native component contracts; run it after a fresh build.
The catalogs are included in packed packages. Generation is an explicit step after the package build.

Use the installed package version from the adjacent package.json when working in an app. Catalogs use `versionSource` instead of embedding a release number, so version-only release commits remain valid. Git manifests can retain placeholder
versions between releases; a source checkout is not proof that an app has a new capability.
Search the core API for the tag, read its manifest record, then inspect React API.md for
its actual public entry. React's root entry is server-safe; interactive controls use `/client`.
Read declarations for full TypeScript types. Consult component source/tests for event timing,
focus and accessibility behavior that metadata cannot prove.

Search the published component catalog before creating or styling an equivalent component.
For example, check the existing buttons, dropdown/select controls and icons before adding your own. For `kv-icon`, look up `cssProperties` and set `--icon-height`
and `--icon-width` to size its SVG. A host dimension has a different effect. Use the published
icon enum/exports and token names; add missing shared icons through the library release flow.

The catalog preserves empty descriptions. Improve the owning Stencil JSDoc or React source
comment, then regenerate; do not invent documentation in generated output. Storybook examples
and the primitives/schema-form skill supply usage guidance beyond the public symbol index.

React-authored controls have their own `components` records in the React manifest and
contract tables in React API.md. These include prop types and requiredness, callback
signatures, declared defaults and ref handles. Only runtime exports appear as usable
components; type-only server exports remain in the export index. README links point
to existing component guidance, and inherited platform attributes remain in declarations.

The private [codegen workspace](../tools/codegen/README.md) owns both catalogs and
[PACKAGES.md](../PACKAGES.md). CI builds metadata, runs `test:docs` and `docs:check`,
then verifies all expected catalogs are tracked and unchanged against HEAD.

Stencil property types use deterministic property ordering. The manifest's `values` lists concrete literal choices; read `type` and `complexType` for complete non-literal contracts.
