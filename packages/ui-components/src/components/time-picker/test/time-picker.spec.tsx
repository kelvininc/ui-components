import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { KvTimePicker } from '../time-picker';
import { KvAbsoluteTimePicker } from '../../absolute-time-picker/absolute-time-picker';
import { APPLY_BUTTON_INVALID_DATE_TOOLTIP_TEXT, DEFAULT_SELECTED_TIME_KEY, FULL_RANGE_SIZE, SINGLE_RANGE_SIZE } from '../time-picker.config';
import { getCalendarLimits, getRelativeViewHeight, validateNewRange } from '../time-picker.helper';
import { EAbsoluteTimePickerMode, IAbsoluteSelectedRangeDates } from '../../absolute-time-picker/absolute-time-picker.types';
import { EAbsoluteTimeError } from '../../absolute-time-picker-dropdown/absolute-time-picker-dropdown.types';
import { DEFAULT_HEADER_TITLE, SINGLE_DATE_HEADER_TITLE } from '../../absolute-time-picker/absolute-time-picker.config';
import { MOCK_RELATIVE_TIME_OPTIONS_GROUPS } from '../../relative-time-picker/test/relative-time-picker.mock';
import { BOTTOM_OPTIONS_HEIGHT, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from '../../relative-time-picker/relative-time-picker.config';
import { CUSTOM_TIME_RANGE_KEY, DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS } from '../../../utils/relative-time';
import { ITimePickerRelativeTime, ITimePickerTimezone } from '../../relative-time-picker/relative-time-picker.types';
import { ETimePickerView, SelectedTimestamp } from '../time-picker.types';

const TIMEZONE: ITimePickerTimezone = { name: 'UTC', offset: 0 };
const TOKYO_TIMEZONE: ITimePickerTimezone = { name: 'Asia/Tokyo', offset: 540 };
const FROM = 1681319856833;
const TO = 1681406272018;

/**
 * Simulates a click on a relative option, mirroring `kv-relative-time-picker.onSelectRelativeOption`:
 * `selectedRelativeTimeChange` fires only when the key or range actually moved, `relativeTimeOptionClicked`
 * always does. Pass `changed: false` for a re-click on the option that is already selected.
 *
 * `kv-relative-time-picker` is not registered in these spec pages, so the events are dispatched directly
 * on its element — a non-bubbling event still reaches the listener the vdom attached there.
 */
const clickRelativeOption = (page: SpecPage, key: string, range: SelectedTimestamp, { changed = true }: { changed?: boolean } = {}): void => {
	const relativePicker = page.root.querySelector('kv-relative-time-picker');

	if (changed) {
		relativePicker.dispatchEvent(new CustomEvent<ITimePickerRelativeTime>('selectedRelativeTimeChange', { detail: { key, range } }));
	}

	relativePicker.dispatchEvent(new CustomEvent<ITimePickerRelativeTime>('relativeTimeOptionClicked', { detail: { key, range } }));
};

describe('KvTimePicker (unit tests)', () => {
	let page: SpecPage;
	let component: KvTimePicker;

	describe('when the component loads with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePicker],
				template: () => <kv-time-picker />
			});
			component = page.rootInstance;
		});

		it('should preselect the default relative option', () => {
			expect(component.selectedTimeState.key).toEqual(DEFAULT_SELECTED_TIME_KEY);
			expect(component.selectedTimeState.range).toHaveLength(FULL_RANGE_SIZE);
		});

		it('should display the show calendar toggle', () => {
			expect(page.root.querySelector('.show-calendar-toggle')).not.toBeNull();
		});

		it('should size the relative view to the maximum height', () => {
			const wrapper = page.root.querySelector<HTMLElement>('.content-wrapper');
			expect(wrapper.style.getPropertyValue('--relative-view-height')).toEqual(`${MAX_HEIGHT}px`);
		});

		it('should disable apply for a single date while in range mode', () => {
			component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [FROM], timezone: TIMEZONE };
			expect(component['isApplyButtonDisabled']()).toBe(true);
		});

		it('should not display the apply and cancel actions', () => {
			expect(page.root.querySelector('.actions')).toBeNull();
		});
	});

	describe('when the options do not contain the default relative option', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePicker],
				template: () => <kv-time-picker relativeTimePickerOptions={MOCK_RELATIVE_TIME_OPTIONS_GROUPS} displayTimezoneDropdown={false} />
			});
			component = page.rootInstance;
		});

		it('should not preselect any option', () => {
			expect(component.selectedTimeState.key).toEqual('');
			expect(component.selectedTimeState.range).toEqual([]);
		});

		it('should disable the apply button', () => {
			expect(component['isApplyButtonDisabled']()).toBe(true);
		});

		it('should size the relative view to its content', () => {
			const wrapper = page.root.querySelector<HTMLElement>('.content-wrapper');
			const expectedHeight = SELECT_OPTION_HEIGHT + 2 * PADDING_SIZE + BOTTOM_OPTIONS_HEIGHT;
			expect(wrapper.style.getPropertyValue('--relative-view-height')).toEqual(`${expectedHeight}px`);
		});
	});

	describe('when the calendar toggle is hidden and the calendar is in single mode', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePicker],
				template: () => <kv-time-picker displayCalendarToggle={false} calendarMode={EAbsoluteTimePickerMode.Single} />
			});
			component = page.rootInstance;
		});

		it('should not display the show calendar toggle', () => {
			expect(page.root.querySelector('.show-calendar-toggle')).toBeNull();
		});

		it('should not render the footer at all', () => {
			expect(page.root.querySelector('.footer')).toBeNull();
		});

		it('should enable apply for a single custom date', () => {
			component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [FROM], timezone: TIMEZONE };
			expect(component['isApplyButtonDisabled']()).toBe(false);
		});

		it('should disable apply when no custom date is selected', () => {
			component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [], timezone: TIMEZONE };
			expect(component['isApplyButtonDisabled']()).toBe(true);
		});

		it('should still require a full range for relative options', () => {
			component.selectedTimeState = { key: DEFAULT_SELECTED_TIME_KEY, range: [FROM], timezone: TIMEZONE };
			expect(component['isApplyButtonDisabled']()).toBe(true);
			component.selectedTimeState = { key: DEFAULT_SELECTED_TIME_KEY, range: [FROM, TO], timezone: TIMEZONE };
			expect(component['isApplyButtonDisabled']()).toBe(false);
		});
	});
});

