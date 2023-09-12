import { Component, Element, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { ISingleSelectDropdown, ISingleSelectDropdownEvents, ISingleSelectDropdownOptions } from './single-select-dropdown.types';
import { isEmpty, size } from 'lodash-es';
import pluralize from 'pluralize';

import {
	EMPTY_STRING,
	INVALID_VALUE_ERROR,
	MINIMUM_SEARCHABLE_OPTIONS,
	SINGLE_SELECT_CLEAR_SELECTION_LABEL,
	SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE
} from './single-select-dropdown.config';
import { CustomCssClass, EComponentSize, ISelectOption } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';
import { getCssStyle } from '../utils';
import { ComputePositionConfig } from '@floating-ui/dom';
import { buildSelectOptions } from './single-select-dropdown.helper';
import { getFlattenSelectOptions, getNextHightlightableOption, getPreviousHightlightableOption, getSelectableOptions } from '../../utils/select.helper';

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
	@Prop({ reflect: true }) shortcuts?: boolean = false;

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
		totalSelectable: ISingleSelectDropdownOptions;
		current: Record<string, ISelectOption>;
		currentSelectable: ISingleSelectDropdownOptions;
		flatten: Record<string, ISelectOption>;
	};
	@State() highlightedOption?: string;

	@Watch('options')
	@Watch('filteredOptions')
	@Watch('selectedOption')
	@Watch('highlightedOption')
	buildSelectOptions() {
		const selectOptions = buildSelectOptions(this.options, this.selectedOption, this.highlightedOption);
		const selectSelectableOptions = getSelectableOptions(this.options);
		const selectCurrentOptions = buildSelectOptions(this.currentOptions, this.selectedOption, this.highlightedOption);
		const selectCurrentSelectableOptions = getSelectableOptions(this.currentOptions);
		const selectFlattenOptions = getFlattenSelectOptions(selectOptions);

		this.selectOptions = {
			total: selectOptions,
			totalSelectable: selectSelectableOptions,
			current: selectCurrentOptions,
			currentSelectable: selectCurrentSelectableOptions,
			flatten: selectFlattenOptions
		};
	}

	@Watch('options')
	optionsChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('selectedOption')
	selectedOptionChangeHandler() {
		this.validateSelectedOptionValue();
		this.calculateLabelValue();
	}

	@Watch('displayValue')
	displayValueChangeHandler() {
		this.calculateLabelValue();
	}

	@Listen('keydown', { target: 'document' })
	handleKeyDown(event: KeyboardEvent) {
		if (!this.shortcuts || !this.isOpen) {
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

	componentWillLoad() {
		this.validateSelectedOptionValue();
		this.buildSelectOptions();
		this.calculateLabelValue();
	}

	private onItemSelected = ({ detail: selectedOptionKey }: CustomEvent<string>) => {
		this.selectOption(selectedOptionKey);
		this.highlightedOption = selectedOptionKey;
	};

	private onSearchChange = ({ detail: searchTerm }: CustomEvent<string>) => {
		this.setSearch(searchTerm);
	};

	private onOpenStateChange = ({ detail: state }: CustomEvent<boolean>) => {
		this.setOpenState(state);
	};

	private onDismiss = (): void => {
		this.setOpenState(false);
	};

	private onNavigateDown = (): void => {
		this.highlightedOption = getNextHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onNavigateUp = (): void => {
		this.highlightedOption = getPreviousHightlightableOption(this.selectOptions.currentSelectable, this.highlightedOption);
	};

	private onEnter = (): void => {
		if (isEmpty(this.highlightedOption)) {
			return;
		}

		this.selectOption(this.highlightedOption);
	};

	private onClearSelection = (): void => {
		this.optionSelected.emit(undefined);
		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private selectOption = (selectedOption: string) => {
		this.optionSelected.emit(selectedOption);
		this.setOpenState(false);
	};

	private setOpenState = (state: boolean) => {
		if (!state) {
			this.setSearch('');
		}

		this.highlightedOption = undefined;
		this.isOpen = state;
		this.openStateChange.emit(state);
	};

	private setSearch = (searchTerm: string): void => {
		this._searchValue = searchTerm;
		this.searchChange.emit(searchTerm);
	};

	private calculateLabelValue = (): void => {
		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
			return;
		}

		if (this.selectedOption && this.selectOptions.flatten[this.selectedOption]) {
			this._selectionDisplayValue = this.selectOptions.flatten[this.selectedOption].label;
			return;
		}

		this._selectionDisplayValue = undefined;
	};

	private validateSelectedOptionValue = (): void => {
		if (this.selectedOption === EMPTY_STRING) {
			throw new Error(INVALID_VALUE_ERROR);
		}
	};

	private renderOptions = (): HTMLKvSelectOptionElement[] => {
		return Object.values(this.selectOptions.current).map(option => <kv-select-option key={option.value} {...option} onItemSelected={this.onItemSelected} />);
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

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	private get currentOptions(): ISingleSelectDropdownOptions | undefined {
		return this.filteredOptions ?? this.options;
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
					onOpenStateChange={this.onOpenStateChange}
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
							{this.shortcuts && (
								<kv-select-shortcuts-label slot="select-footer">
									<div class="counter" slot="right-items">
										{!isEmpty(this._searchValue) && !isEmpty(this.currentOptions) && <span>{pluralize('result', size(this.currentOptions), true)}</span>}
									</div>
								</kv-select-shortcuts-label>
							)}
						</kv-select>
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
