import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EAbsoluteTimeError, EActionButtonType, EComponentSize, EIconName, EInputSource, SelectedRange } from '../../types';
import dayjs from 'dayjs';
import {
	CALENDAR_INPUT_MAX_DATE,
	CALENDAR_INPUT_MIN_DATE,
	CALENDAR_MASK,
	DATETIME_INPUT_MASK,
	DATETIME_INPUT_MASK_PATTERN,
	DATE_INPUT_PLACEHOLDER
} from './absolute-time-picker.config';
import { fromDateInput, fromISO, isDateBefore, isDateSame, newDate } from '../../utils/date';
import { isEmpty, isEqual } from 'lodash-es';
import {
	ERelativeTimeInputMode,
	EAbsoluteTimePickerMode,
	IAbsoluteTimePicker,
	IAbsoluteTimePickerEvents,
	IRelativeTimeInput,
	IAbsoluteSelectedRangeDates,
	ITypedDates
} from './absolute-time-picker.types';
import {
	buildSelectedDatesEventPayload,
	formatSelectedDate,
	getFirstCalendarInitialDate,
	getFromDateInputState,
	getMaximumDateFromDayClick,
	getMinimumDateFromDayClick,
	getSecondCalendarInitialDate,
	getSingleDateTimeInputState,
	getCustomIntervalTitle,
	getToDateTimeInputState,
	getTypedSelection,
	getTypedDateInputState,
	isEndDateAtStartOfDay,
	parseTypedDateTime
} from './absolute-time-picker.helper';
import { IClickDateEvent } from '../calendar/calendar.types';
import { DATE_FORMAT } from '../calendar/calendar.config';

