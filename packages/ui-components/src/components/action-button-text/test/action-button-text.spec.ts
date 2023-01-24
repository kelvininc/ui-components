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
});
