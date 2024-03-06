import { EIconName } from '../icon/icon.types';
import { ISelectOption } from '../select-option/select-option.types';

export const DEFAULT_NO_DATA_AVAILABLE_LABEL = 'No data available.';
export const MINIMUM_SEARCHABLE_OPTIONS = 15;
export const SELECT_OPTION_HEIGHT_IN_PX = 32;
export const DEFAULT_ADD_OPTION_PLACEHOLDER = 'Add a new option';
export const ADD_OPTION: ISelectOption = {
	label: DEFAULT_ADD_OPTION_PLACEHOLDER,
	value: '9e8caf09-5cde-4150-84f5-29c06bebc0ae',
	icon: EIconName.Add
};
