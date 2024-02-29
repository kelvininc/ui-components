import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EComponentSize, EIconName, EInputSource } from '../../types';
import dayjs from 'dayjs';
import {
	CALENDAR_DATE_TIME_MASK,
	CALENDAR_INPUT_MAX_DATE,
	CALENDAR_INPUT_MIN_DATE,
	CALENDAR_MASK,
	DATETIME_INPUT_MASK,
	DATE_INPUT_MASK,
	DATE_INPUT_PLACEHOLDER,
	DEFAULT_HEADER_TITLE
} from './absolute-time-picker.config';
import { fromDateInput, fromISO, isDateBefore, isDateSame, newDate } from '../../utils/date.helper';
import { isEmpty } from 'lodash';
import {
	ERelativeTimeInputMode,
	EAbsoluteTimePickerMode,
	IAbsoluteTimePicker,
	IAbsoluteTimePickerEvents,
	IRelativeTimeInput,
	IAbsoluteSelectedRangeDates
} from './absolute-time-picker.types';
import { buildSelectedDatesEventPayload, getFirstCalendarInitialDate, getSecondCalendarInitialDate, isEndDateAtStartOfDay } from './absolute-time-picker.helper';
import { IClickDateEvent } from '../time-picker-calendar/time-picker-calendar.types';
import { DATE_FORMAT } from '../time-picker-calendar/time-picker-calendar.config';