describe('KvTimePicker (option list commits on click)', () => {
	let page: SpecPage;
	let component: KvTimePicker;
	let timeRangeChange: jest.Mock;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen={true} />
		});
		component = page.rootInstance;
		timeRangeChange = jest.fn();
		page.root.addEventListener('timeRangeChange', timeRangeChange);
	});

	it('should commit the clicked option and close the panel', async () => {
		clickRelativeOption(page, 'today', [FROM, TO]);
		await page.waitForChanges();

		expect(timeRangeChange).toHaveBeenCalledTimes(1);
		expect(timeRangeChange.mock.calls[0][0].detail).toEqual(expect.objectContaining({ key: 'today', range: [FROM, TO] }));
		expect(component.isOpen).toBe(false);
	});

	it('should commit again when the already selected option is clicked', async () => {
		const { key, range } = component.selectedTimeState;

		clickRelativeOption(page, key, range, { changed: false });
		await page.waitForChanges();

		expect(timeRangeChange).toHaveBeenCalledTimes(1);
		expect(component.isOpen).toBe(false);
	});

	// The periodic refresh in kv-relative-time-picker re-emits `selectedRelativeTimeChange` as a
	// "now"-relative range moves. Committing from it would make an open panel close itself unprompted.
	it('should not commit from the periodic range refresh', async () => {
		component['onSelectedRelativeTimeChange']({ detail: { key: DEFAULT_SELECTED_TIME_KEY, range: [FROM, TO] } } as CustomEvent<ITimePickerRelativeTime>);
		await page.waitForChanges();

		expect(timeRangeChange).not.toHaveBeenCalled();
		expect(component.isOpen).toBe(true);
	});

	it('should commit a timezone change without closing the panel', async () => {
		component['onSelectedTimezoneChange']({ detail: TOKYO_TIMEZONE } as CustomEvent<ITimePickerTimezone>);
		await page.waitForChanges();

		expect(timeRangeChange).toHaveBeenCalledTimes(1);
		expect(timeRangeChange.mock.calls[0][0].detail.timezone).toEqual(TOKYO_TIMEZONE);
		expect(component.isOpen).toBe(true);
	});

	it('should display the apply and cancel actions once the custom interval is picked', async () => {
		component['onClickSeeCustomInterval']({ detail: CUSTOM_TIME_RANGE_KEY } as CustomEvent<string>);
		await page.waitForChanges();

		expect(component.timePickerView).toEqual(ETimePickerView.AbsoluteTimePicker);
		expect(page.root.querySelector('.actions')).not.toBeNull();
	});
});

