import { Component, Element, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { isEqual, merge } from 'lodash-es';
import {
	ICalendarAdvanceAbsoluteTimeConfig,
	ICalendarAdvanceRelativeTimeConfig,
	ITextField,
	EActionButtonType,
	ICalendarAdvanceSelectedTime,
	ICalendarAdvanceTime,
	ECalendarAdvanceTimeType,
	SelectedRange
} from '../../types';
import { DEFAULT_DATE_INPUT_CONFIG, DEFAULT_DROPDOWN_POSITION_OPTIONS } from './advance-date-select-dropdown.config';
import { IAdvanceDateSelectDropdown, IAdvanceDateSelectDropdownEvents, ITimeChange } from './advance-date-select-dropdown.types';
import {
	formatAbsoluteSelectedTime,
	getRelativeTimeLabel,
	getTimeRange,
	isAbsoluteTimeSelected,
	isRelativeTimeSelected,
	isTimeSelected
} from './advance-date-select-dropdown.helper';
import { formatTimezoneName, fromDatesRangeKey, getDefaultTimezone, getTimezonesNames } from '../../utils/date.helper';
import { ComputePositionConfig } from '@floating-ui/dom';

@Component({
	tag: 'kv-advance-date-select-dropdown',
	styleUrl: 'advance-date-select-dropdown.scss',
	shadow: true
})
export class KvAdvanceDateSelectDropdown implements IAdvanceDateSelectDropdown, IAdvanceDateSelectDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedTime?: ICalendarAdvanceSelectedTime;
	/** @inheritdoc */
	@Prop({ reflect: false }) absoluteTimeConfig?: ICalendarAdvanceAbsoluteTimeConfig;
	/** @inheritdoc */
	@Prop({ reflect: false }) relativeTimeConfig?: ICalendarAdvanceRelativeTimeConfig;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedTimezone?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: string[] = getTimezonesNames();
	/** @inheritdoc */
	@Prop({ reflect: false }) dateMask?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownPositionOptions?: Partial<ComputePositionConfig> = DEFAULT_DROPDOWN_POSITION_OPTIONS;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() relativeTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** @inheritdoc */
	@Event() absoluteTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** @inheritdoc */
	@Event() timezoneChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() timeApplied: EventEmitter<ITimeChange>;

	@State() internalSelectedTime: ICalendarAdvanceSelectedTime | undefined;
	@State() internalSelectedTimezone: string;
	@State() calendarElement: HTMLDivElement = null;

	@Element() element: HTMLKvAdvanceDateSelectDropdownElement;

	@Watch('selectedTime')
	handleSelectedTimeChange(newSelectedTime: ICalendarAdvanceSelectedTime | undefined) {
		this.internalSelectedTime = newSelectedTime;
	}

	componentWillLoad() {
		this.handleSelectedTimeChange(this.selectedTime);
	}

	componentDidLoad() {
		this.calendarElement = this.element.shadowRoot.querySelector('#calendar');
	}

	private getTextFieldTooltip = (): string | undefined => {
		if (this.selectedTime !== undefined) {
			if (this.selectedTimezone !== undefined) {
				return formatTimezoneName(this.selectedTimezone);
			}

			const defaultTimezone = getDefaultTimezone();
			if (this.timezones.includes(defaultTimezone)) {
				return formatTimezoneName(defaultTimezone);
			}
		}
	};

	private getFormattedSelectedTime = (): string | undefined => {
		if (this.selectedTime !== undefined) {
			if (this.selectedTime.type === ECalendarAdvanceTimeType.Relative) {
				return getRelativeTimeLabel(this.selectedTime.key as string | undefined);
			}

			if (this.selectedTime.type === ECalendarAdvanceTimeType.Absolute) {
				const [startDate, endDate] = fromDatesRangeKey(this.selectedTime.key) as SelectedRange;

				if (startDate !== undefined && endDate !== undefined) {
					return formatAbsoluteSelectedTime(startDate, endDate, this.dateMask);
				}
			}
		}
	};

	private onRelativeTimeChange = ({ detail: newRelativeTime }: CustomEvent<ICalendarAdvanceTime>) => {
		this.internalSelectedTime = {
			type: ECalendarAdvanceTimeType.Relative,
			key: newRelativeTime.key
		};
	};

	private onAbsoluteTimeChange = ({ detail: newAbsoluteTime }: CustomEvent<ICalendarAdvanceTime>) => {
		this.internalSelectedTime = {
			type: ECalendarAdvanceTimeType.Absolute,
			key: newAbsoluteTime.key
		};
	};

	private onTimezoneChange = ({ detail: newTimezone }: CustomEvent<string>) => {
		this.internalSelectedTimezone = newTimezone;
	};

	private onClickApply = () => {
		this.timeApplied.emit({
			time: {
				type: this.internalSelectedTime.type,
				payload: {
					key: this.internalSelectedTime.key,
					range: getTimeRange(this.internalSelectedTime, this.relativeTimeConfig?.options)
				}
			},
			timezone: this.internalSelectedTimezone
		});
		this.closeDropdown();
	};

	private onClickCancel = () => {
		this.internalSelectedTime = this.selectedTime;
		this.internalSelectedTimezone = this.selectedTimezone;

		this.closeDropdown();
	};

	private closeDropdown = () => {
		const dropdownElement = this.element.shadowRoot.querySelector('#dropdown') as HTMLKvDropdownElement | undefined;
		if (dropdownElement) {
			dropdownElement.onToggleOpenState();
		}
	};

	public isApplyDisabled = (): boolean => {
		// if there's no internal selected time, apply should be disabled
		if (!isTimeSelected(this.internalSelectedTime)) {
			return true;
		}

		// if the internal selected time is not the same as the external selected time, apply should be enabled
		if (!isEqual(this.internalSelectedTime, this.selectedTime)) {
			return false;
		}

		// if the selected time is the same but the internal timezone is different from the external timezone, apply should be enabled
		if (this.internalSelectedTimezone !== this.selectedTimezone) {
			return false;
		}

		return true;
	};

	public getInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_DATE_INPUT_CONFIG, this.inputConfig, { value: this.getFormattedSelectedTime(), tooltip: this.getTextFieldTooltip() });
	};

	render() {
		return (
			<Host>
				<div
					class={{
						'advance-date-select-dropdown': true,
						'advance-date-select-dropdown--selected-relative': isRelativeTimeSelected(this.selectedTime),
						'advance-date-select-dropdown--selected-absolute': isAbsoluteTimeSelected(this.selectedTime)
					}}
				>
					<kv-dropdown inputConfig={this.getInputConfig()} options={this.dropdownPositionOptions} listElement={this.calendarElement} id="dropdown">
						<div id="calendar" class="calendar-container">
							<kv-calendar-advance-date-selector
								selectedTime={this.internalSelectedTime}
								absoluteTimeConfig={this.absoluteTimeConfig}
								relativeTimeConfig={this.relativeTimeConfig}
								selectedTimezone={this.internalSelectedTimezone}
								timezones={this.timezones}
								onRelativeTimeChange={this.onRelativeTimeChange}
								onAbsoluteTimeChange={this.onAbsoluteTimeChange}
								onTimezoneChange={this.onTimezoneChange}
							/>
							<div class="footer">
								<div class="selected-time">
									{isTimeSelected(this.selectedTime) && (
										<Fragment>
											<div class="label">Range in use:</div>
											<div class="value">{this.getFormattedSelectedTime()}</div>
										</Fragment>
									)}
								</div>
								<div class="actions">
									<kv-action-button-text type={EActionButtonType.Tertiary} text="Cancel" onClickButton={this.onClickCancel} />
									<kv-action-button-text type={EActionButtonType.Primary} text="Apply" disabled={this.isApplyDisabled()} onClickButton={this.onClickApply} />
								</div>
							</div>
						</div>
					</kv-dropdown>
				</div>
			</Host>
		);
	}
}
