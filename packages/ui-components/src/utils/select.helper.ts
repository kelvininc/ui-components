import { isEmpty } from 'lodash-es';
import { ISelectMultiOptions, ISelectOptionWithChildren, ISelectOptionsWithChildren, ISelectSingleOptions } from '../types';
import { isSubString } from './string.helper';

export const getSelectableOptions = (options: ISelectOptionsWithChildren = {}): ISelectOptionsWithChildren => {
	return Object.values(options).reduce<ISelectOptionsWithChildren>((accumulator, option) => {
		if (isEmpty(option.options) && !option.disabled) {
			accumulator[option.value] = option;
		} else if (!isEmpty(option.options)) {
			const nested = getSelectableOptions(option.options);
			for (const key of Object.keys(nested)) {
				accumulator[key] = nested[key];
			}
		}

		return accumulator;
	}, {});
};

export const getSelectableOptionsFromArray = (options: ISelectOptionWithChildren[]): ISelectOptionWithChildren[] =>
	options.filter(option => isEmpty(option.options) && !option.disabled);

export const getSelectedSelectableOptions = (options: ISelectMultiOptions = {}, selectedOptions: Record<string, boolean> = {}): ISelectMultiOptions => {
	const selectableOptions = getSelectableOptions(options);

	return Object.keys(selectedOptions).reduce((accumulator, optionKey) => {
		const selectedOption = selectableOptions[optionKey];
		const isOptionSelected = selectedOptions[optionKey] === true;

		if (selectedOption && isOptionSelected) {
			accumulator[optionKey] = selectedOption;
		}

		return accumulator;
	}, {});
};

export const getFlattenSelectOptions = (selectOptions: ISelectOptionsWithChildren = {}): ISelectOptionsWithChildren =>
	Object.values(selectOptions).reduce<ISelectOptionsWithChildren>((accumulator, selectOption) => {
		accumulator[selectOption.value] = selectOption;

		const childrenOpts = getFlattenSelectOptions(selectOption.options);
		Object.keys(childrenOpts).forEach(childrenKey => (accumulator[childrenKey] = childrenOpts[childrenKey]));

		return accumulator;
	}, {});

const flattenOptionsReducer = (accumulator: ISelectOptionWithChildren[], selectOption: ISelectOptionWithChildren): ISelectOptionWithChildren[] => {
	accumulator.push(selectOption);
	Object.values(selectOption.options ?? {}).reduce(flattenOptionsReducer, accumulator);
	return accumulator;
};

export const getFlattenSelectOptionsArray = (selectOptions: ISelectOptionsWithChildren = {}): ISelectOptionWithChildren[] =>
	Object.values(selectOptions).reduce(flattenOptionsReducer, []);

export const flattenSelectOptionsArray = (selectOptions: ISelectOptionWithChildren[] = []): ISelectOptionWithChildren[] => selectOptions.reduce(flattenOptionsReducer, []);

export const buildSelectedOptions = (options: ISelectMultiOptions = {}, selected: string[]): Record<string, boolean> =>
	Object.keys(options).reduce<Record<string, boolean>>((accumulator, childKey) => {
		accumulator[childKey] = selected.includes(childKey);
		return accumulator;
	}, {});

export const buildAllOptionsSelected = (options: ISelectMultiOptions = {}): Record<string, boolean> =>
	Object.keys(options).reduce<Record<string, boolean>>((accumulator, childKey) => {
		accumulator[childKey] = true;
		return accumulator;
	}, {});

export const getSelectedCount = (selectedOptions: Record<string, boolean> = {}): number => Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;

export const buildPartialOptionsSelected = (options: ISelectMultiOptions = {}, maxSelectable: number, currentSelectedCount: number): Record<string, boolean> | undefined => {
	const availableSlots = maxSelectable - currentSelectedCount;
	if (availableSlots <= 0) {
		return undefined;
	}

	const keysToSelect = Object.keys(options).slice(0, availableSlots);
	return keysToSelect.reduce<Record<string, boolean>>((acc, key) => {
		acc[key] = true;
		return acc;
	}, {});
};

export const getPreviousHightlightableOption = (options: ISelectOptionWithChildren[], highlightedOption?: string): string | undefined => {
	if (options.length === 0) {
		return;
	}

	const optionValues = options.map(o => o.value);
	const fallbackOption = optionValues[0];
	const highlightedIndex = highlightedOption !== undefined ? optionValues.indexOf(highlightedOption) : -1;

	if (highlightedIndex === -1) {
		return fallbackOption;
	}

	if (highlightedIndex === 0) {
		return highlightedOption;
	}

	return optionValues[highlightedIndex - 1];
};

export const getNextHightlightableOption = (options: ISelectOptionWithChildren[], highlightedOption?: string): string | undefined => {
	if (options.length === 0) {
		return;
	}

	const optionValues = options.map(o => o.value);
	const fallbackOption = optionValues[0];
	const highlightedIndex = highlightedOption !== undefined ? optionValues.indexOf(highlightedOption) : -1;

	if (highlightedIndex === -1) {
		return fallbackOption;
	}

	if (highlightedIndex === optionValues.length - 1) {
		return highlightedOption;
	}

	return optionValues[highlightedIndex + 1];
};

export const searchDropdownOptions = (term: string, options: ISelectSingleOptions | ISelectMultiOptions = {}): ISelectSingleOptions | ISelectMultiOptions => {
	if (isEmpty(term)) {
		return options;
	}

	return Object.keys(options).reduce<ISelectSingleOptions | ISelectMultiOptions>((accumulator, key) => {
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

		if (isSubString(term, option.label) || isSubString(term, option.value)) {
			accumulator[key] = option;
		}

		return accumulator;
	}, {});
};
