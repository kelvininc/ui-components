import { Component, Event, EventEmitter, Prop, h, Element, State, Watch } from '@stencil/core';
import { ISelectMultiOptions, ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from './select-multi-options.types';
import { DEFAULT_NO_DATA_AVAILABLE_LABEL, MINIMUM_SEARCHABLE_OPTIONS } from './select-multi-options.config';
import { EToggleState, ISelectOption } from '../select-option/select-option.types';
import { isEmpty } from 'lodash';
import { buildAllOptionsSelected, getFlattenSelectOptions, getSelectableOptions } from '../../utils/select.helper';
import { buildSelectOptions } from './select-multi-options.helper';

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

	@Element() el: HTMLKvSelectMultiOptionsElement;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;

	@State() selectOptions: {
		total: Record<string, ISelectOption>;
		current: Record<string, ISelectOption>;
		flatten: Record<string, ISelectOption>;
		totalSelectable: ISelectMultiOptions;
		currentSelectable: ISelectMultiOptions;
	};

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('selectedOptions')
	buildSelectOptions() {
		const selectOptions = buildSelectOptions(this.options, this.options, this.selectedOptions);
		const selectSelectableOptions = getSelectableOptions(this.options);
		const selectCurrentOptions = buildSelectOptions(this.currentOptions, this.options, this.selectedOptions);
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

	componentWillLoad() {
		this.buildSelectOptions();
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		return this.filteredOptions ?? this.options;
	}

	private onSelectAll = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.selectAll.emit();
	};

	private onClearSelection = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.clearSelection.emit();
	};

	private onSelectedOptionsChange = (event: CustomEvent<string>) => {
		event.stopPropagation();

		const { detail: selectedOptionKey } = event;

		const selectedOption = this.selectOptions.flatten[selectedOptionKey];

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

	private renderOptions = () => {
		return Object.values(this.selectOptions.current).map(option => <kv-select-option key={option.value} {...option} onItemSelected={this.onSelectedOptionsChange} />);
	};

	private get isSearchable() {
		return this.searchable && Object.keys(this.selectOptions.totalSelectable).length >= this.minSearchOptions;
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
				{this.renderOptions()}
			</kv-select>
		);
	}
}
