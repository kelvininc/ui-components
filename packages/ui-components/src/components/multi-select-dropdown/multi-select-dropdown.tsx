import { Component, Host, h, Prop, Event, EventEmitter, Watch, State } from '@stencil/core';
import { isEmpty } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents, IMultiSelectDropdownOption } from './multi-select-dropdown.types';
import { MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.config';
import { buildDropdownGroups } from '../dropdown-group/dropdown-group.helper';
import { getDropdownDisplayValue } from './multi-select-dropdown.helper';

@Component({
	tag: 'kv-multi-select-dropdown',
	styleUrl: 'multi-select-dropdown.scss',
	shadow: true
})
export class KvMultiSelectDropdown implements IMultiSelectDropdown, IMultiSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean;
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
	@Event() optionsSelected: EventEmitter<{ [key: string]: boolean }>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;

	@State() _selectionDisplayValue: string;
	@State() _searchValue: string;

	private selectOption = (event: CustomEvent<string>) => {
		const option = event.detail;
		// triple bang for handling false, true and undefined
		this.selectedOptions[option] = !!!this.selectedOptions[option];
		this.calculateLabelValue();

		this.optionsSelected.emit(this.selectedOptions);
	};

	private calculateLabelValue() {
		if (this.displayValue?.length > 0) {
			this._selectionDisplayValue = this.displayValue;
		} else {
			this._selectionDisplayValue = getDropdownDisplayValue(this.options, this.selectedOptions);
		}
	}

	private openStateChangeHandler = (event: CustomEvent<boolean>) => {
		this.isOpen = event.detail;

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
			<kv-dropdown-group key={groupName} label={groupName}>
				{this.renderOptions(groups[groupName])}
			</kv-dropdown-group>
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

	render() {
		const groups = buildDropdownGroups(this.options);
		const groupNames = Object.keys(groups);
		const isSelectionClearable = !isEmpty(this.options) && this.selectionClearable;
		const isSelectionClearEnabled = Object.keys(this.selectedOptions).length > 0;
		const hasGroups = groupNames.length > 1;

		return (
			<Host>
				<kv-dropdown
					isOpen={this.isOpen}
					label={this.label}
					value={this._selectionDisplayValue}
					loading={this.loading}
					icon={this.icon}
					disabled={this.disabled}
					required={this.required}
					placeholder={this.placeholder}
					errorState={this.errorState}
					helpText={this.helpText}
					onOpenStateChange={this.openStateChangeHandler}
				>
					<kv-select
						searchable={this.searchable}
						searchValue={this._searchValue}
						selectionClearable={isSelectionClearable}
						selectionClearEnabled={isSelectionClearEnabled}
						clearSelectionLabel={this.clearSelectionLabel}
						onClearSelection={this.onClearSelection}
						onSearchChange={this.onSearchChange}
					>
						{isEmpty(this.options) && <kv-select-option class="no-data" label={this.noDataAvailableLabel} value={null} />}
						{hasGroups ? this.renderGroups(groupNames, groups) : this.renderOptions(Object.values(this.options))}
					</kv-select>
				</kv-dropdown>
			</Host>
		);
	}
}
