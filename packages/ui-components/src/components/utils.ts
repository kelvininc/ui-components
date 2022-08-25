import { isNil } from 'lodash-es';
import { DEFAULT_CONFIG } from '../globals/config';
import { UIComponentsConfig } from '../types';

export const getConfig = (): UIComponentsConfig => {
	if (typeof window !== 'undefined') {
		const KvUiComponents = window.KvUiComponents;
		if (!isNil(KvUiComponents) && !isNil(KvUiComponents.config)) {
			return KvUiComponents.config;
		}
	}

	return DEFAULT_CONFIG;
};
