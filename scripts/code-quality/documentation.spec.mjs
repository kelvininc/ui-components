import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { checkDocumentation, isAuthored, main } from './documentation.mjs';
import { changedRanges } from './files.mjs';

test('should report an undocumented utility when its body changes', () => {
	const code =
		'export const clampValue = (value: number): number => {\n return value + 1;\n};';

	assert.ok(
		checkDocumentation('src/utils.ts', code, [{ from: 2, to: 2 }]).some(
			(item) => item.ruleId === 'jsdoc/require-jsdoc'
		)
	);
});

test('should leave an untouched legacy function outside the changed-unit check', () => {
	const code =
		'export function oldValue() { return 1; }\n/** Current value. */\nexport const current = 2;';

	assert.equal(
		checkDocumentation('src/config.ts', code, [{ from: 3, to: 3 }]).length,
		0
	);
});

test('should accept a useful TypeScript utility contract without repeated types', () => {
	const code =
		'/**\n * Clamp a percentage to the supported range.\n * @param value - Unbounded percentage.\n * @returns A percentage between zero and one hundred.\n * @example\n * ```ts\n * clampValue(120); // 100\n * ```\n */\nexport const clampValue = (value: number): number => Math.min(100, Math.max(0, value));';

	assert.deepEqual(checkDocumentation('src/utils.ts', code), []);
});

test('should reject malformed TSDoc when an existing docblock changes', () => {
	assert.ok(
		checkDocumentation(
			'src/value.ts',
			'/** Read {@link unfinished */\nexport function value(): number { return 1; }',
			[{ from: 1, to: 1 }]
		).some((item) => item.ruleId === 'tsdoc/syntax')
	);
});

test('should select the surviving boundary when a change only deletes lines', () => {
	assert.deepEqual(changedRanges('@@ -10,3 +10,0 @@'), [
		{ from: 10, to: 11, deletion: true, docblockOnly: false }
	]);
});

test('should ignore generated declarations and dependency trees', () => {
	assert.equal(isAuthored('packages/a/dist/index.js'), false);
	assert.equal(isAuthored('node_modules/a/index.ts'), false);
	assert.equal(isAuthored('src/contracts.d.ts'), false);
	assert.equal(isAuthored('src/utils.ts'), true);
});

test('should leave an unchanged sibling method outside the changed-unit check', () => {
	const source = [
		'/** Provide values. */',
		'class Values {',
		' oldValue() { return 1; }',
		' /** Read the current value. */',
		' current() {',
		'  return 2;',
		' }',
		'}'
	].join('\n');

	assert.deepEqual(
		checkDocumentation('src/values.ts', source, [{ from: 6, to: 6 }]),
		[]
	);
});

test('should reject malformed JavaScript parameter types', () => {
	assert.ok(
		checkDocumentation(
			'src/value.js',
			'/** Read a value.\n * @param {broken<} value - Input.\n */\nfunction read(value) { return value; }'
		).some((item) => item.ruleId === 'jsdoc/valid-types')
	);
});

test('should preserve the default tag used by existing API metadata', () => {
	assert.deepEqual(
		checkDocumentation(
			'src/props.ts',
			'/** Editor options. */\nexport interface Options {\n /** Language mode.\n * @default plaintext\n */\n language?: string;\n}'
		),
		[]
	);
});

test('should require documentation for an exported interface member', () => {
	const source =
		'/** Editor contract. */\nexport interface Editor {\n value: string;\n}';

	assert.ok(
		checkDocumentation('src/types.ts', source).some(
			(item) => item.ruleId === 'jsdoc/require-jsdoc' && item.line === 3
		)
	);
});

test('should load the checker without an ancestor checkout supplying ESLint', () => {
	const root = fileURLToPath(new URL('../../', import.meta.url));
	const isolated = mkdtempSync(path.join(tmpdir(), 'ui-docs-dependencies-'));

	try {
		mkdirSync(path.join(isolated, 'scripts/code-quality'), {
			recursive: true
		});

		for (const filename of [
			'documentation.mjs',
			'documentation-config.mjs',
			'files.mjs',
			'tools.config.mjs'
		]) {
			cpSync(
				path.join(root, 'scripts/code-quality', filename),
				path.join(isolated, 'scripts/code-quality', filename)
			);
		}

		for (const dirname of ['node_modules', 'packages']) {
			symlinkSync(
				path.join(root, dirname),
				path.join(isolated, dirname),
				'dir'
			);
		}

		const result = spawnSync(
			process.execPath,
			[
				'--input-type=module',
				'-e',
				"await import('./scripts/code-quality/documentation.mjs'); await import('./scripts/code-quality/tools.config.mjs');"
			],
			{
				cwd: isolated,
				encoding: 'utf8'
			}
		);

		assert.equal(result.status, 0, result.stdout + result.stderr);
	} finally {
		rmSync(isolated, { recursive: true, force: true });
	}
});

