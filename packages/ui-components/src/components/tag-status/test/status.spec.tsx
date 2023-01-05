import { SpecPage } from '@stencil/core/internal';
import { KvTagStatus } from '../tag-status';
import { newSpecPage } from '@stencil/core/testing';

describe('Status Tag (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagStatus],
				html: `<kv-tag-status></kv-tag-status>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a type', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTagStatus],
				html: `<kv-tag-status type="pending"></kv-tag-status>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
