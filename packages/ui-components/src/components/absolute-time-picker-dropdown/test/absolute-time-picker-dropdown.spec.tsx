import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePickerDropdown } from '../absolute-time-picker-dropdown';
import { h } from '@stencil/core';

describe('Absolute Time Picker Dropdown (unit tests)', () => {
	let page: SpecPage;

	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdown],
				template: () => <kv-absolute-time-picker-dropdown initialDate="2023-03-03" />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when a selectedDate is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdown],
				template: () => <kv-absolute-time-picker-dropdown selectedDates={[1681319856833]} />
			});
		});

		it('should match the snapshot, the initial date on the calendar should be inherited from the selected date ("2023-04-12")', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
