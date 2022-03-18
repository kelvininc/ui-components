import { SpecPage } from '@stencil/core/internal';
import { KvActionButtonSplit } from '../action-button-split';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';

describe('Action Button Split (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButtonSplit;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonSplit],
				html: '<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down"></kv-action-button-split>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `icon` with undefined', () => {
			expect(component.icon).toBeUndefined();
			expect(component.hasIcon).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});
	});

	describe('when has a icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonSplit],
				html: '<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down" icon="kv-add"></kv-action-button-split>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hasIcon` with true', () => {
			expect(component.hasIcon).toBe(true);
		});

		describe('and the icon is removed', () => {
			beforeEach(() => {
				page.root.setAttribute('icon', '');
			});

			it('should change `hasIcon` to false', () => {
				expect(component.hasIcon).toBe(false);
			});
		});
	});
});
