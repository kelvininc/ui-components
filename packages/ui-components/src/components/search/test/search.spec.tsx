import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../types';
import { KvSearch } from '../search';

describe('Search (unit tests)', () => {
	let page: SpecPage;
	let component: KvSearch;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search></kv-search>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});
	});

	describe('when value is changed', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search value="Teste"></kv-search>`
			});
			component = page.rootInstance;
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
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with true', () => {
			expect(component.disabled).toBe(true);
		});
	});
});
