import { SpecPage } from '@stencil/core/internal';
import { KvActionButtonText } from '../action-button-text';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';

describe('Action Button Text (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButtonText;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonText],
				html: '<kv-action-button-text type="primary" text="Primary Button"></kv-action-button-text>'
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
		});

		it('should initialize `rightIcon` with undefined', () => {
			expect(component.rightIcon).toBeUndefined();
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});
	});

	describe('when has a icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonText],
				html: '<kv-action-button-text icon="kv-add" type="primary" text="Primary Button"></kv-action-button-text>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a rightIcon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonText],
				html: '<kv-action-button-text right-icon="kv-arrow-drop-down" type="primary" text="Primary Button"></kv-action-button-text>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has both icon and rightIcon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonText],
				html: '<kv-action-button-text icon="kv-add" right-icon="kv-arrow-drop-down" type="primary" text="Primary Button"></kv-action-button-text>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when it has only an icon and a label', () => {
		it('names the inner button with the label', async () => {
			const { KvActionButton } = await import('../../action-button/action-button');
			page = await newSpecPage({
				components: [KvActionButtonText, KvActionButton],
				html: '<kv-action-button-text type="text" icon="kv-close" text="" accessible-label="Close"></kv-action-button-text>'
			});
			const inner = page.root?.shadowRoot?.querySelector('kv-action-button');

			expect(inner?.shadowRoot?.querySelector('[part="button"]')?.getAttribute('aria-label')).toBe('Close');
		});
	});
});
