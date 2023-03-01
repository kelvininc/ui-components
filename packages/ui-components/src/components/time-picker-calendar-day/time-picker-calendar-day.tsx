import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { IClickDayEvent, IMouseEnterEvent, IMouseLeaveEvent, ITimePickerCalendarDay, ITimePickerCalendarDayEvents } from './time-picker-calendar-day.types';

/**
 * @part day-container - The day button container.
 */
@Component({
	tag: 'kv-time-picker-calendar-day',
	styleUrl: 'time-picker-calendar-day.scss',
	shadow: true
})
export class KvTimePickerCalendarDay implements ITimePickerCalendarDay, ITimePickerCalendarDayEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) day!: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) inRange?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) isRangeStartDate?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) isRangeEndDate?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) isToday?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) isBetweenSelectedDates?: boolean = false;

	/** @inheritdoc */
	@Event() clickDay: EventEmitter<IClickDayEvent>;
	/** @inheritdoc */
	@Event() mouseEnterDay: EventEmitter<IMouseEnterEvent>;
	/** @inheritdoc */
	@Event() mouseLeaveDay: EventEmitter<IMouseLeaveEvent>;

	private onClickDay = (event: MouseEvent): void => {
		if (this.disabled) {
			return;
		}

		this.clickDay.emit({ event, payload: this.day });
	};

	private onMouseEnterDay = (event: MouseEvent): void => {
		this.mouseEnterDay.emit({ event, payload: this.day });
	};

	private onMouseLeaveDay = (event: MouseEvent): void => {
		this.mouseLeaveDay.emit({ event, payload: this.day });
	};

	render() {
		return (
			<Host>
				<div
					onClick={this.onClickDay}
					class={{
						'time-picker-calendar-day': true,
						'time-picker-calendar-day--disabled': this.disabled,
						'time-picker-calendar-day--active': this.active,
						'time-picker-calendar-day--in-range': this.inRange,
						'time-picker-calendar-day--today': this.isToday,
						'time-picker-calendar-day--range-start': this.isRangeStartDate,
						'time-picker-calendar-day--range-end': this.isRangeEndDate,
						'time-picker-calendar-day--between-dates': this.isBetweenSelectedDates
					}}
					onMouseEnter={this.onMouseEnterDay}
					onMouseLeave={this.onMouseLeaveDay}
					part="day-container"
				>
					{this.day}
				</div>
			</Host>
		);
	}
}
