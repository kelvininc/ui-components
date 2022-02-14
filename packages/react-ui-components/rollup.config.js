// import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
	input: "dist-transpiled/index",
	output: [
		{
			dir: "dist/",
			entryFileNames: "[name].esm.js",
			chunkFileNames: "[name]-[hash].esm.js",
			format: "es",
			sourcemap: true
		},
		{
			dir: "dist/",
			format: "commonjs",
			preferConst: true,
			sourcemap: true
		}
	],
	external: (id) => !/^(\.|\/)/.test(id),
	plugins: [
		peerDepsExternal(),
		resolve(),
		copy({
			targets: [
				{
					src: "../ui-components/src/assets",
					dest: "dist"
				}
			]
		})
	]
};