@Component({
	tag: 'kv-absolute-time-picker',
	styleUrl: 'absolute-time-picker.scss',
	shadow: false
})
export class KvAbsoluteTimePicker implements IAbsoluteTimePicker, IAbsoluteTimePickerEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) headerTitle?: string = DEFAULT_HEADER_TITLE;
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
	@Event() selectedDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** @inheritdoc */
	@Event() backButtonClicked: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigReset: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigChange: EventEmitter<IAbsoluteSelectedRangeDates>;

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

	@Watch('selectedDates')
	handleSelectedRangeDatesChange(value: string[] = []) {
		if (value.length === 0) {
			this.resetInputValues();
			this.resetDateLimits();
			return;
		}

		if (this.mode === EAbsoluteTimePickerMode.Range) {
			if (isEmpty(this.relativeTimeConfig)) {
				const [from, to] = value;

				const parsedFromDate = dayjs(from, CALENDAR_DATE_TIME_MASK).format(DATETIME_INPUT_MASK);
				const parsedToDate = dayjs(to, CALENDAR_DATE_TIME_MASK).format(DATETIME_INPUT_MASK);

				this.setInputValues(parsedFromDate, parsedToDate);
			}
		} else {
			const [date] = value;
			const parsedDate = dayjs(date, CALENDAR_DATE_TIME_MASK).format(DATETIME_INPUT_MASK);
			this.singleInputValue = parsedDate;
		}
	}

	@Watch('relativeTimeConfig')
	handleRelativeTimeConfigInput(newValue: IRelativeTimeInput) {
		if (isEmpty(newValue)) {
			this.inputMode = ERelativeTimeInputMode.Date;
			if (this.selectedDates.length === 0) {
				this.setInputValues('', '');
				this.displayedMonth = fromDateInput(new Date());
			}
			return;
		}

		this.inputMode = newValue.mode;
		this.setInputValues(newValue.from, newValue.to);
		const [from] = this.selectedDates;
		const date = newDate(from);
		if (date.isValid()) {
			this.displayedMonth = date;
		}
	}

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

	private emitSelectRangeDatesChangeEvent = (dateA?: dayjs.Dayjs, dateB?: dayjs.Dayjs): void => {
		const range = buildSelectedDatesEventPayload(dateA, dateB);
		this.selectedDatesChange.emit({
			range
		});
	};

	private handleBackClick = (event: MouseEvent) => {
		this.backButtonClicked.emit(event);
	};

	private onClickDate = ({ detail }: CustomEvent<IClickDateEvent>): void => {
		const date = detail.date;
		const clickedDate = fromISO(date).startOf('day');
		const inputDate = newDate(date);

		if (this.mode === EAbsoluteTimePickerMode.Range) {
			const [selectedStartDate, selectedEndDate] = this.selectedDates;

			if (!selectedStartDate) {
				this.displayedMonth = clickedDate;
				this.setInputValues(inputDate.startOf('day').format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(clickedDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
				return;
			}

			if (isDateSame(clickedDate, selectedStartDate)) {
				if (!selectedEndDate) {
					this.setInputValues(inputDate.startOf('day').format(DATETIME_INPUT_MASK), inputDate.endOf('day').format(DATETIME_INPUT_MASK));
					this.resetDateLimits();
					this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'), clickedDate.endOf('day'));

					return;
				}

				this.resetInputValues();
				this.resetDateLimits();
				this.emitSelectRangeDatesChangeEvent();
				return;
			}

			if (selectedEndDate !== undefined) {
				this.displayedMonth = inputDate;
				this.setInputValues(inputDate.startOf('day').format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(inputDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
				return;
			}

			if (isDateBefore(clickedDate, selectedStartDate)) {
				this.displayedMonth = clickedDate;
				this.setInputValues(inputDate.startOf('day').format(DATETIME_INPUT_MASK), '');
				this.setDateLimits(clickedDate.format(CALENDAR_MASK), '');
				this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
				return;
			}

			this.setInputValues(newDate(selectedStartDate).format(DATETIME_INPUT_MASK), inputDate.endOf('day').format(DATETIME_INPUT_MASK));
			this.resetDateLimits();
			this.emitSelectRangeDatesChangeEvent(fromISO(selectedStartDate).startOf('day'), clickedDate.endOf('day'));
			return;
		} else {
			this.displayedMonth = clickedDate;
			this.singleInputValue = inputDate.startOf('day').format(DATETIME_INPUT_MASK);
			this.emitSelectRangeDatesChangeEvent(inputDate.startOf('day'));
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
		const parsedFromInputDate = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);
		const parsedToInputDate = dayjs(this.toInputValue, DATETIME_INPUT_MASK);

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (!isEmpty(this.fromInputValue)) {
					this.displayedMonth = parsedFromInputDate;
				}
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.fromInputValue) && parsedToInputDate.diff(parsedFromInputDate, 'month') > 0) {
				this.displayedMonth = parsedFromInputDate;
			}
		}
	};

	private handleOnFocusToInput = () => {
		this.toInputFocused = true;
		this.fromInputFocused = false;
		const parsedToInputDate = dayjs(this.toInputValue, DATETIME_INPUT_MASK);
		const parsedFromInputDate = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (!isEmpty(this.toInputValue) && parsedFromInputDate.diff(parsedToInputDate, 'month') > 0) {
					this.displayedMonth = parsedToInputDate.subtract(1, 'month');
				}
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.toInputValue) && parsedToInputDate.diff(parsedFromInputDate, 'month') > 0) {
				this.displayedMonth = parsedToInputDate.subtract(1, 'month');
			}
		}
	};

	private handleDateChange = (event: CustomEvent<string>, inputSource: EInputSource) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (inputSource === EInputSource.Single) {
			if (parsedDate.isValid() && parsedDateTime.isValid()) {
				this.singleInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
				this.displayedMonth = parsedDate;
				this.emitSelectRangeDatesChangeEvent(parsedDateTime);
			}
		} else {
			if (parsedDateTime.isValid()) {
				if (inputSource === EInputSource.From) {
					this.handleFromInputDateChange(parsedDate, parsedDateTime);
				} else {
					this.handleToInputDateChange(parsedDate, parsedDateTime);
				}
			} else {
				if (isEmpty(this.fromInputValue)) {
					this.minDate = '';
				}

				if (isEmpty(this.toInputValue)) {
					this.maxDate = '';
				}
			}
		}
	};

	private handleFromInputDateChange = (parsedDate: dayjs.Dayjs, parsedDateTime: dayjs.Dayjs) => {
		this.fromInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
		this.displayedMonth = parsedDate;
		if (!isEmpty(this.toInputValue)) {
			if (parsedDateTime.isSame(dayjs(this.toInputValue, DATETIME_INPUT_MASK))) {
				this.emitSelectRangeDatesChangeEvent(parsedDateTime.subtract(1, 'second'), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			} else {
				this.emitSelectRangeDatesChangeEvent(parsedDateTime, dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
			this.resetDateLimits();
		} else {
			this.emitSelectRangeDatesChangeEvent(parsedDateTime);
			this.toInputFocused = true;
			this.minDate = parsedDate.format(CALENDAR_MASK);
		}
	};

	private handleToInputDateChange = (parsedDate: dayjs.Dayjs, parsedDateTime: dayjs.Dayjs) => {
		this.toInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
		this.displayedMonth = parsedDate.subtract(1, 'month');
		if (!isEmpty(this.fromInputValue)) {
			if (parsedDateTime.isSame(dayjs(this.fromInputValue, DATETIME_INPUT_MASK))) {
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDateTime.add(1, 'second'));
			} else {
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDateTime);
			}
			this.resetDateLimits();
		} else {
			this.maxDate = parsedDate.format(CALENDAR_MASK);
			this.emitSelectRangeDatesChangeEvent(parsedDateTime);
			this.fromInputFocused = true;
		}
	};

	private handleEndDateLostFocus = (event: CustomEvent<string>) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && isEndDateAtStartOfDay(parsedDateTime)) {
			const parsedDateFormated = parsedDate.endOf('day').format(DATETIME_INPUT_MASK);
			this.toInputValue = parsedDateFormated;
			this.displayedMonth = parsedDate.subtract(1, 'month');
			if (!isEmpty(this.fromInputValue)) {
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDate.endOf('day'));
			} else {
				this.emitSelectRangeDatesChangeEvent(parsedDate.endOf('day'));
				this.fromInputFocused = true;
			}
		}
	};

	/** Components config methods */
	private useInputMask = (): boolean => {
		return this.inputMode === ERelativeTimeInputMode.Date;
	};

	private getFromInputDateTimeLimits = () => {
		const parsedToDateTime = dayjs(this.toInputValue, DATETIME_INPUT_MASK);
		if (!isEmpty(this.toInputValue) && parsedToDateTime.isValid()) {
			return {
				min: this.calendarInputMinDate,
				max: parsedToDateTime.format(DATETIME_INPUT_MASK)
			};
		}

		return {
			min: this.calendarInputMinDate,
			max: this.calendarInputMaxDate
		};
	};

	private getToInputDateTimeLimits = () => {
		const parsedFromDateTime = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);
		if (!isEmpty(this.fromInputValue) && parsedFromDateTime.isValid()) {
			return {
				min: parsedFromDateTime.format(DATETIME_INPUT_MASK),
				max: this.calendarInputMaxDate
			};
		}

		return {
			min: this.calendarInputMinDate,
			max: this.calendarInputMaxDate
		};
	};

	private getCalendarLimits = () => ({
		minDate: !isEmpty(this.minDate) ? this.minDate : dayjs(this.calendarInputMinDate, DATETIME_INPUT_MASK).format(DATE_FORMAT),
		maxDate: !isEmpty(this.maxDate) ? this.maxDate : dayjs(this.calendarInputMaxDate, DATETIME_INPUT_MASK).format(DATE_FORMAT)
	});

	render() {
		const fromCalendarInitialDate = getFirstCalendarInitialDate(this.displayedMonth);
		const toCalendarInitialDate = getSecondCalendarInitialDate(this.displayedMonth);

		return (
			<Host>
				<div class="absolute-time-picker-container">
					{this.displayBackButton && (
						<div class="navigate-back" onClick={this.handleBackClick}>
							<kv-icon name={EIconName.SlimRight} customClass="rotate-180" />
							<div class="back-text">Back</div>
						</div>
					)}
					<div class="header">
						<div class="title">{this.headerTitle}</div>
					</div>
					{this.mode === EAbsoluteTimePickerMode.Range ? (
						<div class="absolute-range-input">
							<kv-date-time-input
								inputName="from-input"
								useInputMask={this.useInputMask()}
								label="From"
								value={this.fromInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								highlighted={isEmpty(this.fromInputValue) && !this.toInputFocused}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.From)}
								onInputFocus={this.handleOnFocusFromInput}
								{...this.getFromInputDateTimeLimits()}
							/>
							<kv-date-time-input
								inputName="to-input"
								useInputMask={this.useInputMask()}
								label="To"
								value={this.toInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								highlighted={isEmpty(this.toInputValue) && !isEmpty(this.fromInputValue)}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.To)}
								onDateTimeBlur={this.handleEndDateLostFocus}
								onInputFocus={this.handleOnFocusToInput}
								{...this.getToInputDateTimeLimits()}
							/>
						</div>
					) : (
						<div class="absolute-point-input">
							<kv-date-time-input
								id="single-date-input"
								useInputMask
								label="Day & Hour"
								value={this.singleInputValue}
								size={EComponentSize.Small}
								placeholder={DATE_INPUT_PLACEHOLDER}
								onTextChange={ev => this.handleDateChange(ev, EInputSource.Single)}
								min={this.calendarInputMinDate}
								max={this.calendarInputMaxDate}
							/>
						</div>
					)}
					<div class="calendars">
						<kv-time-picker-calendar
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
							{...this.getCalendarLimits()}
						/>
						<kv-time-picker-calendar
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
							{...this.getCalendarLimits()}
						/>
					</div>
				</div>
			</Host>
		);
	}
}
