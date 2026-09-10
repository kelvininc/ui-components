import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EActionButtonType } from '../action-button/action-button.types';
import { isEmpty, isNumber, merge } from 'lodash-es';
import { ITextField } from '../text-field/text-field.types';
import {
	APPLY_BUTTON_ERROR_TOOLTIP_TEXT,
	APPLY_BUTTON_SINGLE_ERROR_TOOLTIP_TEXT,
	DEFAULT_SELECTED_TIME_KEY,
	DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS,
	DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG,
	FULL_RANGE_SIZE,
	SINGLE_RANGE_SIZE,
	TIME_PICKER_PORTAL_Z_INDEX
} from './time-picker.config';
import { ETimePickerView } from './time-picker.types';
import { ComputePositionConfig } from '@floating-ui/dom';
import { EAbsoluteTimePickerMode, EComponentSize, ETooltipPosition, ITimezoneOffset, SelectedRange } from '../../types';
import { IRelativeTimePickerOption, ITimePickerRelativeTime, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { getDefaultTimezone, getDefaultTimezones, getTimezoneOffset } from '../../utils/date/date.helper';
import { ITimePicker, ITimePickerEvents, ITimePickerTimeState, ITimePickerTime, SelectedTimestamp } from './time-picker.types';
import {
	buildCustomIntervalTimeRange,
	buildTooltipText,
	createTimestampInTimezoneFromFormattedDate,
	getAbsoluteTimePickerRangeDates,
	getLast24HoursRange,
	getRelativeTimeInputText,
	getRelativeTimeLabel,
	getRelativeViewHeight,
	getTimePickerEventPayload,
	getTimestampFromDateRange,
	hasRangeChanged,
	validateNewRange
} from './time-picker.helper';
import { CALENDAR_DATE_TIME_MASK, DATETIME_INPUT_MASK, DEFAULT_HEADER_TITLE } from '../absolute-time-picker/absolute-time-picker.config';
import { IRelativeTimeInput, IAbsoluteSelectedRangeDates } from '../absolute-time-picker/absolute-time-picker.types';
import dayjs from 'dayjs';
import { CUSTOM_TIME_RANGE_KEY, DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS, buildOptionRange, buildTimestampRange, getRelativeTimeOption } from '../../utils/relative-time';

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
	@Prop({ reflect: true, mutable: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement | null = null;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) showCalendar?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectedTimeOption?: ITimePickerTimeState | ITimePickerTime;
	/** @inheritdoc */
	@Prop({ reflect: true }) relativeTimePickerOptions?: IRelativeTimePickerOption[][] = DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: ITimezoneOffset[] = getDefaultTimezones();
	/** @inheritdoc */
	@Prop({ reflect: true }) disableTimezoneSelection?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayCustomizeInterval?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayTimezoneDropdown?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) displayCalendarToggle?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarMode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Range;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMinDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMaxDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = TIME_PICKER_PORTAL_Z_INDEX;
	/** @inheritdoc */
	@Prop({ reflect: false }) tooltipPosition?: ETooltipPosition = ETooltipPosition.TopStart;

	// Defines what content is being displayed
	@State() timePickerView: ETimePickerView = ETimePickerView.RelativeTimePicker;
	// Current selected option
	@State() selectedTimeState: ITimePickerTimeState;
	// Apply button tooltip text
	@State() applyButtontooltipText: string = '';
	// Defines if calendar is locked when the user is in full view and clicked customize interval
	@State() calendarViewLocked: boolean = false;
	// Defines if the timezone dropdown is visible in the input wrapper
	@State() timezoneSelectionContentVisible = false;
	@State() internalDropdownsOpen: boolean = false;

	/** @inheritdoc */
	@Event() timeRangeChange: EventEmitter<ITimePickerTime>;
	/** @inheritdoc */
	@Event() dropdownStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;
	/** @inheritdoc */
	@Event() showCalendarStateChange: EventEmitter<boolean>;

	@Watch('selectedTimeOption')
	handleSelectTimeStateChange() {
		this.syncTimeState();
	}

	@Watch('showCalendar')
	handleShowCalendarChange(value: boolean) {
		this.syncShowCalendarViewState(value);

		// Hiding the calendar also hides Apply, so a pending range would be left with no way to confirm it
		// — and `calendarViewLocked` would stay set, disabling the toggle. Fall back to the committed value.
		// Order matters: the view is reset first so `undoLastChanges` takes its non-full-view branch.
		if (!value) {
			this.undoLastChanges();
		}
	}

	componentWillLoad() {
		this.syncTimeState();
		this.syncShowCalendarViewState(this.showCalendar);
	}

	private syncShowCalendarViewState(value: boolean) {
		this.timePickerView = value ? ETimePickerView.FullView : ETimePickerView.RelativeTimePicker;
	}

	/**
	 * Keeps `selectedTimeState` coherent with the prop, on mount and on every change.
	 *
	 * Clearing the prop resets to the default state rather than spreading nothing. The
	 * watcher used to assign `{ ...timeState, timezone }` unconditionally, so a consumer
	 * setting `selectedTimeOption` back to `undefined` left an object with no `range` —
	 * and everything that reads `selectedTimeState.range` (the calendar range, the
	 * tooltip, `hasRangeChanged`) then saw `undefined`. The render threw, and because a
	 * throwing render never patches the vdom, `isOpen` stopped reaching the panel and the
	 * dropdown could not be opened again for the life of that instance.
	 */
	private syncTimeState() {
		if (isEmpty(this.selectedTimeOption)) {
			this.resetDefaultSelectedTimeState();
		} else {
			this.syncTimeStateWithTimeOption();
		}
	}

	private syncTimeStateWithTimeOption() {
		this.selectedTimeState = {
			...this.selectedTimeOption,
			timezone: this.selectedTimeOption.timezone ?? this.getSelectedTimezone()
		};
	}

	private resetDefaultSelectedTimeState = () => {
		// Only preselect the default option when the provided options actually contain it
		const hasDefaultOption = getRelativeTimeOption(DEFAULT_SELECTED_TIME_KEY, this.relativeTimePickerOptions) !== undefined;

		this.selectedTimeState = hasDefaultOption
			? {
					key: DEFAULT_SELECTED_TIME_KEY,
					range: getLast24HoursRange(),
					timezone: this.getSelectedTimezone()
				}
			: {
					key: '',
					range: [],
					timezone: this.getSelectedTimezone()
				};
	};

	private getSelectedTimezone = (): ITimePickerTimezone => {
		if (this.selectedTimeState?.timezone !== undefined) {
			return this.selectedTimeState.timezone;
		}

		const defaultTimezone = getDefaultTimezone();
		return {
			name: defaultTimezone,
			offset: getTimezoneOffset(defaultTimezone)
		};
	};

	private onDropdownChange = ({ detail: isDropdownOpen }: CustomEvent<boolean>) => {
		this.isOpen = isDropdownOpen;
		this.dropdownStateChange.emit(isDropdownOpen);
		if (!this.isApplyButtonDisabled() && !isDropdownOpen) {
			if (isEmpty(this.selectedTimeOption)) {
				this.resetDefaultSelectedTimeState();
			}

			if (this.timePickerView !== ETimePickerView.FullView) {
				this.timePickerView = ETimePickerView.RelativeTimePicker;
			}
		}
		this.timezoneSelectionContentVisible = false;
	};

	/**
	 * Syncs the draft selection. Also fires from `kv-relative-time-picker`'s periodic refresh as a
	 * "now"-relative range moves, so it must never commit — see `onRelativeTimeOptionClicked`.
	 */
	private onSelectedRelativeTimeChange = ({ detail: timeOption }: CustomEvent<ITimePickerRelativeTime>) => {
		this.selectedTimeState = {
			key: timeOption.key,
			range: timeOption.range,
			timezone: this.getSelectedTimezone()
		};
		this.calendarViewLocked = false;
	};

	/**
	 * A click on a relative option is the confirmation, so it commits and closes — unless a calendar is
	 * on screen, where Apply confirms instead.
	 */
	private onRelativeTimeOptionClicked = ({ detail: timeOption }: CustomEvent<ITimePickerRelativeTime>) => {
		if (this.isCalendarVisible()) {
			return;
		}

		this.calendarViewLocked = false;
		this.commitTimeState({
			key: timeOption.key,
			range: timeOption.range,
			timezone: this.getSelectedTimezone()
		});
	};

	private onClickSeeCustomInterval = ({ detail: key }: CustomEvent<string>) => {
		if (this.selectedTimeState && this.selectedTimeState.key !== CUSTOM_TIME_RANGE_KEY) {
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
		const timeState: ITimePickerTimeState = {
			...this.selectedTimeState,
			range: this.getRangeInTimezone(timezone),
			timezone
		};

		// Committing needs a calendar-free view — there is no Apply button to confirm with — and a
		// complete selection. When the given options omit the default key nothing is preselected, so the
		// range can still be empty here, and emitting that would break `ITimePickerTime` and hand a
		// consumer an unusable range. Either way the panel stays open: the timezone modifies the current
		// selection rather than being the selection, and is kept as draft until an option makes it valid.
		if (!this.isCalendarVisible() && validateNewRange(timeState.range, this.getExpectedRangeSize())) {
			this.emitTimeRangeChange(timeState);
			return;
		}

		this.selectedTimeState = timeState;
	};

	/**
	 * Re-anchors the selected range to a newly picked timezone. A custom interval keeps its wall-clock
	 * dates; a relative option is recomputed from its definition so its boundaries land in the new zone.
	 */
	private getRangeInTimezone = (timezone: ITimePickerTimezone): SelectedTimestamp => {
		const { key, range } = this.selectedTimeState;

		if (key === CUSTOM_TIME_RANGE_KEY) {
			return range?.length > 0 ? getTimestampFromDateRange(range, this.getSelectedTimezone().name, timezone.name) : range;
		}

		const option = getRelativeTimeOption(key, this.relativeTimePickerOptions);
		return option !== undefined ? buildTimestampRange(buildOptionRange(option, timezone.name)) : range;
	};

	private onClickApply = () => {
		this.commitTimeState(this.selectedTimeState);
	};

	/** Publishes a selection without dismissing the panel */
	private emitTimeRangeChange = (timeState: ITimePickerTimeState) => {
		// Assigned first so `getSelectedTimezone` resolves against the state being emitted
		this.selectedTimeState = timeState;
		this.timeRangeChange.emit(getTimePickerEventPayload(timeState, this.getSelectedTimezone()));
	};

	/** Publishes a selection and dismisses the panel */
	private commitTimeState = (timeState: ITimePickerTimeState) => {
		this.emitTimeRangeChange(timeState);
		this.dropdownStateChange.emit(false);
		this.isOpen = false;
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
		this.isOpen = false;
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
			this.calendarViewLocked = false;
			this.timePickerView = ETimePickerView.RelativeTimePicker;
		}
	};

	private onShowCalendarClick = () => {
		if (!this.calendarViewLocked) {
			this.showCalendarStateChange.emit(!this.showCalendar);
		}
	};

	private getRelativeTimeInputConfig(): IRelativeTimeInput | undefined {
		if (this.calendarMode !== EAbsoluteTimePickerMode.Single && this.selectedTimeState?.key !== CUSTOM_TIME_RANGE_KEY) {
			return getRelativeTimeInputText(this.relativeTimePickerOptions, this.selectedTimeState, this.getSelectedTimezone().name);
		}
	}

	private handleRelativeTimeConfigReset = () => {
		this.calendarViewLocked = true;
		this.selectedTimeState = {
			key: CUSTOM_TIME_RANGE_KEY,
			range: [],
			timezone: this.getSelectedTimezone()
		};
	};

	private handleAbsoluteDatesChange = ({ detail }: CustomEvent<IAbsoluteSelectedRangeDates>) => {
		const range = detail.range;
		if (!this.calendarViewLocked) {
			this.calendarViewLocked = true;
		}

		const timezone = this.getSelectedTimezone();
		const newRange = range.map(date => createTimestampInTimezoneFromFormattedDate(date, timezone.name, CALENDAR_DATE_TIME_MASK)) as SelectedTimestamp;

		if (hasRangeChanged(newRange, this.selectedTimeState.range)) {
			this.selectedTimeState = {
				key: CUSTOM_TIME_RANGE_KEY,
				range: newRange,
				timezone
			};

			this.updateApplyButtonConfig(range);
		}
	};

	private displayInputWrapperContent = () => {
		this.timezoneSelectionContentVisible = true;
	};

	private getCalendarLimitDatesFormatted = (date: number): string | undefined => {
		if (!isNumber(date)) return;

		const selectedTimezone = this.getSelectedTimezone();
		return dayjs(date).tz(selectedTimezone.name).format(DATETIME_INPUT_MASK);
	};

	// Components config methods

	/**
	 * Apply/Cancel exist to confirm a calendar selection, where a half-picked range is not yet a valid
	 * choice. In the plain option list the click is itself the confirmation, so they are dropped.
	 */
	private isCalendarVisible = (): boolean => {
		return this.timePickerView !== ETimePickerView.RelativeTimePicker;
	};

	private isCalendarToggleVisible = (): boolean => {
		return this.displayCalendarToggle && this.timePickerView !== ETimePickerView.AbsoluteTimePicker;
	};

	private isFooterVisible = (): boolean => {
		return this.isCalendarToggleVisible() || this.isCalendarVisible();
	};

	private isSingleCustomInterval = (): boolean => {
		return this.calendarMode === EAbsoluteTimePickerMode.Single && this.selectedTimeState?.key === CUSTOM_TIME_RANGE_KEY;
	};

	private getExpectedRangeSize = (): number => {
		return this.isSingleCustomInterval() ? SINGLE_RANGE_SIZE : FULL_RANGE_SIZE;
	};

	private isApplyButtonDisabled() {
		const { range: stateRange, timezone: selectedTimezone } = this.selectedTimeState;
		const expectedRangeSize = this.getExpectedRangeSize();

		if (stateRange.length > 0 && validateNewRange(stateRange, expectedRangeSize)) {
			if (this.selectedTimeOption?.range?.length > 0) {
				const { range: propRange } = this.selectedTimeOption;

				if (stateRange.length === expectedRangeSize && hasRangeChanged(stateRange, propRange)) {
					return false;
				}
			}

			if (this.selectedTimeOption?.timezone?.name !== selectedTimezone?.name) {
				return false;
			}
		}

		return true;
	}

	private updateApplyButtonConfig = (range: SelectedRange) => {
		if (range && range.length === this.getExpectedRangeSize()) {
			this.applyButtontooltipText = '';
		} else {
			this.applyButtontooltipText = this.isSingleCustomInterval() ? APPLY_BUTTON_SINGLE_ERROR_TOOLTIP_TEXT : APPLY_BUTTON_ERROR_TOOLTIP_TEXT;
		}
	};

	private getDropdownInputValue = (): string | undefined => {
		if (this.selectedTimeOption?.key === CUSTOM_TIME_RANGE_KEY) {
			return buildCustomIntervalTimeRange(this.selectedTimeOption.range, this.selectedTimeOption.timezone.name);
		}

		if (!isEmpty(this.selectedTimeOption)) {
			return getRelativeTimeLabel(this.selectedTimeOption?.key, this.relativeTimePickerOptions);
		}

		return '';
	};

	private getTextFieldTooltip = (): string | undefined => {
		if (this.selectedTimeState?.key === CUSTOM_TIME_RANGE_KEY) {
			return buildTooltipText(this.selectedTimeState.range, this.getSelectedTimezone(), this.timezones);
		}
	};

	private getFormattedSelectedTime = (): string | undefined => {
		if (this.selectedTimeState?.key === CUSTOM_TIME_RANGE_KEY) {
			return DEFAULT_HEADER_TITLE;
		}

		return getRelativeTimeLabel(this.selectedTimeState?.key, this.relativeTimePickerOptions);
	};

	private getInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG, this.inputConfig, {
			value: this.getDropdownInputValue(),
			tooltipConfig: { text: this.getTextFieldTooltip(), position: this.tooltipPosition },
			inputDisabled: this.disabled
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
	 * @returns formatted dates to the absolute time picker component
	 */
	private getAbsoluteRange = (): string[] => {
		const defaultTimezone = this.getSelectedTimezone();
		return getAbsoluteTimePickerRangeDates(this.selectedTimeState, defaultTimezone, this.calendarMode);
	};

	private onInternalDropdownsStateChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.internalDropdownsOpen = openState;
	};

	render() {
		const dropdownPositionConfig = this.dropdownPositionOptions;
		const inputConfig = this.getInputConfig();

		return (
			<Host>
				<kv-dropdown
					isOpen={this.isOpen}
					onOpenStateChange={this.onDropdownChange}
					actionElement={this.actionElement}
					inputConfig={inputConfig}
					options={dropdownPositionConfig}
					disabled={this.disabled}
					zIndex={this.zIndex}
					clickOutsideClose={!this.internalDropdownsOpen}
				>
					<slot name="right-slot" slot="right-slot" />
					<slot name="left-slot" slot="left-slot" />
					<slot name="dropdown-action" slot="dropdown-action" />
					<div class="time-range-content">
						<div
							class={{
								'content-wrapper': true,
								'content-wrapper--relative': this.timePickerView === ETimePickerView.RelativeTimePicker,
								'content-wrapper--absolute': this.timePickerView === ETimePickerView.AbsoluteTimePicker,
								'content-wrapper--full-view': this.timePickerView === ETimePickerView.FullView
							}}
							style={{
								['--relative-view-height']: `${getRelativeViewHeight(
									this.relativeTimePickerOptions,
									this.displayCustomizeInterval,
									this.displayTimezoneDropdown
								)}px`
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
									onRelativeTimeOptionClicked={this.onRelativeTimeOptionClicked}
									onTimezoneChange={this.onSelectedTimezoneChange}
									onTimezoneInputClicked={this.displayInputWrapperContent}
									onTimezoneDropdownStateChange={this.onInternalDropdownsStateChange}
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
									mode={this.calendarMode}
									headerTitle={this.getFormattedSelectedTime()}
									selectedDates={this.getAbsoluteRange()}
									relativeTimeConfig={this.getRelativeTimeInputConfig()}
									displayBackButton={this.timePickerView === ETimePickerView.AbsoluteTimePicker}
									onBackButtonClicked={this.onClickBack}
									onSelectedDatesChange={this.handleAbsoluteDatesChange}
									onRelativeTimeConfigReset={this.handleRelativeTimeConfigReset}
									onRelativeTimeConfigChange={this.handleAbsoluteDatesChange}
									calendarInputMinDate={this.getCalendarLimitDatesFormatted(this.calendarInputMinDate)}
									calendarInputMaxDate={this.getCalendarLimitDatesFormatted(this.calendarInputMaxDate)}
								/>
							</div>
						</div>
						{this.isFooterVisible() && (
							<div class="footer">
								{/* Always rendered so `space-between` keeps the actions right-aligned when the toggle is hidden */}
								<div class="toggle-wrapper">
									{this.isCalendarToggleVisible() && (
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
								{this.isCalendarVisible() && (
									<div class="actions">
										<kv-action-button-text type={EActionButtonType.Secondary} size={EComponentSize.Small} text="Cancel" onClickButton={this.onClickCancel} />
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
								)}
							</div>
						)}
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
