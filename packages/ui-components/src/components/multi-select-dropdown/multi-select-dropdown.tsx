import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents, IMultiSelectDropdownOptions } from './multi-select-dropdown.types';

import { MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.config';
import { getDropdownDisplayValue } from './multi-select-dropdown.helper';
import { EComponentSize } from '../../types';

@Component({
	tag: 'kv-multi-select-dropdown',
	styleUrl: 'multi-select-dropdown.scss',
	shadow: true
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
	@Prop({ reflect: true }) options?: IMultiSelectDropdownOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: Record<string, boolean> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: IMultiSelectDropdownOptions = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) inputSize?: EComponentSize = EComponentSize.Large;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<Record<string, boolean>>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _selectionDisplayValue: string | undefined;
	@State() _searchValue: string;
	@State() _isOpen: boolean = false;

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

	private onClearSelection = () => {
		this.selectedOptions = {};
		this.selectionCleared.emit();
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

	render() {
		return (
			<Host>
				<kv-dropdown inputConfig={this.inputConfig} isOpen={this._isOpen} onOpenStateChange={this.openStateChangeHandler} disabled={this.disabled} exportparts="input">
					<kv-select-multi-options
						options={this.options}
						filteredOptions={this.filteredOptions}
						selectedOptions={this.selectedOptions}
						noDataAvailableLabel={this.noDataAvailableLabel}
						searchable={this.searchable}
						searchValue={this._searchValue}
						selectionClearable={this.selectionClearable}
						clearSelectionLabel={this.clearSelectionLabel}
						maxHeight={this.maxHeight}
						minHeight={this.minHeight}
						onSearchChange={this.onSearchChange}
						onSelectionCleared={this.onClearSelection}
						onOptionsSelected={this.selectOption}
					/>
				</kv-dropdown>
			</Host>
		);
	}
}
