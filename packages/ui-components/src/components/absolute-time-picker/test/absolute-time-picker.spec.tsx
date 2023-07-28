import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePicker } from '../absolute-time-picker';
import { h } from '@stencil/core';

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
});
