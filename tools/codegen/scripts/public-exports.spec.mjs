import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

import { runtimeExport } from './public-exports.mjs';

test('should match emitted runtime exports when a type-only export precedes a value star', async () => {
	const root = mkdtempSync(path.join(tmpdir(), 'runtime-exports-'));
	const options = {
		module: ts.ModuleKind.ESNext,
		target: ts.ScriptTarget.ES2022,
		moduleResolution: ts.ModuleResolutionKind.Bundler
	};

	try {
		writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
		writeFileSync(path.join(root, 'value.ts'), 'export class Foo {}');
		writeFileSync(
			path.join(root, 'value.js'),
			ts.transpileModule('export class Foo {}', {
				compilerOptions: options
			}).outputText
		);

		for (const [name, star] of [
			['type-only', ''],
			['with-star', "export * from './value.js';"],
			['local-type-only', ''],
			['local-with-star', "export * from './value.js';"]
		]) {
			const declaration = name.startsWith('local')
				? "import type { Foo } from './value.js'; export { Foo };"
				: "export type { Foo } from './value.js';";
			const text = `${declaration} ${star}`;
			const filename = path.join(root, `${name}.ts`);

			writeFileSync(filename, text);
			writeFileSync(
				path.join(root, `${name}.js`),
				ts.transpileModule(text, { compilerOptions: options })
					.outputText
			);
			const emitted = await import(
				pathToFileURL(path.join(root, `${name}.js`)).href
			);
			const program = ts.createProgram([filename], options);
			const actual = runtimeExport(
				ts,
				program,
				program.getTypeChecker(),
				program.getSourceFile(filename),
				'Foo'
			);

			assert.equal(actual, Object.hasOwn(emitted, 'Foo'), name);
		}
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
