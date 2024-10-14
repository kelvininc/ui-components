import type { StorybookConfig } from "@storybook/react-vite";
import { join, dirname } from "path";

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
		getAbsolutePath("@storybook/addon-themes"),
		getAbsolutePath("@pxtrn/storybook-addon-docs-stencil")
	],
	framework: {
		name: getAbsolutePath("@storybook/react-vite"),
		options: {}
	},
	staticDirs: [
		{
			from: "../src/assets/",
			to: "/"
		},
		{
			from: "../node_modules/@kelvininc/react-ui-components/assets",
			to: "/"
		}
	],
	typescript: {
		reactDocgen: "react-docgen-typescript"
	}
};
export default config;
