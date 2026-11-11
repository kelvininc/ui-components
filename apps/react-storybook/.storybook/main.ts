import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-webpack5";
import path, { join, dirname } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

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
		getAbsolutePath("@pxtrn/storybook-addon-docs-stencil"),
		getAbsolutePath("@storybook/addon-mcp")
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
	// The components manifest feeds the docs tools of @storybook/addon-mcp.
	// react-docgen-typescript finds no props in the built React wrappers, so
	// the manifest reads them from the packages' .d.ts files with
	// react-component-meta instead. Both need `pnpm build:packages` first.
	features: {
		componentsManifest: true,
		experimentalReactComponentMeta: true
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