describe('KvTimePicker (no option preselected)', () => {
	let page: SpecPage;
	let component: KvTimePicker;
	let timeRangeChange: jest.Mock;

	beforeEach(async () => {
		// Options omitting the default key leave nothing selected, and the timezone dropdown stays on
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen={true} relativeTimePickerOptions={MOCK_RELATIVE_TIME_OPTIONS_GROUPS} />
		});
		component = page.rootInstance;
		timeRangeChange = jest.fn();
		page.root.addEventListener('timeRangeChange', timeRangeChange);
	});

	// An empty range breaks `ITimePickerTime` and would hand a consumer an unusable range
	it('should not commit a timezone change while no option is selected', async () => {
		component['onSelectedTimezoneChange']({ detail: TOKYO_TIMEZONE } as CustomEvent<ITimePickerTimezone>);
		await page.waitForChanges();

		expect(timeRangeChange).not.toHaveBeenCalled();
		expect(component.isOpen).toBe(true);
	});

	it('should keep the timezone as draft so the next option click carries it', async () => {
		component['onSelectedTimezoneChange']({ detail: TOKYO_TIMEZONE } as CustomEvent<ITimePickerTimezone>);
		await page.waitForChanges();

		expect(component.selectedTimeState.timezone).toEqual(TOKYO_TIMEZONE);

		const [{ value: key }] = MOCK_RELATIVE_TIME_OPTIONS_GROUPS[0];
		clickRelativeOption(page, key, [FROM, TO]);
		await page.waitForChanges();

		expect(timeRangeChange).toHaveBeenCalledTimes(1);
		expect(timeRangeChange.mock.calls[0][0].detail).toEqual({ key, range: [FROM, TO], timezone: TOKYO_TIMEZONE });
		expect(component.isOpen).toBe(false);
	});
});

describe('KvTimePicker (calendar confirms with apply)', () => {
	let page: SpecPage;
	let component: KvTimePicker;
	let timeRangeChange: jest.Mock;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen={true} showCalendar={true} />
		});
		component = page.rootInstance;
		timeRangeChange = jest.fn();
		page.root.addEventListener('timeRangeChange', timeRangeChange);
	});

	it('should display the apply and cancel actions', () => {
		expect(component.timePickerView).toEqual(ETimePickerView.FullView);
		expect(page.root.querySelector('.actions')).not.toBeNull();
	});

	it('should not commit on option click, leaving apply to confirm the draft', async () => {
		clickRelativeOption(page, 'today', [FROM, TO]);
		await page.waitForChanges();

		expect(timeRangeChange).not.toHaveBeenCalled();
		expect(component.isOpen).toBe(true);
		// the draft still advances, so apply has something valid to confirm
		expect(component.selectedTimeState.key).toEqual('today');
		expect(component['isApplyButtonDisabled']()).toBe(false);
	});

	it('should drop a pending calendar range when the calendar is hidden', async () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [FROM, TO], timezone: TIMEZONE };
		component.calendarViewLocked = true;

		// Driven from the host element so it takes the same path as a consumer updating the prop
		(page.root as HTMLKvTimePickerElement).showCalendar = false;
		await page.waitForChanges();

		expect(component.timePickerView).toEqual(ETimePickerView.RelativeTimePicker);
		expect(component.selectedTimeState.key).toEqual(DEFAULT_SELECTED_TIME_KEY);
		expect(component.calendarViewLocked).toBe(false);
		expect(page.root.querySelector('.actions')).toBeNull();
	});
});

