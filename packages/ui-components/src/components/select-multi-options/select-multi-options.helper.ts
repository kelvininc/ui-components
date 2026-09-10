import type { IBuildSelectOptionsParams, ISelectMultiOption, ISelectOptionWithChildren, ISelectOptionsWithChildren } from './select-multi-options.types';
import { EToggleState } from '../../types';
import type { ISelectOption } from '../../types';
import { getSelectedCount } from '../../utils/select.helper';
import { ADD_OPTION } from './select-multi-options.config';

interface IBuildRangeSelectionParams {
	/** The range to select, ordered from the anchor towards the endpoint */
	optionValues: string[];
	/** The options a range selection is allowed to deselect, i.e. the ones currently listed */
	replaceableOptionValues: string[];
	selectedOptions?: Record<string, boolean>;
	maxSelectable?: number;
}

export const getRangeOptionValues = (options: ISelectOptionWithChildren[], anchorValue: string, endpointValue: string): string[] => {
	const optionValues = options.map(({ value }) => value);
	const anchorIndex = optionValues.indexOf(anchorValue);
	const endpointIndex = optionValues.indexOf(endpointValue);

	if (anchorIndex === -1 || endpointIndex === -1) {
		return [];
	}

	if (anchorIndex <= endpointIndex) {
		return optionValues.slice(anchorIndex, endpointIndex + 1);
	}

	return optionValues.slice(endpointIndex, anchorIndex + 1).reverse();
};

export const buildRangeSelection = ({ optionValues, replaceableOptionValues, selectedOptions = {}, maxSelectable }: IBuildRangeSelectionParams): Record<string, boolean> => {
	const rangeOptionValues = new Set(optionValues);
	const newSelectedOptions = { ...selectedOptions };

	// A range selection owns the listed options, so anything listed outside the range is deselected.
	// Selections hidden by the current search are left untouched.
	for (const optionValue of replaceableOptionValues) {
		if (!rangeOptionValues.has(optionValue)) {
			delete newSelectedOptions[optionValue];
		}
	}

	let selectedCount = getSelectedCount(newSelectedOptions);
	for (const optionValue of optionValues) {
		if (newSelectedOptions[optionValue]) {
			continue;
		}

		if (maxSelectable !== undefined && selectedCount >= maxSelectable) {
			break;
		}

		newSelectedOptions[optionValue] = true;
		selectedCount += 1;
	}

	return newSelectedOptions;
};

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
