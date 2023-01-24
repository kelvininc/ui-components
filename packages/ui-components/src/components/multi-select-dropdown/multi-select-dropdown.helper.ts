import { isNil } from 'lodash-es';
import { IMultiSelectDropdownOptions } from './multi-select-dropdown.types';

export const getSelectedOptionsCount = (options: IMultiSelectDropdownOptions = {}, selectedOptions: { [key: string]: boolean } = {}): string[] => {
	return Object.keys(selectedOptions).reduce<string[]>((accumulator, selectOption) => {
		if (isNil(options[selectOption])) {
			return accumulator;
		}

		if (selectedOptions[selectOption]) {
			accumulator.push(selectOption);
		}

		return accumulator;
	}, []);
};

export const getDropdownDisplayValue = (options: IMultiSelectDropdownOptions = {}, selectedOptions: { [key: string]: boolean } = {}): string => {
	return getSelectedOptionsCount(options, selectedOptions).reduce((acc, optionKey, currentIndex, selectedOptionsArray) => {
		if (isNil(options[optionKey])) {
			if (currentIndex === selectedOptionsArray.length - 1) {
				acc = acc.slice(0, acc.length - 2);
			}
			return acc;
		}
		return `${acc + options[optionKey]?.label + (currentIndex !== selectedOptionsArray.length - 1 ? ', ' : '')}`;
	}, '');
};
