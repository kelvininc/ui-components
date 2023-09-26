import { Component, Event, EventEmitter, Prop, h, Element, State, Watch, Listen, Method } from '@stencil/core';
import { ISelectMultiOptions, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from './select-multi-options.types';
import { DEFAULT_NO_DATA_AVAILABLE_LABEL, MINIMUM_SEARCHABLE_OPTIONS, SELECT_OPTION_HEIGHT_IN_PX } from './select-multi-options.config';
import { EToggleState, ISelectOption } from '../select-option/select-option.types';
import { isEmpty } from 'lodash';
import { buildAllOptionsSelected, getFlattenSelectOptions, getNextHightlightableOption, getPreviousHightlightableOption, getSelectableOptions } from '../../utils/select.helper';
import { buildSelectOptions, getSelectOptionHeight } from './select-multi-options.helper';
import { selectHelper } from '../../utils';
import pluralize from 'pluralize';

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
	@Prop({ reflect: true }) noDataAvailableLabel?: string = DEFAULT_NO_DATA_AVAILABLE_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean;
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
	@Prop({ reflect: true }) selectionAll?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) counter?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) shortcuts?: boolean = true;

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

	@State() selectOptions: {
		total: Record<string, ISelectOption>;
		current: Record<string, ISelectOption>;
		flatten: Record<string, ISelectOption>;
		totalSelectable: ISelectMultiOptions;
		currentSelectable: ISelectMultiOptions;
	};
	@State() highlightedOption: string;

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('selectedOptions')
	@Watch('highlightedOption')
	buildSelectionOptions() {
		const selectOptions = buildSelectOptions(this.options, this.options, this.selectedOptions, this.highlightedOption);
		const selectSelectableOptions = getSelectableOptions(this.options);
		const selectCurrentOptions = buildSelectOptions(this.currentOptions, this.options, this.selectedOptions, this.highlightedOption);
		const selectCurrentSelectableOptions = getSelectableOptions(this.currentOptions);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);

		this.selectOptions = {
			total: selectOptions,
			current: selectCurrentOptions,
			flatten: selectFlattenOptions,
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
		const selectedOption = this.selectOptions.flatten[selectedOptionKey];
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

	private renderOptions = (): HTMLKvSelectElement[] => {
		const items = Object.values(this.selectOptions.current);

		return (
			<kv-virtualized-list
				itemCount={items.length}
				getItemHeight={index => getSelectOptionHeight(items[index])}
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

		const hasCurrentOptions = currentOptionsLength > 0;
		const isSelectionClearable = optionsLength > 0 && this.selectionClearable;
		const isSelectionClearEnabled = selectedOptionsLength > 0 && hasCurrentOptions;
		const isSelectAllAvailable = optionsLength > 0 && this.selectionAll;
		const isSelectAllEnabled = hasCurrentOptions && selectedOptionsLength < optionsLength;

		return (
			<kv-select
				maxHeight={this.maxHeight}
				minHeight={this.minHeight}
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
				{!hasCurrentOptions && this.noDataAvailableLabel && (
					<slot name="no-data-available">
						<kv-select-option class="no-data" label={this.noDataAvailableLabel} value="no-data-available" />
					</slot>
				)}
				{hasCurrentOptions && this.renderOptions()}
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