describe('KvTimePicker (custom option labels)', () => {
	let page: SpecPage;
	let component: KvTimePicker;

	const getOptionLabel = () => page.root.querySelector('kv-relative-time-picker').getAttribute('customintervaloptionlabel');
	const getCalendarTitle = () => page.root.querySelector('kv-absolute-time-picker').getAttribute('headertitle');

	describe('in range mode', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePicker],
				template: () => <kv-time-picker isOpen />
			});
			component = page.rootInstance;
		});

		it('should label the custom option as an interval', () => {
			expect(getOptionLabel()).toEqual(DEFAULT_HEADER_TITLE);
		});

		it('should title the calendar as an interval once the custom option is picked', async () => {
			component['onClickSeeCustomInterval']({ detail: CUSTOM_TIME_RANGE_KEY } as CustomEvent<string>);
			await page.waitForChanges();

			expect(getCalendarTitle()).toEqual(DEFAULT_HEADER_TITLE);
		});
	});

	describe('in single mode', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePicker],
				template: () => <kv-time-picker isOpen calendarMode={EAbsoluteTimePickerMode.Single} />
			});
			component = page.rootInstance;
		});

		it('should label the custom option as a date', () => {
			expect(getOptionLabel()).toEqual(SINGLE_DATE_HEADER_TITLE);
		});

		it('should title the calendar as a date once the custom option is picked', async () => {
			component['onClickSeeCustomInterval']({ detail: CUSTOM_TIME_RANGE_KEY } as CustomEvent<string>);
			await page.waitForChanges();

			expect(getCalendarTitle()).toEqual(SINGLE_DATE_HEADER_TITLE);
		});

		it('should title the calendar as a date once a date is picked in it', async () => {
			page.root.querySelector('kv-absolute-time-picker').dispatchEvent(new CustomEvent('selectedDatesChange', { detail: { range: ['2023-04-15 10:00:00'] } }));
			await page.waitForChanges();

			expect(component.selectedTimeState.key).toEqual(CUSTOM_TIME_RANGE_KEY);
			expect(getCalendarTitle()).toEqual(SINGLE_DATE_HEADER_TITLE);
		});
	});
});

/** Simulates `kv-absolute-time-picker` reporting whether the dates typed in its inputs are valid */
const setInputValidity = async (page: SpecPage, isValid: boolean): Promise<void> => {
	page.root.querySelector('kv-absolute-time-picker').dispatchEvent(new CustomEvent<boolean>('inputValidityChange', { detail: isValid }));
	await page.waitForChanges();
};

const getApplyButton = (page: SpecPage): Element => page.root.querySelector('kv-action-button-text[text="Apply"]');

describe('KvTimePicker (calendar limits)', () => {
	let page: SpecPage;
	let component: KvTimePicker;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen showCalendar calendarMode={EAbsoluteTimePickerMode.Single} calendarInputMinDate={FROM} calendarInputMaxDate={TO} />
		});
		component = page.rootInstance;
	});

	it('should disable apply for a custom date before the minimum', async () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [FROM - 1000], timezone: TIMEZONE };
		await page.waitForChanges();

		expect(component['getCalendarError']()).toEqual(EAbsoluteTimeError.StartDateBeforeMinimumDate);
		expect(component['isApplyActionDisabled']()).toBe(true);
		expect(getApplyButton(page).hasAttribute('disabled')).toBe(true);
		expect(page.root.querySelector('kv-absolute-time-picker').getAttribute('error')).toEqual(EAbsoluteTimeError.StartDateBeforeMinimumDate);
	});

	it('should not flag a day click clamped to the minimum, which drops its milliseconds', () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [Math.floor(FROM / 1000) * 1000], timezone: TIMEZONE };

		expect(component['getCalendarError']()).toBeUndefined();
		expect(component['isApplyActionDisabled']()).toBe(false);
	});

	it('should disable apply for a custom date after the maximum', () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [TO + 1000], timezone: TIMEZONE };

		expect(component['getCalendarError']()).toEqual(EAbsoluteTimeError.EndDateAfterMaximumDate);
		expect(component['isApplyActionDisabled']()).toBe(true);
	});

	it('should not check a relative option against the limits', () => {
		component.selectedTimeState = { key: DEFAULT_SELECTED_TIME_KEY, range: [FROM - 1000, TO], timezone: TIMEZONE };

		expect(component['getCalendarError']()).toBeUndefined();
	});

	it('should give the calendar the limits formatted in the selected timezone', () => {
		const calendar = page.root.querySelector('kv-absolute-time-picker');

		expect(calendar.getAttribute('calendarinputmindate')).toEqual('12-04-2023 17:17:36');
		expect(calendar.getAttribute('calendarinputmaxdate')).toEqual('13-04-2023 17:17:52');
	});
});

