import base from "!!style-loader?injectType=lazyStyleTag!css-loader!./base.scss";
import custom from "!!style-loader?injectType=lazyStyleTag!css-loader!./custom.scss";
import cssVariablesTheme from "@etchteam/storybook-addon-css-variables-theme";

export const decorators = [cssVariablesTheme];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	},
	cssVariables: {
		files: {
			"Default Theme": base,
			"Custom Theme": custom
		}
	}
};
