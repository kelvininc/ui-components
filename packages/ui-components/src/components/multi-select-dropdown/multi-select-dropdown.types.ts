import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from '../select-multi-options/select-multi-options.types';
import { EComponentSize, ICustomCss } from '../../types';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface IMultiSelectDropdown extends ICustomCss, Omit<ISelectMultiOptionsConfig, 'searchValue'> {
	/** (required) The text to display as the dropdown placeholder */
	placeholder?: string;
	/** (optional) If `true` the dropdown is opened */
	isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (optional) If `true` dropdown requires a value to be selected */
	required?: boolean;
	/** (optional) The text to display on the dropdown label */
	label?: string;
	/** (optional) The text to display on the dropdown  */
	displayValue?: string;
	/** (optional) The text to display as a prefix to `displayValue` */
	displayPrefix?: string;
	/** (optional) Text to display inside a badge on the right side of the displayed value */
	badge?: string;
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
}

export interface IMultiSelectDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'optionSelected' | 'optionCreated'> {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
	/** Emitted when there's a click outside the dropdown's bondaries */
	clickOutside: EventEmitter<void>;
}
