import { ISelectMultiOption, ISelectOptionWithChildren, ISelectOptionsWithChildren, type IBuildSelectOptionsParams } from './select-multi-options.types';
import { EToggleState, ISelectOption } from '../../types';
import { ADD_OPTION } from './select-multi-options.config';

export const buildNewOption = (highlightedOption?: string, createInputPlaceholder?: string): ISelectOption => ({
	...ADD_OPTION,
	label: createInputPlaceholder ?? ADD_OPTION.label,
	togglable: false,
	selected: false,
	state: EToggleState.None,
	highlighted: ADD_OPTION.value === highlightedOption
});

const buildSelectOption = ({
	optionKey,
	options = {},
	allOptions = {},
	selectedOptions = {},
	highlightedOption,
	level = 0,
	maxSelectable,
	selectedCount
}: IBuildSelectOptionsParams & { optionKey: string }): ISelectOptionWithChildren => {
	const childrenOptions = buildSelectOptions({
		options: options[optionKey].options,
		allOptions: allOptions[optionKey].options,
		selectedOptions,
		highlightedOption,
		level: level + 1,
		maxSelectable,
		selectedCount
	});

	const isSelected = selectedOptions[optionKey] === true;
	const isMaxReached = maxSelectable !== undefined && selectedCount !== undefined && selectedCount >= maxSelectable;
	const isDisabledByMax = isMaxReached && !isSelected;

	return {
		togglable: true,
		...options[optionKey],
		options: childrenOptions,
		selected: isSelected,
		state: getOptionToggleState(allOptions[optionKey], selectedOptions),
		highlighted: optionKey === highlightedOption,
		level: level,
		heading: Object.values(childrenOptions).length > 0,
		disabled: options[optionKey].disabled || isDisabledByMax
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

export const buildSelectOptions = ({
	options = {},
	allOptions = {},
	selectedOptions = {},
	highlightedOption,
	hasAddItem = false,
	createInputPlaceholder,
	level = 0,
	maxSelectable,
	selectedCount
}: IBuildSelectOptionsParams): ISelectOptionsWithChildren => {
	const selectOptions = Object.keys(options).reduce<ISelectOptionsWithChildren>((accumulator, optionKey) => {
		if (allOptions[optionKey]) {
			accumulator[optionKey] = buildSelectOption({ optionKey, options, allOptions, selectedOptions, highlightedOption, level, maxSelectable, selectedCount });
		}

		return accumulator;
	}, {});

	if (hasAddItem) {
		selectOptions[ADD_OPTION.value] = buildNewOption(highlightedOption, createInputPlaceholder);
	}

	return selectOptions;
};

export const buildSelectOptionsArray = ({
	options = {},
	allOptions = {},
	selectedOptions = {},
	highlightedOption,
	hasAddItem = false,
	createInputPlaceholder,
	level = 0,
	maxSelectable,
	selectedCount
}: IBuildSelectOptionsParams): ISelectOptionWithChildren[] => {
	const selectOptionsArray: ISelectOptionWithChildren[] = [];

	for (const optionKey of Object.keys(options)) {
		if (allOptions[optionKey] !== undefined) {
			const builtOption = buildSelectOption({ optionKey, options, allOptions, selectedOptions, highlightedOption, level, maxSelectable, selectedCount });
			selectOptionsArray.push(builtOption);
		}
	}

	if (hasAddItem) {
		selectOptionsArray.push(buildNewOption(highlightedOption, createInputPlaceholder));
	}

	return selectOptionsArray;
};