test('should report a function when its leading docblock is deleted', () => {
	const source = 'export const current = () => 1;';
	const ranges = changedRanges(
		'@@ -1,3 +0,0 @@\n-/**\n- * Current value.\n- */'
	);

	assert.ok(
		checkDocumentation('src/value.ts', source, ranges).some(
			(item) => item.ruleId === 'jsdoc/require-jsdoc'
		)
	);
});

test('should leave both neighboring functions untouched when a whole function is deleted', () => {
	const source =
		'export const before = () => 1;\nexport const after = () => 2;';
	const diff = '@@ -2,1 +1,0 @@\n-export const removed = () => 3;';

	assert.deepEqual(
		checkDocumentation('src/value.ts', source, changedRanges(diff)),
		[]
	);
});

test('should select the containing function when only a body statement is deleted', () => {
	const source = 'export const current = () => {\n return 1;\n};';
	const diff = '@@ -2,1 +1,0 @@\n- const unused = 3;';

	assert.ok(
		checkDocumentation('src/value.ts', source, changedRanges(diff)).some(
			(item) => item.ruleId === 'jsdoc/require-jsdoc'
		)
	);
});

test('should report documentation removed by a replacement hunk', () => {
	const source = '// Read current.\nexport function current() { return 1; }';
	const diff = '@@ -1 +1 @@\n-/** Read current. */\n+// Read current.';

	assert.ok(
		checkDocumentation('src/current.ts', source, changedRanges(diff)).some(
			(item) => item.ruleId === 'jsdoc/require-jsdoc' && item.line === 2
		)
	);
});

test('should validate the whole contract when only its description changes', () => {
	const source = '/**\n *\n */\nexport function current() { return 1; }';
	const diff = '@@ -2 +2 @@\n- * Read current.\n+ *';

	assert.ok(
		checkDocumentation('src/current.ts', source, changedRanges(diff)).some(
			(item) => item.ruleId === 'jsdoc/require-description'
		)
	);
});

test('should document separately exported types and their members', () => {
	for (const source of [
		'interface Options {\n value: string;\n}\nexport { Options };',
		'type Options = {\n value: string;\n};\nexport type { Options as PublicOptions };',
		'export default interface Options {\n value: string;\n}',
		'type Options = {\n value: string;\n};\nexport default Options;'
	]) {
		const missing = checkDocumentation('src/types.ts', source).filter(
			(item) => item.ruleId === 'jsdoc/require-jsdoc'
		);

		assert.ok(
			missing.some((item) => item.line === 1),
			source
		);
		assert.ok(
			missing.some((item) => item.line === 2),
			source
		);
	}
});

test('should leave unexported types outside public-contract documentation rules', () => {
	const source =
		'interface Options { value: string; }\ntype Internal = { value: number };\nexport { Options } from "./other";';

	assert.deepEqual(checkDocumentation('src/types.ts', source), []);
});

test('should require documentation for separately exported constants', () => {
	for (const statement of [
		'export { TIMEOUT };',
		'export { TIMEOUT as DELAY };',
		'export default TIMEOUT;'
	]) {
		const source = `const TIMEOUT = 30;\n${statement}`;

		assert.ok(
			checkDocumentation('src/config.ts', source).some(
				(item) =>
					item.ruleId === 'jsdoc/require-jsdoc' && item.line === 1
			),
			statement
		);
	}
});

test('should select the full public contract when only a local export changes', () => {
	for (const statement of [
		'export { Options };',
		'export type { Options as PublicOptions };',
		'export default Options;'
	]) {
		const source = `interface Options {\n value: string;\n}\n${statement}\ninterface Internal { value: string; }`;
		const missing = checkDocumentation('src/types.ts', source, [
			{ from: 4, to: 4 }
		]).filter((item) => item.ruleId === 'jsdoc/require-jsdoc');

		assert.ok(
			missing.some((item) => item.line === 1),
			statement
		);
		assert.ok(
			missing.some((item) => item.line === 2),
			statement
		);
		assert.ok(!missing.some((item) => item.line === 5), statement);
	}
});

