module.exports = {
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@etchteam/storybook-addon-css-variables-theme",
		"storybook-addon-sass-postcss",
		'@pxtrn/storybook-addon-docs-stencil',
		'@storybook/addon-notes/register'
	],
	staticDirs: [
		{
			from: "../../ui-components/src/assets/fonts",
			to: "/fonts"
		},
		{
			from: "./images",
			to: "/images"
		}
	]
};
