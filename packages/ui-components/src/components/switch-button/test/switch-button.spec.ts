import { SpecPage } from '@stencil/core/internal';
import { KvSwitchButton } from '../switch-button';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';

describe('Switch Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvSwitchButton;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button></kv-switch-button>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `checked` with false', () => {
			expect(component.checked).toBe(false);
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});

		it('should initialize `label` with empty string', () => {
			expect(component.label).toBe('');
		});

		it('should initialize `hasLabel` with false', () => {
			expect(component.hasLabel).toBe(false);
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button label="Switch"></kv-switch-button>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hasLabel` with true', () => {
			expect(component.hasLabel).toBe(true);
		});

		describe('and the label is removed', () => {
			beforeEach(() => {
				page.root.setAttribute('label', '');
			});

			it('should change `hasLabel` to false', () => {
				expect(component.hasLabel).toBe(false);
			});
		});
	});
});
