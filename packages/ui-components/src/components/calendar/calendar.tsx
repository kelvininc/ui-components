import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { getArrayOfIndexes } from '../../utils/arrays.helper';
import {
	areDatesValid,
	formatDate,
	fromDateFields,
	getDateMonth,
	getDateYear,
	getFirstWeekdayIndexOfMonth,
	getMonthAndYearTitle,
	getNumberOfDaysInMonth,
	getWeekdaysNames,
	isDateAfter,
	isDateBefore,
	isDateInArray,
	isDateInRange,
	isDateSame,
	isDateValid
} from '../../utils/date.helper';
import { EActionButtonType } from '../action-button/action-button.types';
import { EIconName } from '../icon/icon.types';
import { ICalendar, ICalendarEvents, IChangeYearEvent, IChangeMonthEvent, IClickDateEvent, SelectedRange } from './calendar.types';

/**
 * @part month-container - The month container.
 * @part calendar-container - The calendar container.
 */
@Component({
	tag: 'kv-calendar',
	styleUrls: {
		night: 'calendar.night.scss',
		light: 'calendar.light.scss'
	},
	shadow: true
})
export class KvCalendar implements ICalendar, ICalendarEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;

	/** @inheritdoc */
	@Event() changeMonth: EventEmitter<IChangeMonthEvent>;
	/** @inheritdoc */
	@Event() changeYear: EventEmitter<IChangeYearEvent>;
	/** @inheritdoc */
	@Event() clickDate: EventEmitter<IClickDateEvent>;

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
		}
	}
	@Watch('disabledDates')
	validateDisabledDates(newDisabledDates: string[] | undefined) {
		if (newDisabledDates !== undefined && !areDatesValid(newDisabledDates)) {
			throw new Error('Disabled dates should be an array with valid dates');
		}
	}
	@Watch('minDate')
	validateMinDate(newMinDate: string) {
		if (newMinDate !== undefined && !isDateValid(newMinDate)) {
			throw new Error('Min date should be a valid date');
		}
	}
	@Watch('maxDate')
	validateMaxDate(newMaxDate: string) {
		if (newMaxDate !== undefined && !isDateValid(newMaxDate)) {
			throw new Error('Max date should be a valid date');
		}
	}

	componentWillLoad() {
		this.validateSelectedDates(this.selectedDates);
		this.validateInitialDate(this.initialDate);
		this.validateDisabledDates(this.disabledDates);
		this.validateMinDate(this.minDate);
		this.validateMaxDate(this.maxDate);
	}

	public onClickPreviousMonth = (event: CustomEvent<MouseEvent>) => {
		if (this.month === 1) {
			this.year = this.year - 1;
			this.month = 12;

			this.changeMonth.emit({ event: event.detail, payload: this.month });
			this.changeYear.emit({ event: event.detail, payload: this.year });

			return;
		}

		this.month = this.month - 1;
		this.changeMonth.emit({ event: event.detail, payload: this.month });
	};

	public onClickNextMonth = (event: CustomEvent<MouseEvent>) => {
		if (this.month === 12) {
			this.year = this.year + 1;
			this.month = 1;

			this.changeMonth.emit({ event: event.detail, payload: this.month });
			this.changeYear.emit({ event: event.detail, payload: this.year });

			return;
		}

		this.month = this.month + 1;
		this.changeMonth.emit({ event: event.detail, payload: this.month });
	};

	public isDayDisabled = (day: number): boolean => {
		const dayMoment = fromDateFields(day, this.month, this.year);

		if (isDateInArray(dayMoment, this.disabledDates)) {
			return true;
		}

		if (this.minDate && isDateBefore(dayMoment, this.minDate)) {
			return true;
		}

		if (this.maxDate && isDateAfter(dayMoment, this.maxDate)) {
			return true;
		}

		return false;
	};

	public onClickDay = (day: number, event: MouseEvent): void => {
		const clickedDateMoment = fromDateFields(day, this.month, this.year);
		this.clickDate.emit({ event, payload: formatDate(clickedDateMoment) });
	};

	public isDayActive = (day: number): boolean => {
		const date = fromDateFields(day, this.month, this.year);

		return isDateInArray(date, this.selectedDates);
	};

	public onMouseEnter = (day: number): void => {
		this.hoveredDay = day;
	};

	public onMouseLeave = (_day: number): void => {
		this.hoveredDay = undefined;
	};

	public getSelectedRange = (): SelectedRange => {
		if (this.selectedDates && this.selectedDates.length > 0) {
			const startDate = this.selectedDates[0];

			if (this.selectedDates.length === 1) {
				return [startDate];
			}

			const endDate = this.selectedDates[this.selectedDates.length - 1];

			return [startDate, endDate];
		}

		return [];
	};

	public isDayInRange = (day: number): boolean => {
		const [selectedStartDate, selectedEndDate] = this.getSelectedRange();

		// Return false if one of the following conditions is true:
		// - day is disabled?
		// - start date is not selected?
		// - cursor is not over a day?
		// - end date is not selected?
		if (this.isDayDisabled(day) || selectedStartDate === undefined || this.hoveredDay === undefined || selectedEndDate !== undefined) {
			return false;
		}

		const date = fromDateFields(day, this.month, this.year);
		const hoveredDate = fromDateFields(this.hoveredDay, this.month, this.year);

		return isDateInRange(date, selectedStartDate, hoveredDate, false);
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

		if (selectedEndDate === undefined) {
			return isDateSame(date, selectedStartDate);
		}

		return isDateSame(date, selectedEndDate);
	};

	render() {
		const blankDays = getArrayOfIndexes(getFirstWeekdayIndexOfMonth(this.month, this.year));
		const days = getArrayOfIndexes(getNumberOfDaysInMonth(this.month, this.year));

		return (
			<Host>
				<div class="calendar" part="calendar-container">
					<div class="calendar__header">
						<kv-action-button-icon icon={EIconName.ArrowLeft} type={EActionButtonType.Tertiary} onClickButton={this.onClickPreviousMonth} />
						<div class="month">{getMonthAndYearTitle(this.month, this.year)}</div>
						<kv-action-button-icon icon={EIconName.ArrowRight} type={EActionButtonType.Tertiary} onClickButton={this.onClickNextMonth} />
					</div>
					<div class="calendar__body">
						<div class="calendar-month" part="month-container">
							<div class="calendar-month__weekdays">
								{getWeekdaysNames().map(weekday => (
									<div key={weekday} class="weekday">
										{weekday}
									</div>
								))}
							</div>
							<div class="calendar-month__days">
								{blankDays.map(id => (
									<div key={id} class="day day--blank" />
								))}
								{days.map(index => (
									<kv-calendar-day
										key={`${this.year}-${this.month}-${index + 1}`}
										day={index + 1}
										onClickDay={this.onClickDay.bind(this, index + 1)}
										disabled={this.isDayDisabled(index + 1)}
										active={this.isDayActive(index + 1)}
										inRange={this.isDayInRange(index + 1)}
										leftRounded={this.isSelectedStartDay(index + 1)}
										rightRounded={this.isSelectedEndDay(index + 1)}
										onMouseEnterDay={this.onMouseEnter.bind(this, index + 1)}
										onMouseLeaveDay={this.onMouseLeave.bind(this, index + 1)}
										exportparts="day-container"
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
