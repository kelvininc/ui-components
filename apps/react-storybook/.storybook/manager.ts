import { addons } from "@storybook/manager-api";
import theme from "./themes/kelvin-theme";

addons.setConfig({
	theme,
	enableShortcuts: false
});
