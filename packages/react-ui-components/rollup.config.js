import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import preserveDirectives from 'rollup-preserve-directives';

const input = './src/index.ts';

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

export default [
	{
		input,
		output: {
			dir: 'dist/',
			entryFileNames: '[name].esm.js',
			chunkFileNames: '[name]-[hash].esm.js',
			format: 'es',
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

			return !/^(\.|\/)/.test(id)
		},
		plugins: getPlugins({ useLodashEs: true })
	},
	{
		input,
		output: {
			dir: 'dist/',
			format: 'commonjs',
			sourcemap: true
		},
		external: id => !/^(\.|\/)/.test(id),
		plugins: getPlugins({}, [
			copy({
				targets: [
					{
						src: 'node_modules/@kelvininc/ui-components/dist/assets',
						dest: './dist'
					}
				]
			})
		])
	}
];
