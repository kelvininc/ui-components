import { SpecPage } from '@stencil/core/internal';
import { KvFormLabel } from '../form-label';
import { newSpecPage } from '@stencil/core/testing';

describe('Form Label (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label label="Text Field"></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is labeled and required', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvFormLabel],
				html: `<kv-form-label label="Text Field" required></kv-form-label>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
