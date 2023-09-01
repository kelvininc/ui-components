import { ISelectMultiOptions, ISingleSelectDropdownOptions } from '@kelvininc/ui-components';
import { isEmpty } from 'lodash';

export const searchDropdownOptions = (term: string, options: ISingleSelectDropdownOptions | ISelectMultiOptions) => {
	const lowerCaseTerm = term.toLowerCase();
	return Object.keys(options).reduce<ISingleSelectDropdownOptions | ISelectMultiOptions>((accumulator, key) => {
		const option = options[key];

		if (!isEmpty(option.options)) {
			const childrenMatches = searchDropdownOptions(term, option.options);

			if (!isEmpty(childrenMatches)) {
				accumulator[key] = {
					...option,
					options: childrenMatches
				};
			}

			return accumulator;
		}

		const lowerCaseLabel = option.label.toLowerCase();
		if (lowerCaseLabel.includes(lowerCaseTerm)) {
			accumulator[key] = option;
		}

		return accumulator;
	}, {});
};

export const getDropdownDisplayValue = (selectedOptions: string[], options: ISingleSelectDropdownOptions | ISelectMultiOptions, suffix = 'filtered'): string | undefined => {
	if (selectedOptions.length === 0) {
		return undefined;
	}

	if (selectedOptions.length === 1 && options[selectedOptions[0]]) {
		return options[selectedOptions[0]].label;
	}

	return `${selectedOptions.length} ${suffix}`;
};
