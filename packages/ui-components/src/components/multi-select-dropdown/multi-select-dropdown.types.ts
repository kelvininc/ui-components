import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { ICreateOptionState, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from '../select-multi-options/select-multi-options.types';
import { EComponentSize, ICustomCss } from '../../types';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface IMultiSelectDropdown extends ICustomCss, Omit<ISelectMultiOptionsConfig, 'searchValue' | 'createOptionState' | 'clearHiddenSelection'> {
	/** (required) The text to display as the dropdown placeholder */
	placeholder?: string;
	/**
	 * (optional) If `true` the dropdown's list is open. The dropdown keeps it in step with its own opening and
	 * closing, and reports every change through `openStateChange`, so a host can both follow the list and close it.
	 */
	isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName;
	/** (optional) If `true` dropdown requires a value to be selected */
	required?: boolean;
	/** (optional) The text to display on the dropdown label */
	label?: string;
	/** Accessible name for the default trigger when there's no visible label. */
	accessibleLabel?: string;
	/** (optional) The text to display on the dropdown  */
	displayValue?: string;
	/** (optional) The text to display as a prefix to `displayValue` */
	displayPrefix?: string;
	/** (optional) Text to display inside a badge on the right side of the displayed value */
	badge?: string;
	/** (optional) If `true` the badge is not displayed */
	hideBadge?: boolean;
	/** (required) The error state for the dropdown */
	errorState?: EValidationState;
	/** (optional) The text to display as help text  */
	helpText?: string | string[];
	/** (optional) If `true` the dropdown is disabled */
	disabled?: boolean;
	/** (optional) The size of the input */
	inputSize?: EComponentSize;
	/** (optional) The dropdown position config options */
	dropdownOptions?: Partial<ComputePositionConfig>;
	/** (optional) If `false` clicking outside the dropdown will not trigger state change. Default: true */
	clickOutsideClose?: boolean;
	/** (optional) A reference to the dropdown action element */
	actionElement?: HTMLElement;
	/** (optional) the dropdown list z-index (default: 9004) */
	zIndex?: number;
	/** (optional) The text field options */
	inputConfig?: Partial<ITextField>;
	/** (optional) If `false` the search text field is not auto-focused. Default `true`. */
	autoFocus?: boolean;
	/**
	 * (optional) The state of the open create form's latest submit, for an option created asynchronously.
	 * When set, a submit only emits `optionCreated` and the form stays open:
	 * - `loading`: the form can be neither submitted again nor cancelled, and the dropdown stays open: neither
	 * its trigger nor a click outside closes it. The default form shows its create action loading and makes
	 * its input read-only; a slotted form shows this itself, e.g. by passing `loading` to its
	 * `kv-select-create-option`.
	 * - `error`: the form can be submitted again. The default form shows `error` on its text field until the
	 * value is edited.
	 * - `success`: the form closes. Add the option to `options`, and to `selectedOptions` to select it.
	 *
	 * `success` is read when the status changes to it, so report `loading` while the option is created.
	 * Unset, a submit emits `optionCreated` and closes the form straight away. Either way the dropdown
	 * doesn't select the created option itself: `optionsSelected` isn't emitted for it.
	 */
	createOptionState?: ICreateOptionState;
}

export interface IMultiSelectDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'optionSelected'> {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
	/** Emitted when there's a click outside the dropdown's bondaries */
	clickOutside: EventEmitter<MouseEvent>;
}