test('should select a newly exported constant without selecting neighboring declarations', () => {
	const source =
		'const TIMEOUT = 30;\nexport const OTHER = 2;\nexport { TIMEOUT };';
	const missing = checkDocumentation('src/config.ts', source, [
		{ from: 3, to: 3 }
	]).filter((item) => item.ruleId === 'jsdoc/require-jsdoc');

	assert.ok(missing.some((item) => item.line === 1));
	assert.ok(!missing.some((item) => item.line === 2));
	const reexport =
		'interface Options { value: string; }\nexport { Options } from "./other";';

	assert.deepEqual(
		checkDocumentation('src/types.ts', reexport, [{ from: 2, to: 2 }]),
		[]
	);
});

test('should ignore unrelated inline lint directives and keep documentation enforcement active', () => {
	const source =
		'// eslint-disable-next-line @typescript-eslint/no-explicit-any\n/** Current value. */\nexport const current = 1;';

	assert.deepEqual(checkDocumentation('src/value.ts', source), []);
	assert.ok(
		checkDocumentation(
			'src/value.ts',
			'/* eslint-disable */\nexport const current = 1;'
		).some((item) => item.ruleId === 'jsdoc/require-jsdoc')
	);
});

test('should resolve exported constants declared through nested binding patterns', () => {
	for (const declaration of [
		'const { TIMEOUT } = defaults;',
		'const { value: TIMEOUT = 30 } = defaults;',
		'const [TIMEOUT] = defaults;',
		'const { nested: { TIMEOUT }, ...rest } = defaults;'
	]) {
		const source = `${declaration}\nexport { TIMEOUT };`;

		for (const ranges of [undefined, [{ from: 2, to: 2 }]]) {
			assert.ok(
				checkDocumentation('src/config.ts', source, ranges).some(
					(item) =>
						item.ruleId === 'jsdoc/require-jsdoc' && item.line === 1
				),
				declaration
			);
		}
	}
});

test('should check changed public enum members without selecting legacy siblings', () => {
	const source =
		'/** Execution state. */\nexport enum State {\n Legacy,\n Ready\n}';
	const missing = checkDocumentation('src/types.ts', source, [
		{ from: 4, to: 4 }
	]).filter((item) => item.ruleId === 'jsdoc/require-jsdoc');

	assert.ok(missing.some((item) => item.line === 4));
	assert.ok(!missing.some((item) => item.line === 3));
	assert.deepEqual(
		checkDocumentation('src/types.ts', 'enum Internal { Ready }'),
		[]
	);
});

test('should require complete contracts in environment-qualified utility modules', () => {
	const source =
		'/** Read a value. */\nexport const read = (value: number): number => value;';

	for (const filename of [
		'src/utils.server.ts',
		'src/utils.client.ts',
		'src/values.utils.server.ts',
		'src/helpers/values.ts'
	]) {
		const rules = checkDocumentation(filename, source).map(
			(item) => item.ruleId
		);

		for (const rule of [
			'jsdoc/require-param',
			'jsdoc/require-returns',
			'jsdoc/require-example'
		]) {
			assert.ok(rules.includes(rule), `${filename}: ${rule}`);
		}
	}
	assert.deepEqual(
		checkDocumentation('src/Component.client.tsx', source),
		[]
	);
});

test('should select public members when only a direct export header changes', () => {
	for (const declaration of [
		'interface Options {',
		'type Options = {',
		'enum Options {'
	]) {
		const member = declaration.startsWith('enum')
			? ' Value,'
			: ' value: string;';
		const source = `/** Public options. */\nexport ${declaration}\n${member}\n}\n/** Other contract. */\nexport interface Other {\n legacy: string;\n}`;
		const diff = `@@ -2 +2 @@\n-${declaration}\n+export ${declaration}`;
		const missing = checkDocumentation(
			'src/types.ts',
			source,
			changedRanges(diff)
		);

		assert.ok(
			missing.some(
				(item) =>
					item.ruleId === 'jsdoc/require-jsdoc' && item.line === 3
			),
			declaration
		);
		assert.ok(!missing.some((item) => item.line === 7), declaration);
	}
});

