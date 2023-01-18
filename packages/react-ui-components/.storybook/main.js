const path = require('path');

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/preset-create-react-app',
		'storybook-addon-themes',
		'@pxtrn/storybook-addon-docs-stencil',
		'@storybook/addon-notes/register'
	],
	staticDirs: [
		{
			from: '../../ui-components/src/assets/',
			to: '/'
		},
		{
			from: './images',
			to: '/images'
		}
	],
	core: {
		builder: 'webpack5'
	},
	webpackFinal: async config => {
		config.resolve.alias = {
			...config.resolve?.alias,
			'@ui-notes': path.resolve(__dirname, '../../ui-components/src/components'),
			'@react-ui-notes': path.resolve(__dirname, '../src/components'),
		};

		return config;
	}
};
