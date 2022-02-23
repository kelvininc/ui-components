import base from '!!style-loader?injectType=lazyStyleTag!css-loader!./base.scss';
import custom from '!!style-loader?injectType=lazyStyleTag!css-loader!./custom.scss';
import cssVariablesTheme from '@etchteam/storybook-addon-css-variables-theme';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { extractArgTypes, extractArgTypesFactory, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';

import docJson from '../../ui-components/docs/docs.json';

// To have hot-reload
defineCustomElements();

if (docJson) setStencilDocJson(docJson);

export const decorators = [cssVariablesTheme];
export const parameters = {
	viewMode: 'canvas',
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	},
	cssVariables: {
		files: {
			'Default Theme': base,
			'Custom Theme': custom
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
		extractArgTypes,
		extractComponentDescription
	}
};
