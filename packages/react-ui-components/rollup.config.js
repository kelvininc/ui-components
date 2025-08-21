import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import preserveDirectives from 'rollup-preserve-directives';

const getPlugins = (lodashImportOpts = {}, otherPlugins = []) => {
	return [
		peerDepsExternal(),
		resolve(),
		optimizeLodashImports({ ...lodashImportOpts }),
		typescript(),
		postcss({
			modules: true
		}),
		preserveDirectives(),
		...otherPlugins
	];
};

// Multiple entry points configuration
const entryPoints = {
	client: './src/client.ts', // Client-only exports (with 'use client')
	shared: './src/shared.ts', // Explicit shared exports
	server: './src/server.ts' // Server-safe exports
};

const createConfig = (input, filename, isESM = true) => ({
	input,
	output: {
		dir: 'dist/',
		entryFileNames: isESM ? `${filename}.esm.js` : `${filename}.js`,
		chunkFileNames: isESM ? '[name]-[hash].esm.js' : '[name]-[hash].js',
		format: isESM ? 'es' : 'commonjs',
		exports: 'named',
		sourcemap: true
	},
	external: id => {
		// @rjsf packages are not esm compatible and
		// therefore need to be bundled with the library
		//
		// For more information: https://github.com/rjsf-team/react-jsonschema-form/issues/4537

		if (/^@rjsf($|\/)/.test(id)) {
			return false;
		}

		return !/^(\.|\/)/.test(id);
	},
	plugins: getPlugins(
		{ useLodashEs: isESM },
		!isESM
			? [
					copy({
						targets: [
							{
								src: 'node_modules/@kelvininc/ui-components/dist/assets',
								dest: './dist'
							}
						]
					})
			  ]
			: []
	)
});

export default [
	// ESM builds for all entry points
	...Object.entries(entryPoints).map(([name, input]) => createConfig(input, name, true)),
	// CommonJS builds for all entry points
	...Object.entries(entryPoints).map(([name, input]) => createConfig(input, name, false))
];
