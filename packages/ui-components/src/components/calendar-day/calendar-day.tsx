import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import { ICalendarDay, ICalendarDayEvents } from './calendar-day.types';

/**
 * @part day-container - The day button container.
 */
@Component({
	tag: 'kv-calendar-day',
	styleUrl: 'calendar-day.scss',
	shadow: true
})
export class KvCalendarDay implements ICalendarDay, ICalendarDayEvents {
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
	@Event() clickDay: EventEmitter<number>;
	/** @inheritdoc */
	@Event() mouseEnterDay: EventEmitter<number>;
	/** @inheritdoc */
	@Event() mouseLeaveDay: EventEmitter<number>;

	private onClickDay = (): void => {
		if (this.disabled) {
			return;
		}

		this.clickDay.emit(this.day);
	};

	private onMouseEnterDay = (): void => {
		this.mouseEnterDay.emit(this.day);
	};

	private onMouseLeaveDay = (): void => {
		this.mouseLeaveDay.emit(this.day);
	};

	render() {
		return (
			<Host>
				<div
					onClick={this.onClickDay}
					class={{
						'calendar-day': true,
						'calendar-day--disabled': this.disabled,
						'calendar-day--active': this.active,
						'calendar-day--in-range': this.inRange,
						'calendar-day--today': this.isToday,
						'calendar-day--range-start': this.isRangeStartDate,
						'calendar-day--range-end': this.isRangeEndDate,
						'calendar-day--between-dates': this.isBetweenSelectedDates
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
