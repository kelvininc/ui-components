import { IMultiSelectDropdownOptions, ISingleSelectDropdownOptions, ISelectMultiOptions } from '@kelvininc/ui-components';
import { isEmpty } from 'lodash';

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

export const searchMultiLevelDropdownOptions = (term: string, options: ISelectMultiOptions) => {
	if (isEmpty(term)) {
		return;
	}

	return Object.keys(options).reduce<ISelectMultiOptions>((acc, key) => {
		const option = options[key];
		if (isEmpty(option.children)) {
			if (option.label.includes(term)) {
				acc[key] = option;
			}
		} else {
			const childrenMatches = searchMultiLevelDropdownOptions(term, option.children);

			if (!isEmpty(childrenMatches)) {
				acc[key] = {
					...option,
					children: childrenMatches
				};
			}
		}
		return acc;
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
