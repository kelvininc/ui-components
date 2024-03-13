import { isEmpty } from 'lodash';
import { IDateTimeInputLimits } from './date-time-input.types';

/**
 * This inputmask cannot handle date limits if one of the limit is not defined.
 * Therefore, if we need to use this feature, we should always set the two limits.
 */
export const getDateLimitsInputmaskConfig = (limits?: IDateTimeInputLimits): Inputmask.Options => {
	if (!isEmpty(limits?.min) && !isEmpty(limits?.max)) {
		return {
			...limits
		};
	}
};
