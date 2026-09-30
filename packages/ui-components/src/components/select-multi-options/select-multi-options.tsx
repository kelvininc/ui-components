import { Component, Element, Event, forceUpdate, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';
import type {
	ICreateOptionState,
	ISelectMultiOptions,
	ISelectMultiOptionsConfig,
	ISelectMultiOptionsEvents,
	ISelectOptionWithChildren,
	ISelectOptionsWithChildren
} from './select-multi-options.types';
import { ECreateOptionStatus } from './select-multi-options.types';
import {
	ASYNC_CREATE_SUBMIT_LOCK_IN_MS,
	CREATE_FORM_FOCUS_TARGET_SELECTOR,
	DEFAULT_ADD_OPTION_PLACEHOLDER,
	MINIMUM_SEARCHABLE_OPTIONS,
	DEFAULT_SEARCH_DEBOUNCE_IN_MS,
	DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG,
	SELECT_OPTION_HEIGHT_IN_PX,
	DEFAULT_NO_RESULTS_FOUND_CONFIG
} from './select-multi-options.config';
import { EToggleState } from '../select-option/select-option.types';
import { debounce, isEmpty, isNil } from 'lodash-es';
import type { DebouncedFunc } from 'lodash-es';
import {
	buildAllOptionsSelected,
	buildPartialOptionsSelected,
	flattenSelectOptionsArray,
	getFlattenSelectOptions,
	getNextHightlightableOption,
	getPreviousHightlightableOption,
	getSelectableOptions,
	getSelectableOptionsFromArray,
	getSelectedCount
} from '../../utils/select.helper';
import {
	buildRangeSelection,
	buildSelectOptions,
	buildSelectOptionsArray,
	getRangeOptionValues,
	hasEmptyStateIllustration,
	hasFocusInput,
	hasSlottedElement,
	isAddOption
} from './select-multi-options.helper';
import { selectHelper } from '../../utils';
import pluralize from 'pluralize';
import type { IIllustrationMessage } from '../illustration-message/illustration-message.types';
import type { ISelectCreateOption } from '../select-create-option/select-create-option.types';
import { EValidationState } from '../text-field/text-field.types';
import type { ITextField } from '../text-field/text-field.types';
import { EComponentSize } from '../../utils/types';

/**
 * @part select - The select container.
 */
@Component({
	tag: 'kv-select-multi-options',
	styleUrl: 'select-multi-options.scss',
	shadow: true
})
export class KvSelectMultiOptions implements ISelectMultiOptionsConfig, ISelectMultiOptionsEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableConfig?: IIllustrationMessage = DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) noResultsFoundConfig?: IIllustrationMessage = DEFAULT_NO_RESULTS_FOUND_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchDebounce?: number = DEFAULT_SEARCH_DEBOUNCE_IN_MS;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionAll?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) shortcuts?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) canAddItems?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) createInputPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) createOptionPlaceholder?: string = DEFAULT_ADD_OPTION_PLACEHOLDER;
	/** @inheritdoc */
	@Prop({ reflect: false }) createOptionConfig?: Partial<Omit<ISelectCreateOption, 'value' | 'loading'>>;
	/** @inheritdoc */
	@Prop({ reflect: false }) createOptionState?: ICreateOptionState;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxSelectable?: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) showShortcuts?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) rangeSelection?: boolean = true;

	@Element() el: HTMLKvSelectMultiOptionsElement;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<string>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;
	/** @inheritdoc */
	@Event() dismiss: EventEmitter<void>;
	/** @inheritdoc */
	@Event() optionCreated: EventEmitter<string>;
	/** @inheritdoc */
	@Event({ bubbles: false }) createFormToggle: EventEmitter<boolean>;

	@Listen('valueChanged')
	valueChangedOptionHandler({ detail: newValue }: CustomEvent<string>) {
		this.createdOptionValue = newValue;
		// An edited value is no longer the one that failed, and it may be submitted again
		this.isCreateValueEdited = true;
		this.unlockAsyncSubmit();
	}
	@Listen('clickCreate')
	clickCreateOptionHandler() {
		if (this.isCreateLoading || this.isAsyncSubmitLocked) {
			return;
		}

		this.resetRangeSelection();

		if (this.isCreateAsync) {
			// The consumer reports through `createOptionState` how the submit goes. Until that report can
			// have arrived, this lock holds off a second submit. All of it is set up before the event,
			// since a listener may report back synchronously, from within it.
			this.submittedOptionValue = this.createdOptionValue;
			this.isCreateValueEdited = false;
			this.isAwaitingCreateState = true;
			this.lockAsyncSubmit();
			this.optionCreated.emit(this.createdOptionValue);
			return;
		}

		this.optionCreated.emit(this.createdOptionValue);
		this.optionSelected.emit(this.createdOptionValue);
		this.closeCreateForm(false);
	}
	@Listen('clickCancel')
	cancelCreateOptionHandler() {
		if (this.isCreateLoading) {
			return;
		}

		this.closeCreateForm(true);
	}

	@State() selectOptions: {
		totalFlatten: ISelectOptionsWithChildren;
		currentFlatten: ISelectOptionWithChildren[];
		totalSelectable: ISelectOptionsWithChildren;
		currentSelectable: ISelectOptionWithChildren[];
		searchAvailable: boolean;
	};
	@State() highlightedOption: string;
	@State() debouncedSearchValue?: string;
	@State() isCreating: boolean = false;
	@State() createdOptionValue: string = '';
	@State() isCreateValueEdited: boolean = false;
	@State() isAwaitingCreateState: boolean = false;

	private rebuildScheduled = false;
	private rangeSelectionAnchor?: string;
	private isAsyncSubmitLocked = false;
	private asyncSubmitLockTimer?: ReturnType<typeof setTimeout>;
	// The value of the open form's latest asynchronous submit
	private submittedOptionValue?: string;
	private emittedCreateFormState = false;
	private pendingFocus?: 'create-form' | 'search';
	private createFormRef?: HTMLDivElement;
	private createFormSlotRef?: HTMLSlotElement;

	private scheduleRebuild = () => {
		if (this.rebuildScheduled) return;
		this.rebuildScheduled = true;
		queueMicrotask(() => {
			this.rebuildScheduled = false;
			this.buildSelectionOptions();
		});
	};

	private applySearchValue = (searchValue?: string): void => {
		this.debouncedSearchValue = searchValue;
	};

	// `debounce` captures its wait on creation, so the debouncer is rebuilt whenever `searchDebounce` changes.
	private debounceSearchValue: DebouncedFunc<(searchValue?: string) => void> = debounce(this.applySearchValue, DEFAULT_SEARCH_DEBOUNCE_IN_MS);

	private buildSearchDebouncer = (): void => {
		this.debounceSearchValue.cancel();
		this.debounceSearchValue = debounce(this.applySearchValue, this.searchDebounce);
	};

	/**
	 * Delays the term the local search filters by, so that a fast typist filters the list once
	 * instead of once per keystroke. Only the filtering waits - `searchValue` still reaches the
	 * search input immediately, keeping the typed text and the clear action responsive.
	 */
	private setDebouncedSearchValue = (searchValue?: string): void => {
		// Clearing the search restores the full list, which must never lag behind: it also happens
		// when the dropdown closes, and a pending term would reopen it still filtered. A zero wait
		// is applied straight away too, since `debounce` would still defer it to a later task.
		if (!this.searchDebounce || isEmpty(searchValue)) {
			this.debounceSearchValue.cancel();
			this.applySearchValue(searchValue);

			return;
		}

		this.debounceSearchValue(searchValue);
	};

	@Watch('searchValue')
	onSearchValueChanged(searchValue?: string) {
		this.setDebouncedSearchValue(searchValue);
	}

	@Watch('searchDebounce')
	onSearchDebounceChanged() {
		this.buildSearchDebouncer();
		this.setDebouncedSearchValue(this.searchValue);
	}

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('searchable')
	@Watch('minSearchOptions')
	@Watch('debouncedSearchValue')
	@Watch('selectedOptions')
	@Watch('highlightedOption')
	@Watch('maxSelectable')
	@Watch('canAddItems')
	@Watch('createOptionPlaceholder')
	onInputsChanged(_newValue: unknown, _oldValue: unknown, propName: string) {
		if (propName === 'options') {
			this.resetRangeSelection();
		}

		if (propName === 'canAddItems' && !this.canAddItems) {
			this.closeCreateForm(false);
		}

		this.scheduleRebuild();
	}

	@Watch('createOptionState')
	onCreateOptionStateChanged(state?: ICreateOptionState, previousState?: ICreateOptionState) {
		// Whatever the consumer hands over after a submit answers it, so an error it reports again shows
		this.isAwaitingCreateState = false;

		// A consumer may hand a new object over on every render: only a new status reports anything else,
		// but for an error reported again, which answers the submit as well, so that it can be retried
		if (state?.status === previousState?.status) {
			if (state?.status === ECreateOptionStatus.Error) {
				this.unlockAsyncSubmit();
			}

			return;
		}

		// The consumer has answered the submit, which is all the lock was waiting for
		this.unlockAsyncSubmit();

		if (state?.status === ECreateOptionStatus.Success && this.isCreating) {
			this.completeCreateOption(isEmpty(state.optionKey) ? (this.submittedOptionValue ?? this.createdOptionValue) : state.optionKey);
		}
	}

	buildSelectionOptions() {
		const selectedCount = getSelectedCount(this.selectedOptions);
		// The add option is only ever a row of the current list, so none of the totals count it
		const selectOptions = buildSelectOptions({
			options: this.options,
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			maxSelectable: this.maxSelectable,
			selectedCount
		});
		const selectSelectableOptions = getSelectableOptions(selectOptions);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);
		// Derived before the current options are built so that the search input's visibility and the
		// local filtering can never disagree: both read this single value.
		const searchAvailable = this.searchable && Object.keys(selectFlattenOptions).length >= this.minSearchOptions;
		const selectCurrentOptionsArray = buildSelectOptionsArray({
			options: this.getCurrentOptions(searchAvailable),
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			hasAddItem: this.canAddItems,
			createInputPlaceholder: this.createOptionPlaceholder
		});
		const selectCurrentFlattenOptions = flattenSelectOptionsArray(selectCurrentOptionsArray);
		const selectCurrentSelectableOptions = getSelectableOptionsFromArray(selectCurrentFlattenOptions);

		this.selectOptions = {
			totalFlatten: selectFlattenOptions,
			currentFlatten: selectCurrentFlattenOptions,
			totalSelectable: selectSelectableOptions,
			currentSelectable: selectCurrentSelectableOptions,
			searchAvailable
		};
	}

	@Listen('keydown', { target: 'document' })
	handleKeyDown(event: KeyboardEvent) {
		// The shortcuts drive the list, which the create form replaces. A key from inside the form is
		// checked by its path too: a custom form may have closed itself on it before this runs.
		if (!this.shortcuts || this.isCreating || this.isCreateFormEvent(event)) {
			return;
		}

		switch (event.key) {
			case 'Escape':
				this.onDismiss();
				break;
			case 'Enter':
				this.onEnter(event.shiftKey);
				break;
			case 'ArrowUp':
				this.onNavigateUp();
				break;
			case 'ArrowDown':
				this.onNavigateDown();
				break;
		}
	}

	/** Clears the highlighted option state */
	@Method()
	async clearHighlightedOption(): Promise<void> {
		this.highlightedOption = undefined;
		this.resetRangeSelection();
	}

	/** Closes the create form */
	@Method()
	async closeCreatePopup(): Promise<void> {
		this.closeCreateForm(false);
	}

	/** Focuses the search text field */
	@Method()
	async focusSearch() {
		this.selectRef?.focusSearch();
	}

	componentWillLoad() {
		// Props are assigned after construction, so the debouncer only learns a consumer's wait here.
		this.buildSearchDebouncer();
		this.debouncedSearchValue = this.searchValue;
		this.buildSelectionOptions();
	}

	componentDidRender() {
		// After the render, so that the create form is laid out when it reports being open
		if (this.emittedCreateFormState !== this.isCreating) {
			this.emittedCreateFormState = this.isCreating;
			this.createFormToggle.emit(this.isCreating);
		}

		// After the event, so the focus also finds a form that a listener mounted in response
		this.applyPendingFocus();
	}

	disconnectedCallback() {
		this.debounceSearchValue.cancel();
		this.unlockAsyncSubmit();
	}

	private selectRef?: HTMLKvSelectElement | null;

	private onEnter = (isShiftKey: boolean): void => {
		if (isEmpty(this.highlightedOption)) {
			return;
		}

		this.selectOption(this.highlightedOption, this.isRangeSelectionEnabled && isShiftKey);
	};

	private onNavigateDown = (): void => {
		this.highlightedOption = getNextHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onNavigateUp = (): void => {
		this.highlightedOption = getPreviousHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onDismiss = (): void => {
		this.highlightedOption = undefined;
		this.resetRangeSelection();
		this.dismiss.emit();
	};

	private onSelectAll = (event: CustomEvent<void>): void => {
		event.stopPropagation();
		this.resetRangeSelection();
		this.optionsSelected.emit(selectHelper.buildAllOptionsSelected(selectHelper.getSelectableOptions(this.options)));
		this.selectAll.emit();
	};

	private onClearSelection = (event: CustomEvent<void>): void => {
		event.stopPropagation();
		this.resetRangeSelection();
		this.optionsSelected.emit({});
		this.clearSelection.emit();
	};

	private onRenderedItemSelected = (event: CustomEvent<string>): void => {
		event.stopPropagation();
	};

	private onOptionClick = (event: MouseEvent, selectedOptionKey: string): void => {
		if (!this.selectOption(selectedOptionKey, this.isRangeSelectionEnabled && event.shiftKey)) {
			return;
		}

		if (this.shortcuts) {
			this.highlightedOption = selectedOptionKey;
		}
	};

	private selectOption = (selectedOptionKey: string, isShiftClick = false): boolean => {
		if (isAddOption(selectedOptionKey)) {
			this.openCreateForm();
			return true;
		}

		const selectedOption = this.selectOptions.totalFlatten[selectedOptionKey];
		if (!selectedOption || !this.canSelectOption(selectedOption, isShiftClick)) {
			return false;
		}

		this.optionSelected.emit(selectedOptionKey);

		// Check if the selected option does not have any children
		if (isEmpty(selectedOption.options)) {
			this.selectLeafOption(selectedOptionKey, isShiftClick);
			return true;
		}

		this.resetRangeSelection();
		const childrenValues = getSelectableOptions(selectedOption.options);
		switch (selectedOption.state) {
			case EToggleState.Selected:
			case EToggleState.Indeterminate:
				// de-select all children
				const newOptions = { ...(this.selectedOptions ?? {}) };
				Object.keys(childrenValues).forEach(childrenKey => delete newOptions[childrenKey]);
				this.optionsSelected.emit({ ...newOptions });
				break;

			case EToggleState.None:
				// select all children, respecting maxSelectable limit
				if (this.maxSelectable !== undefined) {
					const currentSelectedCount = getSelectedCount(this.selectedOptions);
					const partialSelection = buildPartialOptionsSelected(childrenValues, this.maxSelectable, currentSelectedCount);
					if (!partialSelection) return false;

					this.optionsSelected.emit({
						...this.selectedOptions,
						...partialSelection
					});
					return true;
				}

				this.optionsSelected.emit({
					...this.selectedOptions,
					...buildAllOptionsSelected(childrenValues)
				});
		}

		return true;
	};

	private canSelectOption = (option: ISelectOptionWithChildren, isShiftClick: boolean): boolean => {
		if (option.selectable === false) {
			return false;
		}

		if (option.disabled !== true) {
			return true;
		}

		// An option disabled only because maxSelectable is reached is still a valid range
		// endpoint: the range replaces the listed selection, which frees the slots it needs
		return isShiftClick && this.isDisabledByMaxSelectable(option.value);
	};

	private isDisabledByMaxSelectable = (optionValue: string): boolean => {
		// currentFlatten is built without maxSelectable, so it carries only intrinsic disabled state
		const listedOption = this.selectOptions.currentFlatten.find(({ value }) => value === optionValue);

		return listedOption !== undefined && listedOption.disabled !== true;
	};

	private selectLeafOption = (selectedOptionKey: string, isShiftClick: boolean): void => {
		const selectedOptions = this.selectedOptions ?? {};
		const rangeSelectableOptions = this.getRangeSelectableOptions();
		const isRangeSelectable = rangeSelectableOptions.some(({ value }) => value === selectedOptionKey);

		if (isShiftClick && isRangeSelectable) {
			const anchorOptionKey = this.getRangeSelectionAnchor(rangeSelectableOptions, selectedOptions);
			const rangeOptionValues = anchorOptionKey !== undefined ? getRangeOptionValues(rangeSelectableOptions, anchorOptionKey, selectedOptionKey) : [];

			if (rangeOptionValues.length > 0) {
				this.optionsSelected.emit(
					buildRangeSelection({
						optionValues: rangeOptionValues,
						replaceableOptionValues: rangeSelectableOptions.map(({ value }) => value),
						selectedOptions,
						maxSelectable: this.maxSelectable
					})
				);
				// The anchor stays put so consecutive shift-clicks grow and shrink the same range
				this.rangeSelectionAnchor = anchorOptionKey;
				return;
			}
		}

		const shouldSelect = selectedOptions[selectedOptionKey] !== true;
		if (shouldSelect && this.maxSelectable !== undefined && getSelectedCount(selectedOptions) >= this.maxSelectable) {
			return;
		}

		const newSelectedOptions = { ...selectedOptions };
		if (shouldSelect) {
			newSelectedOptions[selectedOptionKey] = true;
		} else {
			delete newSelectedOptions[selectedOptionKey];
		}

		this.optionsSelected.emit(newSelectedOptions);
		this.rangeSelectionAnchor = isRangeSelectable ? selectedOptionKey : undefined;
	};

	private getRangeSelectableOptions = (): ISelectOptionWithChildren[] =>
		this.selectOptions.currentSelectable.filter(({ selectable, value }) => selectable !== false && !isAddOption(value));

	private getRangeSelectionAnchor = (rangeSelectableOptions: ISelectOptionWithChildren[], selectedOptions: Record<string, boolean>): string | undefined => {
		if (this.rangeSelectionAnchor !== undefined && rangeSelectableOptions.some(({ value }) => value === this.rangeSelectionAnchor)) {
			return this.rangeSelectionAnchor;
		}

		// Without an anchor from this interaction, fall back to the first listed selected option
		return rangeSelectableOptions.find(({ value }) => selectedOptions[value] === true)?.value;
	};

	private resetRangeSelection = (): void => {
		this.rangeSelectionAnchor = undefined;
	};

	private openCreateForm = (): void => {
		if (this.isCreating) {
			return;
		}

		this.resetRangeSelection();
		this.isCreating = true;
		this.createdOptionValue = this.searchValue;
		this.submittedOptionValue = undefined;
		this.isCreateValueEdited = false;
		this.isAwaitingCreateState = false;
		this.unlockAsyncSubmit();
		this.pendingFocus = 'create-form';
	};

	private closeCreateForm = (restoreSearchFocus: boolean): void => {
		if (!this.isCreating) {
			return;
		}

		this.isCreating = false;
		this.submittedOptionValue = undefined;
		this.unlockAsyncSubmit();
		this.pendingFocus = restoreSearchFocus ? 'search' : undefined;
	};

	/** Selects the created option, as a synchronous submit does, or without a key only closes the form */
	private completeCreateOption = (optionKey?: string): void => {
		this.resetRangeSelection();

		if (isEmpty(optionKey)) {
			this.closeCreateForm(true);
			return;
		}

		this.optionSelected.emit(optionKey);
		this.closeCreateForm(false);
	};

	/**
	 * The lock releases itself: the component can't count on seeing the consumer's loading flag go on and
	 * off, since a quick failure can batch both into one update.
	 */
	private lockAsyncSubmit = (): void => {
		clearTimeout(this.asyncSubmitLockTimer);
		this.isAsyncSubmitLocked = true;
		this.asyncSubmitLockTimer = setTimeout(this.unlockAsyncSubmit, ASYNC_CREATE_SUBMIT_LOCK_IN_MS);
	};

	private unlockAsyncSubmit = (): void => {
		clearTimeout(this.asyncSubmitLockTimer);
		this.isAsyncSubmitLocked = false;
	};

	// Content added to or removed from an empty state's slot changes what the list shows, with no prop or state of its own
	private onEmptyStateSlotChange = (): void => forceUpdate(this);

	private isCreateFormEvent = (event: Event): boolean => this.createFormRef !== undefined && event.composedPath().includes(this.createFormRef);

	private applyPendingFocus = (): void => {
		const pendingFocus = this.pendingFocus;
		this.pendingFocus = undefined;

		if (pendingFocus === 'create-form') {
			this.focusCreateForm();
		} else if (pendingFocus === 'search') {
			this.selectRef?.focusSearch();
		}
	};

	/** Focuses the default create form, or the text field of a slotted one that is already mounted */
	private focusCreateForm = (): void => {
		const formElements = this.createFormSlotRef?.assignedElements?.({ flatten: true }) ?? [];

		for (const element of formElements) {
			const target = element.matches(CREATE_FORM_FOCUS_TARGET_SELECTOR) ? element : element.querySelector(CREATE_FORM_FOCUS_TARGET_SELECTOR);

			if (hasFocusInput(target)) {
				target.focusInput();
				return;
			}
		}
	};

	/**
	 * The default form shows why the latest submit failed, until its value is edited. An error left from an
	 * earlier submit stays hidden until the consumer answers the new one.
	 */
	private getCreateErrorInputConfig = (): Partial<ITextField> => {
		const { status, error } = this.createOptionState ?? {};

		if (status !== ECreateOptionStatus.Error || this.submittedOptionValue === undefined || this.isCreateValueEdited || this.isAwaitingCreateState) {
			return {};
		}

		return isEmpty(error) ? { state: EValidationState.Invalid } : { state: EValidationState.Invalid, helpText: error };
	};

	private renderCreateForm = () => (
		<div key="create-new-option-form" class="create-new-option-form" ref={element => (this.createFormRef = element)}>
			<slot name="create-new-option" ref={element => (this.createFormSlotRef = element as HTMLSlotElement)}>
				<div class="form-container">
					<kv-select-create-option
						value={this.createdOptionValue}
						loading={this.isCreateLoading}
						disabled={this.createOptionConfig?.disabled ?? false}
						size={this.createOptionConfig?.size ?? EComponentSize.Small}
						inputConfig={{ placeholder: this.createInputPlaceholder, ...this.createOptionConfig?.inputConfig, ...this.getCreateErrorInputConfig() }}
					/>
				</div>
			</slot>
		</div>
	);

	private renderOptions = (): HTMLKvVirtualizedListElement => {
		const items = this.selectOptions.currentFlatten;

		return (
			<kv-virtualized-list
				key="options-list"
				itemCount={items.length}
				itemHeight={SELECT_OPTION_HEIGHT_IN_PX}
				getItemKey={index => items[index].value}
				renderItem={index => (
					<kv-select-option
						key={items[index].value}
						{...items[index]}
						onClick={event => this.onOptionClick(event, items[index].value)}
						onItemSelected={this.onRenderedItemSelected}
						style={{
							'--select-option-height': `${SELECT_OPTION_HEIGHT_IN_PX}px`
						}}
						exportparts="icon:select-option-icon"
					/>
				)}
				exportparts="select-option-icon"
			/>
		);
	};

	private get isRangeSelectionEnabled(): boolean {
		return this.rangeSelection !== false;
	}

	/** With a create state, the consumer creates the option and reports how it goes */
	private get isCreateAsync(): boolean {
		return !isNil(this.createOptionState);
	}

	private get isCreateLoading(): boolean {
		return this.isCreating && this.createOptionState?.status === ECreateOptionStatus.Loading;
	}

	private get isSearchable() {
		return this.selectOptions.searchAvailable;
	}

	private getCurrentOptions(searchAvailable: boolean): ISelectMultiOptions | undefined {
		if (this.filteredOptions !== undefined) {
			return this.filteredOptions;
		}

		// Only filter locally while the search input is actually reachable, otherwise a term left over
		// from before it was hidden would narrow the list with no way for the user to clear it.
		return searchAvailable ? selectHelper.searchDropdownOptions(this.debouncedSearchValue, this.options) : this.options;
	}

	render() {
		const selectedOptions = this.selectedOptions ?? {};

		const optionsLength = Object.keys(this.selectOptions.totalSelectable).length;
		const currentRowsLength = this.selectOptions.currentFlatten.length;
		const currentResultsLength = this.selectOptions.currentFlatten.filter(({ value }) => !isAddOption(value)).length;
		const selectedOptionsLength = Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;

		const hasOptions = optionsLength > 0;
		const hasCurrentRows = currentRowsLength > 0;
		const hasCurrentResults = currentResultsLength > 0;
		const hasSelectedOptions = selectedOptionsLength > 0;

		// Only real results count: the add option is still listed below an empty state
		const isNoDataAvailable = !this.isCreating && !hasOptions && !hasCurrentResults;
		const isNoResultsFound = !this.isCreating && hasOptions && !hasCurrentResults;
		const noDataAvailableConfig = this.noDataAvailableConfig ?? DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG;
		const noResultsFoundConfig = this.noResultsFoundConfig ?? DEFAULT_NO_RESULTS_FOUND_CONFIG;
		// Content of the consumer's own in an empty state's slot takes the place of its illustration and message
		const hasNoDataAvailableContent = isNoDataAvailable && hasSlottedElement(this.el, 'no-data-available');
		const hasNoResultsFoundContent = isNoResultsFound && hasSlottedElement(this.el, 'no-results-found');
		const emptyStateConfig =
			isNoDataAvailable && !hasNoDataAvailableContent ? noDataAvailableConfig : isNoResultsFound && !hasNoResultsFoundContent ? noResultsFoundConfig : undefined;
		const hasNoDataAvailableIllustration = isNoDataAvailable && hasEmptyStateIllustration(noDataAvailableConfig);
		const hasNoResultsFoundIllustration = isNoResultsFound && hasEmptyStateIllustration(noResultsFoundConfig);
		// An empty state without an illustration only shows its header, in the list header
		const emptyStateMessage = emptyStateConfig && !hasEmptyStateIllustration(emptyStateConfig) ? emptyStateConfig.header : undefined;
		const hasEmptyStateMessage = !isEmpty(emptyStateMessage);

		const isSelectionClearable = hasOptions && this.selectionClearable && !hasEmptyStateMessage;
		const isSelectionClearEnabled = hasSelectedOptions && hasCurrentResults;
		const isSelectAllAvailable = hasOptions && this.selectionAll && this.maxSelectable === undefined && !hasEmptyStateMessage;
		const isSelectAllEnabled = hasCurrentResults && selectedOptionsLength < optionsLength;

		// Nothing below the header: no rows, no illustration, no content of the consumer's and no create form
		const isListEmpty =
			!this.isCreating && !hasCurrentRows && !hasNoDataAvailableIllustration && !hasNoResultsFoundIllustration && !hasNoDataAvailableContent && !hasNoResultsFoundContent;
		// The shortcuts navigate rows, so there are none to show without them
		const hasShortcutsFooter = this.shortcuts && this.showShortcuts && !this.isCreating && hasCurrentRows;
		const maxSelectableCount = Math.min(this.maxSelectable ?? optionsLength, optionsLength);
		const selectedItemsCountText = `Selected: ${selectedOptionsLength}/${maxSelectableCount}`;

		return (
			<kv-select
				ref={element => (this.selectRef = element)}
				class={{ creating: this.isCreating, empty: isListEmpty }}
				maxHeight={this.maxHeight}
				minHeight={this.minHeight}
				maxWidth={this.maxWidth}
				minWidth={this.minWidth}
				searchable={this.isSearchable}
				searchValue={this.searchValue}
				selectionClearable={isSelectionClearable}
				selectionClearEnabled={isSelectionClearEnabled}
				searchPlaceholder={this.searchPlaceholder}
				clearSelectionLabel={this.clearSelectionLabel}
				selectionAll={isSelectAllAvailable}
				selectionAllEnabled={isSelectAllEnabled}
				selectAllLabel={this.selectAllLabel}
				hasLabelContent={this.counter || hasEmptyStateMessage}
				onSelectAll={this.onSelectAll}
				onClearSelection={this.onClearSelection}
				part="select"
				exportparts="select-option-icon"
			>
				<slot name="select-header-actions" slot="select-header-actions" />
				{hasEmptyStateMessage && (
					<div class="empty-state-message" slot="select-header-actions" role="status">
						{emptyStateMessage}
					</div>
				)}
				<slot name="select-header-label" slot="select-header-label" />
				{this.counter && (
					<div class="select-header-label" slot="select-header-label">
						<kv-tooltip text={selectedItemsCountText} truncate>
							<div class="selected-items-label">{selectedItemsCountText}</div>
						</kv-tooltip>
					</div>
				)}
				{isNoDataAvailable && (
					<slot key="no-data-available" name="no-data-available" onSlotchange={this.onEmptyStateSlotChange}>
						{hasNoDataAvailableIllustration && (
							<div class="no-data-available">
								<div class="illustration-message">
									<kv-illustration-message {...noDataAvailableConfig} />
								</div>
							</div>
						)}
					</slot>
				)}
				{isNoResultsFound && (
					<slot key="no-results-found" name="no-results-found" onSlotchange={this.onEmptyStateSlotChange}>
						{hasNoResultsFoundIllustration && (
							<div class="no-results-found">
								<div class="illustration-message">
									<kv-illustration-message {...noResultsFoundConfig} />
								</div>
							</div>
						)}
					</slot>
				)}
				{hasCurrentRows && this.renderOptions()}
				{this.isCreating && this.renderCreateForm()}
				{hasShortcutsFooter && (
					<slot name="select-footer" slot="select-footer">
						<kv-select-shortcuts-label rangeSelection={this.isRangeSelectionEnabled}>
							<div class="counter" slot="right-items">
								{!isEmpty(this.debouncedSearchValue) && hasCurrentResults && <span>{pluralize('result', currentResultsLength, true)}</span>}
							</div>
						</kv-select-shortcuts-label>
					</slot>
				)}
				{!this.isCreating && <slot name="select-footer" slot="select-footer" />}
			</kv-select>
		);
	}
}
