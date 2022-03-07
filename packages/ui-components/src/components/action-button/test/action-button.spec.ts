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
	});
});
