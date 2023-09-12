import { isEmpty } from 'lodash';
import { ISelectOption, ISingleSelectDropdownOptions } from '../../types';

export const buildSelectOptions = (options: ISingleSelectDropdownOptions = {}, selectedOption?: string, highlightedOption?: string): Record<string, ISelectOption> =>
	Object.values(options).reduce<Record<string, ISelectOption>>((accumulator, option) => {
		accumulator[option.value] = {
			...option,
			togglable: false,
			options: buildSelectOptions(option.options, selectedOption, highlightedOption),
			selectable: isEmpty(option.options),
			selected: selectedOption === option.value,
			highlighted: highlightedOption === option.value
		};

		return accumulator;
	}, {});
