import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvRelativeTimePicker } from '../relative-time-picker';
import { h } from '@stencil/core';
import { MOCK_RELATIVE_TIME_OPTIONS_GROUPS } from './relative-time-picker.mock';
import { CUSTOMIZE_INTERVAL_LABEL } from '../relative-time-picker.config';
import { CUSTOM_TIME_RANGE_KEY } from '../../../utils/relative-time';

const getCustomIntervalOption = (page: SpecPage): Element => page.root.shadowRoot.querySelector(`kv-select-option[value="${CUSTOM_TIME_RANGE_KEY}"]`);

describe('KvRelativeTimePicker (unit tests)', () => {
	let page: SpecPage;
	let component: KvRelativeTimePicker;

	describe('when the component loads with empty props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRelativeTimePicker],
				template: () => <kv-relative-time-picker options={MOCK_RELATIVE_TIME_OPTIONS_GROUPS} />
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should display customize interval option', () => {
			expect(component.customIntervalOptionEnabled).toEqual(true);
		});

		it('should label the customize interval option with the default label', () => {
			expect(getCustomIntervalOption(page).getAttribute('label')).toEqual(CUSTOMIZE_INTERVAL_LABEL);
		});

		it('should display timezone select component', () => {
			expect(component.timezoneSelectionEnabled).toEqual(true);
		});
	});

	describe('when the component loads with both customize interval and timezone components hidden', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRelativeTimePicker],
				template: () => <kv-relative-time-picker options={MOCK_RELATIVE_TIME_OPTIONS_GROUPS} customIntervalOptionEnabled={false} timezoneSelectionEnabled={false} />
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should display customize interval option', () => {
			expect(component.customIntervalOptionEnabled).toEqual(false);
		});

		it('should display timezone select component', () => {
			expect(component.timezoneSelectionEnabled).toEqual(false);
		});
	});

	describe('when a customize interval option label is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRelativeTimePicker],
				template: () => <kv-relative-time-picker options={MOCK_RELATIVE_TIME_OPTIONS_GROUPS} customIntervalOptionLabel="Custom Date" />
			});
		});

		it('should label the customize interval option with it', () => {
			expect(getCustomIntervalOption(page).getAttribute('label')).toEqual('Custom Date');
		});

		it('should fall back to the default label when it is cleared', async () => {
			page.root.customIntervalOptionLabel = undefined;
			await page.waitForChanges();

			expect(getCustomIntervalOption(page).getAttribute('label')).toEqual(CUSTOMIZE_INTERVAL_LABEL);
		});
	});
});
