import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { IChangeMonthEvent, IChangeYearEvent, IClickDateEvent, ITimePickerCalendar, ITimePickerCalendarEvents } from './time-picker-calendar.types';
import {
	areDatesValid,
	formatDate,
	fromDateFields,
	getDateMonth,
	getDateYear,
	getMonthAndYearTitle,
	getNumberOfDaysInMonth,
	getWeekdaysNames,
	isDateAfter,
	isDateBefore,
	isDateInArray,
	isDateInRange,
	isDateSame,
	isDateValid,
	newDate
} from '../../utils/date.helper';
import { getArrayOfIndexes } from '../../utils/arrays.helper';
import { EIconName } from '../icon/icon.types';
import { getCalendarEndDisabledDays, getCalendarStartDisabledDays, getHooveredDate, getSelectedRange } from './time-picker-calendar.helper';
import { CALENDAR_DEFAULT_MIN_DATE, DATE_FORMAT } from './time-picker-calendar.config';
import dayjs from 'dayjs';
import { EAbsoluteTimePickerMode } from '../../types';
import { isEmpty } from 'lodash';

@Component({
	tag: 'kv-time-picker-calendar',
	styleUrl: 'time-picker-calendar.scss',
	shadow: true
})
export class KvTimePickerCalendar implements ITimePickerCalendar, ITimePickerCalendarEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disableHoveringStyling?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) hoveredDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) displayPreviousMonthArrow?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) displayNextMonthArrow?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) mode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Range;

	/** @inheritdoc */
	@Event() changeMonth: EventEmitter<IChangeMonthEvent>;
	/** @inheritdoc */
	@Event() changeYear: EventEmitter<IChangeYearEvent>;
	/** @inheritdoc */
	@Event() clickDate: EventEmitter<IClickDateEvent>;
	/** @inheritdoc */
	@Event() hoveredDateChange: EventEmitter<string>;

	@State() month: number = getDateMonth(this.initialDate ?? new Date());
	@State() year: number = getDateYear(this.initialDate ?? new Date());
	@State() hoveredDay: number;

	@Watch('selectedDates')
	validateSelectedDates(newSelectedDates: string[] | undefined) {
		if (newSelectedDates !== undefined && !areDatesValid(newSelectedDates)) {
			throw new Error('Selected date should be an array with valid dates');
		}
	}

	@Watch('initialDate')
	validateInitialDate(newInitialDate: string | undefined) {
		if (newInitialDate !== undefined && !isDateValid(newInitialDate)) {
			throw new Error('Initial date should be a valid date');
		} else {
			this.month = getDateMonth(newInitialDate ?? new Date());
			this.year = getDateYear(newInitialDate ?? new Date());
		}
	}

	@Watch('disabledDates')
	validateDisabledDates(newDisabledDates: string[] | undefined) {
		if (newDisabledDates !== undefined && !areDatesValid(newDisabledDates)) {
			throw new Error('Disabled dates should be an array with valid dates');
		}
	}

	componentWillLoad() {
		this.validateSelectedDates(this.selectedDates);
		this.validateInitialDate(this.initialDate);
		this.validateDisabledDates(this.disabledDates);
	}

	public onClickPreviousMonth = () => {
		if (!this.isBackNavigationDisabled()) {
			if (this.month === 1) {
				this.year = this.year - 1;
				this.month = 12;

				this.changeMonth.emit({ month: this.month });
				this.changeYear.emit({ year: this.year });

				return;
			}

			this.month = this.month - 1;
			this.changeMonth.emit({ month: this.month });
		}
	};

	public onClickNextMonth = () => {
		if (!this.isNextNavigationDisabled()) {
			if (this.month === 12) {
				this.year = this.year + 1;
				this.month = 1;

				this.changeMonth.emit({ month: this.month });
				this.changeYear.emit({ year: this.year });

				return;
			}

			this.month = this.month + 1;
			this.changeMonth.emit({ month: this.month });
		}
	};

	public isDayDisabled = (day: number): boolean => {
		const dayMoment = fromDateFields(day, this.month, this.year);

		if (isDateInArray(dayMoment, this.disabledDates)) {
			return true;
		}

		if (this.minDate && isDateBefore(dayMoment, dayjs(this.minDate, DATE_FORMAT))) {
			return true;
		}

		if (this.maxDate && isDateAfter(dayMoment, dayjs(this.maxDate, DATE_FORMAT))) {
			return true;
		}

		return false;
	};

	public onClickDay = (day: number): void => {
		const clickedDateMoment = fromDateFields(day, this.month, this.year);
		this.clickDate.emit({ date: formatDate(clickedDateMoment) });
	};

	public isDayActive = (day: number): boolean => {
		const date = fromDateFields(day, this.month, this.year);

		return isDateInArray(
			date,
			this.selectedDates.filter(date => date !== undefined)
		);
	};

	public onMouseEnter = (day: number): void => {
		this.hoveredDay = day;
		const date = fromDateFields(day, this.month, this.year).format(DATE_FORMAT);
		this.hoveredDateChange.emit(date);
	};

	public onMouseLeave = (_day: number): void => {
		this.hoveredDay = undefined;
		this.hoveredDateChange.emit('');
	};

	public getSelectedRange() {
		return getSelectedRange(this.selectedDates);
	}

	public isDayInRange = (day: number): boolean => {
		const [selectedStartDate, selectedEndDate] = this.getSelectedRange();

		if (
			this.disableHoveringStyling ||
			this.mode === EAbsoluteTimePickerMode.Single ||
			this.isDayDisabled(day) ||
			selectedStartDate === undefined ||
			selectedEndDate !== undefined
		) {
			return false;
		}

		const date = fromDateFields(day, this.month, this.year).format(DATE_FORMAT);
		const hoveredDate = getHooveredDate(this.hoveredDay, this.month, this.year, this.hoveredDate);
		return isDateInRange(date, newDate(selectedStartDate).format(DATE_FORMAT), hoveredDate, false);
	};

	public isSelectedStartDay = (day: number): boolean => {
		const [selectedStartDate] = this.getSelectedRange();

		if (selectedStartDate === undefined) {
			return false;
		}

		const dateMoment = fromDateFields(day, this.month, this.year);

		return isDateSame(dateMoment, selectedStartDate);
	};

	public isSelectedEndDay = (day: number): boolean => {
		const date = fromDateFields(day, this.month, this.year);

		const [selectedStartDate, selectedEndDate] = this.getSelectedRange();

		if (selectedStartDate === undefined) {
			return false;
		}

		return isDateSame(date, selectedEndDate ?? selectedStartDate);
	};

	public isToday = (day: number): boolean => {
		const nowDate = newDate().format(DATE_FORMAT);
		const dayDate = fromDateFields(day, this.month, this.year).format(DATE_FORMAT);
		return nowDate === dayDate;
	};

	public isInsideDataRange = (day: number): boolean => {
		const dayDate = fromDateFields(day, this.month, this.year);
		const [selectedStartDate, selectedEndDate] = this.getSelectedRange();

		if (selectedStartDate === undefined || selectedEndDate === undefined) return false;

		return isDateInRange(dayDate, selectedStartDate, selectedEndDate, false);
	};

	private isBackNavigationDisabled = (): boolean => {
		const calendarMinDate = this.minDate ? this.minDate : CALENDAR_DEFAULT_MIN_DATE;

		const dayDate = fromDateFields(1, this.month, this.year);
		const minDateFormatted = dayjs(calendarMinDate, DATE_FORMAT);

		return dayDate.isBefore(minDateFormatted) || dayDate.isSame(minDateFormatted);
	};

	private isNextNavigationDisabled = (): boolean => {
		if (isEmpty(this.maxDate)) return false;

		const dayDate = fromDateFields(1, this.month, this.year);
		const maxDateFormatted = dayjs(this.maxDate, DATE_FORMAT);

		return dayDate.isAfter(maxDateFormatted);
	};

	render() {
		const previousMonthLastDays = getCalendarStartDisabledDays(this.month, this.year);
		const currentMonthDays = getArrayOfIndexes(getNumberOfDaysInMonth(this.month, this.year));
		const nextMonthStartDays = getCalendarEndDisabledDays(previousMonthLastDays.length + currentMonthDays.length);

		return (
			<Host>
				<div class="calendar">
					<div class="calendar__header">
						<div class={{ 'navigator': true, 'navigator--disabled': this.isBackNavigationDisabled() }} onClick={this.onClickPreviousMonth}>
							{this.displayPreviousMonthArrow && <kv-icon name={EIconName.NavClose} />}
						</div>
						<div class="month">{getMonthAndYearTitle(this.month, this.year)}</div>
						<div class={{ 'navigator': true, 'navigator--disabled': this.isNextNavigationDisabled() }} onClick={this.onClickNextMonth}>
							{this.displayNextMonthArrow && <kv-icon name={EIconName.NavOpen} />}
						</div>
					</div>
					<div class="calendar__body">
						<div class="calendar-month">
							<div class="calendar-month__weekdays">
								{getWeekdaysNames().map(weekday => (
									<div key={weekday} class="weekday">
										{weekday}
									</div>
								))}
							</div>
							<div class="calendar-month__days">
								{previousMonthLastDays.map(id => (
									<kv-time-picker-calendar-day key={`previous-${this.year}-${this.month}-${id + 1}`} day={id} disabled={true} />
								))}
								{currentMonthDays.map(index => (
									<kv-time-picker-calendar-day
										key={`${this.year}-${this.month}-${index + 1}`}
										day={index + 1}
										onClickDay={this.onClickDay.bind(this, index + 1)}
										disabled={this.isDayDisabled(index + 1)}
										active={this.isDayActive(index + 1)}
										inRange={this.isDayInRange(index + 1)}
										isRangeStartDate={this.isSelectedStartDay(index + 1)}
										isRangeEndDate={this.isSelectedEndDay(index + 1)}
										isToday={this.isToday(index + 1)}
										isBetweenSelectedDates={this.isInsideDataRange(index + 1)}
										onMouseEnterDay={this.onMouseEnter.bind(this, index + 1)}
										onMouseLeaveDay={this.onMouseLeave.bind(this, index + 1)}
									/>
								))}
								{nextMonthStartDays.map(id => (
									<kv-time-picker-calendar-day key={`after-${this.year}-${this.month}-${id + 1}`} day={id} disabled={true} />
								))}
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