describe('KvTimePicker (default calendar limits)', () => {
	let page: SpecPage;
	let component: KvTimePicker;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen showCalendar />
		});
		component = page.rootInstance;
	});

	it('should disable apply for a custom range before the calendar minimum', () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [Date.UTC(2017, 0, 1), Date.UTC(2017, 0, 2)], timezone: TIMEZONE };

		expect(component['getCalendarError']()).toEqual(EAbsoluteTimeError.StartDateBeforeMinimumDate);
		expect(component['isApplyActionDisabled']()).toBe(true);
	});

	it('should flag a custom range that ends before it starts', () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [TO, FROM], timezone: TIMEZONE };

		expect(component['getCalendarError']()).toEqual(EAbsoluteTimeError.EndDateBeforeStartDate);
	});
});

describe('KvTimePicker (typed date is incomplete or invalid)', () => {
	let page: SpecPage;
	let component: KvTimePicker;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker],
			template: () => <kv-time-picker isOpen showCalendar />
		});
		component = page.rootInstance;
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [FROM, TO], timezone: TIMEZONE };
		await page.waitForChanges();
	});

	it('should enable apply for a changed custom range', () => {
		expect(getApplyButton(page).hasAttribute('disabled')).toBe(false);
	});

	it('should disable apply and explain why while the typed date is invalid', async () => {
		await setInputValidity(page, false);

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(true);
		expect(page.root.querySelector('kv-tooltip').getAttribute('text')).toEqual(APPLY_BUTTON_INVALID_DATE_TOOLTIP_TEXT);

		await setInputValidity(page, true);

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(false);
	});

	it('should explain an invalid date after a relative option replaced an incomplete custom date', async () => {
		component['handleAbsoluteDatesChange']({ detail: { range: [] } } as CustomEvent<IAbsoluteSelectedRangeDates>);
		clickRelativeOption(page, 'today', [FROM, TO]);
		await setInputValidity(page, false);

		expect(page.root.querySelector('kv-tooltip').getAttribute('text')).toEqual(APPLY_BUTTON_INVALID_DATE_TOOLTIP_TEXT);
	});

	it('should not mark the inputs with a limit error while the typed date is invalid', async () => {
		component.selectedTimeState = { key: CUSTOM_TIME_RANGE_KEY, range: [Date.UTC(2017, 0, 1), Date.UTC(2017, 0, 2)], timezone: TIMEZONE };
		await setInputValidity(page, false);

		expect(page.root.querySelector('kv-absolute-time-picker').hasAttribute('error')).toBe(false);
	});

	it('should keep the click outside behaviour of a valid draft', async () => {
		component.timePickerView = ETimePickerView.AbsoluteTimePicker;
		await setInputValidity(page, false);

		component['onDropdownChange']({ detail: false } as CustomEvent<boolean>);
		await page.waitForChanges();

		expect(component.timePickerView).toEqual(ETimePickerView.RelativeTimePicker);
	});

	it('should remount the calendar to discard the typed date on cancel', async () => {
		await setInputValidity(page, false);
		const calendar = page.root.querySelector('kv-absolute-time-picker');

		component['onClickCancel'](new CustomEvent('clickButton'));
		await page.waitForChanges();

		expect(component.hasInvalidDateInput).toBe(false);
		expect(page.root.querySelector('kv-absolute-time-picker')).not.toBe(calendar);
	});

	it('should discard the typed date when a relative option is clicked', async () => {
		await setInputValidity(page, false);

		clickRelativeOption(page, 'today', [FROM, TO]);
		await page.waitForChanges();

		expect(component.hasInvalidDateInput).toBe(false);
		expect(component.selectedTimeState.key).toEqual('today');
		expect(getApplyButton(page).hasAttribute('disabled')).toBe(false);
	});

	it('should not let the refresh of the selected option rewrite the typed date', async () => {
		component.selectedTimeState = { key: 'today', range: [FROM, TO], timezone: TIMEZONE };
		await setInputValidity(page, false);

		page.root
			.querySelector('kv-relative-time-picker')
			.dispatchEvent(new CustomEvent<ITimePickerRelativeTime>('selectedRelativeTimeChange', { detail: { key: 'today', range: [FROM + 60000, TO + 60000] } }));
		await page.waitForChanges();

		expect(component.selectedTimeState.range).toEqual([FROM, TO]);
	});
});

