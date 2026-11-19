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

/** Count React 18 findings, so parser diagnostics never pass for a rejected API. */
const findings = (source) =>
	check(source).filter((item) => item.ruleId === 'react18').length;

test('should reject unsupported APIs through every static binding of the module object', () => {
	for (const [module, api] of [
		['react', 'useOptimistic'],
		['react-dom', 'requestFormReset']
	]) {
		for (const binding of [
			`import { default as R } from '${module}';`,
			`import { 'default' as R } from '${module}';`,
			`import Root from '${module}'; const R = Root;`,
			`import * as NS from '${module}'; const R = NS.default;`,
			`import * as NS from '${module}'; const { default: R } = NS;`,
			`const R = require('${module}');`,
			`const R = await import('${module}');`
		]) {
			for (const use of [
				`R.${api}();`,
				`const { ${api}: alias } = R;`,
				`let alias; ({ ${api}: alias } = R);`
			]) {
				assert.equal(findings(`${binding} ${use}`), 1, `${binding} ${use}`);
			}
		}
	}
});

test('should reject unsupported APIs reached through the namespace default member', () => {
	for (const source of [
		"import * as NS from 'react'; NS.default.useOptimistic(0);",
		"import * as NS from 'react'; const { default: { useOptimistic: optimistic } } = NS;",
		"import { default as R } from 'react'; const view = <R.Activity />;"
	]) {
		assert.equal(findings(source), 1, source);
	}
});

test('should allow supported APIs and values that are not the React module object', () => {
	for (const source of [
		"import { default as R } from 'react'; R.startTransition(() => {});",
		"import { default as R } from 'react'; function local(R) { R.useOptimistic(0); }",
		"import React from 'react'; let R = React; R = { useOptimistic() {} }; R.useOptimistic(0);",
		"import { default as R } from './local'; R.useOptimistic(0);",
		"const R = load('react'); R.useOptimistic(0);",
		'const first = second; const second = first; first.use(1);',
		'let R; R.use(1);'
	]) {
		assert.equal(findings(source), 0, source);
	}
});

test('should resolve the module object through TypeScript syntax and optional chains', () => {
	const linter = new Linter({ configType: 'eslintrc' });

	linter.defineParser('typescript', require('@typescript-eslint/parser'));
	linter.defineRule('react18', rule);

	for (const source of [
		"import React from 'react'; (React as typeof React).useOptimistic(0);",
		"import React from 'react'; React!.useOptimistic(0);",
		"import React from 'react'; (React satisfies object).useOptimistic(0);",
		"import React from 'react'; interface React { extra: true } React.useOptimistic(0);",
		"async function load() { const R = await (import('react') as Promise<typeof import('react')>); R.useOptimistic(0); }",
		"async function load() { const NS = await import('react'); const R = NS?.default; R.useOptimistic(0); }"
	]) {
		assert.equal(
			linter
				.verify(source, {
					parser: 'typescript',
					parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
					rules: { react18: 'error' }
				})
				.filter((item) => item.ruleId === 'react18').length,
			1,
			source
		);
	}
});
