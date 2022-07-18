import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
	input: 'src/components/index.ts',
	output: [
		{
			dir: 'dist/',
			entryFileNames: '[name].esm.js',
			chunkFileNames: '[name]-[hash].esm.js',
			format: 'es',
			sourcemap: true
		},
		{
			dir: 'dist/',
			format: 'commonjs',
			preferConst: true,
			sourcemap: true
		}
	],
	external: id => !/^(\.|\/)/.test(id),
	plugins: [
		peerDepsExternal(),
		resolve(),
		typescript({ tsconfig: './tsconfig.lib.json' }),
		postcss(),
		copy({
			targets: [
				{
					src: '../ui-components/src/assets',
					dest: './'
				}
			]
		})
	]
};
