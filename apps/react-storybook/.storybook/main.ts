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
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@storybook/addon-interactions"),
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
				useSWC: true,
			},
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
	}
};
export default config;
