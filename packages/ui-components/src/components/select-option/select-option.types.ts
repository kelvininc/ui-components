import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';
import { CustomCssClass, ICustomCss } from '../../types';
import { HostAttributes } from '@stencil/core/internal';

export enum EToggleState {
	Selected = 'selected',
	Indeterminate = 'indeterminate',
	None = 'none'
}

export interface ISelectOptionAction {
	/** (required) The callback to call when the action is clicked */
	onClick: () => void;
	/** (required) The icon of the action */
	icon: EIconName;
	/**  (optional) If `true` the action is active */
	active?: boolean;
}

export interface ISelectOption extends ICustomCss {
	/** (required) The text to display on the item */
	label: string;
	/** (required) The item value */
	value: string;
	/** (optional) Icon of the item displayed on the left */
	icon?: EIconName;
	/** (optional) Tooltip text to be displayed on icon hover */
	tooltipIcon?: EIconName;
	/** (optional) Description of the item displayed on the right */
	description?: string;
	/** (optional) Icon of the item displayed on the right */
	rightIcon?: EIconName;
	/** (optional) If `true` the item is disabled */
	disabled?: boolean;
	/** (optional) If `true` the item is selected */
	selected?: boolean;
	/** (optional) If `true` the item is highlighted */
	highlighted?: boolean;
	/** (optional) If `true` the item is togglable */
	togglable?: boolean;
	/** (optional) If `false` the item is only for presenting and cannot be selected. */
	selectable?: boolean;
	/** (optional) If `true` the item is presented as a list heading. Default: `false`*/
	heading?: boolean;
	/** (optional) The level depth at which the option is rendered */
	level?: number;
	/** (optional) The toggle button state */
	state?: EToggleState;
	/** (optional) Additional style to apply for custom CSS. */
	customStyle?: HostAttributes['style'];
	/** (optional) Custom class to apply for custom styling. */
	customClass?: CustomCssClass;
	/** (optional) If true, a dirty dot indicator will be added to left side of the option's text. */
	isDirty?: boolean;
	/** (optional) Action to display on the right side of the item */
	action?: ISelectOptionAction;
}

export interface ISelectOptionEvents {
	/** Emitted when the user clicks on the item */
	itemSelected: EventEmitter<string>;
}
