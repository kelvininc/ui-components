import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePicker } from '../absolute-time-picker';
import { h } from '@stencil/core';
import { EAbsoluteTimePickerMode } from '../absolute-time-picker.types';

describe('Absolute Time Picker (unit tests)', () => {
	let page: SpecPage;

	// This component in testing should always consider an initial date
	// to prevent snapshots changes
	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker initialDate="2023-03-03" />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with preselected dates', () => {
		let component: KvAbsoluteTimePicker;

		describe('in single mode', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker mode={EAbsoluteTimePickerMode.Single} selectedDates={['2023-03-03 10:30:00']} />
				});
				component = page.rootInstance;
			});

			it('should initialize the single input with the selected date', () => {
				expect(component.singleInputValue).toEqual('03-03-2023 10:30:00');
			});

			it('should display the month of the selected date', () => {
				expect(component.displayedMonth.format('YYYY-MM')).toEqual('2023-03');
			});
		});

		describe('in range mode', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00', '2023-03-10 18:00:00']} />
				});
				component = page.rootInstance;
			});

			it('should initialize the from and to inputs with the selected dates', () => {
				expect(component.fromInputValue).toEqual('03-03-2023 10:30:00');
				expect(component.toInputValue).toEqual('10-03-2023 18:00:00');
			});
		});

		describe('when an initial date is provided', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker initialDate="2024-01-15" selectedDates={['2023-03-03 10:30:00', '2023-03-10 18:00:00']} />
				});
				component = page.rootInstance;
			});

			it('should keep the initial date as the displayed month', () => {
				expect(component.displayedMonth.format('YYYY-MM')).toEqual('2024-01');
			});
		});
	});
});
