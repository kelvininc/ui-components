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
import { EComponentSize, ETooltipPosition, SelectedRange } from '../../types';
import { IRelativeTimePickerOption, ITimePickerRelativeTime, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { CUSTOMIZE_INTERVAL_KEY, DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS } from '../relative-time-picker/relative-time-picker.config';
import { getDefaultTimezone, getTimezoneOffset, getTimezonesNames } from '../../utils/date.helper';
import { ITimePicker, ITimePickerEvents, ITimePickerTime } from './time-picker.types';
import {
	buildCustomIntervalTimeRange,
	buildTooltipText,
	createTimestampInTimezoneFromFormattedDate,
	getAbsoluteTimePickerRangeDates,
	getLast24HoursRange,
	getRelativeTimeInputText,
	getRelativeTimeLabel,
	getTimestampFromDateRange,
	hasRangeChanged,
	validateNewRange
} from './time-picker.helper';
import { CALENDAR_DATE_TIME_MASK, DEFAULT_HEADER_TITLE } from '../absolute-time-picker/absolute-time-picker.config';
import { IRelativeTimeInput, IAbsoluteSelectedRangeDates } from '../absolute-time-picker/absolute-time-picker.types';

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
	@Prop({ reflect: true, mutable: true }) showCalendar?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedTimeOption?: ITimePickerTime;
	/** @inheritdoc */
	@Prop({ reflect: true }) relativeTimePickerOptions?: IRelativeTimePickerOption[][] = DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: string[] = getTimezonesNames();
	/** @inheritdoc */
	@Prop({ reflect: true }) disableTimezoneSelection?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayCustomizeInterval?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayTimezoneDropdown?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMinDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMaxDate?: string;

	// Defines what content is being displayed
	@State() timePickerView: ETimePickerView = ETimePickerView.RelativeTimePicker;
	// Current selected option
	@State() selectedTimeState: ITimePickerTime;
	// Dropdown open state
	@State() dropdownOpen: boolean = false;
	// Defines the calendar initial date if needed
	@State() calendarInitialDate: string;
	// Apply button tooltip text
	@State() applyButtontooltipText: string = '';
	// Defines if calendar is locked when the user is in full view and clicked customize interval
	@State() calendarViewLocked: boolean = false;
	// Defines if the timezone dropdown is visible in the input wrapper
	@State() timezoneSelectionContentVisible = false;

	/** @inheritdoc */
	@Event() timeRangeChange: EventEmitter<ITimePickerTime>;
	/** @inheritdoc */
	@Event() dropdownStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;
	/** @inheritdoc */
	@Event() showCalendarStateChange: EventEmitter<boolean>;

	@Watch('selectedTimeOption')
	handleSelectTimeStateChange(timeState: ITimePickerTime) {
		this.selectedTimeState = timeState;
	}

	@Watch('showCalendar')
	handleShowCalendarChange() {
		this.syncShowCalendarViewState();
	}

	componentWillLoad() {
		if (isEmpty(this.selectedTimeOption)) {
			this.resetDefaultSelectedTimeState();
		} else {
			if (isEmpty(this.selectedTimeState)) {
				this.selectedTimeState = this.selectedTimeOption;
			}
		}
		this.syncShowCalendarViewState();
	}

	private syncShowCalendarViewState() {
		this.timePickerView = this.showCalendar ? ETimePickerView.FullView : ETimePickerView.RelativeTimePicker;
	}

	private resetDefaultSelectedTimeState = () => {
		this.selectedTimeState = {
			key: DEFAULT_SELECTED_TIME_KEY,
			range: getLast24HoursRange(),
			timezone: this.getSelectedTimezone()
		};
	};

	private getSelectedTimezone = (): ITimePickerTimezone | undefined => {
		if (this.selectedTimeState !== undefined) {
			return this.selectedTimeState.timezone;
		}

		const defaultTimezone = getDefaultTimezone();
		if (this.timezones.includes(defaultTimezone)) {
			return {
				name: defaultTimezone,
				offset: getTimezoneOffset(defaultTimezone)
			};
		}
	};

	private onDropdownChange = ({ detail: isDropdownOpen }: CustomEvent<boolean>) => {
		this.dropdownOpen = isDropdownOpen;
		this.dropdownStateChange.emit(isDropdownOpen);
		if (!this.isApplyButtonDisabled() && !isDropdownOpen) {
			if (!isEmpty(this.selectedTimeOption)) {
				this.selectedTimeState = this.selectedTimeOption;
			} else {
				this.resetDefaultSelectedTimeState();
			}

			if (this.timePickerView !== ETimePickerView.FullView) {
				this.timePickerView = ETimePickerView.RelativeTimePicker;
			}
		}
		this.timezoneSelectionContentVisible = false;
	};

	private onSelectedRelativeTimeChange = ({ detail: timeOption }: CustomEvent<ITimePickerRelativeTime>) => {
		this.selectedTimeState = {
			key: timeOption.key,
			range: timeOption.range,
			timezone: this.getSelectedTimezone()
		};
		this.calendarViewLocked = false;
	};

	private onClickSeeCustomInterval = ({ detail: key }: CustomEvent<string>) => {
		if (this.selectedTimeState && this.selectedTimeState.key !== CUSTOMIZE_INTERVAL_KEY) {
			this.selectedTimeState = {
				key,
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

	private onSelectedTimezoneChange = ({ detail: timezone }: CustomEvent<ITimePickerTimezone>) => {
		const previousTimezone = this.selectedTimeState.timezone.name;
		const range =
			this.selectedTimeState.key === CUSTOMIZE_INTERVAL_KEY
				? getTimestampFromDateRange(this.selectedTimeState.range, previousTimezone, timezone.name)
				: this.selectedTimeState.range;

		this.selectedTimeState = {
			...this.selectedTimeState,
			range,
			timezone
		};
	};

	private onClickApply = () => {
		this.timeRangeChange.emit(this.selectedTimeState);
		this.dropdownStateChange.emit(false);
		this.dropdownOpen = false;
		this.timezoneSelectionContentVisible = false;

		if (this.timePickerView !== ETimePickerView.FullView) {
			this.timePickerView = ETimePickerView.RelativeTimePicker;
			this.calendarViewLocked = false;
		}
	};

	private onClickBack = () => {
		this.undoLastChanges();
		this.calendarViewLocked = false;
	};

	private onClickCancel = (event: CustomEvent<MouseEvent>) => {
		this.undoLastChanges();
		this.cancelClicked.emit(event);
		this.dropdownOpen = false;
		this.timezoneSelectionContentVisible = false;
	};

	private undoLastChanges = () => {
		if (!isEmpty(this.selectedTimeOption)) {
			this.selectedTimeState = this.selectedTimeOption;
		} else {
			this.resetDefaultSelectedTimeState();
		}

		this.applyButtontooltipText = '';
		if (this.timePickerView !== ETimePickerView.FullView) {
			this.timePickerView = ETimePickerView.RelativeTimePicker;
		}
	};

	private onShowCalendarClick = () => {
		if (!this.calendarViewLocked) {
			this.timePickerView = this.showCalendar ? ETimePickerView.RelativeTimePicker : ETimePickerView.FullView;
			this.showCalendarStateChange.emit(!this.showCalendar);
			this.showCalendar = !this.showCalendar;
		}
	};

	private getRelativeTimeInputConfig(): IRelativeTimeInput | undefined {
		if (this.selectedTimeState?.key !== CUSTOMIZE_INTERVAL_KEY) {
			return getRelativeTimeInputText(this.relativeTimePickerOptions, this.selectedTimeState, this.getSelectedTimezone().name);
		}
	}

	private handleRelativeTimeConfigReset = () => {
		this.calendarViewLocked = true;
		this.selectedTimeState = {
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

		const [from, to] = range;
		const timezone = this.getSelectedTimezone();
		const fromDate = createTimestampInTimezoneFromFormattedDate(from, timezone.name, CALENDAR_DATE_TIME_MASK);
		const toDate = createTimestampInTimezoneFromFormattedDate(to, timezone.name, CALENDAR_DATE_TIME_MASK);

		if (hasRangeChanged([fromDate, toDate], this.selectedTimeState.range)) {
			this.selectedTimeState = {
				key: CUSTOMIZE_INTERVAL_KEY,
				range: range.length === FULL_RANGE_SIZE ? [fromDate, toDate] : [fromDate],
				timezone
			};

			this.updateApplyButtonConfig(range);
		}
	};

	private displayInputWrapperContent = () => {
		this.timezoneSelectionContentVisible = true;
	};

	// Components config methods
	private isApplyButtonDisabled() {
		if (
			this.selectedTimeState.range.length === FULL_RANGE_SIZE &&
			hasRangeChanged(this.selectedTimeState.range, this.selectedTimeOption?.range) &&
			validateNewRange(this.selectedTimeState.range)
		) {
			return false;
		}

		if (this.selectedTimeState && this.selectedTimeOption && this.selectedTimeState.timezone.name !== this.selectedTimeOption.timezone.name) {
			return false;
		}

		return true;
	}

	private updateApplyButtonConfig = (range: SelectedRange) => {
		if (range && range.length === FULL_RANGE_SIZE) {
			this.applyButtontooltipText = '';
		} else {
			this.applyButtontooltipText = APPLY_BUTTON_ERROR_TOOLTIP_TEXT;
		}
	};

	private getDropdownInputValue = (): string | undefined => {
		if (this.selectedTimeOption?.key === CUSTOMIZE_INTERVAL_KEY) {
			return buildCustomIntervalTimeRange(this.selectedTimeOption.range, this.selectedTimeOption.timezone.name);
		}

		const key = isEmpty(this.selectedTimeOption) ? DEFAULT_SELECTED_TIME_KEY : this.selectedTimeOption?.key;
		return getRelativeTimeLabel(key, this.relativeTimePickerOptions);
	};

	private getTextFieldTooltip = (): string | undefined => {
		if (this.selectedTimeState?.key === CUSTOMIZE_INTERVAL_KEY) {
			return buildTooltipText(this.selectedTimeState, this.timezones);
		}
	};

	private getFormattedSelectedTime = (): string | undefined => {
		if (this.selectedTimeState?.key === CUSTOMIZE_INTERVAL_KEY) {
			return DEFAULT_HEADER_TITLE;
		}

		return getRelativeTimeLabel(this.selectedTimeState?.key, this.relativeTimePickerOptions);
	};

	private getInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG, this.inputConfig, {
			value: this.getDropdownInputValue(),
			tooltipConfig: { text: this.getTextFieldTooltip() }
		});
	};

	/**
	 * Returns the apply button tooltip helptext
	 * @returns apply button help text
	 */
	private getApplyButtonTooltipText = (): string => {
		return this.isApplyButtonDisabled() ? this.applyButtontooltipText : '';
	};

	/**
	 * Transforms the timestamp into absolute-time-picker dates in the format: YYYY/MM/DD HH:mm:ss
	 * @returns formated dates to the absolute time picker component
	 */
	private getAbsoluteRange = (): string[] => {
		return getAbsoluteTimePickerRangeDates(this.selectedTimeState);
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
										'relative-range--full-view': this.timePickerView === ETimePickerView.FullView
									}}
								>
									<kv-relative-time-picker
										options={this.relativeTimePickerOptions}
										timezones={this.timezones}
										selectedTimezone={this.getSelectedTimezone().name}
										selectedTimeKey={this.selectedTimeState?.key}
										customIntervalOptionEnabled={this.displayCustomizeInterval}
										timezoneSelectionEnabled={this.displayTimezoneDropdown}
										timezoneContentVisible={this.timezoneSelectionContentVisible}
										disableTimezoneSelection={this.disableTimezoneSelection}
										onCustomizeIntervalClicked={this.onClickSeeCustomInterval}
										onSelectedRelativeTimeChange={this.onSelectedRelativeTimeChange}
										onTimezoneChange={this.onSelectedTimezoneChange}
										onTimezoneInputClicked={this.displayInputWrapperContent}
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
										selectedRangeDates={this.getAbsoluteRange()}
										relativeTimeConfig={this.getRelativeTimeInputConfig()}
										initialDate={this.calendarInitialDate}
										displayBackButton={this.timePickerView === ETimePickerView.AbsoluteTimePicker}
										onBackButtonClicked={this.onClickBack}
										onSelectRangeDatesChange={this.handleAbsoluteDatesChange}
										onRelativeTimeConfigReset={this.handleRelativeTimeConfigReset}
										onRelativeTimeConfigChange={this.handleAbsoluteDatesChange}
										calendarInputMaxDate={this.calendarInputMaxDate}
										calendarInputMinDate={this.calendarInputMinDate}
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
									<kv-tooltip text={this.getApplyButtonTooltipText()} position={ETooltipPosition.TopStart}>
										<kv-action-button-text
											type={EActionButtonType.Primary}
											size={EComponentSize.Small}
											text="Apply"
											disabled={this.isApplyButtonDisabled()}
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