import { StyleMode, UIComponentsConfig } from '../types';
import { DEFAULT_CONFIG } from './config';

export const initialize = (userConfig: UIComponentsConfig = {}) => {
	const { window: win } = window;

	if (typeof win === 'undefined') {
		return;
	}

	const instance = (win.KvUiComponents = win.KvUiComponents ?? {});
	const actualConfig = (instance.config = instance.config ?? {});
	win.KvUiComponents.config = {
		...DEFAULT_CONFIG,
		...actualConfig,
		...userConfig
	};
};

/**
 * Dynamically sets the theme mode without requiring a page refresh.
 * This updates the mode attribute on the body element, which triggers
 * CSS custom properties to update across all components.
 *
 * @param mode - The StyleMode to set ('night' or 'light')
 */
export const setThemeMode = (mode: StyleMode): void => {
	if (!Object.values(StyleMode).includes(mode)) {
		console.warn(`Invalid theme mode: ${mode}, expected: ${Object.values(StyleMode).join(',')}`);
		return;
	}

	document.body.setAttribute('mode', mode);

	if (typeof window !== 'undefined' && window.KvUiComponents?.config) {
		window.KvUiComponents.config.styleMode = mode;
	}
};

/**
 * Gets the current theme mode.
 *
 * @returns The current StyleMode
 */
export const getThemeMode = (): StyleMode => {
	const bodyMode = document.body.getAttribute('mode') as StyleMode;

	if (bodyMode && Object.values(StyleMode).includes(bodyMode)) {
		return bodyMode;
	}

	return window.KvUiComponents?.config?.styleMode ?? StyleMode.Night;
};

/**
 * Toggles between light and dark theme modes.
 *
 * @returns The new StyleMode after toggling
 */
export const toggleThemeMode = (): StyleMode => {
	const currentMode = getThemeMode();
	const newMode = currentMode === StyleMode.Night ? StyleMode.Light : StyleMode.Night;
	setThemeMode(newMode);
	return newMode;
};

export default initialize;