@Component({
	tag: 'kv-absolute-time-picker',
	styleUrl: 'absolute-time-picker.scss',
	shadow: false
})
export class KvAbsoluteTimePicker implements IAbsoluteTimePicker, IAbsoluteTimePickerEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) headerTitle?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) displayBackButton?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) mode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Range;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) relativeTimeConfig?: IRelativeTimeInput;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMinDate?: string = CALENDAR_INPUT_MIN_DATE;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMaxDate?: string = CALENDAR_INPUT_MAX_DATE;
	/** @inheritdoc */
	@Prop({ reflect: false }) error?: EAbsoluteTimeError;

	/** @inheritdoc */
	@Event() selectedDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** @inheritdoc */
	@Event() backButtonClicked: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigReset: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** @inheritdoc */
	@Event() inputValidityChange: EventEmitter<boolean>;

	/** Input values inserted by the user on the date and time input */
	@State() fromInputValue: string = '';
	@State() toInputValue: string = '';
	@State() singleInputValue: string = '';
	/** Shared hovered date between calendars for range mode */
	@State() hoveredDate: string = '';
	/** First calendar displayed month (Second calendar is displayedMonth + 1) */
	@State() displayedMonth: dayjs.Dayjs = fromDateInput(this.initialDate) ?? fromDateInput(new Date());
	/** Used to force focus the from and to input */
	@State() fromInputFocused: boolean = true;
	@State() toInputFocused: boolean = false;
	/**
	 * Used to define when the input dates came from the relative time picker where the input
	 * can be an absolute date or a text (ex: last 24 hours)
	 */
	@State() inputMode: ERelativeTimeInputMode = ERelativeTimeInputMode.Date;
	/** Calendars max and minimum dates */
	@State() minDate: string = '';
	@State() maxDate: string = '';

	/** Validity last reported through `inputValidityChange` */
	private lastInputValidity = true;
	/** Dates of the last `selectedDatesChange`, until the parent sends them back */
	private lastEmittedDates?: SelectedRange;

	@Watch('selectedDates')
	handleSelectedRangeDatesChange(value: string[] = [], oldValue?: string[]) {
		// A parent re-render sends a new array with the same dates, and then the echo of the dates just emitted.
		// Neither carries anything new, and rewriting the inputs would wipe what is still being typed.
		const isEcho = isEqual(value, this.lastEmittedDates);
		this.lastEmittedDates = undefined;

		if (isEcho || isEqual(value, oldValue)) {
			return;
		}

		this.syncInputsWithSelectedDates(value);
	}

	@Watch('relativeTimeConfig')
	handleRelativeTimeConfigInput(newValue: IRelativeTimeInput, oldValue?: IRelativeTimeInput) {
		// kv-time-picker builds a new config on every render
		if (oldValue !== undefined && isEqual(newValue, oldValue)) {
			return;
		}

		if (isEmpty(newValue)) {
			this.inputMode = ERelativeTimeInputMode.Date;
			if (!this.selectedDates || this.selectedDates.length === 0) {
				this.setInputValues('', '');
				this.displayedMonth = fromDateInput(new Date());
			} else {
				// The inputs still show the relative texts. `selectedDates` can be updated before this prop,
				// when its watcher skips the inputs, so they are filled from it here.
				this.syncInputsWithSelectedDates(this.selectedDates);
			}
			return;
		}

		this.inputMode = newValue.mode;
		this.setInputValues(newValue.from, newValue.to);
		// Only sync the displayed month from selectedDates when initialDate is not explicitly set
		if (!this.initialDate) {
			const [from] = this.selectedDates ?? [];
			if (from) {
				const date = newDate(from);
				if (date.isValid()) {
					this.displayedMonth = date;
				}
			}
		}
	}

	@Watch('mode')
	handleModeChange() {
		// The inputs of the new mode are rendered empty
		this.syncInputsWithSelectedDates(this.selectedDates);
	}

	componentWillLoad() {
		// Watchers do not run for initial prop values, so sync the inputs and the displayed month with preselected dates
		if (!isEmpty(this.relativeTimeConfig)) {
			this.handleRelativeTimeConfigInput(this.relativeTimeConfig);
		}
		this.syncInputsWithSelectedDates(this.selectedDates);
		this.syncDisplayedMonthWithSelectedDates();
	}

	componentDidRender() {
		// Emitted after rendering, so a parent reacting to it never updates while it is itself rendering
		const isValid = this.inputMode === ERelativeTimeInputMode.Text || getTypedSelection(this.mode, this.getInputValues()) !== undefined;

		if (isValid !== this.lastInputValidity) {
			this.lastInputValidity = isValid;
			this.inputValidityChange.emit(isValid);
		}
	}

	private syncInputsWithSelectedDates = (value: string[] = []) => {
		if (value.length === 0) {
			this.resetInputValues();
			this.resetDateLimits();
			return;
		}

		if (this.mode === EAbsoluteTimePickerMode.Range) {
			if (isEmpty(this.relativeTimeConfig)) {
				const [from, to] = value;
				this.setInputValues(formatSelectedDate(from), formatSelectedDate(to));
			}
		} else {
			const [date] = value;
			this.singleInputValue = formatSelectedDate(date);
		}
	};

	private syncDisplayedMonthWithSelectedDates = () => {
		if (this.initialDate) {
			return;
		}

		const [from] = this.selectedDates ?? [];
		const date = newDate(from);
		if (from && date.isValid()) {
			this.displayedMonth = date;
		}
	};

	private setDateLimits = (min: string, max: string) => {
		this.minDate = min;
		this.maxDate = max;
	};

	private setInputValues = (from: string, to: string) => {
		this.fromInputValue = from;
		this.toInputValue = to;
	};

	private resetInputValues = () => {
		this.fromInputValue = '';
		this.toInputValue = '';
		this.singleInputValue = '';
	};

	private resetDateLimits = () => {
		this.minDate = '';
		this.maxDate = '';
	};

	private getInputValues = (): ITypedDates => ({
		from: this.fromInputValue,
		to: this.toInputValue,
		single: this.singleInputValue
	});

	private setInputValue = (inputSource: EInputSource, value: string) => {
		if (inputSource === EInputSource.From) {
			this.fromInputValue = value;
		} else if (inputSource === EInputSource.To) {
			this.toInputValue = value;
		} else {
			this.singleInputValue = value;
		}
	};

	private emitSelectRangeDatesChangeEvent = (dateA?: dayjs.Dayjs, dateB?: dayjs.Dayjs): void => {
		const range = buildSelectedDatesEventPayload(dateA, dateB);
		this.lastEmittedDates = range;
		this.selectedDatesChange.emit({
			range
		});
	};

	/** Emits the typed dates, unless an input holds an incomplete or invalid date */
	private emitTypedSelection = (): void => {
		const dates = getTypedSelection(this.mode, this.getInputValues());

		if (dates) {
			const [dateA, dateB] = dates;
			this.emitSelectRangeDatesChangeEvent(dateA, dateB);
		}
	};

	private handleBackClick = (event: MouseEvent) => {
		this.backButtonClicked.emit(event);
	};

	private onClickDate = ({ detail }: CustomEvent<IClickDateEvent>): void => {
		const date = detail.date;
		const clickedDate = fromISO(date);
		const inputDate = newDate(date);

		const fromDate = getMinimumDateFromDayClick(clickedDate, this.calendarInputMinDate);
		const toDate = getMaximumDateFromDayClick(clickedDate, this.calendarInputMaxDate);

		if (this.mode === EAbsoluteTimePickerMode.Range) {
			const [selectedStartDate, selectedEndDate] = this.selectedDates ?? [];

			if (!selectedStartDate) {
				this.displayedMonth = clickedDate.startOf('day');
				this.setInputValues(fromDate.format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(clickedDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(fromDate);
				return;
			}

			if (isDateSame(clickedDate, selectedStartDate)) {
				if (!selectedEndDate) {
					this.setInputValues(fromDate.format(DATETIME_INPUT_MASK), toDate.format(DATETIME_INPUT_MASK));
					this.resetDateLimits();
					this.emitSelectRangeDatesChangeEvent(fromDate, toDate);

					return;
				}

				this.resetInputValues();
				this.resetDateLimits();
				this.emitSelectRangeDatesChangeEvent();
				return;
			}

			if (selectedEndDate !== undefined) {
				this.displayedMonth = inputDate;
				this.setInputValues(fromDate.format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(inputDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(fromDate);
				return;
			}

			if (isDateBefore(clickedDate, selectedStartDate)) {
				this.displayedMonth = clickedDate;
				this.setInputValues(fromDate.format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(fromDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(fromDate);
				return;
			}

			this.setInputValues(newDate(selectedStartDate).format(DATETIME_INPUT_MASK), toDate.format(DATETIME_INPUT_MASK));
			this.resetDateLimits();
			this.emitSelectRangeDatesChangeEvent(fromISO(selectedStartDate), toDate);
			return;
		} else {
			this.displayedMonth = clickedDate;
			this.singleInputValue = fromDate.format(DATETIME_INPUT_MASK);
			this.emitSelectRangeDatesChangeEvent(fromDate);
		}
	};

	private handleClickBackMonth = () => {
		this.displayedMonth = this.displayedMonth.subtract(1, 'month');
		if (!isEmpty(this.relativeTimeConfig)) {
			this.relativeTimeConfigReset.emit();
		}
	};

	private handleClickForwardMonth = () => {
		this.displayedMonth = this.displayedMonth.add(1, 'month');
		if (!isEmpty(this.relativeTimeConfig)) {
			this.relativeTimeConfigReset.emit();
		}
	};

	private handleHoveredDateChange = (event: CustomEvent<string>) => {
		if (this.mode === EAbsoluteTimePickerMode.Range) this.hoveredDate = event.detail;
	};

	private handleInputReset = () => {
		this.resetInputValues();
		this.inputMode = ERelativeTimeInputMode.Date;
		this.relativeTimeConfigReset.emit();
	};

	/** User date-time-input I/O event handlers */
	private handleOnFocusFromInput = () => {
		this.toInputFocused = false;
		this.fromInputFocused = true;
		const parsedFromInputDate = parseTypedDateTime(this.fromInputValue);
		const parsedToInputDate = parseTypedDateTime(this.toInputValue);

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (parsedFromInputDate) {
					this.displayedMonth = parsedFromInputDate;
				}
				this.emitTypedSelection();
			}
		} else {
			if (
				parsedFromInputDate &&
				((parsedToInputDate && parsedToInputDate.diff(parsedFromInputDate, 'month') > 0) || this.displayedMonth.diff(parsedFromInputDate, 'month') > 0)
			) {
				this.displayedMonth = parsedFromInputDate;
			}
		}
	};

	private handleOnFocusToInput = () => {
		this.toInputFocused = true;
		this.fromInputFocused = false;
		const parsedToInputDate = parseTypedDateTime(this.toInputValue);
		const parsedFromInputDate = parseTypedDateTime(this.fromInputValue);

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (parsedToInputDate && parsedFromInputDate && parsedFromInputDate.diff(parsedToInputDate, 'month') > 0) {
					this.displayedMonth = parsedToInputDate.subtract(1, 'month');
				}
				this.emitTypedSelection();
			}
		} else {
			if (
				parsedToInputDate &&
				((parsedFromInputDate && parsedToInputDate.diff(parsedFromInputDate, 'month') > 0) || this.displayedMonth.diff(parsedToInputDate, 'month') > 0)
			) {
				this.displayedMonth = parsedToInputDate.subtract(1, 'month');
			}
		}
	};

	private handleDateChange = (event: CustomEvent<string>, inputSource: EInputSource) => {
		const date = event.detail;
		// Kept even while incomplete or invalid, so the rendered value always matches what the input shows
		this.setInputValue(inputSource, date);

		const parsedDateTime = parseTypedDateTime(date);

		if (parsedDateTime) {
			if (inputSource === EInputSource.Single) {
				this.displayedMonth = parsedDateTime.startOf('day');
			} else if (inputSource === EInputSource.From) {
				this.handleFromInputDateChange(parsedDateTime);
			} else {
				this.handleToInputDateChange(parsedDateTime);
			}
		} else if (inputSource !== EInputSource.Single) {
			if (isEmpty(this.fromInputValue)) {
				this.minDate = '';
			}

			if (isEmpty(this.toInputValue)) {
				this.maxDate = '';
			}
		}

		this.emitTypedSelection();
	};

	private handleFromInputDateChange = (parsedDateTime: dayjs.Dayjs) => {
		const parsedDate = parsedDateTime.startOf('day');
		this.displayedMonth = parsedDate;
		if (!isEmpty(this.toInputValue)) {
			this.resetDateLimits();
		} else {
			this.toInputFocused = true;
			this.minDate = parsedDate.format(CALENDAR_MASK);
		}
	};

	private handleToInputDateChange = (parsedDateTime: dayjs.Dayjs) => {
		const parsedDate = parsedDateTime.startOf('day');
		this.displayedMonth = parsedDate.subtract(1, 'month');
		if (!isEmpty(this.fromInputValue)) {
			this.resetDateLimits();
		} else {
			this.maxDate = parsedDate.format(CALENDAR_MASK);
			this.fromInputFocused = true;
		}
	};

	private handleEndDateLostFocus = (event: CustomEvent<string>) => {
		const parsedDateTime = parseTypedDateTime(event.detail);

		if (parsedDateTime && isEndDateAtStartOfDay(parsedDateTime)) {
			const endOfDay = parsedDateTime.endOf('day');
			this.toInputValue = endOfDay.format(DATETIME_INPUT_MASK);
			this.displayedMonth = parsedDateTime.subtract(1, 'month');
			if (isEmpty(this.fromInputValue)) {
				this.fromInputFocused = true;
			}
			this.emitTypedSelection();
		}
	};

	/** Components config methods */
	private useInputMask = (): boolean => {
		return this.inputMode === ERelativeTimeInputMode.Date;
	};

	private getCalendarStringLimits = () => ({
		minDate: !isEmpty(this.minDate) ? this.minDate : dayjs(this.calendarInputMinDate, DATETIME_INPUT_MASK).format(DATE_FORMAT),
		maxDate: !isEmpty(this.maxDate) ? this.maxDate : dayjs(this.calendarInputMaxDate, DATETIME_INPUT_MASK).format(DATE_FORMAT)
	});

	private getCalendarTimestampLimits = () => ({
		minDate: !isEmpty(this.minDate) ? undefined : dayjs(this.calendarInputMinDate, DATETIME_INPUT_MASK).valueOf(),
		maxDate: !isEmpty(this.maxDate) ? undefined : dayjs(this.calendarInputMaxDate, DATETIME_INPUT_MASK).valueOf()
	});

	render() {
		const fromCalendarInitialDate = getFirstCalendarInitialDate(this.displayedMonth);
		const toCalendarInitialDate = getSecondCalendarInitialDate(this.displayedMonth);
		const headerTitle = this.headerTitle ?? getCustomIntervalTitle(this.mode);

		return (
			<Host>
				<div class="absolute-time-picker-container">
					{this.displayBackButton && (
						<div class="navigate-back" onClick={this.handleBackClick}>
							<kv-action-button-text text="Back" icon={EIconName.SlimRight} type={EActionButtonType.Text} size={EComponentSize.Small} />
						</div>
					)}
					{headerTitle && (
						<div class="header">
							<div class="title">{headerTitle}</div>
						</div>
					)}
					{this.mode === EAbsoluteTimePickerMode.Range ? (
						<div class="absolute-range-input">
							<kv-date-time-input
								inputName="from-input"
								useInputMask={this.useInputMask()}
								inputMaskPattern={DATETIME_INPUT_MASK_PATTERN}
								label="From"
								value={this.fromInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								highlighted={isEmpty(this.fromInputValue) && !this.toInputFocused}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.From)}
								onInputFocus={this.handleOnFocusFromInput}
								{...getTypedDateInputState(
									this.useInputMask() ? this.fromInputValue : undefined,
									getFromDateInputState(this.error, this.getCalendarTimestampLimits())
								)}
							/>
							<kv-date-time-input
								inputName="to-input"
								useInputMask={this.useInputMask()}
								inputMaskPattern={DATETIME_INPUT_MASK_PATTERN}
								label="To"
								value={this.toInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								highlighted={isEmpty(this.toInputValue) && !isEmpty(this.fromInputValue)}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.To)}
								onDateTimeBlur={this.handleEndDateLostFocus}
								onInputFocus={this.handleOnFocusToInput}
								{...getTypedDateInputState(
									this.useInputMask() ? this.toInputValue : undefined,
									getToDateTimeInputState(this.error, this.getCalendarTimestampLimits())
								)}
							/>
						</div>
					) : (
						<div class="absolute-point-input">
							<kv-date-time-input
								id="single-date-input"
								useInputMask
								inputMaskPattern={DATETIME_INPUT_MASK_PATTERN}
								label="Day & Hour"
								value={this.singleInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.Single)}
								{...getTypedDateInputState(this.singleInputValue, getSingleDateTimeInputState(this.error, this.getCalendarTimestampLimits()))}
							/>
						</div>
					)}
					<div class="calendars">
						<kv-calendar
							mode={this.mode}
							displayNextMonthArrow={false}
							displayPreviousMonthArrow
							selectedDates={this.selectedDates}
							hoveredDate={this.hoveredDate}
							initialDate={fromCalendarInitialDate}
							disabledDates={this.disabledDates}
							onClickDate={this.onClickDate}
							onChangeMonth={this.handleClickBackMonth}
							onHoveredDateChange={this.handleHoveredDateChange}
							{...this.getCalendarStringLimits()}
						/>
						<kv-calendar
							mode={this.mode}
							displayNextMonthArrow
							displayPreviousMonthArrow={false}
							selectedDates={this.selectedDates}
							hoveredDate={this.hoveredDate}
							initialDate={toCalendarInitialDate}
							disabledDates={this.disabledDates}
							onClickDate={this.onClickDate}
							onChangeMonth={this.handleClickForwardMonth}
							onHoveredDateChange={this.handleHoveredDateChange}
							{...this.getCalendarStringLimits()}
						/>
					</div>
				</div>
			</Host>
		);
	}
}
