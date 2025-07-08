import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EAbsoluteTimePickerMode, IAbsoluteSelectedRangeDates } from '../absolute-time-picker/absolute-time-picker.types';
import { buildTimezoneByOffset, getDefaultTimezone, getTimezoneOffset, getTimezonesNames } from '../../utils/date.helper';
import { CALENDAR_MASK, DATETIME_INPUT_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { buildCustomIntervalTimeRange, buildTooltipText, hasRangeChanged } from '../time-picker/time-picker.helper';
import { isEmpty, isNumber, merge } from 'lodash';
import { ITextField } from '../text-field/text-field.types';
import { DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG } from '../time-picker/time-picker.config';
import { ComputePositionConfig } from '@floating-ui/dom';
import dayjs from 'dayjs';
import { EActionButtonType } from '../action-button/action-button.types';
import { EComponentSize, ETooltipPosition, ITimePickerTimezone, ITimezoneOffset, SelectedTimestamp } from '../../types';
import { IAbsoluteTimePickerDropdown, IAbsoluteTimePickerDropdownEvents } from './absolute-time-picker-dropdown.types';
import { getSelectedTimestampDates, getFormattedSelectedDates, isAbsoluteTimePickerFilled, getAbsoluteTimePickerError } from './absolute-time-picker-dropdown.utils';

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
	@Prop({ reflect: false }) timezone?: ITimePickerTimezone;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: ITimezoneOffset[] = buildTimezoneByOffset(getTimezonesNames());
	/** @inheritdoc */
	@Prop({ reflect: false }) disabledDates?: string[] = [];
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMinDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) calendarInputMaxDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) mode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Single;
	/** @inheritdoc */
	@Prop({ reflect: false }) tooltipPosition?: ETooltipPosition = ETooltipPosition.BottomStart;
	/** @inheritdoc */
	@Prop({ reflect: false }) headerTitle?: string = '';
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false, mutable: true }) dropdownOpen: boolean = false;

	// Defines the calendar initial date if needed
	@State() calendarInitialDate: string = this.initialDate;
	// Current selected option
	@State() selectedDateState: SelectedTimestamp = [];

	/** @inheritdoc */
	@Event() selectedDatesChange: EventEmitter<[number] | [number, number]>;
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

	private getSelectedTimezone = (): ITimePickerTimezone => {
		if (!isEmpty(this.timezone)) return this.timezone;

		const defaultTimezone = getDefaultTimezone();
		return {
			name: defaultTimezone,
			offset: getTimezoneOffset(defaultTimezone)
		};
	};

	private handleAbsoluteDatesChange = ({ detail }: CustomEvent<IAbsoluteSelectedRangeDates>) => {
		const range = detail.range;
		const { name: timezoneName } = this.getSelectedTimezone();
		this.selectedDateState = getSelectedTimestampDates(range, this.mode, timezoneName);
	};

	private getAbsoluteRange = (): string[] => {
		const { name: timezoneName } = this.getSelectedTimezone();
		return getFormattedSelectedDates(this.selectedDateState, this.mode, timezoneName);
	};

	private getCalendarLimitDatesFormatted = (date: number): string | undefined => {
		if (!isNumber(date)) return;

		const selectedTimezone = this.getSelectedTimezone();
		return dayjs(date).tz(selectedTimezone.name).format(DATETIME_INPUT_MASK);
	};

	private onDropdownChange = ({ detail: isDropdownOpen }: CustomEvent<boolean>) => {
		this.dropdownOpen = isDropdownOpen;
		this.dropdownStateChange.emit(isDropdownOpen);
	};

	private getTextFieldTooltip = (): string | undefined => {
		if (this.selectedDates?.length > 0) {
			return buildTooltipText(this.selectedDates, this.getSelectedTimezone(), this.timezones);
		}
	};

	private getDropdownInputValue = (): string | undefined => {
		return buildCustomIntervalTimeRange(this.selectedDates, this.getSelectedTimezone().name);
	};

	private getInputConfig = (): Partial<ITextField> => {
		const inputValue = this.getDropdownInputValue();

		return merge({}, DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG, this.inputConfig, {
			value: inputValue,
			tooltipConfig: { text: this.getTextFieldTooltip(), position: this.tooltipPosition }
		});
	};

	private onClickApply = () => {
		this.selectedDatesChange.emit(this.selectedDateState as [number] | [number, number]);
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

	render() {
		const dropdownPositionConfig = this.dropdownPositionOptions;
		const inputConfig = this.getInputConfig();
		const error = getAbsoluteTimePickerError(this.selectedDateState, this.mode, { minDate: this.calendarInputMinDate, maxDate: this.calendarInputMaxDate });

		const isFilled = isAbsoluteTimePickerFilled(this.selectedDateState, this.mode);
		const isDirty = hasRangeChanged(this.selectedDateState, this.selectedDates);
		const hasError = error !== undefined;

		const isApplyDisabled = !isFilled || hasError || !isDirty;

		return (
			<Host>
				<kv-dropdown
					isOpen={this.dropdownOpen}
					onOpenStateChange={this.onDropdownChange}
					inputConfig={inputConfig}
					options={dropdownPositionConfig}
					disabled={this.disabled}
				>
					<div class="absolute-time-content">
						<kv-absolute-time-picker
							mode={this.mode}
							headerTitle={this.headerTitle}
							selectedDates={this.getAbsoluteRange()}
							disabledDates={this.disabledDates}
							initialDate={this.calendarInitialDate}
							onSelectedDatesChange={this.handleAbsoluteDatesChange}
							calendarInputMinDate={this.getCalendarLimitDatesFormatted(this.calendarInputMinDate)}
							calendarInputMaxDate={this.getCalendarLimitDatesFormatted(this.calendarInputMaxDate)}
							error={error}
						/>
						<div class="footer">
							<div class="actions">
								<kv-action-button-text type={EActionButtonType.Tertiary} size={EComponentSize.Small} text="Cancel" onClickButton={this.onClickCancel} />
								<kv-action-button-text
									type={EActionButtonType.Primary}
									size={EComponentSize.Small}
									text="Apply"
									disabled={isApplyDisabled}
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
