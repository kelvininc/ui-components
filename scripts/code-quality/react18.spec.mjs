import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(
	new URL('../../packages/react-ui-components/package.json', import.meta.url)
);
const { Linter } = require('eslint');
const rule = require('../../scripts/code-quality/react18.cjs');

/** Verify a JavaScript fixture through the actual React 18 API rule. */
const check = (source) => {
	const linter = new Linter({ configType: 'eslintrc' });

	linter.defineRule('react18', rule);

	return linter.verify(source, {
		parserOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			ecmaFeatures: { jsx: true }
		},
		rules: { react18: 'error' }
	});
};

test('should allow React 18 transitions', () =>
	assert.deepEqual(
		check(
			"import { startTransition, useTransition, useDeferredValue } from 'react'; startTransition(() => {});"
		),
		[]
	));
test('should reject a renamed React 19 import', () =>
	assert.equal(check("import { use as read } from 'react';").length, 1));
test('should reject a newer API accessed through a namespace alias', () =>
	assert.equal(
		check("import * as R from 'react'; R.useOptimistic(0);").length,
		1
	));
test('should allow a local object shadowing a React import', () =>
	assert.deepEqual(
		check(
			"import React from 'react'; function example(React) { React.use(1); }"
		),
		[]
	));
test('should reject re-exporting an unsupported API', () =>
	assert.equal(
		check("export { ViewTransition as Transition } from 'react';").length,
		1
	));

test('should reject a React 19 component through a JSX namespace alias', () =>
	assert.equal(
		check(
			"import * as R from 'react'; const view = <R.Activity />;"
		).filter((item) => item.ruleId === 'react18').length,
		1
	));
test('should allow JSX through a local shadow of a React namespace', () =>
	assert.deepEqual(
		check(
			"import * as R from 'react'; function View(R) { return <R.Activity />; }"
		),
		[]
	));

test('should reject unsupported React APIs destructured through aliases', () => {
	for (const source of [
		"import * as R from 'react'; const { useOptimistic: optimistic } = R;",
		"import React from 'react'; let optimistic; ({ useOptimistic: optimistic } = React);"
	]) {
		assert.equal(
			check(source).filter((item) => item.ruleId === 'react18').length,
			1
		);
	}
});

test('should allow React 18 destructuring and a shadowed local namespace', () => {
	assert.deepEqual(
		check("import * as R from 'react'; const { startTransition } = R;"),
		[]
	);
	assert.deepEqual(
		check(
			"import * as R from 'react'; function local(R) { const { useOptimistic: optimistic } = R; }"
		),
		[]
	);
});

test('should reject React 19.1 and 19.2 APIs through named and namespace imports', () => {
	for (const name of ['captureOwnerStack', 'cacheSignal']) {
		for (const source of [
			`import { ${name} as read } from 'react';`,
			`import * as R from 'react'; R.${name}();`,
			`import React from 'react'; const { ${name}: read } = React;`
		]) {
			assert.equal(
				check(source).filter((item) => item.ruleId === 'react18').length,
				1,
				source
			);
		}
	}
});

test('should reject React 19 form reset through named and namespace imports', () => {
	for (const source of [
		"import { requestFormReset as reset } from 'react-dom';",
		"import * as DOM from 'react-dom'; DOM.requestFormReset(form);",
		"import * as DOM from 'react-dom'; const { requestFormReset: reset } = DOM;"
	]) {
		assert.equal(
			check(source).filter((item) => item.ruleId === 'react18').length,
			1,
			source
		);
	}
});
