import { ISelectMultiOption, ISelectMultiOptions } from './select-multi-options.types';
import { EToggleState, ISelectOption } from '../../types';

const buildSelectOption = (
	optionKey: string,
	options: ISelectMultiOptions = {},
	allOptions: ISelectMultiOptions,
	selectedOptions: Record<string, boolean> = {},
	highlightedOption?: string
): ISelectOption => {
	const childrenOptions = buildSelectOptions(options[optionKey].options, allOptions[optionKey].options, selectedOptions, highlightedOption);

	return {
		...options[optionKey],
		options: childrenOptions,
		selected: selectedOptions[optionKey] === true,
		togglable: true,
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
	allOptions: ISelectMultiOptions,
	selectedOptions: Record<string, boolean> = {},
	highlightedOption?: string
): Record<string, ISelectOption> =>
	Object.keys(options).reduce<Record<string, ISelectOption>>((accumulator, optionKey) => {
		accumulator[optionKey] = buildSelectOption(optionKey, options, allOptions, selectedOptions, highlightedOption);

		return accumulator;
	}, {});
