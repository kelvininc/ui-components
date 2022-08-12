import { Component, Host, h, Prop, Event, EventEmitter, Watch, State } from '@stencil/core';
import { isEmpty, isNil } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { ISingleSelectDropdown, ISingleSelectDropdownOptions, ISingleSelectDropdownEvents } from './single-select-dropdown.types';
import { SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './single-select-dropdown.config';

@Component({
	tag: 'kv-single-select-dropdown',
	styleUrl: 'single-select-dropdown.scss',
	shadow: true
})
export class KvSingleSelectDropdown implements ISingleSelectDropdown, ISingleSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = false;
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
	@Event() optionSelected: EventEmitter<string>;
	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;

	@State() _selectedOption: string;
	@State() _selectedOptionLabel: string;
	@State() _searchValue: string;

	private selectOption = (event: CustomEvent<string>) => {
		const selectedOption = event.detail;
		const option = this.options[selectedOption];

		this._selectedOption = option.value;
		this._selectedOptionLabel = option.label;
		this.optionSelected.emit(option.value);
		this.isOpen = false;
		this._searchValue = '';
		this.searchChange.emit('');
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

	render() {
		return (
			<Host>
				<kv-dropdown
					isOpen={this.isOpen}
					label={this.label}
					value={this._selectedOptionLabel}
					loading={this.loading}
					icon={this.icon}
					disabled={this.disabled}
					required={this.required}
					placeholder={this.placeholder}
					errorState={this.errorState}
					helpText={this.helpText}
					onOpenStateChange={this.openStateChangeHandler}
				>
					<kv-select searchValue={this._searchValue} searchable={this.searchable} onSearchChange={this.onSearchChange}>
						{isEmpty(this.options) && <kv-select-option class="no-data" label={this.noDataAvailableLabel} value={null} />}
						{Object.values(this.options).map(option => (
							<kv-select-option
								label={option.label}
								value={option.value}
								disabled={option.disabled}
								selected={option.value === this._selectedOption}
								onItemSelected={this.selectOption}
							/>
						))}
					</kv-select>
				</kv-dropdown>
			</Host>
		);
	}
}
