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
import { ERelativeTimeInputMode, IAbsoluteTimePicker, IAbsoluteTimePickerEvents, IRelativeTimeInput, IAbsoluteSelectedRangeDates } from './absolute-time-picker.types';
import { buildSelectedDatesEventPayload, isEndDateAtStartOfDay, isInputDateInLimit } from './absolute-time-picker.helper';
import { IClickDateEvent } from '../time-picker-calendar/time-picker-calendar.types';

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
	@Prop({ reflect: false }) selectedRangeDates?: string[] = [];
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
	@Event() selectRangeDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** @inheritdoc */
	@Event() backButtonClicked: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigReset: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigChange: EventEmitter<IAbsoluteSelectedRangeDates>;

	/** From and to input values inserted by the user on the input */
	@State() fromInputValue: string = '';
	@State() toInputValue: string = '';
	/** Shared hovered date between calendars */
	@State() hoveredDate: string = '';
	/**  First calendar displayed month (Second calendar is displayedMonth + 1) */
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
	@State() maxDate: string = '';
	@State() minDate: string = '';

	@Watch('selectedRangeDates')
	handleSelectedRangeDatesChange(value: string[] = []) {
		if (value.length === 0) {
			this.resetInputValues();
			this.resetDateLimits();
			return;
		}

		if (isEmpty(this.fromInputValue) && isEmpty(this.toInputValue) && isEmpty(this.relativeTimeConfig)) {
			const [from, to] = value;

			const parsedFromDate = dayjs(from, CALENDAR_DATE_TIME_MASK).format(DATETIME_INPUT_MASK);
			const parsedToDate = dayjs(to, CALENDAR_DATE_TIME_MASK).format(DATETIME_INPUT_MASK);

			this.setInputValues(parsedFromDate, parsedToDate);
		}
	}

	@Watch('relativeTimeConfig')
	handleRelativeTimeConfigInput(newValue: IRelativeTimeInput) {
		if (isEmpty(newValue)) {
			this.inputMode = ERelativeTimeInputMode.Date;
			if (this.selectedRangeDates.length === 0) {
				this.setInputValues('', '');
				this.displayedMonth = fromDateInput(new Date());
			}
			return;
		}

		this.inputMode = newValue.mode;
		this.setInputValues(newValue.from, newValue.to);
		const [from] = this.selectedRangeDates;
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
	};

	private resetDateLimits = () => {
		this.minDate = '';
		this.maxDate = '';
	};

	private emitSelectRangeDatesChangeEvent = (dateA?: dayjs.Dayjs, dateB?: dayjs.Dayjs): void => {
		const range = buildSelectedDatesEventPayload(dateA, dateB);
		this.selectRangeDatesChange.emit({
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
		const [selectedStartDate, selectedEndDate] = this.selectedRangeDates;

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
			if (!isInputDateInLimit(inputDate)) {
				this.displayedMonth = inputDate;
			}

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
	};

	private handleClickBackMonth = () => {
		this.displayedMonth = this.displayedMonth.subtract(1, 'month');
	};

	private handleClickForwardMonth = () => {
		this.displayedMonth = this.displayedMonth.add(1, 'month');
	};

	private handleHoveredDateChange = (event: CustomEvent<string>) => {
		this.hoveredDate = event.detail;
	};

	private getFirstCalendarInitialDate = (): string => {
		const initialDate = this.displayedMonth;
		return initialDate.format(CALENDAR_MASK);
	};

	private getSecondCalendarInitialDate = (): string => {
		const initialDate = this.displayedMonth;
		return initialDate.add(1, 'month').format(CALENDAR_MASK);
	};

	private handleInputReset = () => {
		this.resetInputValues();
		this.inputMode = ERelativeTimeInputMode.Date;
		this.relativeTimeConfigReset.emit();
	};

	private handleOnFocusFromInput = () => {
		this.toInputFocused = false;
		this.fromInputFocused = true;
		const parsedDate = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (!isEmpty(this.fromInputValue)) {
					this.displayedMonth = parsedDate;
				}
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.fromInputValue)) {
				this.displayedMonth = parsedDate;
			}
		}
	};

	private handleOnFocusToInput = () => {
		this.toInputFocused = true;
		this.fromInputFocused = false;
		const parsedDate = dayjs(this.toInputValue, DATETIME_INPUT_MASK).subtract(1, 'month');

		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				if (!isEmpty(this.toInputValue)) {
					this.displayedMonth = parsedDate;
				}
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.toInputValue)) {
				this.displayedMonth = parsedDate;
			}
		}
	};

	public handleDateChange = (event: CustomEvent<string>, inputSource: EInputSource) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && parsedDateTime.isValid()) {
			if (inputSource === EInputSource.From) {
				this.fromInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
				this.displayedMonth = parsedDate;
				if (!isEmpty(this.toInputValue)) {
					this.emitSelectRangeDatesChangeEvent(parsedDateTime, dayjs(this.toInputValue, DATETIME_INPUT_MASK));
					this.resetDateLimits();
				} else {
					this.emitSelectRangeDatesChangeEvent(parsedDateTime);
					this.toInputFocused = true;
					this.minDate = parsedDate.format(CALENDAR_MASK);
				}
			} else {
				this.toInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
				this.displayedMonth = parsedDate.subtract(1, 'month');
				if (!isEmpty(this.fromInputValue)) {
					this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDateTime);
					this.resetDateLimits();
				} else {
					this.maxDate = parsedDate.format(CALENDAR_MASK);
					this.emitSelectRangeDatesChangeEvent(parsedDateTime);
					this.fromInputFocused = true;
				}
			}
		} else {
			if (isEmpty(this.fromInputValue)) {
				this.minDate = '';
			}

			if (isEmpty(this.toInputValue)) {
				this.maxDate = '';
			}
		}
	};

	public handleEndDateLostFocus = (event: CustomEvent<string>) => {
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

	private getInputDateLimits = (source: EInputSource) => {
		if (source === EInputSource.From) {
			const parsedToDateTime = dayjs(this.toInputValue, DATETIME_INPUT_MASK);

			if (this.toInputValue && parsedToDateTime.isValid()) {
				return {
					min: this.calendarInputMinDate,
					max: this.toInputValue
				};
			}
		} else {
			const parsedFromDateTime = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);

			if (this.fromInputValue && parsedFromDateTime.isValid()) {
				return {
					min: this.fromInputValue,
					max: this.calendarInputMaxDate
				};
			}
		}

		return {
			min: this.calendarInputMinDate,
			max: this.calendarInputMaxDate
		};
	};

	render() {
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
					<div class="absolute-input">
						<kv-date-time-input
							useInputMask={this.useInputMask()}
							label="From"
							value={this.fromInputValue}
							size={EComponentSize.Small}
							placeholder={DATE_INPUT_PLACEHOLDER}
							highlighted={isEmpty(this.fromInputValue) && !this.toInputFocused}
							onTextChange={ev => this.handleDateChange(ev, EInputSource.From)}
							onInputFocus={this.handleOnFocusFromInput}
							{...this.getInputDateLimits(EInputSource.From)}
						/>
						<kv-date-time-input
							useInputMask={this.useInputMask()}
							label="To"
							value={this.toInputValue}
							size={EComponentSize.Small}
							placeholder={DATE_INPUT_PLACEHOLDER}
							highlighted={isEmpty(this.toInputValue) && !isEmpty(this.fromInputValue)}
							onTextChange={ev => this.handleDateChange(ev, EInputSource.To)}
							onDateTimeBlur={this.handleEndDateLostFocus}
							onInputFocus={this.handleOnFocusToInput}
							{...this.getInputDateLimits(EInputSource.To)}
						/>
					</div>
					<div class="calendars">
						<kv-time-picker-calendar
							displayNextMonthArrow={false}
							displayPreviousMonthArrow
							selectedDates={this.selectedRangeDates}
							hoveredDate={this.hoveredDate}
							initialDate={this.getFirstCalendarInitialDate()}
							disabledDates={this.disabledDates}
							onClickDate={this.onClickDate}
							onChangeMonth={this.handleClickBackMonth}
							onHoveredDateChange={this.handleHoveredDateChange}
							maxDate={this.maxDate}
							minDate={this.minDate}
						/>
						<kv-time-picker-calendar
							displayNextMonthArrow
							displayPreviousMonthArrow={false}
							selectedDates={this.selectedRangeDates}
							hoveredDate={this.hoveredDate}
							initialDate={this.getSecondCalendarInitialDate()}
							disabledDates={this.disabledDates}
							onClickDate={this.onClickDate}
							onChangeMonth={this.handleClickForwardMonth}
							onHoveredDateChange={this.handleHoveredDateChange}
							maxDate={this.maxDate}
							minDate={this.minDate}
						/>
					</div>
				</div>
			</Host>
		);
	}
}
