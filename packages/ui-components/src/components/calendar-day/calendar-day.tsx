import { Component, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { ICalendarDay, ICalendarDayEvents, IClickDayEvent, IMouseEnterEvent, IMouseLeaveEvent } from './calendar-day.types';

/**
 * @part day-container - The day button container.
 */
@Component({
	tag: 'kv-calendar-day',
	styleUrls: {
		night: 'calendar-day.night.scss',
		light: 'calendar-day.light.scss'
	},
	shadow: true
})
export class KvCalendarDay implements ICalendarDay, ICalendarDayEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) day: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) active: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) inRange: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) leftRounded: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) rightRounded: boolean = false;

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

		// emit click day event
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
						'calendar-day': true,
						'calendar-day--disabled': this.disabled,
						'calendar-day--active': this.active,
						'calendar-day--in-range': this.inRange,
						'calendar-day--left-rounded': this.leftRounded,
						'calendar-day--right-rounded': this.rightRounded
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
