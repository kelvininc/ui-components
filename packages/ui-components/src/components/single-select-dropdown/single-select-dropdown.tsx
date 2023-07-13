import { Component, Element, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState, ITextField } from '../text-field/text-field.types';
import { ISingleSelectDropdown, ISingleSelectDropdownEvents, ISingleSelectDropdownOption, ISingleSelectDropdownOptions } from './single-select-dropdown.types';
import { buildSelectGroups, hasGroups } from '../select-group/select-group.helper';
import { isEmpty, isNil } from 'lodash-es';

import { SINGLE_SELECT_CLEAR_SELECTION_LABEL, SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './single-select-dropdown.config';
import { CustomCssClass, EComponentSize } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';
import { getCssStyle } from '../utils';

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
	@Event() optionSelected: EventEmitter<string>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() selectionCleared: EventEmitter<void>;
	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@State() _selectedOption: string;
	@State() _selectedOptionLabel: string;
	@State() _searchValue: string;

	/** The Host's element reference */
	@Element() el: HTMLKvSingleSelectDropdownElement;

	private selectOption = (event: CustomEvent<string>) => {
		const selectedOption = event.detail;
		const option = this.options[selectedOption];

		this._selectedOption = option.value;
		this._selectedOptionLabel = option.label;
		this.optionSelected.emit(option.value);
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
			this._searchValue = '';
			this.searchChange.emit('');
		}

		this.openStateChange.emit(this.isOpen);
	};

	componentWillLoad() {
		this._selectedOption = this.selectedOption;
		this._selectedOptionLabel = this.displayValue;

		if (this.selectedOption?.length > 0 && !isEmpty(this.options)) {
			this.calculateLabelValue();
		}
	}

	@Watch('options')
	optionsChangeHandler() {
		this.calculateLabelValue();
	}

	@Watch('selectedOption')
	selectedOptionChangeHandler(newValue?: string) {
		this._selectedOption = newValue;
		this.calculateLabelValue();
	}

	@Watch('displayValue')
	displayValueChangeHandler(newValue?: string) {
		this._selectedOptionLabel = newValue;
		this.calculateLabelValue();
	}

	private calculateLabelValue() {
		if (isNil(this._selectedOption)) {
			this._selectedOptionLabel = undefined;
			return;
		}

		if (this.displayValue?.length > 0) {
			this._selectedOptionLabel = this.displayValue;
		} else {
			this._selectedOptionLabel = this.options[this._selectedOption]?.label;
		}
	}

	private renderGroups = (groupNames: string[], groups: Record<string, ISingleSelectDropdownOption[]>) => {
		return groupNames.map(groupName => (
			<kv-select-group key={groupName} label={groupName}>
				{this.renderOptions(groups[groupName])}
			</kv-select-group>
		));
	};

	private renderOptions = (options: ISingleSelectDropdownOption[]) => {
		return options.map(option => (
			<kv-select-option
				key={option.label}
				label={option.label}
				value={option.value}
				disabled={option.disabled}
				selected={option.value === this._selectedOption}
				onItemSelected={this.selectOption}
			/>
		));
	};

	private getInputConfig = (): Partial<ITextField> => ({
		label: this.label,
		value: this._selectedOptionLabel,
		loading: this.loading,
		icon: this.icon,
		disabled: this.disabled,
		required: this.required,
		placeholder: this.placeholder,
		state: this.errorState,
		helpText: this.helpText,
		size: this.inputSize
	});

	private getCurrentOptions = (): ISingleSelectDropdownOptions => {
		if (!isNil(this.filteredOptions)) {
			return this.filteredOptions;
		}

		return this.options;
	};

	private onClearSelection = () => {
		this._selectedOption = undefined;
		this.selectionCleared.emit();
		this.calculateLabelValue();
	};

	private getMaxHeight() {
		const maxHeight = getCssStyle(this.el, '--dropdown-max-height');
		return this.maxHeight ?? maxHeight;
	}

	render() {
		const groups = buildSelectGroups(this.getCurrentOptions());
		const groupNames = Object.keys(groups);

		const isSelectionClearable = !isEmpty(this.getCurrentOptions()) && this.selectionClearable;
		const isSelectionClearEnabled = !isEmpty(this._selectedOption);

		return (
			<Host>
				<kv-dropdown inputConfig={this.getInputConfig()} isOpen={this.isOpen} disabled={this.disabled} onOpenStateChange={this.openStateChangeHandler}>
					<div class={{ ...getClassMap(this.customClass), 'single-select-dropdown-slot': true }}>
						<kv-select
							searchValue={this._searchValue}
							searchable={this.searchable}
							selectionClearable={isSelectionClearable}
							selectionClearEnabled={isSelectionClearEnabled}
							clearSelectionLabel={this.clearSelectionLabel}
							onClearSelection={this.onClearSelection}
							onSearchChange={this.onSearchChange}
							searchPlaceholder={this.searchPlaceholder}
							maxHeight={this.getMaxHeight()}
							minHeight={this.minHeight}
						>
							{isEmpty(this.getCurrentOptions()) && <kv-select-option class="no-data" label={this.noDataAvailableLabel} value={null} />}
							{hasGroups(groupNames) ? this.renderGroups(groupNames, groups) : this.renderOptions(Object.values(this.getCurrentOptions()))}
						</kv-select>
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
