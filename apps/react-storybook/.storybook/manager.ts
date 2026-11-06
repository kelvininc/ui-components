import { addons } from "storybook/manager-api";
import theme from "./themes/kelvin-theme";

addons.setConfig({
	theme,
	ui: { enableShortcuts: false },
	layout: { panelPosition: "right" }
});
