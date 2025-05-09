import type { Preview } from "@storybook/react";
import {
	extractArgTypes,
	extractComponentDescription,
	setStencilDocJson
} from "@pxtrn/storybook-addon-docs-stencil";
import { initialize } from "@kelvininc/ui-components";
import docJson from "@kelvininc/ui-components/docs.json";

import theme from "./themes/kelvin-theme";
import { camelToKebab } from "./utils";

if (docJson) {
	setStencilDocJson(
		docJson as unknown as Parameters<typeof setStencilDocJson>[0]
	);
}

initialize({
	baseAssetsUrl: ""
});

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			},
			hideNoControlsWarning: true
		},
		backgrounds: {
			disable: true,
			default: "dark"
		},
		options: {
			storySort: {
				order: [
					"Foundation",
					["Introduction", "Colors", "Spatial System", "Typography"],
					"Buttons",
					"Data Display",
					"Inputs",
					"Feedback",
					"Media",
					"Navigation"
				]
			},
			isToolshown: true
		},
		docs: {
			theme,
			extractComponentDescription: (component) => {
				const displayName =
					component?.displayName || component?.render?.displayName;

				if (!displayName) {
					return null;
				}

				const tagName = camelToKebab(displayName);

				return extractComponentDescription(tagName);
			},
			extractArgTypes: (component) => {
				const displayName =
					component?.displayName || component?.render?.displayName;

				if (!displayName) {
					return null;
				}

				const tagName = camelToKebab(displayName);

				return extractArgTypes(tagName);
			}
		},
		themes: { disable: true }
	},
	tags: ["autodocs"]
};

export default preview;
