import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { KvTimePicker } from '../time-picker';
import { DEFAULT_SELECTED_TIME_KEY, FULL_RANGE_SIZE, SINGLE_RANGE_SIZE } from '../time-picker.config';
import { getRelativeViewHeight, validateNewRange } from '../time-picker.helper';
import { EAbsoluteTimePickerMode } from '../../absolute-time-picker/absolute-time-picker.types';
import { MOCK_RELATIVE_TIME_OPTIONS_GROUPS } from '../../relative-time-picker/test/relative-time-picker.mock';
import { BOTTOM_OPTIONS_HEIGHT, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from '../../relative-time-picker/relative-time-picker.config';
import { CUSTOM_TIME_RANGE_KEY, DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS } from '../../../utils/relative-time';
import { ITimePickerTimezone } from '../../relative-time-picker/relative-time-picker.types';

const TIMEZONE: ITimePickerTimezone = { name: 'UTC', offset: 0 };
const FROM = 1681319856833;
const TO = 1681406272018;

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

describe('KvTimePicker helpers', () => {
	describe('#validateNewRange', () => {
		it('should require an ordered pair by default', () => {
			expect(validateNewRange([FROM, TO])).toBe(true);
			expect(validateNewRange([TO, FROM])).toBe(false);
			expect(validateNewRange([FROM])).toBeFalsy();
		});

		it('should accept a single valid date when a single range is expected', () => {
			expect(validateNewRange([FROM], SINGLE_RANGE_SIZE)).toBe(true);
			expect(validateNewRange([], SINGLE_RANGE_SIZE)).toBe(false);
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

		it('should handle empty options', () => {
			expect(getRelativeViewHeight([], false, false)).toEqual(2 * PADDING_SIZE);
		});
	});
});
