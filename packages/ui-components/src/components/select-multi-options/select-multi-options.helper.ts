import { ISelectMultiOption, ISelectMultiOptions, ISelectOptionWithChildren, ISelectOptionsWithChildren } from './select-multi-options.types';
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
	level = 0
}: {
	optionKey: string;
	options?: ISelectMultiOptions;
	allOptions?: ISelectMultiOptions;
	selectedOptions?: Record<string, boolean>;
	highlightedOption?: string;
	level?: number;
}): ISelectOptionWithChildren => {
	const childrenOptions = buildSelectOptions({
		options: options[optionKey].options,
		allOptions: allOptions[optionKey].options,
		selectedOptions,
		highlightedOption,
		level: level + 1
	});

	return {
		togglable: true,
		...options[optionKey],
		options: childrenOptions,
		selected: selectedOptions[optionKey] === true,
		state: getOptionToggleState(allOptions[optionKey], selectedOptions),
		highlighted: optionKey === highlightedOption,
		level: level,
		heading: Object.values(childrenOptions).length > 0
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
	level = 0
}: {
	options?: ISelectMultiOptions;
	allOptions?: ISelectMultiOptions;
	selectedOptions?: Record<string, boolean>;
	highlightedOption?: string;
	hasAddItem?: boolean;
	createInputPlaceholder?: string;
	level?: number;
}): ISelectOptionsWithChildren => {
	const selectOptions = Object.keys(options).reduce<ISelectOptionsWithChildren>((accumulator, optionKey) => {
		if (allOptions[optionKey]) {
			accumulator[optionKey] = buildSelectOption({ optionKey, options, allOptions, selectedOptions, highlightedOption, level });
		}

		return accumulator;
	}, {});

	if (hasAddItem) {
		selectOptions[ADD_OPTION.value] = buildNewOption(highlightedOption, createInputPlaceholder);
	}

	return selectOptions;
};
