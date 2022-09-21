import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { ISelectDate, ITextField } from '../../types';
import { ISingleDateSelectDropdown, ISingleDateSelectDropdownEvents } from './single-date-select-dropdown.types';
import { isEmpty, merge } from 'lodash-es';

import { DEFAULT_DATE_INPUT_CONFIG } from './single-date-select-dropdown.config';
import { formatDateTime } from '../../utils/date.helper';

@Component({
	tag: 'kv-single-date-select-dropdown',
	styleUrl: 'single-date-select-dropdown.scss',
	shadow: true
})
export class KvSingleDateSelectDropdown implements ISingleDateSelectDropdown, ISingleDateSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) dateMask?: string;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() selectDate: EventEmitter<ISelectDate>;

	@State() isDropdownOpen: boolean = false;

	private onDropdownChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.isDropdownOpen = openState;
	};

	private getInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_DATE_INPUT_CONFIG, this.inputConfig, { value: this.getFormattedSelectedDate() });
	};

	public getFormattedSelectedDate = (): string | undefined => {
		if (!isEmpty(this.selectedDate)) {
			return formatDateTime(this.selectedDate, this.dateMask);
		}
	};

	render() {
		return (
			<Host>
				<div class="single-date-select-dropdown">
					<kv-dropdown isOpen={this.isDropdownOpen} onOpenStateChange={this.onDropdownChange} inputConfig={this.getInputConfig()}>
						<div class="calendar-container">
							<kv-calendar-single-date-selector
								selectedDate={this.selectedDate}
								initialDate={this.initialDate}
								disabledDates={this.disabledDates}
								minDate={this.minDate}
								maxDate={this.maxDate}
							/>
						</div>
					</kv-dropdown>
				</div>
			</Host>
		);
	}
}
