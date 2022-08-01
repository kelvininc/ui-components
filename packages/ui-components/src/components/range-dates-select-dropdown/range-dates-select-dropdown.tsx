import { Placement } from '@floating-ui/dom';
import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { isEmpty, merge } from 'lodash-es';
import { ITextField } from '../../types';
import { formatDatetime } from '../../utils/date.helper';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_END_DATE_INPUT_CONFIG, DEFAULT_START_DATE_INPUT_CONFIG } from './range-dates-select-dropdown.config';
import { IRangeDatesSelectDropdown, IRangeDatesSelectDropdownEvents } from './range-dates-select-dropdown.types';
import { ISelectRangeDates } from '../calendar-range-dates-selector/calendar-range-dates-selector.types';

@Component({
	tag: 'kv-range-dates-select-dropdown',
	styleUrl: 'range-dates-select-dropdown.scss',
	shadow: true
})
export class KvRangeDatesSelectDropdown implements IRangeDatesSelectDropdown, IRangeDatesSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) startInputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: true }) endInputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedRangeDates?: [] | [string] | [string, string] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) placement?: Placement = 'bottom';
	/** @inheritdoc */
	@Prop({ reflect: false }) startDateMask?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) endDateMask?: string;

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() selectRangeDates: EventEmitter<ISelectRangeDates>;

	@Element() el: HTMLKvRangeDatesSelectDropdownElement;

	private onToggleOpenState = () => {
		this.isOpen = !this.isOpen;
		this.openStateChange.emit(this.isOpen);
	};

	private getStartInputConfig = (): Partial<ITextField> => {
		return merge(DEFAULT_START_DATE_INPUT_CONFIG, this.startInputConfig);
	};

	private getEndInputConfig = (): Partial<ITextField> => {
		return merge(DEFAULT_END_DATE_INPUT_CONFIG, this.endInputConfig);
	};

	public getFormattedSelectedStartDate = (): string | undefined => {
		const [startDate] = this.selectedRangeDates;

		if (!isEmpty(startDate)) {
			return formatDatetime(startDate, this.startDateMask);
		}
	};

	public getFormattedSelectedEndDate = (): string | undefined => {
		const [, endDate] = this.selectedRangeDates;

		if (!isEmpty(endDate)) {
			return formatDatetime(endDate, this.endDateMask);
		}
	};

	public isStartSingleDateSelectDropdownFocus = (): boolean => {
		const [startDate] = this.selectedRangeDates;

		return this.isOpen && isEmpty(startDate);
	};

	public isEndSingleDateSelectDropdownFocus = (): boolean => {
		const [startDate, endDate] = this.selectedRangeDates;

		return this.isOpen && !isEmpty(startDate) && isEmpty(endDate);
	};

	private onOpenStateChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.isOpen = openState;
	};

	render() {
		return (
			<Host>
				<div class="range-dates-select-dropdown">
					<kv-dropdown-base isOpen={this.isOpen} placement={this.placement} onOpenStateChange={this.onOpenStateChange}>
						<div slot="action" class="inputs-container">
							<div class="start-single-date-select-dropdown">
								<kv-text-field
									{...this.getStartInputConfig()}
									value={this.getFormattedSelectedStartDate()}
									onClick={this.onToggleOpenState}
									uneditable
									forcedFocus={this.isStartSingleDateSelectDropdownFocus()}
								>
									<kv-icon
										slot="right-slot"
										name={this.isStartSingleDateSelectDropdownFocus() ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
										customClass="icon-24"
									/>
								</kv-text-field>
							</div>
							<div class="end-single-date-select-dropdown">
								<kv-text-field
									{...this.getEndInputConfig()}
									value={this.getFormattedSelectedEndDate()}
									onClick={this.onToggleOpenState}
									uneditable
									forcedFocus={this.isEndSingleDateSelectDropdownFocus()}
								>
									<kv-icon
										slot="right-slot"
										name={this.isEndSingleDateSelectDropdownFocus() ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
										customClass="icon-24"
									/>
								</kv-text-field>
							</div>
						</div>
						<div slot="list" class="calendar-container">
							<kv-calendar-range-dates-selector
								selectedRangeDates={this.selectedRangeDates}
								initialDate={this.initialDate}
								disabledDates={this.disabledDates}
								minDate={this.minDate}
								maxDate={this.maxDate}
							/>
						</div>
					</kv-dropdown-base>
				</div>
			</Host>
		);
	}
}
