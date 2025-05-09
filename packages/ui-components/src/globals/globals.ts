import { UIComponentsConfig } from '../types';
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

export default initialize;
