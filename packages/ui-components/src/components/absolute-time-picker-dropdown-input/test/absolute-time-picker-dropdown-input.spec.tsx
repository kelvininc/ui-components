import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePickerDropdownInput } from '../absolute-time-picker-dropdown-input';
import { h } from '@stencil/core';

describe('Absolute Time Picker Dropdown Input (unit tests)', () => {
	let page: SpecPage;

	// This component in testing should always consider an initial date
	// to prevent snapshots changes
	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdownInput],
				template: () => <kv-absolute-time-picker-dropdown-input initialDate={1681319856833} />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
