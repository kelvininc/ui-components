import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents, IMultiSelectDropdownOption, IMultiSelectDropdownOptions } from './multi-select-dropdown.types';
import { buildSelectGroups, hasGroups } from '../select-group/select-group.helper';

import { MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.config';
import { getDropdownDisplayValue } from './multi-select-dropdown.helper';
import { isEmpty, isNil } from 'lodash-es';

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
	@Prop({ reflect: true }) options?: { [key: string]: IMultiSelectDropdownOption };
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedOptions?: { [key: string]: boolean } = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) filteredOptions?: { [key: string]: IMultiSelectDropdownOption };
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;

	/** @inheritdoc */
	@Event() optionsSelected: EventEmitter<{ [key: string]: boolean }>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;

	@State() _selectionDisplayValue: string;
	@State() _searchValue: string;
	@State() isOpen: boolean = false;

	private selectOption = (event: CustomEvent<string>) => {
		const option = event.detail;
		// triple bang for handling false, true and undefined
		const newOptions = { ...this.selectedOptions, [option]: !!!this.selectedOptions[option] };

		this.optionsSelected.emit(newOptions);
	};

	private calculateLabelValue() {
		if (this.displayValue?.length > 0) {
			this._selectionDisplayValue = this.displayValue;
		} else {
			this._selectionDisplayValue = getDropdownDisplayValue(this.options, this.selectedOptions);
		}
	}

	private openStateChangeHandler = ({ detail: openState }: CustomEvent<boolean>) => {
		this.isOpen = openState;

		if (!this.isOpen) {
			this._searchValue = '';
			this.searchChange.emit('');
		}
	};

	private onSearchChange = (event: CustomEvent<string>) => {
		this._searchValue = event.detail;
		this.searchChange.emit(event.detail);
	};

	private onClearSelection = () => {
		this.selectedOptions = {};
		this.selectionCleared.emit();
		this.calculateLabelValue();
	};

	private renderGroups = (groupNames: string[], groups: Record<string, IMultiSelectDropdownOption[]>) => {
		return groupNames.map(groupName => (
			<kv-select-group key={groupName} label={groupName}>
				{this.renderOptions(groups[groupName])}
			</kv-select-group>
		));
	};

	private renderOptions = (options: IMultiSelectDropdownOption[]) => {
		return options.map(option => (
			<kv-select-option
				label={option.label}
				value={option.value}
				disabled={option.disabled}
				selected={this.selectedOptions[option.value]}
				togglable={true}
				onItemSelected={this.selectOption}
			/>
		));
	};

	private getCurrentOptions = (): IMultiSelectDropdownOptions => {
		if (!isNil(this.filteredOptions)) {
			return this.filteredOptions;
		}

		return this.options;
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

	private getInputConfig = (): Partial<ITextField> => ({
		label: this.label,
		value: this._selectionDisplayValue,
		loading: this.loading,
		icon: this.icon,
		disabled: this.disabled,
		required: this.required,
		placeholder: this.placeholder,
		state: this.errorState,
		helpText: this.helpText
	});

	render() {
		const groups = buildSelectGroups(this.getCurrentOptions());
		const groupNames = Object.keys(groups);
		const isSelectionClearable = !isEmpty(this.getCurrentOptions()) && this.selectionClearable;
		const isSelectionClearEnabled = Object.keys(this.selectedOptions).length > 0;

		return (
			<Host>
				<kv-dropdown inputConfig={this.getInputConfig()} isOpen={this.isOpen} onOpenStateChange={this.openStateChangeHandler} exportparts="input">
					<kv-select
						searchable={this.searchable}
						searchValue={this._searchValue}
						selectionClearable={isSelectionClearable}
						selectionClearEnabled={isSelectionClearEnabled}
						clearSelectionLabel={this.clearSelectionLabel}
						onClearSelection={this.onClearSelection}
						onSearchChange={this.onSearchChange}
						maxHeight={this.maxHeight}
						minHeight={this.minHeight}
					>
						{isEmpty(this.getCurrentOptions()) && <kv-select-option class="no-data" label={this.noDataAvailableLabel} value={null} />}
						{hasGroups(groupNames) ? this.renderGroups(groupNames, groups) : this.renderOptions(Object.values(this.getCurrentOptions()))}
					</kv-select>
				</kv-dropdown>
			</Host>
		);
	}
}
