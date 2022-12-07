import { EnumOptionsType } from '@rjsf/utils';

export const getMatchingOption = (value?: number | string, options?: EnumOptionsType[]) => {
	return value && options?.find(opt => opt.value === value);
};
