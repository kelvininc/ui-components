import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import {
	extractArgTypes,
	extractComponentDescription,
	setStencilDocJson
} from "@pxtrn/storybook-addon-docs-stencil";
import docJson from "@kelvininc/ui-components/docs/docs.json";

import theme from "./themes/kelvin-theme";
import { camelToKebab } from "./utils";

if (docJson) {
	setStencilDocJson(
		docJson as unknown as Parameters<typeof setStencilDocJson>[0]
	);
}

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Global theme for components",
			toolbar: {
				icon: "photo",
				items: [
					{
						value: "light",
						title: "Light Theme",
						right: "🌕"
					},
					{
						value: "night",
						title: "Night Theme",
						right: "🌙"
					}
				]
			}
		}
	},
	initialGlobals: {
		theme: "night"
	},
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
					component.displayName || component.render.displayName;

				if (!displayName) {
					return null;
				}

				const tagName = camelToKebab(displayName);

				return extractComponentDescription(tagName);
			},
			extractArgTypes: (component) => {
				const displayName =
					component.displayName || component.render.displayName;

				if (!displayName) {
					return null;
				}

				const tagName = camelToKebab(displayName);

				return extractArgTypes(tagName);
			}
		},
		themes: { disable: true }
	},
	tags: ["autodocs"],
	decorators: [
		withThemeByClassName({
			themes: {
				light: "light-theme",
				night: "night-theme"
			},
			defaultTheme: "night"
		})
	]
};

export default preview;
