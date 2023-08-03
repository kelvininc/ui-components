import { IStepBarStep } from '../../../types';

export const STEPS_SUCCESS_MOCK: IStepBarStep[] = [
	{
		stepKey: 0,
		enabled: true,
		active: true
	},
	{
		stepKey: 1,
		enabled: true,
		active: true
	},
	{
		stepKey: 2,
		enabled: false
	}
];

export const STEPS_ERROR_MOCK: IStepBarStep[] = [
	{
		stepKey: 0,
		enabled: true,
		active: true,
		hasError: true
	},
	{
		stepKey: 1,
		enabled: true,
		active: true,
		hasError: true
	},
	{
		stepKey: 2,
		enabled: false
	}
];
