import { ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { getSelectedSelectableOptions } from '../../utils/select.helper';

export const getDropdownDisplayValue = (options: ISelectMultiOptions = {}, selectedOptions: Record<string, boolean> = {}): string => {
	return Object.values(getSelectedSelectableOptions(options, selectedOptions))
		.map(({ label }) => label)
		.join(', ');
};
