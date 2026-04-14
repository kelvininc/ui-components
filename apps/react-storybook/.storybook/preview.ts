import type { Preview, Decorator } from "@storybook/react";
import { createElement, useEffect } from "react";
import {
	extractArgTypes,
	extractComponentDescription,
	setStencilDocJson
} from "@pxtrn/storybook-addon-docs-stencil";
import {
	EComponentSize,
	initialize,
	setThemeMode,
	StyleMode
} from "@kelvininc/ui-components";
import docJson from "@kelvininc/ui-components/docs.json";

import theme from "./themes/kelvin-theme";
import { camelToKebab } from "./utils";

if (docJson) {
	setStencilDocJson(
		docJson as unknown as Parameters<typeof setStencilDocJson>[0]
	);
}

initialize({
	styleMode: StyleMode.Night,
	baseAssetsUrl: ""
});

/**
 * Decorator that syncs the Storybook theme toggle with the design tokens system.
 * Updates the body[mode] attribute when theme changes, enabling dynamic dark/light mode.
 */
const withThemeMode: Decorator = (Story, context) => {
	const selectedTheme = context.globals.theme || "night";

	useEffect(() => {
		const mode = selectedTheme === "light" ? StyleMode.Light : StyleMode.Night;
		setThemeMode(mode);

		// Update color-scheme for native elements (scrollbars, inputs, etc.)
		document.documentElement.style.colorScheme = selectedTheme === "light" ? "light" : "dark";
	}, [selectedTheme]);

	return Story();
};

const themeContainerStyle = {
	flex: 1,
	padding: "24px",
	borderRadius: "8px",
	backgroundColor: "var(--background-surface-neutral-default)",
	border: "1px solid var(--border-surface-card-default)",
	color: "var(--text-surface-neutral-primary)"
} as const;

const themeLabelStyle = {
	marginBottom: "12px",
	fontSize: "11px",
	fontWeight: 600,
	textTransform: "uppercase" as const,
	letterSpacing: "0.05em",
	color: "var(--text-surface-neutral-secondary)",
};

/**
 * Decorator that renders each story side-by-side in both light and night themes.
 * Only active in docs mode — canvas mode uses the toolbar theme toggle instead.
 */
const withThemeSideBySide: Decorator = (Story, context) => {
	if (context.viewMode !== "docs" || context.parameters.themeSideBySide === false) {
		return Story();
	}

	return createElement(
		"div",
		{ style: { display: "flex", gap: "24px", width: "100%" } },
		createElement(
			"div",
			{ "data-theme": "light", style: { ...themeContainerStyle, colorScheme: "light" } },
			createElement("div", { style: themeLabelStyle }, "Light"),
			createElement(Story)
		),
		createElement(
			"div",
			{ "data-theme": "night", style: { ...themeContainerStyle, colorScheme: "dark" } },
			createElement("div", { style: themeLabelStyle }, "Night"),
			createElement(Story)
		)
	);
};

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Global theme for components",
			toolbar: {
				icon: "circlehollow",
				title: "Theme",
				items: [
					{
						value: "light",
						title: "Light Theme",
						icon: "sun"
					},
					{
						value: "night",
						title: "Night Theme",
						icon: "moon"
					}
				],
				dynamicTitle: true
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
			extractComponentDescription: (component: any) => {
				const displayName =
					component?.displayName || component?.render?.displayName;

				if (!displayName) {
					return null;
				}

				const tagName = camelToKebab(displayName);

				return extractComponentDescription(tagName);
			},
			extractArgTypes: (component: any) => {
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
	argTypes: {
		size: {
			description: "Size of the component",
			options: Object.values(EComponentSize)
		}
	},
	tags: ["autodocs"],
	decorators: [withThemeSideBySide, withThemeMode]
};

export default preview;
