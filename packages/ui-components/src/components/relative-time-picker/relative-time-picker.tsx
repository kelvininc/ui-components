import { Component, Event, EventEmitter, Host, Prop, State, Watch, h } from '@stencil/core';
import {
	IRelativeTimeDropdownOption,
	IRelativeTimePicker,
	IRelativeTimePickerEvents,
	IRelativeTimePickerOption,
	ITimePickerRelativeTime,
	ITimePickerTimezone
} from './relative-time-picker.types';
import {
	CUSTOMIZE_INTERVAL_KEY,
	CUSTOMIZE_INTERVAL_LABEL,
	DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS,
	GROUP_GAP,
	MAX_HEIGHT,
	PADDING_SIZE,
	SELECT_OPTION_HEIGHT,
	TIMEZONES_PLACEHOLDER,
	TIMEZONES_SEARCH_PLACEHOLDER,
	TIME_RANGE_UPDATE_INTERVAL
} from './relative-time-picker.config';
import { ISelectSingleOptions } from '../single-select-dropdown/single-select-dropdown.types';
import { EIconName } from '../icon/icon.types';
import { buildTimezoneByOffset, formatTimezoneName, getDefaultTimezone, getTimezoneOffset, getTimezonesNames } from '../../utils/date.helper';
import { buildRelativeTimeSelectOptions, buildTimezonesDropdownOptions, getSelectedKeyRange, hasRangeChanged, isScrollNeeded } from './relative-time-picker.helper';
import { CustomCssClass, EComponentSize } from '../../types';
import { isEmpty } from 'lodash-es';
import { getClassMap } from '../../utils/css-class.helper';
import { searchDropdownOptions } from '../../utils/select.helper';
import { ITimezoneOffset, SelectedTimestamp } from '../time-picker/time-picker.types';

@Component({
	tag: 'kv-relative-time-picker',
	styleUrl: 'relative-time-picker.scss',
	shadow: true
})
export class KvRelativeTimePicker implements IRelativeTimePicker, IRelativeTimePickerEvents {
	private intervalID: number;

