const path = require('path');

module.exports = {
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		'storybook-addon-themes',
		"storybook-addon-sass-postcss",
		'@pxtrn/storybook-addon-docs-stencil',
		'@storybook/addon-notes/register'
	],
	staticDirs: [
		{
			from: "../../ui-components/src/assets/",
			to: "/"
		},
		{
			from: "./images",
			to: "/images"
		}
	],
	webpackFinal: async (config) => {
		config.resolve.alias = {
			...config.resolve?.alias,
			"@ui-notes": path.resolve(
				__dirname,
				"../../ui-components/src/components"
			)
		};
		return config;
	}
};
