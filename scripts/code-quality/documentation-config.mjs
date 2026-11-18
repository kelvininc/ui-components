/** Existing parser owners; no reliance on hoisted dependencies. */
export const PARSER_PACKAGES = ['packages/react-ui-components/package.json'];

/** Generated contracts are documented at their generator or spec source. */
export const DOCUMENTATION_EXCLUDES = [
	/stencil-generated/,
	/src\/components\.d\.ts/,
	/(?:^|\/)loader\//
];
