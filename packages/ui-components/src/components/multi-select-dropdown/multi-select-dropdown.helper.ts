import { isNil } from 'lodash-es';
import { IMultiSelectDropdownOption } from './multi-select-dropdown.types';

export const getSelectedOptionsCount = (options: { [key: string]: IMultiSelectDropdownOption }, selectedOptions: { [key: string]: boolean }): string[] => {
	return Object.keys(selectedOptions).reduce((accumulator, selectOption) => {
		if (isNil(options[selectOption])) {
			return accumulator;
		}

		if (selectedOptions[selectOption]) {
			accumulator.push(selectOption);
		}

		return accumulator;
	}, []);
};

export const getDropdownDisplayValue = (options: { [key: string]: IMultiSelectDropdownOption }, selectedOptions: { [key: string]: boolean }): string => {
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
