import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvSearch } from '../search';

describe('Search (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search></kv-search>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search disabled></kv-search>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
