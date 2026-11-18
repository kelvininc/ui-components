import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
	copyFileSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(new URL('../../package.json', import.meta.url));
const typescript = require.resolve('typescript/bin/tsc');
const versions = [
	{ react: '18.3.1', types: '18.3.3', domTypes: '18.3.0' },
	{ react: '19.0.0', types: '19.0.0', domTypes: '19.0.0' }
];
const destination = mkdtempSync(path.join(tmpdir(), 'kelvin-react-consumer-'));

try {
	// Packing exercises public files and rewrites workspace dependencies just as publication does.
	for (const name of ['ui-components', 'react-ui-components']) {
		execFileSync(
			'pnpm',
			[
				'--dir',
				path.join(root, 'packages', name),
				'pack',
				'--pack-destination',
				destination
			],
			{ cwd: root, stdio: 'pipe' }
		);
	}
	const archives = readdirSync(destination);
	const core = path.join(
		destination,
		archives.find((file) => file.startsWith('kelvininc-ui-components-'))
	);
	const react = path.join(
		destination,
		archives.find((file) =>
			file.startsWith('kelvininc-react-ui-components-')
		)
	);

	for (const version of versions) {
		const fixture = mkdtempSync(
			path.join(destination, `react-${version.react}-`)
		);
		const dependencies = {
			'@kelvininc/react-ui-components': `file:${react}`,
			'@kelvininc/ui-components': `file:${core}`,
			react: version.react,
			'react-dom': version.react,
			'@types/react': version.types,
			'@types/react-dom': version.domTypes
		};

		writeFileSync(
			path.join(fixture, 'package.json'),
			JSON.stringify(
				{
					private: true,
					type: 'module',
					packageManager: 'pnpm@10.33.4',
					dependencies,
					pnpm: {
						overrides: {
							react: version.react,
							'react-dom': version.react,
							'@types/react': version.types,
							'@types/react-dom': version.domTypes,
							'@kelvininc/ui-components': `file:${core}`
						}
					}
				},
				null,
				2
			)
		);
		execFileSync(
			'pnpm',
			['install', '--ignore-workspace', '--ignore-scripts'],
			{ cwd: fixture, stdio: 'pipe', env: { ...process.env, CI: 'true' } }
		);

		const fixtureRequire = createRequire(
			path.join(fixture, 'package.json')
		);

		assert.equal(
			fixtureRequire('react/package.json').version,
			version.react
		);
		assert.equal(
			fixtureRequire('@types/react/package.json').version,
			version.types
		);
		copyFileSync(
			path.join(root, 'scripts/react-compat/consumer.tsx'),
			path.join(fixture, 'consumer.tsx')
		);
		copyFileSync(
			path.join(root, 'scripts/react-compat/runtime.mjs'),
			path.join(fixture, 'runtime.mjs')
		);
		writeFileSync(
			path.join(fixture, 'tsconfig.json'),
			JSON.stringify({
				compilerOptions: {
					target: 'ES2022',
					module: 'ESNext',
					moduleResolution: 'Bundler',
					jsx: 'react-jsx',
					strict: true,
					noEmit: true,
					esModuleInterop: true,
					skipLibCheck: true,
					types: ['react', 'react-dom'],
					typeRoots: ['./node_modules/@types']
				},
				files: ['consumer.tsx']
			})
		);
		execFileSync(
			process.execPath,
			[typescript, '-p', path.join(fixture, 'tsconfig.json')],
			{ cwd: fixture, stdio: 'inherit' }
		);
		execFileSync(process.execPath, ['runtime.mjs'], {
			cwd: fixture,
			stdio: 'inherit'
		});
		console.log(
			`Published React consumer passed: runtime ${version.react}, types ${version.types}.`
		);
	}
} catch (error) {
	console.error(
		error.stdout?.toString() || error.stderr?.toString() || error.message
	);
	process.exitCode = 1;
} finally {
	rmSync(destination, { recursive: true, force: true });
}
