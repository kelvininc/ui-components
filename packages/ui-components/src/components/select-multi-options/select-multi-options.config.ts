import { EIconName } from '../icon/icon.types';
import { EIllustrationName } from '../illustration/illustration.types';
import { IIllustrationMessage } from '../illustration-message/illustration-message.types';
import { ISelectOption } from '../select-option/select-option.types';

export const MINIMUM_SEARCHABLE_OPTIONS = 15;
export const DEFAULT_SEARCH_DEBOUNCE_IN_MS = 300;
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

// Without an illustration, only the header is shown, in the list header
export const DEFAULT_NO_RESULTS_FOUND_CONFIG: IIllustrationMessage = {
	header: 'No results found'
};

/**
 * How long an asynchronous create holds off a second submit on its own: long enough for the consumer's
 * `createOptionState` to reach the form, short enough never to hold back a retry after a failure.
 */
export const ASYNC_CREATE_SUBMIT_LOCK_IN_MS = 300;

/** What the create form's focus goes to when it opens: the default form, or a text field in a slotted one. */
export const CREATE_FORM_FOCUS_TARGET_SELECTOR = 'kv-select-create-option, kv-text-field';
