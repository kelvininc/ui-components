import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import { EAbsoluteTimePickerMode, EIconName, EInputSource, ITimePickerTimezone } from '../../types';
import { EDateTimeInputTypeStyle } from '../date-time-input/date-time-input.types';
import {
	CALENDAR_DATE_FORMAT,
	DATE_FORMAT,
	DATE_TIME_INPUT_DATE_FORMAT,
	DEFAULT_LEFT_INPUT_CONFIG,
	DEFAULT_RIGHT_INPUT_CONFIG,
	EMPTY_INPUT_PLACEHOLDER,
	INPUT_MASK_PLACEHOLDER
} from './absolute-time-picker-dropdown-input.config';
import dayjs from 'dayjs';
import { fromISO, getDefaultTimezoneSettings } from '../../utils/date.helper';
import { getFirstCalendarInitialDate, getSecondCalendarInitialDate } from '../absolute-time-picker/absolute-time-picker.helper';
import { IClickDateEvent } from '../time-picker-calendar/time-picker-calendar.types';
import { IAbsoluteTimePickerDropdownInput, IAbsoluteTimePickerDropdownInputEvents, SelectedTime, SelectedTimeState, TimeRange } from './absolute-time-picker-dropdown-input.types';
import { isEmpty, isNumber } from 'lodash';
import { getRangeCalendarDates, getRangeInputValues, getSingleCalendarDate, getSingleInputDate } from './absolute-time-picker-dropdown-input.utils';

