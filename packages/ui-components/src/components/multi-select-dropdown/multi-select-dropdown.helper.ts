import { isEmpty } from 'lodash-es';
import { ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';

export const getSelectedOptionsCount = (options: ISelectMultiOptions = {}, selectedOptions: { [key: string]: boolean } = {}): string[] => {
	return Object.keys(selectedOptions).reduce<string[]>((accumulator, selectOption) => {
		if (isEmpty(options[selectOption])) {
			return accumulator;
		}

		if (selectedOptions[selectOption]) {
			accumulator.push(selectOption);
		}

		return accumulator;
	}, []);
};

export const getDropdownDisplayValue = (options: ISelectMultiOptions = {}, selectedOptions: { [key: string]: boolean } = {}): string => {
	return getSelectedOptionsCount(options, selectedOptions).reduce((acc, optionKey, currentIndex, selectedOptionsArray) => {
		if (isEmpty(options[optionKey])) {
			if (currentIndex === selectedOptionsArray.length - 1) {
				acc = acc.slice(0, acc.length - 2);
			}
			return acc;
		}
		return `${acc + options[optionKey]?.label + (currentIndex !== selectedOptionsArray.length - 1 ? ', ' : '')}`;
	}, '');
};

export const getAllOptionsSelected = (options: ISelectMultiOptions = {}): Record<string, boolean> =>
	Object.keys(options).reduce((accumulator, optionKey) => {
		accumulator[optionKey] = true;

		return accumulator;
	}, {});
