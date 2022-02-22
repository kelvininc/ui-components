import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvBreadcrumbItem } from '../breadcrumb-item';
import { EAnchorTarget } from '../../../utils/types';
import { h } from '@stencil/core'

describe('KvBreadcrumbItem (unit tests)', () => {
	let page: SpecPage;
	let component: KvBreadcrumbItem;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvBreadcrumbItem],
			template: () => (
				<kv-breadcrumb-item
					label='Awesome Label'
					href='https://kelvin.ai'
					target={EAnchorTarget.NewTab}
					active>
				</kv-breadcrumb-item>
			),
		});
		component = page.rootInstance;
	});

	describe('when the component loads', () => {
		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct label', () => {
			expect(component.label).toEqual('Awesome Label');
		});

		it('should set the correct link', () => {
			expect(component.href).toEqual('https://kelvin.ai');
		});

		it('should set the correct target', () => {
			expect(component.target).toEqual(EAnchorTarget.NewTab);
		});

		it('should set the correct active status', () => {
			expect(component.active).toEqual(true);
		});
	});
});
