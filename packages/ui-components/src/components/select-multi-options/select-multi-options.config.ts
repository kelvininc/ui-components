import { EIconName } from '../icon/icon.types';
import { EIllustrationName } from '../illustration/illustration.types';
import { IIllustrationMessage } from '../illustration-message/illustration-message.types';
import { ISelectOption } from '../select-option/select-option.types';

export const MINIMUM_SEARCHABLE_OPTIONS = 15;
export const SELECT_OPTION_HEIGHT_IN_PX = 32;
export const DEFAULT_ADD_OPTION_PLACEHOLDER = 'Add a new option';
export const ADD_OPTION: ISelectOption = {
	label: DEFAULT_ADD_OPTION_PLACEHOLDER,
	value: '9e8caf09-5cde-4150-84f5-29c06bebc0ae',
	icon: EIconName.Add
};

export const DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG: IIllustrationMessage = {
	illustration: EIllustrationName.NoDataAvailable,
	header: 'No Data Available',
	description: 'There is no data to display at the moment.'
};

export const DEFAULT_NO_RESULTS_FOUND_ILLUSTRATION_CONFIG: IIllustrationMessage = {
	illustration: EIllustrationName.NoResultsFoundLight,
	header: 'No Results Found',
	description: 'Despite our best efforts, no results were extracted. Please try a new query or keyword for better results.'
};
