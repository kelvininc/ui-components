import { themes } from '@storybook/theming';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { extractArgTypes, extractArgTypesFactory, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../../ui-components/docs/docs.json';

// To have hot-reload
defineCustomElements();

if (docJson) setStencilDocJson(docJson);

export const parameters = {
	viewMode: 'canvas',
	actions: { argTypesRegex: '^on[A-Z].*' },
	themes: {
		default: 'Night Theme',
		list: [
			{ name: 'Night Theme', class: 'night', color: '#202020' },
			{ name: 'Light Theme', class: 'light', color: '#fff' }
		]
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	},
	backgrounds: { disable: true },
	options: {
		storySort: {
			order: ['Foundation', ['Introduction', 'Colors', 'Spatial System', 'Typography'], 'Components']
		},
		isToolshown: true
	},
	controls: { hideNoControlsWarning: true },
	extractArgTypes: extractArgTypesFactory({ dashCase: false }),
	docs: {
		theme: themes.dark,
		extractArgTypes,
		extractComponentDescription
	}
};
