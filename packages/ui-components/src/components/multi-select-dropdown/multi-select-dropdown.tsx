import { Component, Host, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { isEmpty, isNil } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { IMultiSelectDropdown, IMultiSelectDropdownEvents, IMultiSelectDropdownOption, MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE } from './multi-select-dropdown.types';

@Component({
	tag: 'kv-multi-select-dropdown',
	styleUrl: 'multi-select-dropdown.scss',
	shadow: true
})
export class KvMultiSelectDropdown implements IMultiSelectDropdown, IMultiSelectDropdownEvents {
	/** (required) The text to display as the dropdown placeholder */
	@Prop({ reflect: true }) placeholder?: string;
	/** (optional) If `true` the dropdown is opened */
	@Prop({ reflect: true }) isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** (optional) The icon to display on the dropdown */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** (optional) If `true` the dropdown is searchable */
	@Prop({ reflect: true }) searchable?: boolean;
	/** (optional) If `true` dropdown items can be cleared */
	@Prop({ reflect: true }) selectionClearable?: boolean;
	/** (optional) If `true` dropdown requires a value to be selected */
	@Prop({ reflect: true }) required?: boolean;
	/** (optional) The text to display on the dropdown label */
	@Prop({ reflect: true }) label?: string;
	/** (optional) The text to display on the dropdown  */
	@Prop({ reflect: true }) value?: string;
	/** (required) The error state for the dropdown */
	@Prop({ reflect: true }) errorState?: EValidationState;
	/** (optional) The text to display as help text  */
	@Prop({ reflect: true }) helpText?: string;
	/** (optional) If `true` the dropdown is disabled */
	@Prop({ reflect: true }) disabled?: boolean;
	/** (required) The text to display when there are no options */
	@Prop({ reflect: true }) noDataAvailableLabel?: string = MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE;
	/** (optional) The object with the dropdown options */
	@Prop({ reflect: true }) options?: { [key: string]: IMultiSelectDropdownOption };
	/** (optional) The array of selected options */
	@Prop({ reflect: true }) selectedOptions?: string[] = [];

	/** Emitted when the selected options change */
	@Event() optionsSelected: EventEmitter<string[]>;
	/** Emitted when the search term changes */
	@Event() searchChange: EventEmitter<string>;

	private selectOption = (event: CustomEvent<string>) => {
		const option = event.detail;
		const currentOptionIndex = this.selectedOptions.findIndex(selectedOption => selectedOption === option);

		if (currentOptionIndex === -1) {
			this.selectedOptions.push(option);
		} else {
			this.selectedOptions.splice(currentOptionIndex, 1);
		}
		this.calculateLabelValue();

		this.optionsSelected.emit(this.selectedOptions);
	};

	private calculateLabelValue() {
		if (isEmpty(this.options)) {
			this.value = undefined;
			return;
		}

		this.value = this.selectedOptions.reduce((acc, option, currentIndex) => {
			if (isNil(this.options[option])) {
				if (currentIndex === this.selectedOptions.length - 1) {
					acc = acc.slice(0, acc.length - 2);
				}
				return acc;
			}
			return `${acc + this.options[option].label + (currentIndex !== this.selectedOptions.length - 1 ? ', ' : '')}`;
		}, '');
	}

	private openStateChangeHandler = (event: CustomEvent<boolean>) => {
		this.isOpen = event.detail;
	};

	private onSearchChange = (event: CustomEvent<string>) => {
		this.searchChange.emit(event.detail);
	};

	private onClearSelection = () => {
		this.selectedOptions = [];
		this.calculateLabelValue();
	};

	componentWillLoad() {
		this.calculateLabelValue();
	}

	@Watch('options')
	optionsChangeHandler() {
		this.calculateLabelValue();
	}

	render() {
		return (
			<Host>
				<kv-dropdown
					isOpen={this.isOpen}
					label={this.label}
					value={this.value}
					loading={this.loading}
					icon={this.icon}
					disabled={this.disabled}
					required={this.required}
					placeholder={this.placeholder}
					errorState={this.errorState}
					helpText={this.helpText}
					onOpenStateChange={this.openStateChangeHandler}
				>
					<kv-dropdown-list
						searchable={!isEmpty(this.options) && this.searchable}
						selectionClearable={!isEmpty(this.options) && this.selectionClearable}
						selectionClearEnabled={this.selectedOptions.length > 0}
						onClearSelection={this.onClearSelection}
						onSearchChange={this.onSearchChange}
					>
						{isEmpty(this.options) && <kv-dropdown-list-item class="no-data" label={this.noDataAvailableLabel} value={null} />}
						{this.options &&
							Object.values(this.options).map(option => (
								<kv-dropdown-list-item
									label={option.label}
									value={option.value}
									selected={this.selectedOptions.includes(option.value)}
									togglable={true}
									onItemSelected={this.selectOption}
								/>
							))}
					</kv-dropdown-list>
				</kv-dropdown>
			</Host>
		);
	}
}
