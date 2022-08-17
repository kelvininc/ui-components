import { Component, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';
import { merge } from 'lodash-es';
import {
	ISelectRangeDates,
	ITextField,
	ECalendarAdvanceTimeType,
	ICalendarAdvanceAbsoluteTimeConfig,
	ICalendarAdvanceRelativeTimeConfig,
	RelativeTimeOption,
	SelectedRange
} from '../../types';
import { fromDatesRangeKey, getDatesRangeKey, getDefaultTimezone, getTimezonesNames } from '../../utils/date.helper';
import { searchString } from '../../utils/search.helper';
import { EIconName } from '../icon/icon.types';
import {
	DEFAULT_END_DATE_INPUT_CONFIG,
	DEFAULT_RELATIVE_TIME_OPTIONS,
	DEFAULT_START_DATE_INPUT_CONFIG,
	TIMEZONES_PLACEHOLDER,
	TIMEZONES_SEARCH_LABEL,
	TIMEZONES_SEARCH_PLACEHOLDER
} from './calendar-advance-date-selector.config';
import { buildAbsoluteTimeStartPlaceholderWhenRelativeSelected, buildTimezonesDropdownOptions, getDatesRangeFromRelativeOption } from './calendar-advance-date-selector.helper';
import { ICalendarAdvanceDateSelector, ICalendarAdvanceDateSelectorEvents, ICalendarAdvanceSelectedTime, ICalendarAdvanceTime } from './calendar-advance-date-selector.types';

/**
 * @part calendar - The calendar container.
 */
@Component({
	tag: 'kv-calendar-advance-date-selector',
	styleUrl: 'calendar-advance-date-selector.scss',
	shadow: true
})
export class KvCalendarAdvanceDateSelector implements ICalendarAdvanceDateSelector, ICalendarAdvanceDateSelectorEvents {
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

	@State() timezonesSearchTerm: string;

	/** @inheritdoc */
	@Event() relativeTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** @inheritdoc */
	@Event() absoluteTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** @inheritdoc */
	@Event() timezoneChange: EventEmitter<string>;

	private onTimezoneSearchTermChange = ({ detail: newSearchTerm }: CustomEvent<string>): void => {
		this.timezonesSearchTerm = newSearchTerm;
	};

	private onTimezoneSelected = ({ detail: newSelectedTimezone }: CustomEvent<string>): void => {
		this.timezoneChange.emit(newSelectedTimezone);
	};

	private onSelectRangeDates = ({
		detail: {
			payload: [newStartDate, newEndDate]
		}
	}: CustomEvent<ISelectRangeDates>): void => {
		this.absoluteTimeChange.emit({
			key: getDatesRangeKey(newStartDate, newEndDate),
			range: [newStartDate, newEndDate]
		});
	};

	private onSelectRelativeOption = ({ detail: newOption }: CustomEvent<string>): void => {
		this.relativeTimeChange.emit({
			key: newOption,
			range: getDatesRangeFromRelativeOption(newOption, this.getRelativeTimeOptions())
		});
	};

	private getRelativeTimeKey = (): string | undefined => {
		if (this.selectedTime === undefined) {
			return;
		}

		if (this.selectedTime.type === ECalendarAdvanceTimeType.Relative) {
			return this.selectedTime.key;
		}
	};

	private getAbsoluteTimeRange = (): SelectedRange | undefined => {
		if (this.selectedTime === undefined) {
			return;
		}

		if (this.selectedTime.type === ECalendarAdvanceTimeType.Absolute) {
			return fromDatesRangeKey(this.selectedTime.key) as SelectedRange;
		}
	};

	private getRelativeTimeOptions = (): RelativeTimeOption[] => {
		return this.relativeTimeConfig?.options ?? DEFAULT_RELATIVE_TIME_OPTIONS;
	};

	private getAbsoluteTimeStartPlaceholder = (): string | undefined => {
		const relativeTimeKey = this.getRelativeTimeKey();

		// check if a relative time is not selected
		if (relativeTimeKey === undefined) {
			return this.absoluteTimeConfig?.startInputConfig?.placeholder;
		}

		return buildAbsoluteTimeStartPlaceholderWhenRelativeSelected(relativeTimeKey, this.getRelativeTimeOptions());
	};

	private getAbsoluteTimeEndPlaceholder = (): string | undefined => {
		const relativeTimeKey = this.getRelativeTimeKey();

		// check if a relative time is not selected
		if (relativeTimeKey === undefined) {
			return this.absoluteTimeConfig?.endInputConfig?.placeholder;
		}

		return 'Now';
	};

	public getSelectedTimezone = (): string | undefined => {
		if (this.selectedTimezone !== undefined) {
			return this.selectedTimezone;
		}

		const defaultTimezone = getDefaultTimezone();
		if (this.timezones.includes(defaultTimezone)) {
			return defaultTimezone;
		}

		return undefined;
	};

	public getStartInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_START_DATE_INPUT_CONFIG, this.absoluteTimeConfig?.startInputConfig ?? {}, { placeholder: this.getAbsoluteTimeStartPlaceholder() });
	};

	public getEndInputConfig = (): Partial<ITextField> => {
		return merge({}, DEFAULT_END_DATE_INPUT_CONFIG, this.absoluteTimeConfig?.endInputConfig ?? {}, { placeholder: this.getAbsoluteTimeEndPlaceholder() });
	};

	render() {
		const hasTimezones = this.timezones.length > 0;
		const searchedTimezones = searchString(this.timezonesSearchTerm, this.timezones);
		const dropdownOptions = buildTimezonesDropdownOptions(searchedTimezones);

		return (
			<Host>
				<div class="advance-date-selector" part="calendar">
					<div class="date-selector">
						<div class="selector absolute-date-selector">
							<div class="date-selector-label">Absolute time range</div>
							<kv-range-dates-select-dropdown
								id="range-dates-dropdown"
								initialDate={this.absoluteTimeConfig?.initialDate}
								disabledDates={this.absoluteTimeConfig?.disabledDates}
								minDate={this.absoluteTimeConfig?.minDate}
								maxDate={this.absoluteTimeConfig?.maxDate}
								selectedRangeDates={this.getAbsoluteTimeRange()}
								startInputConfig={this.getStartInputConfig()}
								endInputConfig={this.getEndInputConfig()}
								onSelectRangeDates={this.onSelectRangeDates}
							/>
						</div>
						<div class="selector relative-date-selector">
							<div class="date-selector-label">Relative time range</div>
							<kv-select>
								{this.getRelativeTimeOptions().map(({ label, value, disabled }) => (
									<kv-select-option
										key={label}
										label={label}
										value={value}
										disabled={disabled}
										selected={value === this.getRelativeTimeKey()}
										onItemSelected={this.onSelectRelativeOption}
									/>
								))}
							</kv-select>
						</div>
					</div>
					{hasTimezones && (
						<div class="selector timezone-selector">
							<kv-single-select-dropdown
								label={TIMEZONES_SEARCH_LABEL}
								icon={EIconName.Calendar}
								searchable
								placeholder={TIMEZONES_PLACEHOLDER}
								searchPlaceholder={TIMEZONES_SEARCH_PLACEHOLDER}
								selectedOption={this.getSelectedTimezone()}
								onSearchChange={this.onTimezoneSearchTermChange}
								onOptionSelected={this.onTimezoneSelected}
								options={dropdownOptions}
							/>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