describe('KvTimePicker (typing in the calendar)', () => {
	let page: SpecPage;
	let input: Element;

	const typeDate = async (text: string) => {
		input.dispatchEvent(new CustomEvent<string>('textChange', { detail: text }));
		await page.waitForChanges();
	};

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvTimePicker, KvAbsoluteTimePicker],
			template: () => (
				<kv-time-picker
					isOpen
					showCalendar
					calendarMode={EAbsoluteTimePickerMode.Single}
					calendarInputMinDate={FROM}
					selectedTimeOption={{ key: CUSTOM_TIME_RANGE_KEY, range: [TO], timezone: TIMEZONE }}
				/>
			)
		});
		input = page.root.querySelector('#single-date-input');
	});

	it('should enable apply for a valid date after the minimum', async () => {
		await typeDate('15-04-2023 10:00:00');

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(false);
	});

	it('should disable apply for an incomplete date instead of applying the previous one', async () => {
		await typeDate('15-04-2023 10:00:00');
		await typeDate('15-04-20yy 10:00:00');

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(true);
		expect(page.root.querySelector('kv-tooltip').getAttribute('text')).toEqual(APPLY_BUTTON_INVALID_DATE_TOOLTIP_TEXT);
	});

	it('should disable apply for an impossible date', async () => {
		await typeDate('31-02-2030 00:00:00');

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(true);
	});

	it('should disable apply and mark the input for a date before the minimum', async () => {
		await typeDate('01-01-2017 00:00:00');

		expect(getApplyButton(page).hasAttribute('disabled')).toBe(true);
		expect(input.getAttribute('state')).toEqual('invalid');
		expect(input.getAttribute('helptext')).toContain('must be after');
	});
});

describe('KvTimePicker helpers', () => {
	describe('#validateNewRange', () => {
		it('should require an ordered pair by default', () => {
			expect(validateNewRange([FROM, TO])).toBe(true);
			expect(validateNewRange([TO, FROM])).toBe(false);
			expect(validateNewRange([FROM])).toBe(false);
		});

		it('should accept the unix epoch as a valid timestamp', () => {
			expect(validateNewRange([0, TO])).toBe(true);
			expect(validateNewRange([0], SINGLE_RANGE_SIZE)).toBe(true);
		});

		it('should accept exactly one valid date when a single range is expected', () => {
			expect(validateNewRange([FROM], SINGLE_RANGE_SIZE)).toBe(true);
			expect(validateNewRange([], SINGLE_RANGE_SIZE)).toBe(false);
			expect(validateNewRange([FROM, TO], SINGLE_RANGE_SIZE)).toBe(false);
		});
	});

	describe('#getCalendarLimits', () => {
		it('should default to the calendar limits', () => {
			expect(getCalendarLimits(undefined, undefined, 'UTC')).toEqual({ minDate: Date.UTC(2018, 0, 1), maxDate: Date.UTC(3000, 11, 31, 23, 59, 59) });
		});

		it('should drop the milliseconds of the minimum and keep those of the maximum', () => {
			expect(getCalendarLimits(FROM, TO, 'UTC')).toEqual({ minDate: Math.floor(FROM / 1000) * 1000, maxDate: TO });
		});

		it('should read the limits in the given timezone', () => {
			expect(getCalendarLimits(undefined, undefined, 'Asia/Tokyo').minDate).toEqual(Date.UTC(2017, 11, 31, 15));
		});
	});

	describe('#getRelativeViewHeight', () => {
		it('should cap the default options at the maximum height', () => {
			expect(getRelativeViewHeight(DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS, true, true)).toEqual(MAX_HEIGHT);
		});

		it('should fit a short single group', () => {
			const fiveOptions = [DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS[1].slice(0, 5)];
			expect(getRelativeViewHeight(fiveOptions, true, false)).toEqual(5 * SELECT_OPTION_HEIGHT + 2 * PADDING_SIZE + BOTTOM_OPTIONS_HEIGHT);
		});

		it('should handle empty or missing options', () => {
			expect(getRelativeViewHeight([], false, false)).toEqual(2 * PADDING_SIZE);
			expect(getRelativeViewHeight(undefined, false, false)).toEqual(2 * PADDING_SIZE);
		});
	});
});
