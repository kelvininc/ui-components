import { EventEmitter } from '@stencil/core';
import { IIllustrationMessage, ISelectCreateOption, ISelectEvents, ISelectOption } from '../../types';

export interface ISelectOptionWithChildren extends ISelectOption {
	options?: ISelectOptionsWithChildren;
}

export type ISelectOptionsWithChildren = Record<string, ISelectOptionWithChildren>;

export interface ISelectMultiOption extends Omit<ISelectOption, 'selected' | 'heading' | 'state' | 'level' | 'highlighted' | 'isDirty' | 'action'> {
	options?: ISelectMultiOptions;
}

export type ISelectMultiOptions = Record<string, ISelectMultiOption>;

export interface IBuildSelectOptionsParams {
	options?: ISelectMultiOptions;
	allOptions?: ISelectMultiOptions;
	selectedOptions?: Record<string, boolean>;
	highlightedOption?: string;
	hasAddItem?: boolean;
	createInputPlaceholder?: string;
	level?: number;
	maxSelectable?: number;
	selectedCount?: number;
}

export interface ISelectMultiOptionsConfig {
	/** (optional) The object with the dropdown options */
	options?: ISelectMultiOptions;
	/** (optional) Externally filtered dropdown options. When defined, these override the default local search results. */
	filteredOptions?: ISelectMultiOptions;
	/** (optional) The object with indexed by the dropdown labels and its selected value */
	selectedOptions?: Record<string, boolean>;
	/** (optional) What is shown when there are no options, searching or not: with an `illustration`, the illustration message in the list; without one, only its `header`, in the list header. Content in the `no-data-available` slot takes its place. Default: the "No Data Available" illustration */
	noDataAvailableConfig?: IIllustrationMessage;
	/** (optional) What is shown when the search matches no option: with an `illustration`, the illustration message in the list; without one, only its `header`, in the list header. Content in the `no-results-found` slot takes its place. Default: `No results found`, in the list header */
	noResultsFoundConfig?: IIllustrationMessage;
	/** (optional) If `false` the dropdown is not searchable. Default `true` */
	searchable?: boolean;
	/** (optional) The list search text field placeholder */
	searchPlaceholder?: string;
	/** (optional) The search value to display */
	searchValue?: string;
	/** (optional) The debounce, in milliseconds, applied to the search value before the options are filtered locally. Set to `0` to filter on every keystroke. Defaults to `300`. */
	searchDebounce?: number;
	/** (optional) If `true` dropdown items can be cleared */
	selectionClearable?: boolean;
	/** (optional) The clear selection action text */
	clearSelectionLabel?: string;
	/** (optional) The dropdown's min-height */
	minHeight?: string;
	/** (optional) The dropdown's max-height */
	maxHeight?: string;
	/** (optional) The dropdown's min-width */
	minWidth?: string;
	/** (optional) The dropdown's max-width */
	maxWidth?: string;
	/** (optional) If `true` the list has an action to select all items */
	selectionAll?: boolean;
	/** (optional) The selection all action text */
	selectAllLabel?: string;
	/** (optional) If `true` a selection counter is displayed */
	counter?: boolean;
	/** (optional) The minimum amount of options required to display the search. Defaults to `15`. */
	minSearchOptions?: number;
	/** (optional) If `true` the keyboard shortcuts can be used to navigate between the dropdown results. Default `false` */
	shortcuts?: boolean;
	/** (optional) If `true` an add option will appear at the bottom of options list. Default: `false` */
	canAddItems?: boolean;
	/** (optional) The create new option placeholder. Default: `Add a new option`*/
	createOptionPlaceholder?: string;
	/** (optional) The create form input placeholder  */
	createInputPlaceholder?: string;
	/** (optional) The configuration of the default create form: `disabled` locks its input and create action, `size` sets its size and `inputConfig` its text field. An `inputConfig.placeholder` takes precedence over `createInputPlaceholder`. */
	createOptionConfig?: Partial<Omit<ISelectCreateOption, 'value' | 'loading'>>;
	/**
	 * (optional) The state of the open create form's latest submit, for an option created asynchronously.
	 * When set, a submit only emits `optionCreated` and the form stays open:
	 * - `loading`: the form can be neither submitted again nor cancelled. The default form shows its create
	 * action loading and makes its input read-only; a slotted form shows this itself, e.g. by passing
	 * `loading` to its `kv-select-create-option`.
	 * - `error`: the form can be submitted again. The default form shows `error` on its text field until the
	 * value is edited.
	 * - `success`: `optionSelected` is emitted with `optionKey`, or with the submitted value without one, and
	 * the form closes, as a synchronous submit does. Add the option to `options` first.
	 *
	 * `success` is read when the status changes to it, so report `loading` while the option is created.
	 * Unset, a submit emits `optionCreated` and `optionSelected` with the typed value straight away.
	 */
	createOptionState?: ICreateOptionState;
	/** (optional) Maximum number of items that can be selected */
	maxSelectable?: number;
	/** (optional) If `true` a contiguous range can be selected by shift-clicking or by holding shift while navigating. Default `true` */
	rangeSelection?: boolean;
}

export interface ISelectMultiOptionsEvents extends ISelectEvents {
	/** Emitted when the selected options change */
	optionsSelected: EventEmitter<Record<string, boolean>>;
	/** Emitted when an option is selected */
	optionSelected: EventEmitter<string>;
	/** Emitted when Escape is pressed with `shortcuts` on and the create form closed. The Escape is marked as handled, with `preventDefault()`. */
	dismiss: EventEmitter<void>;
	/** Emitted when a new option is created */
	optionCreated: EventEmitter<string>;
	/** Emitted when the create form opens (`true`), once it is rendered, and when it closes (`false`) */
	createFormToggle: EventEmitter<boolean>;
}

export enum ECreateOptionStatus {
	Idle = 'idle',
	Loading = 'loading',
	Success = 'success',
	Error = 'error'
}

export interface ICreateOptionState {
	/** (required) Where the submit stands */
	status: ECreateOptionStatus;
	/** (optional) Why the submit failed, shown by the default create form while `status` is `error` */
	error?: string;
	/** (optional) The key of the created option, selected once `status` is `success`. Default: the submitted value */
	optionKey?: string;
}
