import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
	cpSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./generate-api.mjs', import.meta.url));

test('should expose public entries and CSS contracts, detect drift and reject missing barrels', () => {
	const dir = mkdtempSync(path.join(tmpdir(), 'ui-api-contract-'));

	try {
		const core = path.join(dir, 'packages/ui-components');
		const tool = path.join(dir, 'tools/codegen');
		const react = path.join(dir, 'packages/react-ui-components');

		mkdirSync(path.join(tool, 'scripts'), { recursive: true });
		mkdirSync(path.join(core, 'docs'), { recursive: true });
		mkdirSync(path.join(react, 'src/stencil-generated'), {
			recursive: true
		});
		cpSync(script, path.join(tool, 'scripts/generate-api.mjs'));

		for (const name of [
			'public-exports.mjs',
			'type-contracts.mjs',
			'react-contracts.mjs',
			'package-map.mjs'
		]) {
			cpSync(
				new URL('./' + name, import.meta.url),
				path.join(tool, 'scripts', name)
			);
		}
		symlinkSync(
			path.resolve(path.dirname(script), '../../../node_modules'),
			path.join(dir, 'node_modules')
		);
		writeFileSync(
			path.join(core, 'package.json'),
			JSON.stringify({ name: '@test/ui', version: '1.2.3' })
		);
		writeFileSync(
			path.join(react, 'package.json'),
			JSON.stringify({
				name: '@test/react-ui',
				repository: { url: 'https://github.com/example/ui' },
				version: '1.2.3',
				exports: {
					'.': { types: './dist/types/server.d.ts' },
					'./client': { types: './dist/types/client.d.ts' },
					'./server': { types: './dist/types/server.d.ts' },
					'./shared': { types: './dist/types/shared.d.ts' }
				}
			})
		);
		const metadata = {
			timestamp: 'ignored',
			compiler: { version: 'test' },
			components: [
				{
					tag: 'kv-demo',
					filePath: 'src/demo.tsx',
					docs: 'Demo',
					encapsulation: 'shadow',
					props: [
						{
							name: 'disabled',
							required: false,
							default: 'false',
							type: 'boolean',
							complexType: {
								references: {
									Demo: {
										location: 'import',
										path: '@test/types',
										id: '../../node_modules/.pnpm/test/node_modules/@test/types::Demo'
									}
								}
							}
						}
					],
					events: [{ event: 'changed', detail: 'string' }],
					methods: [],
					slots: [],
					styles: [{ name: '--icon-height', docs: 'SVG height' }],
					parts: []
				}
			]
		};

		metadata.components[0].props.push({
			name: 'mode',
			type: '"fast" | "slow"',
			values: [
				{ type: 'string', value: 'fast' },
				{ type: 'string', value: 'slow' }
			]
		});
		writeFileSync(
			path.join(core, 'docs/docs.json'),
			JSON.stringify(metadata)
		);
		writeFileSync(
			path.join(react, 'src/stencil-generated/index.ts'),
			'export const KvDemo = 1; const Hidden = 2;'
		);
		writeFileSync(
			path.join(react, 'src/client.ts'),
			"export { KvDemo as PublicDemo } from './stencil-generated'; export * from './shared';"
		);
		writeFileSync(
			path.join(react, 'src/values.ts'),
			'export enum Colour { Red } export const HiddenValue = 1;'
		);
		writeFileSync(
			path.join(react, 'src/shared.ts'),
			"export type Options = { disabled: boolean }; export type * from './values'; export { Colour as LiveColour } from './values'; export type { Colour as TypeColour } from './values'; import type { Colour as ImportedColour } from './values'; export { ImportedColour };"
		);
		writeFileSync(
			path.join(react, 'src/server.ts'),
			"export * from './shared';"
		);
		/** Execute the real CLI against the isolated Stencil/React metadata fixture. */
		const run = (...args) =>
			execFileSync(
				process.execPath,
				[path.join(tool, 'scripts/generate-api.mjs'), ...args],
				{ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
			);

		run();
		const manifest = JSON.parse(
			readFileSync(path.join(react, 'manifest.json'))
		);

		assert.deepEqual(
			manifest.entries['./client'].map((item) => item.name),
			[
				'Colour',
				'HiddenValue',
				'ImportedColour',
				'LiveColour',
				'Options',
				'PublicDemo',
				'TypeColour'
			]
		);
		assert.deepEqual(
			manifest.entries['./server'].map((item) => item.name),
			[
				'Colour',
				'HiddenValue',
				'ImportedColour',
				'LiveColour',
				'Options',
				'TypeColour'
			]
		);
		assert.deepEqual(manifest.entries['.'], manifest.entries['./server']);

		for (const name of [
			'Colour',
			'HiddenValue',
			'ImportedColour',
			'TypeColour'
		]) {
			assert.equal(
				manifest.entries['./server'].find((item) => item.name === name)
					.kind,
				'type',
				name
			);
		}
		assert.equal(
			manifest.entries['./server'].find(
				(item) => item.name === 'LiveColour'
			).kind,
			'value'
		);
		assert.equal(
			JSON.parse(readFileSync(path.join(core, 'manifest.json')))
				.components['kv-demo'].cssProperties[0].name,
			'--icon-height'
		);
		// Property order in Stencil's expanded dependency types can vary by host.
		const prop = metadata.components[0].props[0];

		prop.type = '{ x: number; y: number; }';
		prop.complexType.original = 'Coordinates';
		prop.complexType.resolved = prop.type;
		prop.values = [{ type: prop.type }];
		writeFileSync(
			path.join(core, 'docs/docs.json'),
			JSON.stringify(metadata)
		);
		run();
		prop.type = '{ y: number; x: number; }';
		prop.complexType.resolved = prop.type;
		prop.values = [{ type: prop.type }];
		writeFileSync(
			path.join(core, 'docs/docs.json'),
			JSON.stringify(metadata)
		);
		run('--check');
		assert.deepEqual(
			JSON.parse(
				readFileSync(path.join(core, 'manifest.json'))
			).components['kv-demo'].props.find((item) => item.name === 'mode')
				.values,
			metadata.components[0].props[1].values
		);
		metadata.timestamp = 'new build time';
		metadata.components[0].props[0].complexType.references.Demo.id =
			'/another/install/node_modules/@test/types::Demo';
		writeFileSync(
			path.join(core, 'docs/docs.json'),
			JSON.stringify(metadata)
		);
		run('--check');
		const relocated = mkdtempSync(path.join(tmpdir(), 'ui-api-relocated-'));

		try {
			cpSync(dir, relocated, { recursive: true, verbatimSymlinks: true });
			execFileSync(
				process.execPath,
				[
					path.join(
						relocated,
						'tools/codegen/scripts/generate-api.mjs'
					),
					'--check'
				],
				{ stdio: 'pipe' }
			);
		} finally {
			rmSync(relocated, { recursive: true, force: true });
		}
		const reactPackage = JSON.parse(
			readFileSync(path.join(react, 'package.json'))
		);

		reactPackage.version = '2.0.0';
		writeFileSync(
			path.join(react, 'package.json'),
			JSON.stringify(reactPackage)
		);
		run('--check');
		const clientEntry = reactPackage.exports['./client'];

		delete reactPackage.exports['./client'];
		writeFileSync(
			path.join(react, 'package.json'),
			JSON.stringify(reactPackage)
		);
		assert.throws(() => run('--check'), /Stale catalog/);
		reactPackage.exports['./client'] = clientEntry;
		writeFileSync(
			path.join(react, 'package.json'),
			JSON.stringify(reactPackage)
		);
		// JSON object insertion order is semantically irrelevant to the export map.
		run();
		metadata.components[0].props[0].default = 'true';
		writeFileSync(
			path.join(core, 'docs/docs.json'),
			JSON.stringify(metadata)
		);
		assert.throws(() => run('--check'), /Stale catalog/);
		run();
		writeFileSync(
			path.join(react, 'src/client.ts'),
			"export * from './missing';"
		);
		const invalid = spawnSync(
			process.execPath,
			[path.join(tool, 'scripts/generate-api.mjs')],
			{ encoding: 'utf8' }
		);

		assert.notEqual(invalid.status, 0);
		assert.match(invalid.stderr, /Unresolved public barrel/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
