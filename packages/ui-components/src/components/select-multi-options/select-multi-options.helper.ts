import { ISelectMultiOption, ISelectMultiOptions } from './select-multi-options.types';
import { EToggleState, ISelectOption } from '../../types';
import { isEmpty } from 'lodash';
import { ADD_OPTION, SELECT_OPTION_HEIGHT_IN_PX } from './select-multi-options.config';

const buildNewOption = (highlightedOption?: string, createInputPlaceholder?: string): ISelectOption => ({
	...ADD_OPTION,
	label: createInputPlaceholder ?? ADD_OPTION.label,
	togglable: false,
	selected: false,
	state: EToggleState.None,
	highlighted: ADD_OPTION.value === highlightedOption
});

const buildSelectOption = (
	optionKey: string,
	options: ISelectMultiOptions = {},
	allOptions: ISelectMultiOptions = {},
	selectedOptions: Record<string, boolean> = {},
	highlightedOption?: string
): ISelectOption => {
	const childrenOptions = buildSelectOptions(options[optionKey].options, allOptions[optionKey].options, selectedOptions, highlightedOption);

	return {
		togglable: true,
		...options[optionKey],
		options: childrenOptions,
		selected: selectedOptions[optionKey] === true,
		state: getOptionToggleState(allOptions[optionKey], selectedOptions),
		highlighted: optionKey === highlightedOption
	};
};

const getOptionToggleState = (option: ISelectMultiOption, selectedOptions: Record<string, boolean> = {}): EToggleState => {
	const children = Object.values(option.options ?? {});
	if (children.length === 0) {
		if (selectedOptions[option.value]) {
			return EToggleState.Selected;
		}

		return EToggleState.None;
	}

	const childrenStates = children.map(childrenOpt => getOptionToggleState(childrenOpt, selectedOptions));
	const [firstChildrenState, ...otherChildrenStates] = childrenStates;

	// Check if all children have the same state
	if (otherChildrenStates.every(childrenState => childrenState === firstChildrenState)) {
		return firstChildrenState;
	}

	// Otherwise
	return EToggleState.Indeterminate;
};

export const buildSelectOptions = (
	options: ISelectMultiOptions = {},
	allOptions: ISelectMultiOptions = {},
	selectedOptions: Record<string, boolean> = {},
	highlightedOption?: string,
	hasAddItem: boolean = false,
	createInputPlaceholder?: string
): Record<string, ISelectOption> => {
	const selectOptions = Object.keys(options).reduce<Record<string, ISelectOption>>((accumulator, optionKey) => {
		if (allOptions[optionKey]) {
			accumulator[optionKey] = buildSelectOption(optionKey, options, allOptions, selectedOptions, highlightedOption);
		}

		return accumulator;
	}, {});

	if (hasAddItem) {
		selectOptions[ADD_OPTION.value] = buildNewOption(highlightedOption, createInputPlaceholder);
	}

	return selectOptions;
};

export const getSelectOptionHeight = (option: ISelectOption): number => {
	let height = SELECT_OPTION_HEIGHT_IN_PX;

	if (!isEmpty(option.options)) {
		const children = Object.values(option.options);

		height += children.reduce((accumulator, childrenOption) => {
			accumulator += getSelectOptionHeight(childrenOption);

			return accumulator;
		}, 0);
	}

	return height;
};
