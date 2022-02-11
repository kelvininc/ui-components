module.exports = {
	"stories": [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)"
	],
	"addons": [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@etchteam/storybook-addon-css-variables-theme"
	],
	"staticDirs": [{from:'../src/fonts', to:'/fonts'}],
	"framework": "@storybook/html",
}