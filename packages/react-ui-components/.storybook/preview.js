import { themes } from '@storybook/theming';
import { defineCustomElements } from '@kelvininc/ui-components/loader';
import { initialize, StyleMode } from '@kelvininc/ui-components';
import { extractArgTypes, extractArgTypesFactory, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../../ui-components/docs/docs.json';

// To have hot-reload
defineCustomElements();

if (docJson) setStencilDocJson(docJson);

initialize({ styleMode: StyleMode.Night, baseAssetsUrl: '' });

export const parameters = {
	viewMode: 'canvas',
	actions: { argTypesRegex: '^on[A-Z].*' },
	themes: {
		default: 'Night Theme',
		clearable: false,
		list: [
			{ name: 'Night Theme', class: StyleMode.Night, color: '#202020' },
			{ name: 'Light Theme', class: StyleMode.Light, color: '#fff' }
		],
		onChange: themeName => {
			const iframe = document.getElementById('storybook-preview-iframe');
			const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
			const targetEl = iframeDocument.body;
			targetEl.setAttribute('mode', themeName.class);
			// TODO: Need force render after change theme
		}
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
			order: ['Foundation', ['Introduction', 'Colors', 'Spatial System', 'Typography'], 'Buttons', 'Data Display', 'Inputs', 'Feedback', 'Media', 'Navigation']
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
