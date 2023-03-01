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
import { ISingleSelectDropdownOptions } from '../single-select-dropdown/single-select-dropdown.types';
import { ITimezoneOffset } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.types';
import { EIconName } from '../icon/icon.types';
import { getDefaultTimezone, getTimezoneOffset, getTimezonesNames } from '../../utils/date.helper';
import { searchString } from '../../utils/search.helper';
import { buildTimezoneByOffset, buildTimezonesDropdownOptions } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.helper';
import { buildRelativeTimeSelectOptions, getSelectedKeyRange, hasRangeChanged, isScrollNeeded } from './relative-time-picker.helper';
import { EComponentSize, SelectedRange } from '../../types';
import { isEmpty } from 'lodash-es';

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
	@Prop({ reflect: false }) timezones?: string[] = getTimezonesNames();
	/** @inheritdoc */
	@Prop({ reflect: false }) customizeIntervalOptionVisible?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) timezoneSelectVisible?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) disableTimezoneSelection?: boolean = false;

	/** State that keeps the relative options that are constantly updated if the time
	 * changes
	 */
	@State() relativeTimeOptions: IRelativeTimeDropdownOption[][] = [];
	/** Timezone dropdown management states */
	@State() timezonesSearchTerm: string = '';
	@State() timezonesByOffset: ITimezoneOffset[];
	@State() timezoneDropdownOptions: ISingleSelectDropdownOptions;
	/** State to determine if a scrollbar is needed to display all the options */
	@State() hasScroll: boolean = false;
	/** State to determine if the timezone dropdown is visible */
	@State() timezoneContentVisible: boolean = false;
	@State() selectedOptionRange: SelectedRange;

	/** @inheritdoc */
	@Event() selectedRelativeTimeChange: EventEmitter<ITimePickerRelativeTime>;
	/** @inheritdoc */
	@Event() customizeIntervalClicked: EventEmitter<string>;
	/** @inheritdoc */
	@Event() timezoneChange: EventEmitter<ITimePickerTimezone>;

	@Watch('options')
	handleRelativeTimeOptionsChanges() {
		const optionsToBuild = this.options ?? DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS;
		const dropdownOptions = buildRelativeTimeSelectOptions(optionsToBuild);
		this.relativeTimeOptions = dropdownOptions;

		if (!isEmpty(this.selectedTimeKey) && this.selectedTimeKey !== CUSTOMIZE_INTERVAL_KEY) {
			const currentRange = getSelectedKeyRange(dropdownOptions, this.selectedTimeKey);
			this.hasSelectedKeyRangeChanged(currentRange, this.selectedTimeKey);
		}

		if (this.relativeTimeOptions && this.relativeTimeOptions.length === 0) return;

		this.hasScroll = isScrollNeeded(this.options, this.customizeIntervalOptionVisible, this.timezoneSelectVisible);
	}

	@Watch('timezones')
	handleTimezonesChanges(timezones: string[]) {
		this.timezonesByOffset = buildTimezoneByOffset(timezones);
	}

	@Watch('timezonesSearchTerm')
	onTimezoneSearch(searchTerm: string) {
		const searchedTimezones = searchString(searchTerm, this.timezonesByOffset);
		this.timezoneDropdownOptions = buildTimezonesDropdownOptions(searchedTimezones);
	}

	@Watch('selectedTimeKey')
	onSelectedTimeKeyChange(newKey: string) {
		if (newKey !== CUSTOMIZE_INTERVAL_KEY) {
			this.selectedOptionRange = getSelectedKeyRange(this.relativeTimeOptions, this.selectedTimeKey);
		}
	}

	componentWillLoad() {
		this.handleTimezonesChanges(this.timezones);
		this.onTimezoneSearch('');
		this.handleRelativeTimeOptionsChanges();
	}

	connectedCallback() {
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

	private onSelectRelativeOption = ({ detail: newOption }: CustomEvent<string>, range: SelectedRange): void => {
		this.hasSelectedKeyRangeChanged(range, newOption);
	};

	private hasSelectedKeyRangeChanged = (newRange: SelectedRange, optionSelected: string): void => {
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
		this.timezoneContentVisible = true;
	};

	private getSelectedTimezone = (): string | undefined => {
		if (this.selectedTimezone !== undefined) {
			return this.selectedTimezone;
		}

		const defaultTimezone = getDefaultTimezone();
		if (this.timezones.includes(defaultTimezone)) {
			return defaultTimezone;
		}

		return undefined;
	};

	render() {
		return (
			<Host>
				<div
					class="relative-time-container"
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
					{this.customizeIntervalOptionVisible && (
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
					{this.timezoneSelectVisible && (
						<div class="selectable">
							<kv-input-wrapper
								contentVisible={this.timezoneContentVisible}
								contentDisabled={this.disableTimezoneSelection}
								label={this.getSelectedTimezone()}
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
									selectedOption={this.getSelectedTimezone()}
									onSearchChange={this.onTimezoneSearchTermChange}
									onOptionSelected={this.onTimezoneSelected}
								/>
							</kv-input-wrapper>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
