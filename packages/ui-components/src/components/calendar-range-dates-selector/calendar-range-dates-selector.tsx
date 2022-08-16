import { Component, Event, EventEmitter, h, Host, Prop, Watch } from '@stencil/core';
import { formatDate, fromISOToMoment, getDatesBetweenRange, isDateBefore, isDateSame, isDateValid } from '../../utils/date.helper';
import { IClickDateEvent, SelectedRange } from '../calendar/calendar.types';
import { ICalendarRangeDatesSelector, ICalendarRangeDatesSelectorEvents, ISelectRangeDates } from './calendar-range-dates-selector.types';

@Component({
	tag: 'kv-calendar-range-dates-selector',
	styleUrls: {
		night: 'calendar-range-dates-selector.night.scss',
		light: 'calendar-range-dates-selector.light.scss'
	},
	shadow: true
})
export class KvCalendarRangeDatesSelector implements ICalendarRangeDatesSelector, ICalendarRangeDatesSelectorEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedRangeDates?: SelectedRange = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;

	/** @inheritdoc */
	@Event() selectRangeDates: EventEmitter<ISelectRangeDates>;

	@Watch('selectedRangeDates')
	validateRangeDates(newRangeDates: SelectedRange | undefined) {
		if (newRangeDates !== undefined && newRangeDates.length > 0) {
			const [selectedStartDate, selectedEndDate] = newRangeDates;

			if (selectedStartDate !== undefined && !isDateValid(selectedStartDate)) {
				throw new Error('Range selected start date should be a valid date');
			}

			if (selectedEndDate !== undefined && !isDateValid(selectedEndDate)) {
				throw new Error('Range selected end date should be a valid date');
			}
		}
	}

	componentWillLoad() {
		this.validateRangeDates(this.selectedRangeDates);
	}

	private onClickDate = ({ detail: { event, payload: date } }: CustomEvent<IClickDateEvent>): void => {
		const clickedDateMoment = fromISOToMoment(date);

		const [selectedStartDate, selectedEndDate] = this.getSelectedRangeDates();

		// check if start date is not selected
		if (selectedStartDate === undefined) {
			this.selectRangeDates.emit({ event, payload: [formatDate(clickedDateMoment)] });
			return;
		}

		// check if clicked date is the same as the selected date
		if (isDateSame(clickedDateMoment, selectedStartDate)) {
			// check if end date is not selected
			if (selectedEndDate === undefined) {
				this.selectRangeDates.emit({ event, payload: [formatDate(clickedDateMoment), formatDate(clickedDateMoment)] });
				return;
			}

			this.selectRangeDates.emit({ event, payload: [] });
			return;
		}

		// check if end date is selected
		if (selectedEndDate !== undefined) {
			// reset end date and set
			// start date to the clicked date
			this.selectRangeDates.emit({ event, payload: [formatDate(clickedDateMoment)] });
			return;
		}

		// check if clicked day is before the start date
		if (isDateBefore(clickedDateMoment, selectedStartDate)) {
			// reset end date and set
			// start date to clicked date
			this.selectRangeDates.emit({ event, payload: [formatDate(clickedDateMoment)] });
			return;
		}

		// the clicked date is after the clicked date
		// set end date to the clicked day
		this.selectRangeDates.emit({ event, payload: [formatDate(selectedStartDate), formatDate(clickedDateMoment)] });
		return;
	};

	public getSelectedDates = (): string[] | undefined => {
		const [selectedStartDate, selectedEndDate] = this.getSelectedRangeDates();

		if (selectedStartDate === undefined) {
			return;
		}

		if (selectedEndDate === undefined) {
			return [selectedStartDate];
		}

		return getDatesBetweenRange(selectedStartDate, selectedEndDate);
	};

	private getSelectedRangeDates = () => this.selectedRangeDates ?? [];

	render() {
		const [selectedStartDate] = this.getSelectedRangeDates();
		const selectedDates = this.getSelectedDates();

		return (
			<Host>
				<kv-calendar
					initialDate={this.initialDate ?? selectedStartDate}
					onClickDate={this.onClickDate}
					selectedDates={selectedDates}
					disabledDates={this.disabledDates}
					minDate={this.minDate}
					maxDate={this.maxDate}
					exportparts="calendar-container,month-container,day-container"
				/>
			</Host>
		);
	}
}
