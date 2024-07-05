import { EToasterType, IToaster } from '@kelvininc/ui-components';

export const DEFAULT_ROOT_ID = 'toasters-root';

export const TOASTER_TTL_MS = 5000;

export const TOASTER_CONFIG: IToaster = {
	header: '',
	type: EToasterType.Info,
	ttl: TOASTER_TTL_MS
};