test('should keep unchanged contract members outside a member-only edit', () => {
	for (const declaration of [
		'interface Options {',
		'type Options = {',
		'enum Options {'
	]) {
		const members = declaration.startsWith('enum')
			? [' Legacy,', ' Current,']
			: [' legacy: string;', ' current: number;'];
		const source = [
			'/** Public options. */',
			`export ${declaration}`,
			...members,
			'}'
		].join('\n');
		const missing = checkDocumentation('src/types.ts', source, [
			{ from: 4, to: 4 }
		]);

		assert.ok(
			missing.some(
				(item) =>
					item.ruleId === 'jsdoc/require-jsdoc' && item.line === 4
			),
			declaration
		);
		assert.ok(!missing.some((item) => item.line === 3), declaration);
	}
});

/** Create an isolated Git history with undocumented legacy functions for rename checks. */
const createRenameFixture = (context, original = 'legacy [value].ts') => {
	const cwd = mkdtempSync(path.join(tmpdir(), 'documentation-rename-'));
	const destination = 'renamed value\nfile.ts';
	const source = [
		'export function first() {',
		' const value = 1;',
		' return value;',
		'}',
		'',
		'export function second() {',
		' const value = 2;',
		' return value;',
		'}',
		'',
		'export function third() {',
		' const value = 3;',
		' return value;',
		'}'
	].join('\n');
	/** Run Git only inside the disposable repository, without signing or hooks. */
	const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });

	context.after(() => rmSync(cwd, { recursive: true, force: true }));
	context.mock.method(console, 'log', () => {});
	const errors = context.mock.method(console, 'error', () => {});

	git('init', '-q');
	git('config', 'user.name', 'Fixture');
	git('config', 'user.email', 'fixture@example.invalid');
	git('config', 'commit.gpgsign', 'false');
	git('config', 'core.hooksPath', '/dev/null');
	// Checkers must detect renames even when a developer disables them in Git defaults.
	git('config', 'diff.renames', 'false');
	mkdirSync(path.dirname(path.join(cwd, original)), { recursive: true });
	writeFileSync(path.join(cwd, original), source);
	const neighbor = '/** Read a neighboring value. */\nexport function neighbor() {\n const value = 4;\n return value;\n}';

	writeFileSync(path.join(cwd, 'legacy v.ts'), neighbor);
	git('add', '--', original, 'legacy v.ts');
	git('commit', '-qm', 'fixture base');
	const base = git('rev-parse', 'HEAD').trim();

	git('mv', '--', original, destination);
	// A changed neighbor matches the source as a glob, but must not supply its ranges.
	writeFileSync(path.join(cwd, 'legacy v.ts'), neighbor.replace('value = 4', 'value = 40'));
	git('add', '--', 'legacy v.ts');

	return { cwd, base, destination, source, git, errors };
};

for (const stage of ['staged', 'committed']) {
	test(`should leave legacy documentation untouched when a pure rename is ${stage}`, (context) => {
		const { cwd, base, destination, git, errors } = createRenameFixture(context);

		if (stage === 'committed') {
			git('commit', '-qm', 'fixture rename');
		}
		assert.equal(main(['--base', base], cwd), 0);
		assert.equal(errors.mock.callCount(), 0);
		// An explicit file request still checks the complete file.
		assert.equal(main([destination], cwd), 1);
	});

	test(`should check only the edited function when a rename with a body edit is ${stage}`, (context) => {
		const { cwd, base, destination, source, git, errors } = createRenameFixture(context);

		writeFileSync(path.join(cwd, destination), source.replace('value = 2', 'value = 20'));

		if (stage === 'committed') {
			git('add', '--', destination);
			git('commit', '-qm', 'fixture renamed edit');
		}
		assert.equal(main(['--base', base], cwd), 1);
		const messages = errors.mock.calls.map(({ arguments: args }) => args[0]);

		assert.ok(messages.length > 0);
		assert.ok(
			messages.every((message) => message.startsWith(`${destination}:6:`)),
			messages.join('\n')
		);
	});
}

test('should check the full file when a rename moves generated code into authored scope', (context) => {
	const { cwd, base, destination, errors } = createRenameFixture(context, 'generated/legacy.ts');

	assert.equal(main(['--base', base], cwd), 1);
	const messages = errors.mock.calls.map(({ arguments: args }) => args[0]);

	for (const line of [1, 6, 11]) {
		assert.ok(messages.some((message) => message.startsWith(`${destination}:${line}:`)));
	}
});
