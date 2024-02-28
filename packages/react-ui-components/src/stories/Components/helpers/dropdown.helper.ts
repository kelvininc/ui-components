import { ISelectMultiOptions, ISelectSingleOptions } from '@kelvininc/ui-components';

export const getDropdownDisplayValue = (selectedOptions: string[], options: ISelectSingleOptions | ISelectMultiOptions, suffix = 'filtered'): string | undefined => {
	if (selectedOptions.length === 0) {
		return undefined;
	}

	if (selectedOptions.length === 1 && options[selectedOptions[0]]) {
		return options[selectedOptions[0]].label;
	}

	return `${selectedOptions.length} ${suffix}`;
};
