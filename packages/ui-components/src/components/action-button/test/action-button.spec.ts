import { SpecPage } from '@stencil/core/internal';
import { KvActionButton } from '../action-button';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';

describe('Action Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButton;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="primary"></kv-action-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `active` with false', () => {
			expect(component.active).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});

		it('should not set `aria-busy`', () => {
			expect(page.root.hasAttribute('aria-busy')).toBe(false);
		});
	});

	describe('when is loading', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="secondary" loading></kv-action-button>'
			});
		});

		it('should set `aria-busy` to true', () => {
			expect(page.root.getAttribute('aria-busy')).toBe('true');
		});

		describe('and it stops loading', () => {
			beforeEach(async () => {
				page.root.loading = false;
				await page.waitForChanges();
			});

			it('should remove `aria-busy`', () => {
				expect(page.root.hasAttribute('aria-busy')).toBe(false);
			});
		});
	});

	describe('when is not loading', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="secondary" loading="false"></kv-action-button>'
			});
		});

		it('should not set `aria-busy`', () => {
			expect(page.root.hasAttribute('aria-busy')).toBe(false);
		});
	});
});
