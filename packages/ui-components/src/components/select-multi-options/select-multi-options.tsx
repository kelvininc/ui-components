import { Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';
import type {
	ISelectMultiOptions,
	ISelectMultiOptionsConfig,
	ISelectMultiOptionsEvents,
	ISelectOptionWithChildren,
	ISelectOptionsWithChildren
} from './select-multi-options.types';
import {
	ADD_OPTION,
	DEFAULT_ADD_OPTION_PLACEHOLDER,
	MINIMUM_SEARCHABLE_OPTIONS,
	DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG,
	SELECT_OPTION_HEIGHT_IN_PX,
	DEFAULT_NO_RESULTS_FOUND_ILLUSTRATION_CONFIG
} from './select-multi-options.config';
import { EToggleState } from '../select-option/select-option.types';
import { isEmpty } from 'lodash-es';
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
import { buildNewOption, buildRangeSelection, buildSelectOptions, buildSelectOptionsArray, getRangeOptionValues } from './select-multi-options.helper';
import { selectHelper } from '../../utils';
import pluralize from 'pluralize';
import type { IIllustrationMessage } from '../illustration-message/illustration-message.types';

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
	@Prop({ reflect: true }) noResultsFoundConfig?: IIllustrationMessage = DEFAULT_NO_RESULTS_FOUND_ILLUSTRATION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
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

	@Listen('valueChanged')
	valueChangedOptionHandler({ detail: newValue }: CustomEvent<string>) {
		this.createdOptionValue = newValue;
	}
	@Listen('clickCreate')
	clickCreateOptionHandler() {
		this.resetRangeSelection();
		this.optionCreated.emit(this.createdOptionValue);
		this.optionSelected.emit(this.createdOptionValue);
		this.isCreating = false;
	}
	@Listen('clickCancel')
	cancelCreateOptionHandler() {
		this.isCreating = false;
	}

	@State() selectOptions: {
		totalFlatten: ISelectOptionsWithChildren;
		currentFlatten: ISelectOptionWithChildren[];
		totalSelectable: ISelectOptionsWithChildren;
		currentSelectable: ISelectOptionWithChildren[];
	};
	@State() highlightedOption: string;
	@State() isCreating: boolean = false;
	@State() createdOptionValue: string = '';

	private rebuildScheduled = false;
	private rangeSelectionAnchor?: string;

	private scheduleRebuild = () => {
		if (this.rebuildScheduled) return;
		this.rebuildScheduled = true;
		queueMicrotask(() => {
			this.rebuildScheduled = false;
			this.buildSelectionOptions();
		});
	};

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('searchValue')
	@Watch('selectedOptions')
	@Watch('highlightedOption')
	@Watch('maxSelectable')
	onInputsChanged(_newValue: unknown, _oldValue: unknown, propName: string) {
		if (propName === 'options') {
			this.resetRangeSelection();
		}

		this.scheduleRebuild();
	}

	buildSelectionOptions() {
		const selectedCount = getSelectedCount(this.selectedOptions);
		const selectOptions = buildSelectOptions({
			options: this.options,
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			hasAddItem: this.canAddItems,
			createInputPlaceholder: this.createOptionPlaceholder,
			maxSelectable: this.maxSelectable,
			selectedCount
		});
		const selectCurrentOptionsArray = buildSelectOptionsArray({
			options: this.currentOptions,
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			hasAddItem: this.canAddItems,
			createInputPlaceholder: this.createOptionPlaceholder
		});
		const selectSelectableOptions = getSelectableOptions(selectOptions);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);
		const selectCurrentFlattenOptions = flattenSelectOptionsArray(selectCurrentOptionsArray);
		const selectCurrentSelectableOptions = getSelectableOptionsFromArray(selectCurrentFlattenOptions);

		this.selectOptions = {
			totalFlatten: selectFlattenOptions,
			currentFlatten: selectCurrentFlattenOptions,
			totalSelectable: selectSelectableOptions,
			currentSelectable: selectCurrentSelectableOptions
		};
	}

	@Listen('keydown', { target: 'document' })
	handleKeyDown(event: KeyboardEvent) {
		if (!this.shortcuts) {
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

	/** Close create popup */
	@Method()
	async closeCreatePopup(): Promise<void> {
		this.isCreating = false;
	}

	/** Focuses the search text field */
	@Method()
	async focusSearch() {
		this.selectRef?.focusSearch();
	}

	componentWillLoad() {
		this.buildSelectionOptions();
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

	private onItemSelected = (event: CustomEvent<string>): void => {
		event.stopPropagation();
		this.selectOption(event.detail);
		if (this.shortcuts) {
			this.highlightedOption = event.detail;
		}
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
		if (selectedOptionKey === ADD_OPTION.value) {
			this.resetRangeSelection();
			this.isCreating = true;
			this.createdOptionValue = this.searchValue;
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
		this.selectOptions.currentSelectable.filter(({ selectable, value }) => selectable !== false && value !== ADD_OPTION.value);

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

	private renderOptions = (): HTMLKvVirtualizedListElement => {
		const items = this.selectOptions.currentFlatten;

		return (
			<kv-virtualized-list
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

	private get isSearchable() {
		return this.searchable && Object.keys(this.selectOptions.totalFlatten).length >= this.minSearchOptions;
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		return this.filteredOptions ?? selectHelper.searchDropdownOptions(this.searchValue, this.options);
	}

	render() {
		const selectedOptions = this.selectedOptions ?? {};

		const optionsLength = Object.keys(this.selectOptions.totalSelectable).length;
		const currentOptionsLength = this.selectOptions.currentFlatten.length;
		const selectedOptionsLength = Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;

		const hasOptions = optionsLength > 0;
		const hasCurrentOptions = currentOptionsLength > 0;
		const hasSelectedOptions = selectedOptionsLength > 0;
		const isSelectionClearable = hasOptions && this.selectionClearable;
		const isSelectionClearEnabled = hasSelectedOptions && hasCurrentOptions;
		const isSelectAllAvailable = hasOptions && this.selectionAll && this.maxSelectable === undefined;
		const isSelectAllEnabled = hasCurrentOptions && selectedOptionsLength < optionsLength;

		const hasNoDataAvailable = !hasOptions && !hasCurrentOptions;
		const hasNoResultsFound = hasOptions && !hasCurrentOptions;
		const maxSelectableCount = Math.min(this.maxSelectable ?? optionsLength, optionsLength);
		const selectedItemsCountText = `Selected: ${selectedOptionsLength}/${maxSelectableCount}`;

		return (
			<kv-select
				ref={element => (this.selectRef = element)}
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
				hasLabelContent={this.counter}
				onSelectAll={this.onSelectAll}
				onClearSelection={this.onClearSelection}
				part="select"
				exportparts="select-option-icon"
			>
				<slot name="select-header-actions" slot="select-header-actions" />
				<slot name="select-header-label" slot="select-header-label" />
				{this.counter && (
					<div class="select-header-label" slot="select-header-label">
						<kv-tooltip text={selectedItemsCountText} truncate>
							<div class="selected-items-label">{selectedItemsCountText}</div>
						</kv-tooltip>
					</div>
				)}
				{hasNoDataAvailable && (
					<slot name="no-data-available">
						<div class="no-data-available">
							<div class="illustration-message">
								<kv-illustration-message {...this.noDataAvailableConfig} />
							</div>
						</div>
						{this.canAddItems && (
							<div class="create-new-option-button">
								<kv-select-option
									{...buildNewOption(this.highlightedOption, this.createOptionPlaceholder)}
									onItemSelected={this.onItemSelected}
									style={{
										'--select-option-height': `${SELECT_OPTION_HEIGHT_IN_PX}px`
									}}
								/>
							</div>
						)}
					</slot>
				)}
				{hasNoResultsFound && (
					<slot name="no-results-found">
						<div class="no-results-found">
							<div class="illustration-message">
								<kv-illustration-message {...this.noResultsFoundConfig} />
							</div>
							{this.canAddItems && (
								<div class="create-new-option-button">
									<kv-select-option
										{...buildNewOption(this.highlightedOption, this.createOptionPlaceholder)}
										onItemSelected={this.onItemSelected}
										style={{
											'--select-option-height': `${SELECT_OPTION_HEIGHT_IN_PX}px`
										}}
									/>
								</div>
							)}
						</div>
					</slot>
				)}
				{hasCurrentOptions && this.renderOptions()}
				{this.isCreating && (
					<div
						class={{
							'create-new-option-container': true,
							'has-shortcuts': this.shortcuts && this.showShortcuts
						}}
					>
						<div class="create-new-option-form">
							<slot name="create-new-option">
								<div class="form-container">
									<kv-select-create-option value={this.createdOptionValue} inputConfig={{ placeholder: this.createInputPlaceholder }} />
								</div>
							</slot>
						</div>
					</div>
				)}
				{this.shortcuts && this.showShortcuts && (
					<slot name="select-footer" slot="select-footer">
						<kv-select-shortcuts-label rangeSelection={this.isRangeSelectionEnabled}>
							<div class="counter" slot="right-items">
								{!isEmpty(this.searchValue) && hasCurrentOptions && <span>{pluralize('result', currentOptionsLength, true)}</span>}
							</div>
						</kv-select-shortcuts-label>
					</slot>
				)}
				<slot name="select-footer" slot="select-footer" />
			</kv-select>
		);
	}
}