	/** @inheritdoc */
	@Prop({ reflect: true }) selectedTimeKey?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: IRelativeTimePickerOption[][] = DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
	/** @inheritdoc */
	@Prop({ reflect: false }) selectedTimezone?: string;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezones?: ITimezoneOffset[] = buildTimezoneByOffset(getTimezonesNames());
	/** @inheritdoc */
	@Prop({ reflect: false }) customIntervalOptionEnabled?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezoneSelectionEnabled?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) timezoneContentVisible?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) disableTimezoneSelection?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass: CustomCssClass = '';

	/** State that keeps the relative options that are constantly updated if the time
	 * changes
	 */
	@State() relativeTimeOptions: IRelativeTimeDropdownOption[][] = [];
	/** Timezone dropdown management states */
	@State() timezonesSearchTerm: string = '';
	@State() timezoneDropdownOptions: ISelectSingleOptions;
	@State() timezoneFilteredDropdownOptions: ISelectSingleOptions;

	/** State to determine if a scrollbar is needed to display all the options */
	@State() hasScroll: boolean = false;
	/** Selected option range in timestamp */
	@State() selectedOptionRange: SelectedTimestamp;

	/** @inheritdoc */
	@Event() selectedRelativeTimeChange: EventEmitter<ITimePickerRelativeTime>;
	/** @inheritdoc */
	@Event() customizeIntervalClicked: EventEmitter<string>;
	/** @inheritdoc */
	@Event() timezoneChange: EventEmitter<ITimePickerTimezone>;
	/** @inheritdoc */
	@Event() timezoneInputClicked: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event({ bubbles: false }) timezoneDropdownStateChange: EventEmitter<boolean>;

	@Watch('options')
	handleRelativeTimeOptionsChanges() {
		const optionsToBuild = this.options ?? DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
		const dropdownOptions = buildRelativeTimeSelectOptions(optionsToBuild, this.getSelectedTimezone());
		this.relativeTimeOptions = dropdownOptions;

		if (!isEmpty(this.selectedTimeKey) && this.selectedTimeKey !== CUSTOMIZE_INTERVAL_KEY) {
			const currentRange = getSelectedKeyRange(dropdownOptions, this.selectedTimeKey);
			this.hasSelectedKeyRangeChanged(currentRange, this.selectedTimeKey);
		}

		if (this.relativeTimeOptions && this.relativeTimeOptions.length === 0) return;

		this.hasScroll = isScrollNeeded(this.options, this.customIntervalOptionEnabled, this.timezoneSelectionEnabled);
	}

	@Watch('timezones')
	onTimezonesChange(timezones?: ITimezoneOffset[]) {
		this.timezoneDropdownOptions = buildTimezonesDropdownOptions(timezones);
	}

	@Watch('timezonesSearchTerm')
	onTimezoneSearch(searchTerm: string) {
		this.timezoneFilteredDropdownOptions = searchDropdownOptions(searchTerm, this.timezoneDropdownOptions);
	}

	@Watch('selectedTimeKey')
	onSelectedTimeKeyChange(newKey: string) {
		if (newKey !== CUSTOMIZE_INTERVAL_KEY) {
			this.selectedOptionRange = getSelectedKeyRange(this.relativeTimeOptions, this.selectedTimeKey);
		}
	}

	@Watch('selectedTimezone')
	onSelectedTimezoneChange() {
		this.handleRelativeTimeOptionsChanges();
	}

	componentWillLoad() {
		this.handleRelativeTimeOptionsChanges();
	}

	connectedCallback() {
		this.timezoneDropdownOptions = buildTimezonesDropdownOptions(this.timezones);

		this.intervalID = window.setInterval(() => {
			this.handleRelativeTimeOptionsChanges();
		}, TIME_RANGE_UPDATE_INTERVAL);
	}

	disconnectedCallback() {
		window.clearInterval(this.intervalID);
	}

	private onTimezoneSearchTermChange = ({ detail: newSearchTerm }: CustomEvent<string>): void => {
		this.timezonesSearchTerm = newSearchTerm;
	};

	private onTimezoneSelected = ({ detail: newSelectedTimezone }: CustomEvent<string>): void => {
		this.timezoneChange.emit({
			name: newSelectedTimezone,
			offset: getTimezoneOffset(newSelectedTimezone)
		});
	};

	private onSelectRelativeOption = ({ detail: newOption }: CustomEvent<string>, range: SelectedTimestamp): void => {
		this.hasSelectedKeyRangeChanged(range, newOption);
	};

	private hasSelectedKeyRangeChanged = (newRange: SelectedTimestamp, optionSelected: string): void => {
		if (hasRangeChanged(this.selectedOptionRange, newRange) || optionSelected !== this.selectedTimeKey) {
			this.selectedOptionRange = newRange;
			this.selectedRelativeTimeChange.emit({
				key: optionSelected,
				range: newRange
			});
		}
	};

	private onSelectCustomizeIntervalOption = ({ detail: newOption }: CustomEvent<string>): void => {
		this.selectedOptionRange = [];
		this.customizeIntervalClicked.emit(newOption);
	};

	private handleShowTimezoneContent = () => {
		this.timezoneInputClicked.emit(true);
	};

	private getSelectedTimezone = (): string => {
		if (this.selectedTimezone !== undefined) {
			return this.selectedTimezone;
		}

		return getDefaultTimezone();
	};

	private getSelectedTimezoneTitle = (): string => {
		const timezone = this.getSelectedTimezone();
		return timezone ? formatTimezoneName(timezone) : '';
	};

	private onTimezoneChange = ({ detail: openState }: CustomEvent<boolean>) => {
		this.timezoneDropdownStateChange.emit(openState);
	};

	render() {
		return (
			<Host>
				<div
					class={{
						...getClassMap(this.customClass),
						'relative-time-container': true
					}}
					style={{
						['--max-height']: `${MAX_HEIGHT}px`,
						['--group-gap']: `${GROUP_GAP}px`
					}}
				>
					<div
						class={{
							'relative-time-selector': true,
							'relative-time-selector--has-scroll': this.hasScroll
						}}
						style={{
							['--option-height']: `${SELECT_OPTION_HEIGHT}px`,
							['--padding-size']: `${PADDING_SIZE}px`
						}}
					>
						{this.relativeTimeOptions.map((group, index) => (
							<div key={index} class="relative-time-group">
								{group.map(({ label, value, description, range }) => (
									<kv-time-picker-select-option
										key={label}
										label={label}
										value={value}
										description={description}
										selected={value === this.selectedTimeKey}
										onItemSelected={detail => this.onSelectRelativeOption(detail, range)}
									/>
								))}
							</div>
						))}
					</div>
					{this.customIntervalOptionEnabled && (
						<div class="selectable">
							<kv-select-option
								key={CUSTOMIZE_INTERVAL_KEY}
								label={CUSTOMIZE_INTERVAL_LABEL}
								value={CUSTOMIZE_INTERVAL_KEY}
								selected={CUSTOMIZE_INTERVAL_KEY === this.selectedTimeKey}
								onItemSelected={this.onSelectCustomizeIntervalOption}
							/>
						</div>
					)}
					{this.timezoneSelectionEnabled && (
						<div class="selectable">
							<kv-input-wrapper
								contentVisible={this.timezoneContentVisible}
								contentHidden={this.disableTimezoneSelection}
								label={this.getSelectedTimezoneTitle()}
								icon={EIconName.Edit}
								onContentClick={this.handleShowTimezoneContent}
							>
								<kv-single-select-dropdown
									searchable
									icon={EIconName.Time}
									placeholder={TIMEZONES_PLACEHOLDER}
									inputSize={EComponentSize.Small}
									searchPlaceholder={TIMEZONES_SEARCH_PLACEHOLDER}
									options={this.timezoneDropdownOptions}
									filteredOptions={this.timezoneFilteredDropdownOptions}
									selectedOption={this.getSelectedTimezone()}
									onSearchChange={this.onTimezoneSearchTermChange}
									onOptionSelected={this.onTimezoneSelected}
									onOpenStateChange={this.onTimezoneChange}
								/>
							</kv-input-wrapper>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
