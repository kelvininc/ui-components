import { StyleMode, UIComponentsConfig } from '../types';

export const DEFAULT_CONFIG: UIComponentsConfig = {
	styleMode: StyleMode.Night,
	baseAssetsUrl: '/',
	symbolsFileName: 'svg-symbols.svg'
};

export const DEFAULT_PORTAL_Z_INDEX = 9005;
export const DEFAULT_DROPDOWN_Z_INDEX = DEFAULT_PORTAL_Z_INDEX;
// Toggle tip over Dropdown
export const TOGGLE_TIP_Z_INDEX = DEFAULT_PORTAL_Z_INDEX + 1;
// Tooltip over Toggle tip and Dropdown
export const TOOLTIP_Z_INDEX = DEFAULT_PORTAL_Z_INDEX + 2;
