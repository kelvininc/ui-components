import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { KvTimePicker } from '../time-picker';
import { DEFAULT_SELECTED_TIME_KEY, FULL_RANGE_SIZE, SINGLE_RANGE_SIZE } from '../time-picker.config';
import { getRelativeViewHeight, validateNewRange } from '../time-picker.helper';
import { EAbsoluteTimePickerMode } from '../../absolute-time-picker/absolute-time-picker.types';
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
 * Dispatches the click-intent event on the relative picker. `kv-relative-time-picker` is not registered
 * in these spec pages, so the event is dispatched directly on its element — a non-bubbling event still
 * reaches the listener the vdom attached there.
 */
const clickRelativeOption = (page: SpecPage, key: string, range: SelectedTimestamp): void => {
	page.root.querySelector('kv-relative-time-picker').dispatchEvent(new CustomEvent<ITimePickerRelativeTime>('relativeTimeOptionClicked', { detail: { key, range } }));
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

		clickRelativeOption(page, key, range);
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

	it('should not commit on option click', async () => {
		clickRelativeOption(page, 'today', [FROM, TO]);
		await page.waitForChanges();

		expect(timeRangeChange).not.toHaveBeenCalled();
		expect(component.isOpen).toBe(true);
		expect(component.selectedTimeState.key).toEqual(DEFAULT_SELECTED_TIME_KEY);
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
