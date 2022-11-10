import { IMultiSelectDropdownOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';

export const searchDropdownOptions = (term: string, options: ISingleSelectDropdownOptions | IMultiSelectDropdownOptions) => {
	const lowerCaseTerm = term.toLowerCase();
	return Object.keys(options).reduce<ISingleSelectDropdownOptions | IMultiSelectDropdownOptions>((accumulator, key) => {
		const option = options[key];
		const lowerCaseLabel = option.label.toLowerCase();

		if (lowerCaseLabel.includes(lowerCaseTerm)) {
			accumulator[key] = option;
		}

		return accumulator;
	}, {});
};

export const getDropdownDisplayValue = (
	selectedOptions: string[],
	options: ISingleSelectDropdownOptions | IMultiSelectDropdownOptions,
	suffix = 'filtered'
): string | undefined => {
	if (selectedOptions.length === 0) {
		return undefined;
	}

	if (selectedOptions.length === 1 && options[selectedOptions[0]]) {
		return options[selectedOptions[0]].label;
	}

	return `${selectedOptions.length} ${suffix}`;
};
