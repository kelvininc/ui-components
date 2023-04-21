import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvRelativeTimePicker } from '../relative-time-picker';
import { h } from '@stencil/core';
import { MOCK_RELATIVE_TIME_OPTIONS_GROUPS } from './relative-time-picker.mock';

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
});
