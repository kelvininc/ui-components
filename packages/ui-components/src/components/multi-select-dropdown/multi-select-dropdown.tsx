import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents } from './multi-select-dropdown.types';

import { MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.config';
import { getDropdownDisplayValue, getAllOptionsSelected } from './multi-select-dropdown.helper';
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
	@Prop({ reflect: true }) selectionClearable?: boolean;
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
	@Prop({ reflect: false }) selectionAll: boolean;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectAllLabel: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) counter: boolean;

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

	private selectOption = ({ detail: newOptions }: CustomEvent<Record<string, boolean>>) => {
		this.optionsSelected.emit(newOptions);
	};

	private calculateLabelValue = () => {
		if (this.displayValue?.length) {
			this._selectionDisplayValue = this.displayValue;
		} else {
			this._selectionDisplayValue = getDropdownDisplayValue(this.options, this.selectedOptions);
		}
	};

	private openStateChangeHandler = ({ detail: openState }: CustomEvent<boolean>) => {
		this._isOpen = openState;

		if (!this._isOpen) {
			this._searchValue = '';
			this.searchChange.emit('');
		}
	};

	private onSearchChange = ({ detail: searchValue }: CustomEvent<string>) => {
		this.searchChange.emit(searchValue);
	};

	private onClearSelection = (event: CustomEvent<void>) => {
		event.stopPropagation();

		this.selectedOptions = {};
		this.clearSelection.emit();
		this.calculateLabelValue();
	};

	private onSelectAll = (event: CustomEvent<void>) => {
		event.stopPropagation();
		this.selectedOptions = getAllOptionsSelected(this.options);
		this.selectAll.emit();
		this.calculateLabelValue();
	};

	componentWillLoad() {
		this._selectionDisplayValue = this.displayValue;
		this.calculateLabelValue();
	}

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

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	render() {
		return (
			<Host>
				<kv-dropdown
					inputConfig={this.inputConfig}
					isOpen={this._isOpen}
					onOpenStateChange={this.openStateChangeHandler}
					disabled={this.disabled}
					options={this.dropdownOptions}
				>
					<kv-select-multi-options
						options={this.options}
						filteredOptions={this.filteredOptions}
						selectedOptions={this.selectedOptions}
						noDataAvailableLabel={this.noDataAvailableLabel}
						searchable={this.searchable}
						searchValue={this._searchValue}
						selectionClearable={this.selectionClearable}
						clearSelectionLabel={this.clearSelectionLabel}
						selectionAll={this.selectionAll}
						selectAllLabel={this.selectAllLabel}
						searchPlaceholder={this.searchPlaceholder}
						maxHeight={this.getMaxHeight()}
						minHeight={this.minHeight}
						counter={this.counter}
						onSearchChange={this.onSearchChange}
						onClearSelection={this.onClearSelection}
						onOptionsSelected={this.selectOption}
						onSelectAll={this.onSelectAll}
					>
						<slot name="header-actions" slot="header-actions" />
						<slot name="no-data-available" slot="no-data-available" />
					</kv-select-multi-options>
				</kv-dropdown>
			</Host>
		);
	}
}
