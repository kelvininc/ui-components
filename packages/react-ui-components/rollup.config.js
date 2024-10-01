import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';

const input = 'src/index.ts';

const getPlugins = (lodashImportOpts = {}, otherPlugins = []) => {
	return [
		peerDepsExternal(),
		resolve(),
		optimizeLodashImports({ ...lodashImportOpts }),
		typescript(),
		postcss({
			modules: true
		}),
		{
			name: 'preserve-use-client-directive',
			generateBundle(_options, bundle) {
				for (const fileName in bundle) {
					const chunk = bundle[fileName];
					if (chunk.type === 'chunk' && chunk.code.includes('stencil-generated/components')) {
						chunk.code = "'use client';\n" + chunk.code;
					}
				}
			}
		},
		...otherPlugins
	];
};

export default [
	{
		input,
		output: {
			dir: 'dist/',
			entryFileNames: '[name].esm.js',
			chunkFileNames: '[name]-[hash].esm.js',
			format: 'es',
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: 'src'
		},
		external: id => !/^(\.|\/)/.test(id),
		plugins: getPlugins({ useLodashEs: true }),
		onwarn(warning, warn) {
			if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
				warn(warning);
			}
		}
	},
	{
		input,
		output: {
			dir: 'dist/',
			format: 'commonjs',
			sourcemap: true,
			preserveModules: true,
			preserveModulesRoot: 'src',
			generatedCode: {
				constBindings: true
			}
		},
		external: id => !/^(\.|\/)/.test(id),
		plugins: getPlugins({}, [
			copy({
				targets: [
					{
						src: 'node_modules/@kelvininc/ui-components/dist/assets',
						dest: './'
					}
				]
			})
		]),
		onwarn(warning, warn) {
			if (warning.code !== 'MODULE_LEVEL_DIRECTIVE') {
				warn(warning);
			}
		}
	}
];
