import { isEmpty } from 'lodash';

/**
 * This inputmask cannot handle date limits if one of the limit is not defined.
 * Therefore, if we need to use this feature, we should always set the two limits.
 */
export const getDateLimitsInputmaskConfig = (min?: string, max?: string) => {
	if (!isEmpty(min) && !isEmpty(max)) {
		return {
			min,
			max
		};
	}
};
