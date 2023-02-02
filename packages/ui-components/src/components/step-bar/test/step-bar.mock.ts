import { IStepIndicator } from '../../../types';

export const STEPS_SUCCESS_MOCK: IStepIndicator[] = [
	{
		enabled: true,
		active: true
	},
	{
		enabled: true,
		active: true
	},
	{
		enabled: false
	}
];

export const STEPS_ERROR_MOCK: IStepIndicator[] = [
	{
		enabled: true,
		active: true,
		hasError: true
	},
	{
		enabled: true,
		active: true,
		hasError: true
	},
	{
		enabled: false
	}
];
