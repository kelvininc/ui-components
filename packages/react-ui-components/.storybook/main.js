module.exports = {
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@etchteam/storybook-addon-css-variables-theme",
		"storybook-addon-sass-postcss"
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
