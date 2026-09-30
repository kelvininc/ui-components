import { EventEmitter } from '@stencil/core';
import { ICreateOptionState, ISelectCreateOption, ISelectOption, ISelectMultiOptionsEvents, IMultiSelectDropdown } from '../../types';

export interface ISelectSingleOption
	extends Pick<
		ISelectOption,
		'label' | 'value' | 'icon' | 'disabled' | 'selectable' | 'isDirty' | 'description' | 'action' | 'customClass' | 'customStyle' | 'customAttributes'
	> {
	options?: ISelectSingleOptions;
}

export type ISelectSingleOptions = Record<string, ISelectSingleOption>;

export interface ISingleSelectDropdown extends Omit<IMultiSelectDropdown, 'selectedOptions' | 'options' | 'filteredOptions' | 'rangeSelection'> {
	/** (optional) The value of the selected option */
	selectedOption?: string;
	/** (optional) The object with the dropdown options */
	options?: ISelectSingleOptions;
	/** (optional) Externally filtered dropdown options. When defined, these override the default local search results. */
	filteredOptions?: ISelectSingleOptions;
	/** (optional) If `false` the search text field is not auto-focused. Default `true`. */
	autoFocus?: boolean;
	/** (optional) The configuration of the default create form: `disabled` locks its input and create action, `size` sets its size and `inputConfig` its text field. An `inputConfig.placeholder` takes precedence over `createInputPlaceholder`. */
	createOptionConfig?: Partial<Omit<ISelectCreateOption, 'value' | 'loading'>>;
	/**
	 * (optional) The state of the open create form's latest submit, for an option created asynchronously.
	 * When set, a submit only emits `optionCreated` and the form stays open:
	 * - `loading`: the form can be neither submitted again nor cancelled, and the dropdown stays open: neither
	 * its trigger nor a click outside closes it. The default form shows its create action loading and makes
	 * its input read-only; a slotted form shows this itself, e.g. by passing `loading` to its
	 * `kv-select-create-option`.
	 * - `error`: the form can be submitted again. The default form shows `error` on its text field until the
	 * value is edited.
	 * - `success`: the created option is selected, `optionKey` or the submitted value without one, as a
	 * click on it does: `optionSelected` is emitted and the dropdown closes. Add the option to `options` first.
	 *
	 * `success` is read when the status changes to it, so report `loading` while the option is created.
	 * Unset, a submit emits `optionCreated` and selects the typed value straight away.
	 */
	createOptionState?: ICreateOptionState;
}

export interface ISingleSelectDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'optionsSelected' | 'selectAll'> {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
	/** Emitted when there's a click outside the dropdown's bondaries */
	clickOutside: EventEmitter<MouseEvent>;
}
