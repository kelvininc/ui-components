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
