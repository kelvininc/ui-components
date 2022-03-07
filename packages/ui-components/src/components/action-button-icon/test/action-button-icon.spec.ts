import { SpecPage } from '@stencil/core/internal';
import { KvActionButtonIcon } from '../action-button-icon';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';

describe('Action Button Icon (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButtonIcon;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButtonIcon],
				html: '<kv-action-button-icon type="primary" icon="kv-add"></kv-action-button-icon>'
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

		it('should initialize `size` with small', () => {
			expect(component.size).toBe(EComponentSize.Small);
		});
	});
});