@Component({
	tag: 'kv-absolute-time-picker-dropdown-input',
	styleUrl: 'absolute-time-picker-dropdown-input.scss',
	shadow: false
})
export class KvAbsoluteTimePickerDropdownInput implements IAbsoluteTimePickerDropdownInput, IAbsoluteTimePickerDropdownInputEvents {
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedTime?: SelectedTime | SelectedTimeState;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezone?: ITimePickerTimezone = getDefaultTimezoneSettings();
	/** @inheritdoc */
	@Prop({ reflect: false }) mode?: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Range;
	/** @inheritdoc */
	@Prop({ reflect: false, mutable: true }) isDropdownOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) disabled?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) initialDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) minimumFromInputDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) minimumToInputDate?: number;
	/** @inheritdoc */
	@Prop({ reflect: false }) minimumSingleInputDate?: number;

	/** @inheritdoc */
	@Event() selectedTimeChange: EventEmitter<SelectedTime>;
	/** @inheritdoc */
	@Event() dropdownStateChange: EventEmitter<boolean>;

	@State() rangeInputValues: TimeRange;
	@State() singleTimeInputValue: string = '';

	@State() displayedMonth: dayjs.Dayjs = isNumber(this.initialDate) ? dayjs(this.initialDate) : dayjs();
	@State() focusedInput: EInputSource;
	/** Shared hovered date between calendars for range mode */
	@State() hoveredDate: string = '';

	componentWillLoad() {
		this.syncSelectedTimeState(this.selectedTime);
	}

	@Watch('selectedTime')
	handleSelectedTimeChange(newValue: SelectedTime | SelectedTimeState) {
		this.syncSelectedTimeState(newValue);
	}

	syncSelectedTimeState(newValue: SelectedTime | SelectedTimeState) {
		if (this.mode === EAbsoluteTimePickerMode.Single) {
			this.singleTimeInputValue = getSingleInputDate(newValue, this.timezone.name);
		} else {
			this.rangeInputValues = getRangeInputValues(newValue, this.timezone.name);
		}
	}

	private handleInputFocus = (source: EInputSource) => {
		this.focusedInput = source;

		if (!this.isDropdownOpen) {
			this.isDropdownOpen = true;
			this.dropdownStateChange.emit(this.isDropdownOpen);
		}
	};

	private onClickDate = ({ detail }: CustomEvent<IClickDateEvent>): void => {
		let clickedDate = fromISO(detail.date);

		if (this.mode === EAbsoluteTimePickerMode.Single) {
			if (isNumber(this.minimumSingleInputDate) && dayjs(clickedDate).isBefore(this.minimumSingleInputDate)) {
				clickedDate = dayjs(this.minimumSingleInputDate);
			}

			this.singleTimeInputValue = clickedDate.format(DATE_FORMAT);
			return;
		}

		if (this.focusedInput === EInputSource.From) {
			if (isNumber(this.minimumFromInputDate) && dayjs(clickedDate).isBefore(this.minimumFromInputDate)) {
				clickedDate = dayjs(this.minimumFromInputDate);
			}

			this.rangeInputValues = { ...this.rangeInputValues, from: clickedDate.format(DATE_FORMAT) };
		} else {
			if (isNumber(this.minimumToInputDate) && dayjs(clickedDate).isBefore(this.minimumToInputDate)) {
				clickedDate = dayjs(this.minimumToInputDate);
			}

			this.rangeInputValues = { ...this.rangeInputValues, to: clickedDate.format(DATE_FORMAT) };
		}
	};

	private handleEmptyTextChange = () => {
		if (this.mode === EAbsoluteTimePickerMode.Single) {
			this.singleTimeInputValue = '';
		} else {
			if (this.focusedInput === EInputSource.From) {
				this.rangeInputValues = { ...this.rangeInputValues, from: '' };
			} else {
				this.rangeInputValues = { ...this.rangeInputValues, to: '' };
			}
		}
	};

	private hanleOnTextChange = (event: CustomEvent<string>) => {
		const parsedDateTime = dayjs(event.detail, DATE_FORMAT);

		if (isEmpty(event.detail)) {
			this.handleEmptyTextChange();
			return;
		}

		if (parsedDateTime.isValid()) {
			if (this.mode === EAbsoluteTimePickerMode.Single) {
				this.singleTimeInputValue = parsedDateTime.format(DATE_FORMAT);
				this.displayedMonth = parsedDateTime;
				return;
			}

			if (this.focusedInput === EInputSource.From) {
				this.rangeInputValues = { ...this.rangeInputValues, from: parsedDateTime.format(DATE_FORMAT) };
			} else {
				this.rangeInputValues = { ...this.rangeInputValues, to: parsedDateTime.format(DATE_FORMAT) };
			}
			this.displayedMonth = parsedDateTime;
		}
	};

	private handleClickBackMonth = () => {
		this.displayedMonth = this.displayedMonth.subtract(1, 'month');
	};

	private handleClickForwardMonth = () => {
		this.displayedMonth = this.displayedMonth.add(1, 'month');
	};

	private handleHoveredDateChange = (event: CustomEvent<string>) => {
		if (this.mode === EAbsoluteTimePickerMode.Range) this.hoveredDate = event.detail;
	};

	private handleCloseDropdown = () => {
		this.isDropdownOpen = false;
		this.focusedInput = null;
		if (this.mode === EAbsoluteTimePickerMode.Single) {
			if (isEmpty(this.singleTimeInputValue)) {
				this.syncSelectedTimeState(this.selectedTime);
			} else {
				this.selectedTimeChange.emit([dayjs(this.singleTimeInputValue, DATE_FORMAT).tz(this.timezone.name, true).valueOf()]);
			}
		} else {
			if (isEmpty(this.rangeInputValues?.from) || isEmpty(this.rangeInputValues?.to)) {
				this.syncSelectedTimeState(this.selectedTime);
			} else {
				this.selectedTimeChange.emit([
					dayjs(this.rangeInputValues.from, DATE_FORMAT).tz(this.timezone.name, true).valueOf(),
					dayjs(this.rangeInputValues.to, DATE_FORMAT).tz(this.timezone.name, true).valueOf()
				]);
			}
		}
		this.dropdownStateChange.emit(this.isDropdownOpen);
	};

	private handleDropdownArrowClick = () => {
		const previousDropdownState = this.isDropdownOpen;

		// Dropdown was open, we need to handle the time state update and close the dropdown
		if (previousDropdownState) {
			this.handleCloseDropdown();
		} else {
			this.isDropdownOpen = true;
			this.focusedInput = this.mode === EAbsoluteTimePickerMode.Single ? EInputSource.Single : EInputSource.To;
			this.dropdownStateChange.emit(this.isDropdownOpen);
		}
	};

	private isHoveringStylingActive = () => {
		return (!isEmpty(this.rangeInputValues?.from) && this.focusedInput === EInputSource.To) || (!isEmpty(this.rangeInputValues?.to) && this.focusedInput === EInputSource.From);
	};

	private getMinimumCalendarDate = () => {
		return this.mode === EAbsoluteTimePickerMode.Single
			? isNumber(this.minimumSingleInputDate) && dayjs(this.minimumSingleInputDate).format(CALENDAR_DATE_FORMAT)
			: isNumber(this.minimumFromInputDate) && dayjs(this.minimumFromInputDate).format(CALENDAR_DATE_FORMAT);
	};

	private getSelectedCalendarDates = () => {
		const inputDate = this.mode === EAbsoluteTimePickerMode.Single ? getSingleCalendarDate(this.singleTimeInputValue) : getRangeCalendarDates(this.rangeInputValues);

		if (inputDate) return inputDate;

		if (this.selectedTime) {
			return this.mode === EAbsoluteTimePickerMode.Single
				? getSingleCalendarDate(getSingleInputDate(this.selectedTime, this.timezone.name))
				: getRangeCalendarDates(getRangeInputValues(this.selectedTime, this.timezone.name));
		}

		return [];
	};

	render() {
		const fromCalendarInitialDate = getFirstCalendarInitialDate(this.displayedMonth);
		const toCalendarInitialDate = getSecondCalendarInitialDate(this.displayedMonth);
		const selectedDates = this.getSelectedCalendarDates();
		const useFromInputInputMask = this.focusedInput === EInputSource.From;
		const useToInputInputMask = this.focusedInput === EInputSource.To;
		const useSingleInputInputMask = this.focusedInput === EInputSource.Single;
		const isHoveringStyleEnabled = this.isHoveringStylingActive();
		const minimumCalendarDate = this.getMinimumCalendarDate();

		return (
			<Host>
				<kv-dropdown-base isOpen={this.isDropdownOpen} onClickOutside={this.handleCloseDropdown}>
					<slot name="dropdown-action" slot="action">
						{this.mode === EAbsoluteTimePickerMode.Range ? (
							<div class="time-range-input-container">
								<kv-date-time-input
									disabled={this.disabled}
									inputStyleType={EDateTimeInputTypeStyle.MergedLeft}
									value={this.rangeInputValues?.from}
									dateFormat={DATE_TIME_INPUT_DATE_FORMAT}
									placeholder={useFromInputInputMask ? INPUT_MASK_PLACEHOLDER : EMPTY_INPUT_PLACEHOLDER}
									useInputMask={useFromInputInputMask}
									onInputFocus={() => this.handleInputFocus(EInputSource.From)}
									forcedFocus={this.focusedInput === EInputSource.From && this.isDropdownOpen}
									onTextChange={this.hanleOnTextChange}
									{...DEFAULT_LEFT_INPUT_CONFIG}
								/>
								<kv-date-time-input
									disabled={this.disabled}
									inputStyleType={EDateTimeInputTypeStyle.MergedRight}
									value={this.rangeInputValues?.to}
									dateFormat={DATE_TIME_INPUT_DATE_FORMAT}
									placeholder={useToInputInputMask ? INPUT_MASK_PLACEHOLDER : EMPTY_INPUT_PLACEHOLDER}
									useInputMask={useToInputInputMask}
									onInputFocus={() => this.handleInputFocus(EInputSource.To)}
									forcedFocus={this.focusedInput === EInputSource.To && this.isDropdownOpen}
									rightIcon={this.isDropdownOpen ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
									onTextChange={this.hanleOnTextChange}
									onRightIconClick={this.handleDropdownArrowClick}
									{...DEFAULT_RIGHT_INPUT_CONFIG}
								/>
							</div>
						) : (
							<div class="single-input-container">
								<kv-date-time-input
									disabled={this.disabled}
									value={this.singleTimeInputValue}
									dateFormat={DATE_TIME_INPUT_DATE_FORMAT}
									placeholder={useSingleInputInputMask ? INPUT_MASK_PLACEHOLDER : EMPTY_INPUT_PLACEHOLDER}
									useInputMask={useSingleInputInputMask}
									forcedFocus={this.focusedInput === EInputSource.Single && this.isDropdownOpen}
									onInputFocus={() => this.handleInputFocus(EInputSource.Single)}
									inputStyleType={EDateTimeInputTypeStyle.Separated}
									rightIcon={this.isDropdownOpen ? EIconName.ArrowDropUp : EIconName.ArrowDropDown}
									onTextChange={this.hanleOnTextChange}
									onRightIconClick={this.handleDropdownArrowClick}
									{...DEFAULT_LEFT_INPUT_CONFIG}
								/>
							</div>
						)}
					</slot>
					<div slot="list">
						<div class="calendar-container">
							<kv-time-picker-calendar
								mode={this.mode}
								displayNextMonthArrow={false}
								displayPreviousMonthArrow
								selectedDates={selectedDates}
								hoveredDate={this.hoveredDate}
								onHoveredDateChange={this.handleHoveredDateChange}
								disableHoveringStyling={!isHoveringStyleEnabled}
								initialDate={fromCalendarInitialDate}
								onChangeMonth={this.handleClickBackMonth}
								onClickDate={this.onClickDate}
								minDate={minimumCalendarDate}
							/>
							<kv-time-picker-calendar
								mode={this.mode}
								displayNextMonthArrow
								displayPreviousMonthArrow={false}
								selectedDates={selectedDates}
								hoveredDate={this.hoveredDate}
								onHoveredDateChange={this.handleHoveredDateChange}
								disableHoveringStyling={!isHoveringStyleEnabled}
								initialDate={toCalendarInitialDate}
								onChangeMonth={this.handleClickForwardMonth}
								onClickDate={this.onClickDate}
								minDate={minimumCalendarDate}
							/>
						</div>
					</div>
				</kv-dropdown-base>
			</Host>
		);
	}
}
