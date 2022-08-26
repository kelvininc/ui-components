import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { formatDate, fromISO, isDateSame } from '../../utils/date.helper';
import { IClickDateEvent } from '../calendar/calendar.types';
import { ICalendarSingleDateSelector, ICalendarSingleDateSelectorEvents, ISelectDate } from './calendar-single-date-selector.types';

@Component({
	tag: 'kv-calendar-single-date-selector',
	shadow: true
})
export class KvCalendarSingleDateSelector implements ICalendarSingleDateSelector, ICalendarSingleDateSelectorEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) minDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) maxDate?: string;

	/** @inheritdoc */
	@Event() selectDate: EventEmitter<ISelectDate>;

	private onClickDate = ({ detail: { event, payload: date } }: CustomEvent<IClickDateEvent>): void => {
		const clickedDateMoment = fromISO(date);

		// check if clicked date is the same as the selected date
		if (this.selectedDate !== undefined && isDateSame(clickedDateMoment, this.selectedDate)) {
			this.selectDate.emit({ event });
			return;
		}

		this.selectDate.emit({ event, payload: formatDate(clickedDateMoment) });
	};

	public getSelectedDates = (): [string] | undefined => {
		if (this.selectedDate) {
			return [this.selectedDate];
		}
	};

	render() {
		return (
			<Host>
				<kv-calendar
					initialDate={this.initialDate ?? this.selectedDate}
					onClickDate={this.onClickDate}
					selectedDates={this.getSelectedDates()}
					disabledDates={this.disabledDates}
					minDate={this.minDate}
					maxDate={this.maxDate}
					exportparts="calendar-container,month-container,day-container"
				/>
			</Host>
		);
	}
}
