import { DEFAULT_CONFIG } from '../globals/config';
import { UIComponentsConfig } from '../types';

export const getConfig = (): UIComponentsConfig => {
	if (typeof window !== 'undefined') {
		const KvUiComponents = window.KvUiComponents;
		if (KvUiComponents && KvUiComponents.config) {
			return KvUiComponents.config;
		}
	}

	return DEFAULT_CONFIG;
};
