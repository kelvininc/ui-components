import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EAbsoluteTimePickerMode, IAbsoluteSelectedRangeDates } from '../absolute-time-picker/absolute-time-picker.types';
import { getDefaultTimezone } from '../../utils/date.helper';
import { CALENDAR_DATE_TIME_MASK, CALENDAR_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { buildCustomIntervalTimeRange, createTimestampInTimezoneFromFormattedDate, hasRangeChanged } from '../time-picker/time-picker.helper';
import { SelectedTimestamp } from '../time-picker/time-picker.types';
import { isEmpty, isNil, merge } from 'lodash';
import { ITextField } from '../text-field/text-field.types';
import { DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG } from '../time-picker/time-picker.config';
import { ComputePositionConfig } from '@floating-ui/dom';
import dayjs from 'dayjs';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize } from '../../types';
import { IAbsoluteTimePickerDropdown, IAbsoluteTimePickerDropdownEvents } from './absolute-time-picker-dropdown.types';

@Component({
	tag: 'kv-absolute-time-picker-dropdown',
	styleUrl: 'absolute-time-picker-dropdown.scss',
	shadow: false
})
export class KvAbsoluteTimePickerDropdown implements IAbsoluteTimePickerDropdown, IAbsoluteTimePickerDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) inputConfig?: Partial<ITextField> = {};
	/** @inheritdoc */
	@Prop({ reflect: false }) dropdownPositionOptions?: Partial<ComputePositionConfig> = DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedDates?: SelectedTimestamp = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMinDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMaxDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) mode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Point;

	// Defines the calendar initial date if needed
	@State() calendarInitialDate: string = this.initialDate;
	// Current selected option
	@State() selectedDateState: SelectedTimestamp = [];
	// Dropdown open state
	@State() dropdownOpen: boolean = false;

	/** @inheritdoc */
	@Event() selectedDatesChange: EventEmitter<SelectedTimestamp>;
	/** @inheritdoc */
	@Event() cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;
	/** @inheritdoc */
	@Event() dropdownStateChange: EventEmitter<boolean>;

	componentWillLoad() {
		if (this.selectedDates?.length > 0 && this.selectedDateState?.length === 0) {
			this.selectedDateState = this.selectedDates;
			this.handleSelecteDatesChange(this.selectedDates);
		}
	}

	@Watch('selectedDates')
	handleSelecteDatesChange(newDates: SelectedTimestamp) {
		this.selectedDateState = newDates;
		if (isEmpty(this.initialDate) && newDates?.length > 0) {
			const [fromDate] = newDates;
			this.calendarInitialDate = dayjs(fromDate).format(CALENDAR_MASK);
		}
	}

	private handleAbsoluteDatesChange = ({ detail }: CustomEvent<IAbsoluteSelectedRangeDates>) => {
		const range = detail.range;
		const [from, to] = range;
		const defaultTimezone = getDefaultTimezone();

		if (this.mode === EAbsoluteTimePickerMode.Point) {
			const date = createTimestampInTimezoneFromFormattedDate(from, defaultTimezone, CALENDAR_DATE_TIME_MASK);
			this.selectedDateState = [date];
		} else {
			const dateFrom = createTimestampInTimezoneFromFormattedDate(from, defaultTimezone, CALENDAR_DATE_TIME_MASK);
			const dateTo = !isEmpty(to) ? createTimestampInTimezoneFromFormattedDate(to, defaultTimezone, CALENDAR_DATE_TIME_MASK) : undefined;
			this.selectedDateState = [dateFrom, dateTo];
		}
	};

	private getAbsoluteRange = (): string[] => {
		const defaultTimezone = getDefaultTimezone();
		const [fromDate, toDate] = this.selectedDateState ?? [];

		if (!isNil(fromDate)) {
			if (!isNil(toDate)) {
				return [dayjs(fromDate).tz(defaultTimezone).format(CALENDAR_DATE_TIME_MASK), dayjs(toDate).tz(defaultTimezone).format(CALENDAR_DATE_TIME_MASK)];
			}

			return [dayjs(fromDate).tz(defaultTimezone).format(CALENDAR_DATE_TIME_MASK)];
		}

		return [];
	};

	private onDropdownChange = ({ detail: isDropdownOpen }: CustomEvent<boolean>) => {
		this.dropdownOpen = isDropdownOpen;
		this.dropdownStateChange.emit(isDropdownOpen);
	};

	private getDropdownInputValue = (): string | undefined => {
		return buildCustomIntervalTimeRange(this.selectedDates, getDefaultTimezone());
	};

	private getInputConfig = (): Partial<ITextField> => {
		const inputValue = this.getDropdownInputValue();

		return merge({}, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG, this.inputConfig, {
			value: inputValue,
			tooltipConfig: { text: inputValue }
		});
	};

	private onClickApply = () => {
		this.selectedDatesChange.emit(this.selectedDateState);
		this.dropdownStateChange.emit(false);
		this.dropdownOpen = false;
	};

	private onClickCancel = (event: CustomEvent<MouseEvent>) => {
		this.undoLastChanges();
		this.cancelClicked.emit(event);
		this.dropdownOpen = false;
	};

	private undoLastChanges = () => {
		if (!isEmpty(this.selectedDates)) {
			this.selectedDateState = this.selectedDates;
		} else {
			this.selectedDateState = [];
		}
	};

	private isApplyButtonDisabled() {
		return this.selectedDateState?.length < 1 || !hasRangeChanged(this.selectedDateState, this.selectedDates);
	}

	render() {
		const dropdownPositionConfig = this.dropdownPositionOptions;
		const inputConfig = this.getInputConfig();

		return (
			<Host>
				<kv-dropdown isOpen={this.dropdownOpen} onOpenStateChange={this.onDropdownChange} inputConfig={inputConfig} options={dropdownPositionConfig}>
					<div class="absolute-time-content">
						<kv-absolute-time-picker
							mode={this.mode}
							headerTitle="Custom Interval"
							selectedDates={this.getAbsoluteRange()}
							disabledDates={this.disabledDates}
							initialDate={this.calendarInitialDate}
							onSelectedDatesChange={this.handleAbsoluteDatesChange}
							calendarInputMaxDate={this.calendarInputMaxDate}
							calendarInputMinDate={this.calendarInputMinDate}
						/>
						<div class="footer">
							<div class="actions">
								<kv-action-button-text type={EActionButtonType.Tertiary} size={EComponentSize.Small} text="Cancel" onClickButton={this.onClickCancel} />
								<kv-action-button-text
									type={EActionButtonType.Primary}
									size={EComponentSize.Small}
									text="Apply"
									disabled={this.isApplyButtonDisabled()}
									onClickButton={this.onClickApply}
								/>
							</div>
						</div>
					</div>
				</kv-dropdown>
			</Host>
		);
	}
}
