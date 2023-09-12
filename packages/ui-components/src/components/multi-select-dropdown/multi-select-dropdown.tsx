import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents } from './multi-select-dropdown.types';

import { MINIMUM_SEARCHABLE_OPTIONS, MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.config';
import { getDropdownDisplayValue } from './multi-select-dropdown.helper';
import { CustomCssClass, EComponentSize } from '../../types';
import { getCssStyle } from '../utils';
import { ISelectMultiOptions } from '../select-multi-options/select-multi-options.types';
import { ComputePositionConfig } from '@floating-ui/dom';

@Component({
	tag: 'kv-multi-select-dropdown',
	styleUrl: 'multi-select-dropdown.scss',
	shadow: false
})
export class KvMultiSelectDropdown implements IMultiSelectDropdown, IMultiSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) errorState?: EValidationState;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string | string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) noDataAvailableLabel?: string = MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE;
	/** @inheritdoc */
	@Prop({ reflect: true }) options?: ISelectMultiOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: ISelectMultiOptions;
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
	@Prop({ reflect: false }) selectionAll: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectAllLabel: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) counter: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) minSearchOptions?: number = MINIMUM_SEARCHABLE_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) shortcuts?: boolean = false;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _selectionDisplayValue: string | undefined;
	@State() _searchValue: string;
	@State() _isOpen: boolean = false;

	/** The Host's element reference */
	@Element() el: HTMLKvMultiSelectDropdownElement;

	@Watch('options')
	optionsChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('selectedOptions')
	selectedOptionsChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('displayValue')
	valueChangeHandler() {
		this.calculateLabelValue();
	}

	componentWillLoad() {
		this.calculateLabelValue();
	}

	private selectRef?: HTMLKvSelectMultiOptionsElement | null;

	private onOptionsSelected = ({ detail: newOptions }: CustomEvent<Record<string, boolean>>): void => {
		this.optionsSelected.emit(newOptions);
	};

	private onSearchChange = ({ detail: searchValue }: CustomEvent<string>): void => {
		this.setSearch(searchValue);
	};

	private onClearSelection = (event: CustomEvent<void>): void => {
		event.stopPropagation();

		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private onSelectAll = (event: CustomEvent<void>): void => {
		event.stopPropagation();
		this.selectAll.emit();
		this.calculateLabelValue();
	};

	private onDismiss = (): void => {
		this.setOpenState(false);
	};

	private onOpenStateChange = ({ detail: state }: CustomEvent<boolean>): void => {
		this.setOpenState(state);
	};

	private setOpenState = (state: boolean): void => {
		if (!state) {
			this.setSearch('');
		}

		this.clearHightlightedOption();
		this._isOpen = state;
	};

	private setSearch = (searchTerm: string): void => {
		this._searchValue = searchTerm;
		this.searchChange.emit(searchTerm);
	};

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	private clearHightlightedOption = (): void => {
		this.selectRef?.clearHightlightedOption();
	};

	private calculateLabelValue = (): void => {
		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
		} else {
			this._selectionDisplayValue = getDropdownDisplayValue(this.options, this.selectedOptions);
		}
	};

	private get inputConfig(): Partial<ITextField> {
		return {
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
		};
	}

	render() {
		return (
			<Host>
				<kv-dropdown
					inputConfig={this.inputConfig}
					isOpen={this._isOpen}
					onOpenStateChange={this.onOpenStateChange}
					disabled={this.disabled}
					options={this.dropdownOptions}
				>
					<kv-select-multi-options
						ref={element => (this.selectRef = element)}
						options={this.options}
						filteredOptions={this.filteredOptions}
						selectedOptions={this.selectedOptions}
						noDataAvailableLabel={this.noDataAvailableLabel}
						searchable={this.searchable}
						minSearchOptions={this.minSearchOptions}
						searchValue={this._searchValue}
						selectionClearable={this.selectionClearable}
						clearSelectionLabel={this.clearSelectionLabel}
						selectionAll={this.selectionAll}
						selectAllLabel={this.selectAllLabel}
						searchPlaceholder={this.searchPlaceholder}
						maxHeight={this.getMaxHeight()}
						minHeight={this.minHeight}
						counter={this.counter}
						shortcuts={this._isOpen && this.shortcuts}
						onSearchChange={this.onSearchChange}
						onClearSelection={this.onClearSelection}
						onOptionsSelected={this.onOptionsSelected}
						onSelectAll={this.onSelectAll}
						onDismiss={this.onDismiss}
					>
						<slot name="select-header-actions" slot="select-header-actions" />
						<slot name="select-header-label" slot="select-header-label" />
						<slot name="no-data-available" slot="no-data-available" />
					</kv-select-multi-options>
				</kv-dropdown>
			</Host>
		);
	}
}
