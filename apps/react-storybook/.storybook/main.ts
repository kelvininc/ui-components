import type { StorybookConfig } from "@storybook/react-webpack5";
import path, { join, dirname } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const devMode = process.env.NODE_ENV !== "production";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-themes"),
		{
			name: "@storybook/addon-styling-webpack",
			options: {
				rules: [
					{
						test: /\.scss$/i,
						exclude: /\.module\.scss$/i,
						use: [
							devMode
								? "style-loader"
								: MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									importLoaders: 1,
									modules: {
										mode: "icss"
									}
								}
							},
							{
								loader: "sass-loader"
							}
						]
					},
					{
						test: /\.module\.scss$/i,
						use: [
							devMode
								? "style-loader"
								: MiniCssExtractPlugin.loader,
							{
								loader: "css-loader",
								options: {
									importLoaders: 1,
									modules: {
										mode: "local"
									}
								}
							},
							{
								loader: "sass-loader"
							}
						]
					}
				],
				plugins: [...(devMode ? [] : [new MiniCssExtractPlugin()])]
			}
		},
		getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
		getAbsolutePath("@pxtrn/storybook-addon-docs-stencil")
	],
	framework: {
		name: getAbsolutePath("@storybook/react-webpack5"),
		options: {
			builder: {
				useSWC: true
			}
		}
	},
	staticDirs: [
		{
			from: "../src/assets/",
			to: "/"
		},
		{
			from: "../node_modules/@kelvininc/react-ui-components/dist/assets",
			to: "/"
		},
		{
			from: "../public",
			to: "/"
		}
	],
	typescript: {
		reactDocgen: "react-docgen-typescript"
	},
	// Storybook 9 consolidated a number of runtime packages into the main
	// `storybook` package. `@pxtrn/storybook-addon-docs-stencil@8` (patched to
	// expose its Storybook 8 preset) still resolves the pre-consolidation
	// package names, so alias them here to keep the addon working.
	webpackFinal: async (webpackConfig) => {
		webpackConfig.resolve = webpackConfig.resolve || {};
		webpackConfig.resolve.alias = {
			...(webpackConfig.resolve.alias ?? {}),
			"@storybook/client-logger": require.resolve(
				"storybook/internal/client-logger"
			),
			"@storybook/preview-api": require.resolve(
				"storybook/preview-api"
			)
		};
		// Storybook 9 ships a CommonJS build of the instrumenter which
		// `require`s Node built-ins such as `tty` and calls `tty.isatty()`
		// at load time. Webpack 5 no longer polyfills Node built-ins, and a
		// bare `false` stub leaves `isatty` undefined (TypeError in the
		// preview iframe), so point `tty` at a minimal browser shim instead.
		webpackConfig.resolve.fallback = {
			...(webpackConfig.resolve.fallback ?? {}),
			tty: path.join(__dirname, "tty-shim.cjs")
		};
		return webpackConfig;
	}
};
export default config;
