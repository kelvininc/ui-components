import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';

const input = 'src/index.ts';

const getPlugins = (lodashImportOpts = {}, otherPlugins = []) => {
	return [peerDepsExternal(), resolve(), optimizeLodashImports({ ...lodashImportOpts }), typescript(), postcss(), ...otherPlugins];
};

export default [
	{
		input,
		output: {
			dir: 'dist/',
			entryFileNames: '[name].esm.js',
			chunkFileNames: '[name]-[hash].esm.js',
			format: 'es',
			sourcemap: true
		},
		external: id => !/^(\.|\/)/.test(id),
		plugins: getPlugins({ useLodashEs: true })
	},
	{
		input,
		output: {
			dir: 'dist/',
			format: 'commonjs',
			preferConst: true,
			sourcemap: true
		},
		external: id => !/^(\.|\/)/.test(id),
		plugins: getPlugins({}, [
			copy({
				targets: [
					{
						src: '../ui-components/src/assets',
						dest: './'
					}
				]
			})
		])
	}
];
