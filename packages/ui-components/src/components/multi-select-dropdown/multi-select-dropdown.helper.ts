import { ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { getSelectedSelectableOptions } from '../../utils/select.helper';
import { BADGE_MINIMUM_OPTIONS } from './multi-select-dropdown.config';

export const getDropdownDisplayValue = (options: ISelectMultiOptions = {}, selectedOptions: Record<string, boolean> = {}): string | undefined => {
	const [firstOption] = Object.values(getSelectedSelectableOptions(options, selectedOptions));
	return firstOption?.label;
};

export const getBadgeLabelValue = (selectedOptions: Record<string, boolean> = {}) => {
	const selectedOptionsCount = Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;
	if (selectedOptionsCount < BADGE_MINIMUM_OPTIONS) return;
	return `+${selectedOptionsCount - 1}`;
};
