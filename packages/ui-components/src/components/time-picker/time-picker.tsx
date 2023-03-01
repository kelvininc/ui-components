import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { isEmpty, merge } from 'lodash-es';
import { ITextField } from '../text-field/text-field.types';
import {
	APPLY_BUTTON_ERROR_TOOLTIP_TEXT,
	DEFAULT_SELECTED_TIME_KEY,
	DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS,
	DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG,
	ETimePickerView,
	FULL_RANGE_SIZE
} from './time-picker.config';
import { ComputePositionConfig } from '@floating-ui/dom';
import { EComponentSize, ETooltipPosition, ICalendarAdvanceTime, SelectedRange } from '../../types';
import { IRelativeTimePickerOption, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { CUSTOMIZE_INTERVAL_KEY, DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS } from '../relative-time-picker/relative-time-picker.config';
import { getDefaultTimezone, getTimezoneOffset, getTimezonesNames } from '../../utils/date.helper';
import { ITimePicker, ITimePickerEvents, ITimePickerTime } from './time-picker.types';
import {
	buildCustomIntervalTimeRange,
	buildTooltipText,
	getAbsoluteTimezonedDates,
	getLast24HoursRange,
	getRelativeTimeInputText,
	getRelativeTimeLabel,
	hasRangeChanged
} from './time-picker.helper';
import { CALENDAR_DATE_TIME_MASK, DEFAULT_HEADER_TITLE } from '../absolute-time-picker/absolute-time-picker.config';
import { IRelativeTimeInput, IAbsoluteSelectedRangeDates } from '../absolute-time-picker/absolute-time-picker.types';
import dayjs from 'dayjs';

@Component({
	tag: 'kv-time-picker',
	styleUrl: 'time-picker.scss',
	shadow: false
})
export class KvTimePicker implements ITimePicker, ITimePickerEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownPositionOptions?: Partial<ComputePositionConfig> = DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) showCalendar?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedTimeState?: ITimePickerTime;
	/** @inheritdoc */
	@Prop({ reflect: true }) relativeTimePickerOptions?: IRelativeTimePickerOption[][] = DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedTimezone?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: string[] = getTimezonesNames();
	/** @inheritdoc */
	@Prop({ reflect: true }) disableTimezoneSelection?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayCustomizeInterval?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayTimezoneDropdown?: boolean = true;

	// Defines what content is being displayed
	@State() timePickerView: ETimePickerView = ETimePickerView.RelativeTimePicker;
	// Current selected option
	@State() selectedTimeOption: ITimePickerTime;
	// Current selected Timezone
	@State() selectedTimezoneOption: ITimePickerTimezone;
	// Controls the apply button state
	@State() applyButtonDisabled: boolean = true;
	// Dropdown open state
	@State() dropdownOpen: boolean = false;
	// Defines the calendar initial date if needed
	@State() calendarInitialDate: string;
	// Apply button tooltip text
	@State() applyButtontooltipText: string = '';
	// Defines if calendar is locked when the user is in full view and clicked customize interval
	@State() calendarViewLocked: boolean = false;

	/** @inheritdoc */
	@Event() timeRangeChange: EventEmitter<ITimePickerTime>;
	/** @inheritdoc */
	@Event() dropdownStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;

	@Watch('selectedTimeState')
	handleSelectTimeStateChange(timeState: ITimePickerTime) {
		this.selectedTimeOption = timeState;
	}

	@Watch('selectedTimezone')
	handleSelectedTimezoneChange(timezone: string) {
		this.selectedTimezoneOption = {
			name: timezone,
			offset: getTimezoneOffset(timezone)
		};
	}

	componentWillLoad() {
		if (isEmpty(this.selectedTimeState)) {
			this.selectedTimeOption = {
				key: DEFAULT_SELECTED_TIME_KEY,
				range: getLast24HoursRange(),
				timezone: this.getSelectedTimezone()
			};
		}
	}

	private getSelectedTimezone = (): ITimePickerTimezone | undefined => {
		if (this.selectedTimezoneOption !== undefined) {
			return this.selectedTimezoneOption;
		}

		const defaultTimezone = getDefaultTimezone();
		if (this.timezones.includes(defaultTimezone)) {
			return {
				name: defaultTimezone,
				offset: getTimezoneOffset(defaultTimezone)
			};
		}

		return undefined;
	};

	private onDropdownChange = (event: CustomEvent<boolean>) => {
		this.dropdownOpen = event.detail;
		this.dropdownStateChange.emit(event.detail);
	};

	private onSelectedRelativeTimeChange = (event: CustomEvent<ICalendarAdvanceTime>) => {
		const timeOption = event.detail;
		const [from, to] = timeOption.range;
		this.selectedTimeOption = {
			key: timeOption.key,
			range: [dayjs(from).format(CALENDAR_DATE_TIME_MASK), dayjs(to).format(CALENDAR_DATE_TIME_MASK)],
			timezone: this.getSelectedTimezone()
		};
		this.calendarViewLocked = false;
		this.applyButtonDisabled = false;
	};

	private onClickSeeCustomInterval = (event: CustomEvent<string>) => {
		const key = event.detail;
		this.applyButtonDisabled = true;
		if (this.selectedTimeOption && this.selectedTimeOption.key !== CUSTOMIZE_INTERVAL_KEY) {
			this.selectedTimeOption = {
				key: key,
				range: [],
				timezone: this.getSelectedTimezone()
			};
		}

		if (!this.showCalendar) {
			this.timePickerView = ETimePickerView.AbsoluteTimePicker;
		} else {
			this.calendarViewLocked = true;
		}
	};

	private onSelectedTimezoneChange = (event: CustomEvent<ITimePickerTimezone>) => {
		const timezone = event.detail;
		this.selectedTimezoneOption = timezone;
		this.applyButtonDisabled = false;
	};

	private onClickApply = () => {
		const payload = {
			key: this.selectedTimeOption.key,
			range: getAbsoluteTimezonedDates(this.selectedTimeOption.range),
			timezone: this.getSelectedTimezone()
		};
		this.timeRangeChange.emit(payload);
		this.dropdownStateChange.emit(false);
		this.applyButtonDisabled = true;
		this.dropdownOpen = false;
	};

	private onClickBack = () => {
		this.applyButtontooltipText = '';
		this.applyButtonDisabled = true;
		this.calendarViewLocked = false;
		if (!isEmpty(this.selectedTimeState)) {
			this.selectedTimeOption = this.selectedTimeState;
		} else {
			this.selectedTimeOption = {
				key: DEFAULT_SELECTED_TIME_KEY,
				range: getLast24HoursRange(),
				timezone: this.getSelectedTimezone()
			};
		}
		this.timePickerView = ETimePickerView.RelativeTimePicker;
	};

	private onClickCancel = (event: CustomEvent<MouseEvent>) => {
		this.applyButtontooltipText = '';
		if (!isEmpty(this.selectedTimeState)) {
			this.selectedTimeOption = this.selectedTimeState;
		} else {
			this.selectedTimeOption = {
				key: DEFAULT_SELECTED_TIME_KEY,
				range: getLast24HoursRange(),
				timezone: this.getSelectedTimezone()
			};
		}
		this.cancelClicked.emit(event);
		this.applyButtonDisabled = true;
		this.dropdownOpen = false;
	};

	private onShowCalendarClick = () => {
		if (!this.calendarViewLocked) {
			const currentValue = this.showCalendar;
			this.timePickerView = currentValue ? ETimePickerView.RelativeTimePicker : ETimePickerView.FullView;
			this.showCalendar = !currentValue;
		}
	};

	private getRelativeTimeInputConfig(): IRelativeTimeInput | undefined {
		if (this.selectedTimeOption?.key !== CUSTOMIZE_INTERVAL_KEY) {
			return getRelativeTimeInputText(this.relativeTimePickerOptions, this.selectedTimeOption, this.getSelectedTimezone().name);
		}

		return undefined;
	}

	private handleRelativeTimeConfigReset = () => {
		this.calendarViewLocked = true;
		this.selectedTimeOption = {
			key: CUSTOMIZE_INTERVAL_KEY,
			range: [],
			timezone: this.getSelectedTimezone()
		};
	};

	private handleAbsoluteDatesChange = ({ detail }: CustomEvent<IAbsoluteSelectedRangeDates>) => {
		const range = detail.range;
		if (!this.calendarViewLocked) {
			this.calendarViewLocked = true;
		}

		if (range.length === 2) {
			this.applyButtonDisabled = false;
		}

		if (hasRangeChanged(range, this.selectedTimeOption.range)) {
			this.selectedTimeOption = {
				key: CUSTOMIZE_INTERVAL_KEY,
				range: range,
				timezone: this.getSelectedTimezone()
			};

			this.updateApplyButtonConfig(range);
		}
	};

	// Components config methods
	private updateApplyButtonConfig = (range: SelectedRange) => {
		if (range && range.length === FULL_RANGE_SIZE) {
			this.applyButtontooltipText = '';
			this.applyButtonDisabled = false;
		} else {
			this.applyButtontooltipText = APPLY_BUTTON_ERROR_TOOLTIP_TEXT;
		}
	};

	private getDropdownInputValue = (): string | undefined => {
		if (this.selectedTimeState?.key === CUSTOMIZE_INTERVAL_KEY) {
			return buildCustomIntervalTimeRange(this.selectedTimeState.range);
		}

		const key = isEmpty(this.selectedTimeState) ? DEFAULT_SELECTED_TIME_KEY : this.selectedTimeState?.key;
		return getRelativeTimeLabel(key, this.relativeTimePickerOptions);
	};

	private getTextFieldTooltip = (): string | undefined => {
		if (this.selectedTimeOption?.key === CUSTOMIZE_INTERVAL_KEY) {
			return buildTooltipText(this.selectedTimeOption, this.timezones);
		}
	};

	private getFormattedSelectedTime = (): string | undefined => {
		if (!this.showCalendar || (this.showCalendar && this.selectedTimeOption?.key === CUSTOMIZE_INTERVAL_KEY)) {
			return DEFAULT_HEADER_TITLE;
		}

		return getRelativeTimeLabel(this.selectedTimeOption?.key, this.relativeTimePickerOptions);
	};

	private getInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG, this.inputConfig, {
			value: this.getDropdownInputValue(),
			tooltipConfig: { text: this.getTextFieldTooltip() }
		});
	};

	render() {
		const dropdownPositionConfig = this.dropdownPositionOptions;
		const inputConfig = this.getInputConfig();
		return (
			<Host>
				<div class="time-range-container">
					<kv-dropdown
						isOpen={this.dropdownOpen}
						onOpenStateChange={this.onDropdownChange}
						inputConfig={inputConfig}
						options={dropdownPositionConfig}
						disabled={this.disabled}
					>
						<div class="content">
							<div
								class={{
									'content-wrapper': true,
									'content-wrapper--relative': this.timePickerView === ETimePickerView.RelativeTimePicker,
									'content-wrapper--absolute': this.timePickerView === ETimePickerView.AbsoluteTimePicker,
									'content-wrapper--full-view': this.timePickerView === ETimePickerView.FullView
								}}
							>
								<div
									class={{
										'relative-range': true,
										'relative-range--visible': this.timePickerView === ETimePickerView.RelativeTimePicker || this.timePickerView === ETimePickerView.FullView,
										'relative-range--full-view': this.timePickerView === ETimePickerView.FullView
									}}
								>
									<kv-relative-time-picker
										options={this.relativeTimePickerOptions}
										timezones={this.timezones}
										selectedTimezone={this.selectedTimezone}
										selectedTimeKey={this.selectedTimeOption?.key}
										customizeIntervalOptionVisible={this.displayCustomizeInterval}
										timezoneSelectVisible={this.displayTimezoneDropdown}
										disableTimezoneSelection={this.disableTimezoneSelection}
										onCustomizeIntervalClicked={this.onClickSeeCustomInterval}
										onSelectedRelativeTimeChange={this.onSelectedRelativeTimeChange}
										onTimezoneChange={this.onSelectedTimezoneChange}
									/>
								</div>
								<div
									class={{
										'calendar-range': true,
										'calendar-range--visible': this.timePickerView === ETimePickerView.AbsoluteTimePicker,
										'calendar-range--full-view': this.timePickerView === ETimePickerView.FullView
									}}
								>
									<kv-absolute-time-picker
										headerTitle={this.getFormattedSelectedTime()}
										selectedRangeDates={this.selectedTimeOption?.range}
										relativeTimeConfig={this.getRelativeTimeInputConfig()}
										initialDate={this.calendarInitialDate}
										displayBackButton={this.timePickerView === ETimePickerView.AbsoluteTimePicker}
										onBackButtonClicked={this.onClickBack}
										onSelectRangeDatesChange={this.handleAbsoluteDatesChange}
										onRelativeTimeConfigReset={this.handleRelativeTimeConfigReset}
										onRelativeTimeConfigChange={this.handleAbsoluteDatesChange}
									/>
								</div>
							</div>
							<div class="footer">
								<div class="toggle-wrapper">
									{this.timePickerView !== ETimePickerView.AbsoluteTimePicker && (
										<div class="show-calendar-toggle">
											<kv-switch-button
												checked={this.showCalendar}
												size={EComponentSize.Small}
												onClick={this.onShowCalendarClick}
												disabled={this.calendarViewLocked}
											/>
											<div class="toggle-text">Show Calendar</div>
										</div>
									)}
								</div>
								<div class="actions">
									<kv-action-button-text type={EActionButtonType.Tertiary} size={EComponentSize.Small} text="Cancel" onClickButton={this.onClickCancel} />
									<kv-tooltip text={this.applyButtonDisabled ? this.applyButtontooltipText : ''} position={ETooltipPosition.TopStart}>
										<kv-action-button-text
											type={EActionButtonType.Primary}
											size={EComponentSize.Small}
											text="Apply"
											disabled={this.applyButtonDisabled}
											onClickButton={this.onClickApply}
										/>
									</kv-tooltip>
								</div>
							</div>
						</div>
					</kv-dropdown>
				</div>
			</Host>
		);
	}
}
