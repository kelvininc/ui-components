import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EComponentSize, EIconName } from '../../types';
import dayjs from 'dayjs';
import { CALENDAR_MASK, DATETIME_INPUT_MASK, DATE_INPUT_MASK, DATE_INPUT_PLACEHOLDER, DEFAULT_HEADER_TITLE } from './absolute-time-picker.config';
import { fromDateInput, fromISO, isDateAfter, isDateBefore, isDateSame, isDateTimeAfter, newDate } from '../../utils/date.helper';
import { isEmpty } from 'lodash';
import { ERelativeTimeInputMode, IAbsoluteTimePicker, IAbsoluteTimePickerEvents, IRelativeTimeInput, IAbsoluteSelectedRangeDates } from './absolute-time-picker.types';
import { buildSelectedDatesEventPayload, isEndDateAtStartOfDay } from './absolute-time-picker.helper';
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
	@Event() selectRangeDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** @inheritdoc */
	@Event() backButtonClicked: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigReset: EventEmitter<MouseEvent>;
	/** @inheritdoc */
	@Event() relativeTimeConfigChange: EventEmitter<IAbsoluteSelectedRangeDates>;

	@State() fromInputValue: string = '';
	@State() toInputValue: string = '';
	@State() hoveredDate: string = '';
	@State() displayedMonth: dayjs.Dayjs = fromDateInput(this.initialDate) ?? fromDateInput(new Date());
	@State() fromInputFocused: boolean = true;
	@State() toInputFocused: boolean = false;
	@State() inputMode: ERelativeTimeInputMode = ERelativeTimeInputMode.Date;
	@State() maxDate: string = '';
	@State() minDate: string = '';

	@Watch('relativeTimeConfig')
	handleRelativeTimeConfigInput(newValue: IRelativeTimeInput) {
		if (isEmpty(newValue)) {
			this.inputMode = ERelativeTimeInputMode.Date;
			if (this.selectedRangeDates.length === 0) {
				this.fromInputValue = '';
				this.toInputValue = '';
				this.displayedMonth = fromDateInput(new Date());
			}
			return;
		}

		this.inputMode = newValue.mode;
		this.fromInputValue = newValue.from;
		this.toInputValue = newValue.to;
		const [from] = this.selectedRangeDates;
		const date = newDate(from);
		if (date.isValid()) {
			this.displayedMonth = date;
		}
	}

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
		const [selectedStartDate, selectedEndDate] = this.selectedRangeDates;
		const inputDate = newDate(date);

		if (!selectedStartDate) {
			this.fromInputValue = inputDate.startOf('day').format(DATETIME_INPUT_MASK);
			this.minDate = clickedDate.format(CALENDAR_MASK);
			this.maxDate = '';
			this.displayedMonth = clickedDate;
			this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
			return;
		}

		if (isDateSame(clickedDate, selectedStartDate)) {
			if (!selectedEndDate) {
				this.fromInputValue = inputDate.startOf('day').format(DATETIME_INPUT_MASK);
				this.toInputValue = inputDate.endOf('day').format(DATETIME_INPUT_MASK);
				this.minDate = '';
				this.maxDate = '';
				this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'), clickedDate.endOf('day'));

				return;
			}

			this.fromInputValue = '';
			this.toInputValue = '';
			this.minDate = '';
			this.maxDate = '';
			this.emitSelectRangeDatesChangeEvent();
			return;
		}

		if (selectedEndDate !== undefined) {
			this.fromInputValue = inputDate.startOf('day').format(DATETIME_INPUT_MASK);
			this.toInputValue = '';
			this.minDate = inputDate.format(CALENDAR_MASK);
			this.maxDate = '';
			this.displayedMonth = inputDate;
			this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
			return;
		}

		if (isDateBefore(clickedDate, selectedStartDate)) {
			this.fromInputValue = inputDate.startOf('day').format(DATETIME_INPUT_MASK);
			this.toInputValue = '';
			this.displayedMonth = clickedDate;
			this.minDate = clickedDate.format(CALENDAR_MASK);
			this.maxDate = '';
			this.emitSelectRangeDatesChangeEvent(clickedDate.startOf('day'));
			return;
		}

		this.fromInputValue = newDate(selectedStartDate).format(DATETIME_INPUT_MASK);
		this.toInputValue = inputDate.endOf('day').format(DATETIME_INPUT_MASK);
		this.maxDate = '';
		this.minDate = '';
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
		this.fromInputValue = '';
		this.toInputValue = '';
		this.inputMode = ERelativeTimeInputMode.Date;
		this.relativeTimeConfigReset.emit();
	};

	private handleOnFocusFromInput = () => {
		this.toInputFocused = false;
		this.fromInputFocused = true;
		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.fromInputValue)) {
				const parsedDate = dayjs(this.fromInputValue, DATETIME_INPUT_MASK);
				this.displayedMonth = parsedDate;
			}
		}
	};

	private handleOnFocusToInput = () => {
		this.toInputFocused = true;
		this.fromInputFocused = false;
		if (this.relativeTimeConfig) {
			if (this.relativeTimeConfig.mode === ERelativeTimeInputMode.Text) {
				this.handleInputReset();
			} else {
				this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
			}
		} else {
			if (!isEmpty(this.toInputValue)) {
				const parsedDate = dayjs(this.toInputValue, DATETIME_INPUT_MASK).subtract(1, 'month');
				this.displayedMonth = parsedDate;
			}
		}
	};

	public handleStartDateChange = (event: CustomEvent<string>) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && parsedDateTime.isValid()) {
			this.fromInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
			this.displayedMonth = parsedDate;
			if (!isEmpty(this.toInputValue)) {
				if (isDateBefore(parsedDateTime, dayjs(this.toInputValue, DATETIME_INPUT_MASK)) || isDateSame(parsedDateTime, dayjs(this.toInputValue, DATETIME_INPUT_MASK))) {
					this.emitSelectRangeDatesChangeEvent(parsedDateTime, dayjs(this.toInputValue, DATETIME_INPUT_MASK));
					this.minDate = '';
					this.maxDate = '';
				} else {
					this.fromInputValue = undefined;
					return;
				}
			} else {
				this.emitSelectRangeDatesChangeEvent(parsedDateTime);
				this.toInputFocused = true;
				this.minDate = parsedDate.format(CALENDAR_MASK);
			}
		} else {
			this.minDate = '';
			if (isEmpty(this.toInputValue)) {
				this.maxDate = '';
			}
		}
	};

	public handleStartDateLostFocus = (event: CustomEvent<string>) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && !parsedDateTime.isValid()) {
			const parsedDateFormated = parsedDate.startOf('day').format(DATETIME_INPUT_MASK);
			this.fromInputValue = parsedDateFormated;
			this.displayedMonth = parsedDate;
			if (!isEmpty(this.toInputValue)) {
				if (isDateBefore(parsedDate, dayjs(this.toInputValue, DATE_INPUT_MASK))) {
					this.emitSelectRangeDatesChangeEvent(parsedDate.startOf('day'), dayjs(this.toInputValue, DATETIME_INPUT_MASK));
				} else {
					this.fromInputValue = undefined;
					return;
				}
			} else {
				this.emitSelectRangeDatesChangeEvent(parsedDate.startOf('day'));
				this.toInputFocused = true;
			}
		}
	};

	public handleEndDateChange = (event: CustomEvent<string>) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && parsedDateTime.isValid() && date !== this.toInputValue) {
			this.toInputValue = parsedDateTime.format(DATETIME_INPUT_MASK);
			this.displayedMonth = parsedDate.subtract(1, 'month');
			if (!isEmpty(this.fromInputValue)) {
				if (
					isDateTimeAfter(parsedDateTime, dayjs(this.fromInputValue, DATETIME_INPUT_MASK)) ||
					isDateSame(parsedDateTime, dayjs(this.fromInputValue, DATETIME_INPUT_MASK))
				) {
					this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDateTime);
					this.minDate = '';
					this.maxDate = '';
				} else {
					this.toInputValue = undefined;
					return;
				}
			} else {
				this.maxDate = parsedDate.format(CALENDAR_MASK);
				this.emitSelectRangeDatesChangeEvent(parsedDateTime);
				this.fromInputFocused = true;
			}
		}
	};

	public handleEndDateLostFocus = (event: CustomEvent<string>) => {
		const date = event.detail;
		const parsedDate = dayjs(date, DATE_INPUT_MASK);
		const parsedDateTime = dayjs(date, DATETIME_INPUT_MASK);

		if (parsedDate.isValid() && isEndDateAtStartOfDay(parsedDateTime) && date !== this.fromInputValue) {
			const parsedDateFormated = parsedDate.endOf('day').format(DATETIME_INPUT_MASK);
			this.toInputValue = parsedDateFormated;
			this.displayedMonth = parsedDate.subtract(1, 'month');
			if (!isEmpty(this.fromInputValue)) {
				if (isDateAfter(parsedDate, dayjs(this.fromInputValue, DATE_INPUT_MASK))) {
					this.emitSelectRangeDatesChangeEvent(dayjs(this.fromInputValue, DATETIME_INPUT_MASK), parsedDate.endOf('day'));
				} else {
					this.toInputValue = undefined;
					return;
				}
			} else {
				this.emitSelectRangeDatesChangeEvent(parsedDate.endOf('day'));
				this.fromInputFocused = true;
			}
		}
	};

	// Components config methods
	private useInputMask = (): boolean => {
		return this.inputMode === ERelativeTimeInputMode.Date;
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
							onTextChange={this.handleStartDateChange}
							onDateTimeBlur={this.handleStartDateLostFocus}
							onInputFocus={this.handleOnFocusFromInput}
						/>
						<kv-date-time-input
							useInputMask={this.useInputMask()}
							label="To"
							value={this.toInputValue}
							size={EComponentSize.Small}
							placeholder={DATE_INPUT_PLACEHOLDER}
							highlighted={isEmpty(this.toInputValue) && !isEmpty(this.fromInputValue)}
							onTextChange={this.handleEndDateChange}
							onDateTimeBlur={this.handleEndDateLostFocus}
							onInputFocus={this.handleOnFocusToInput}
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
