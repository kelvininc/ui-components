import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export interface ITextArea {
	/** (optional) Icon to show to the left of the text field */
	icon?: EIconName;
	/** (optional) The text to show inside the text area */
	text?: string;
	/** (optional) The placeholder to show in the text area */
	placeholder?: string;
	/** (optional) The maximum number of characters allowed */
	maxCharLength?: number;
	/** (optional) If `true` the chars counter is displayed. Default: `true` */
	counter?: boolean;
	/** (optional) If `true` the counter is always visible (not only on focus). Default: `false` */
	counterAlwaysVisible?: boolean;
	/** (optional) If `true` the text area is disabled. Default: `false`. */
	disabled?: boolean;
	/** (optional) The validation state. Default: `EValidationState.None`. */
	state?: EValidationState;
	/** (optional) Accessible name for the editable area. A visible label outside the component can't name it across the shadow root, so pass that label's text here */
	accessibleLabel?: string;
	/** Elements describing the editable area, including help in an ancestor tree. Clear with an empty array. */
	accessibleDescriptionElements?: readonly Element[];
}

export interface ITextAreaEvents {
	/** Emits the current text when there's a change */
	textChange: EventEmitter<string>;
}
