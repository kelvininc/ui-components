import { ComputePositionConfig } from '@floating-ui/dom';
import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { isEmpty, merge } from 'lodash-es';
import { ITextField } from '../../types';
import { IInputConfig } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.types';
import { formatDateTime } from '../../utils/date.helper';
import { EIconName } from '../icon/icon.types';
import { DEFAULT_DROPDOWN_POSITION_OPTIONS, DEFAULT_END_DATE_INPUT_CONFIG, DEFAULT_START_DATE_INPUT_CONFIG } from './range-dates-select-dropdown.config';
import { IRangeDatesSelectDropdown, IRangeDatesSelectDropdownEvents } from './range-dates-select-dropdown.types';
import { ISelectRangeDates } from '../calendar-range-dates-selector/calendar-range-dates-selector.types';
import { SelectedRange } from '../../types';

@Component({
	tag: 'kv-range-dates-select-dropdown',
	styleUrl: 'range-dates-select-dropdown.scss',
	shadow: false
})
export class KvRangeDatesSelectDropdown implements IRangeDatesSelectDropdown, IRangeDatesSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) startInputConfig?: IInputConfig = {};
	/** @inheritdoc */
	@Prop({ reflect: false }) endInputConfig?: IInputConfig = {};
	/** @inheritdoc */
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedRangeDates?: SelectedRange;
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownPositionOptions?: Partial<ComputePositionConfig> = DEFAULT_DROPDOWN_POSITION_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: false }) autoClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() selectRangeDates: EventEmitter<ISelectRangeDates>;

	@Element() el: HTMLKvRangeDatesSelectDropdownElement;

	private onToggleOpenState = () => {
		if (!this.disabled) {
			this.isOpen = !this.isOpen;
			this.openStateChange.emit(this.isOpen);
		}
	};

	private getSelectedRangeRanges = (): SelectedRange => {
		return this.selectedRangeDates ?? [];
	};

	private getStartInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_START_DATE_INPUT_CONFIG, { disabled: this.disabled }, this.startInputConfig);
	};

	private getEndInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_END_DATE_INPUT_CONFIG, { disabled: this.disabled }, this.endInputConfig);
	};

	public getFormattedSelectedStartDate = (): string | undefined => {
		const [startDate] = this.getSelectedRangeRanges();
		if (!isEmpty(startDate)) {
			return formatDateTime(startDate, this.startInputConfig.dateMask);
		}
	};

	public getFormattedSelectedEndDate = (): string | undefined => {
		const [, endDate] = this.getSelectedRangeRanges();

		if (!isEmpty(endDate)) {
			return formatDateTime(endDate, this.endInputConfig.dateMask);
		}
	};

	public isStartSingleDateSelectDropdownFocus = (): boolean => {
		const [startDate] = this.getSelectedRangeRanges();

		return this.isOpen && isEmpty(startDate);
	};

	public isEndSingleDateSelectDropdownFocus = (): boolean => {
		const [startDate, endDate] = this.getSelectedRangeRanges();

		return this.isOpen && !isEmpty(startDate) && isEmpty(endDate);
	};

	private onOpenStateChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.isOpen = openState;
	};

	private onSelectRangeDates = ({ detail }: CustomEvent<ISelectRangeDates>) => {
		this.selectRangeDates.emit(detail);
		const { payload: newSelectRangeDates } = detail;
		const [startDate, endDate] = newSelectRangeDates;

		if (!this.autoClose) {
			return;
		}

		if (this.isOpen && !isEmpty(startDate) && !isEmpty(endDate)) {
			this.onToggleOpenState();
		}
	};

	render() {
		return (
			<Host>
				<div class="range-dates-select-dropdown">
					<kv-dropdown-base isOpen={this.isOpen} options={this.dropdownPositionOptions} onOpenStateChange={this.onOpenStateChange}>
						<div slot="action" class="inputs-container">
							<div class="start-single-date-select-dropdown">
								<kv-text-field
									{...this.getStartInputConfig()}
									value={this.getFormattedSelectedStartDate()}
									onFieldClick={this.onToggleOpenState}
									readonly
									actionIcon={this.isStartSingleDateSelectDropdownFocus() ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
									forcedFocus={this.isStartSingleDateSelectDropdownFocus()}
								/>
							</div>
							<div class="end-single-date-select-dropdown">
								<kv-text-field
									{...this.getEndInputConfig()}
									value={this.getFormattedSelectedEndDate()}
									onFieldClick={this.onToggleOpenState}
									readonly
									actionIcon={this.isEndSingleDateSelectDropdownFocus() ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
									forcedFocus={this.isEndSingleDateSelectDropdownFocus()}
								/>
							</div>
						</div>
						<div slot="list" class="range-dates-select-dropdown-calendar-container">
							<kv-calendar-range-dates-selector
								selectedRangeDates={this.getSelectedRangeRanges()}
								initialDate={this.initialDate}
								disabledDates={this.disabledDates}
								minDate={this.minDate}
								maxDate={this.maxDate}
								onSelectRangeDates={this.onSelectRangeDates}
							/>
						</div>
					</kv-dropdown-base>
				</div>
			</Host>
		);
	}
}
