import { Component, Event, EventEmitter, Prop, h, Element, State, Watch, Listen, Method } from '@stencil/core';
import { ISelectMultiOptions, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents, ISelectOptionsWithChildren } from './select-multi-options.types';
import {
	ADD_OPTION,
	DEFAULT_ADD_OPTION_PLACEHOLDER,
	MINIMUM_SEARCHABLE_OPTIONS,
	DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG,
	SELECT_OPTION_HEIGHT_IN_PX,
	DEFAULT_NO_RESULTS_FOUND_ILLUSTRATION_CONFIG
} from './select-multi-options.config';
import { EToggleState } from '../select-option/select-option.types';
import { isEmpty } from 'lodash';
import { buildAllOptionsSelected, getFlattenSelectOptions, getNextHightlightableOption, getPreviousHightlightableOption, getSelectableOptions } from '../../utils/select.helper';
import { buildNewOption, buildSelectOptions } from './select-multi-options.helper';
import { selectHelper } from '../../utils';
import pluralize from 'pluralize';
import { IIllustrationMessage } from '../illustration-message/illustration-message.types';

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
		currentFlatten: ISelectOptionsWithChildren;
		totalSelectable: ISelectOptionsWithChildren;
		currentSelectable: ISelectOptionsWithChildren;
	};
	@State() highlightedOption: string;
	@State() isCreating: boolean = false;
	@State() createdOptionValue: string = '';

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('selectedOptions')
	@Watch('highlightedOption')
	buildSelectionOptions() {
		const selectOptions = buildSelectOptions({
			options: this.options,
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			hasAddItem: this.canAddItems,
			createInputPlaceholder: this.createOptionPlaceholder
		});
		const selectCurrentOptions = buildSelectOptions({
			options: this.currentOptions,
			allOptions: this.options,
			selectedOptions: this.selectedOptions,
			highlightedOption: this.highlightedOption,
			hasAddItem: this.canAddItems,
			createInputPlaceholder: this.createOptionPlaceholder
		});
		const selectSelectableOptions = getSelectableOptions(selectOptions);
		const selectCurrentSelectableOptions = getSelectableOptions(selectCurrentOptions);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);
		const selectCurrentFlattenOptions = getFlattenSelectOptions(selectCurrentOptions);

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
				this.onEnter();
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
	}

	/** Close create popup */
	@Method()
	async closeCreatePopup(): Promise<void> {
		this.isCreating = false;
	}

	componentWillLoad() {
		this.buildSelectionOptions();
	}

	private onEnter = (): void => {
		if (isEmpty(this.highlightedOption)) {
			return;
		}

		this.selectOption(this.highlightedOption);
	};

	private onNavigateDown = (): void => {
		this.highlightedOption = getNextHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onNavigateUp = (): void => {
		this.highlightedOption = getPreviousHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onDismiss = (): void => {
		this.highlightedOption = undefined;
		this.dismiss.emit();
	};

	private onSelectAll = (event: CustomEvent<void>): void => {
		event.stopPropagation();
		this.optionsSelected.emit(selectHelper.buildAllOptionsSelected(selectHelper.getSelectableOptions(this.options)));
		this.selectAll.emit();
	};

	private onClearSelection = (event: CustomEvent<void>): void => {
		event.stopPropagation();
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

	private selectOption = (selectedOptionKey: string): void => {
		if (selectedOptionKey === ADD_OPTION.value) {
			this.isCreating = true;
			this.createdOptionValue = this.searchValue;
			return;
		}

		const selectedOption = this.selectOptions.totalFlatten[selectedOptionKey];
		this.optionSelected.emit(selectedOptionKey);

		// Check if the selected option does not have any children
		if (isEmpty(selectedOption.options)) {
			const { [selectedOptionKey]: selectedOptionValue, ...otherSelectedOptions } = this.selectedOptions;
			if (selectedOptionValue) {
				this.optionsSelected.emit(otherSelectedOptions);
			} else {
				this.optionsSelected.emit({
					...otherSelectedOptions,
					[selectedOptionKey]: true
				});
			}

			return;
		}

		const childrenValues = getSelectableOptions(selectedOption.options);
		switch (selectedOption.state) {
			case EToggleState.Selected:
			case EToggleState.Indeterminate:
				// de-select all children
				const newOptions = this.selectedOptions;
				Object.keys(childrenValues).forEach(childrenKey => delete newOptions[childrenKey]);
				this.optionsSelected.emit({ ...newOptions });
				break;

			case EToggleState.None:
				// select all children
				this.optionsSelected.emit({
					...this.selectedOptions,
					...buildAllOptionsSelected(childrenValues)
				});
		}
	};

	private renderOptions = (): HTMLKvVirtualizedListElement => {
		const items = Object.values(this.selectOptions.currentFlatten);

		return (
			<kv-virtualized-list
				itemCount={items.length}
				itemHeight={SELECT_OPTION_HEIGHT_IN_PX}
				getItemKey={index => items[index].value}
				renderItem={index => (
					<kv-select-option
						key={items[index].value}
						{...items[index]}
						onItemSelected={this.onItemSelected}
						style={{
							'--select-option-height': `${SELECT_OPTION_HEIGHT_IN_PX}px`
						}}
					/>
				)}
			/>
		);
	};

	private get isSearchable() {
		return this.searchable && Object.keys(this.selectOptions.totalSelectable).length >= this.minSearchOptions;
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		return this.filteredOptions ?? this.options;
	}

	render() {
		const selectedOptions = this.selectedOptions ?? {};

		const optionsLength = Object.keys(this.selectOptions.totalSelectable).length;
		const currentOptionsLength = Object.keys(this.selectOptions.currentSelectable).length;
		const selectedOptionsLength = Object.keys(selectedOptions).filter(key => selectedOptions[key]).length;

		const hasOptions = optionsLength > 0;
		const hasCurrentOptions = currentOptionsLength > 0;
		const hasSelectedOptions = selectedOptionsLength > 0;
		const isSelectionClearable = hasOptions && this.selectionClearable;
		const isSelectionClearEnabled = hasSelectedOptions && hasCurrentOptions;
		const isSelectAllAvailable = hasOptions && this.selectionAll;
		const isSelectAllEnabled = hasCurrentOptions && selectedOptionsLength < optionsLength;

		const hasNoDataAvailable = !hasOptions && !hasCurrentOptions;
		const hasNoResultsFound = hasOptions && !hasCurrentOptions;

		return (
			<kv-select
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
				onSelectAll={this.onSelectAll}
				onClearSelection={this.onClearSelection}
				part="select"
			>
				<slot name="select-header-actions" slot="select-header-actions" />
				<slot name="select-header-label" slot="select-header-label" />
				{this.counter && (
					<div slot="select-header-label">
						<div class="selected-items-label">Selected: {`${selectedOptionsLength}/${optionsLength}`}</div>
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
							'has-shortcuts': this.shortcuts
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
				{this.shortcuts && (
					<slot name="select-footer" slot="select-footer">
						<kv-select-shortcuts-label>
							<div class="counter" slot="right-items">
								{!isEmpty(this.searchValue) && hasCurrentOptions && <span>{pluralize('result', currentOptionsLength, true)}</span>}
							</div>
						</kv-select-shortcuts-label>
					</slot>
				)}
			</kv-select>
		);
	}
}
