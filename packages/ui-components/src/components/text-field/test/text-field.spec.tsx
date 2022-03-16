import { SpecPage } from '@stencil/core/internal';
import { KvTextField } from '../text-field';
import { newSpecPage } from '@stencil/core/testing';

describe('Text Field (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field label="Text Field"></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextField],
				html: `<kv-text-field disabled></kv-text-field>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
