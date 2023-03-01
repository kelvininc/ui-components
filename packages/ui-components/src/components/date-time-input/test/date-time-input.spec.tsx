import { SpecPage } from '@stencil/core/internal';
import { KvDateTimeInput } from '../date-time-input';
import { newSpecPage } from '@stencil/core/testing';

describe('Date Time Input (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDateTimeInput],
				html: `<kv-date-time-input></kv-date-time-input>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvDateTimeInput],
				html: `<kv-date-time-input label="Date Time Label"></date-time-input>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
