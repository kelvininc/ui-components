import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { ISingleSelectDropdown, ISingleSelectDropdownEvents, ISingleSelectDropdownOptions } from './single-select-dropdown.types';
import { isEmpty, isNil } from 'lodash-es';

import { MINIMUM_SEARCHABLE_OPTIONS, SINGLE_SELECT_CLEAR_SELECTION_LABEL, SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './single-select-dropdown.config';
import { CustomCssClass, EComponentSize, ISelectMultiOptions, ISelectOption } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';
import { getCssStyle } from '../utils';
import { ComputePositionConfig } from '@floating-ui/dom';
import { buildSelectOptions } from './single-select-dropdown.helper';
import { getFlattenSelectOptions, getSelectableOptions } from '../../utils/select.helper';

@Component({
	tag: 'kv-single-select-dropdown',
	styleUrl: 'single-select-dropdown.scss',
	shadow: false
})
export class KvSingleSelectDropdown implements ISingleSelectDropdown, ISingleSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder: string;
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string = SINGLE_SELECT_CLEAR_SELECTION_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) errorState?: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableLabel?: string = SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE;
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISingleSelectDropdownOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOption?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISingleSelectDropdownOptions;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputSize?: EComponentSize = EComponentSize.Large;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownOptions: Partial<ComputePositionConfig>;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;

	/** @inheritdoc */
	@Event() optionSelected: EventEmitter<string>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _searchValue: string;
	@State() _selectionDisplayValue: string | undefined;

	/** The Host's element reference */
	@Element() el: HTMLKvSingleSelectDropdownElement;

	@State() selectOptions: {
		total: Record<string, ISelectOption>;
		current: Record<string, ISelectOption>;
		flatten: Record<string, ISelectOption>;
		totalSelectable: ISelectMultiOptions;
	};

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('selectedOption')
	buildSelectOptions() {
		const selectOptions = buildSelectOptions(this.options, this.selectedOption);
		const selectCurrentOptions = buildSelectOptions(this.currentOptions, this.selectedOption);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);
		const selectSelectableOptions = getSelectableOptions(this.options);

		this.selectOptions = {
			total: selectOptions,
			current: selectCurrentOptions,
			flatten: selectFlattenOptions,
			totalSelectable: selectSelectableOptions
		};
	}

	private get currentOptions(): ISelectMultiOptions | undefined {
		return this.filteredOptions ?? this.options;
	}

	private get selectedOptionLabel(): string | undefined {
		if (isNil(this.selectedOption)) {
			this._selectionDisplayValue = undefined;
			return;
		}

		return this.selectOptions.flatten[this.selectedOption].label;
	}

	private selectOption = (event: CustomEvent<string>) => {
		const { detail: selectedOptionKey } = event;
		const selectedOption = this.selectOptions.flatten[selectedOptionKey];

		this.optionSelected.emit(selectedOption.value);
		this._searchValue = '';
		this.searchChange.emit('');

		this.isOpen = false;
		this.openStateChange.emit(false);
	};

	private onSearchChange = (event: CustomEvent<string>) => {
		this._searchValue = event.detail;
		this.searchChange.emit(event.detail);
	};

	private openStateChangeHandler = (event: CustomEvent<boolean>) => {
		this.isOpen = event.detail;

		if (!this.isOpen) {
			this.searchChange.emit('');
		}

		this.openStateChange.emit(this.isOpen);
	};

	componentWillLoad() {
		this.buildSelectOptions();
		this.calculateLabelValue();
	}

	@Watch('options')
	optionsChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('selectedOption')
	selectedOptionChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('displayValue')
	displayValueChangeHandler() {
		this.calculateLabelValue();
	}

	private calculateLabelValue() {
		if (isNil(this.selectedOption)) {
			this._selectionDisplayValue = undefined;
			return;
		}

		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
			return;
		}

		this._selectionDisplayValue = this.selectedOptionLabel;
	}

	private renderOptions = () => {
		return Object.values(this.selectOptions.current).map(option => <kv-select-option key={option.value} {...option} onItemSelected={this.selectOption} />);
	};

	private getInputConfig = (): Partial<ITextField> => ({
		label: this.label,
		value: this._selectionDisplayValue,
		loading: this.loading,
		icon: this.icon,
		disabled: this.disabled,
		required: this.required,
		placeholder: this.placeholder,
		state: this.errorState,
		helpText: this.helpText,
		size: this.inputSize
	});

	private onClearSelection = () => {
		this.selectedOption = undefined;
		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	private get isSearchable() {
		return this.searchable && Object.keys(this.selectOptions.totalSelectable).length >= this.minSearchOptions;
	}

	render() {
		const isSelectionClearable = !isEmpty(this.currentOptions) && this.selectionClearable;
		const isSelectionClearEnabled = !isEmpty(this.selectedOption);

		return (
			<Host>
				<kv-dropdown
					inputConfig={this.getInputConfig()}
					isOpen={this.isOpen}
					disabled={this.disabled}
					onOpenStateChange={this.openStateChangeHandler}
					options={this.dropdownOptions}
				>
					<div class={{ ...getClassMap(this.customClass), 'single-select-dropdown-slot': true }}>
						<kv-select
							searchValue={this._searchValue}
							searchable={this.isSearchable}
							selectionClearable={isSelectionClearable}
							selectionClearEnabled={isSelectionClearEnabled}
							clearSelectionLabel={this.clearSelectionLabel}
							onClearSelection={this.onClearSelection}
							onSearchChange={this.onSearchChange}
							searchPlaceholder={this.searchPlaceholder}
							maxHeight={this.getMaxHeight()}
							minHeight={this.minHeight}
						>
							<slot name="select-header-actions" slot="select-header-actions" />
							<slot name="select-header-label" slot="select-header-label" />
							{isEmpty(this.currentOptions) && (
								<slot name="no-data-available">
									<kv-select-option class="no-data" label={this.noDataAvailableLabel} value="no-data-available" />
								</slot>
							)}
							{this.renderOptions()}
						</kv-select>
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
