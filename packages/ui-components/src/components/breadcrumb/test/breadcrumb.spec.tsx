import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { cloneDeep } from 'lodash-es';
import { KvBreadcrumb } from '../breadcrumb';
import { BREADCRUMBS_MOCK } from './breadcrumb.mock';

describe('KvBreadcrumb (unit tests)', () => {
	let page: SpecPage;
	let component: KvBreadcrumb;

	const breadCrumbMock = cloneDeep(BREADCRUMBS_MOCK);

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvBreadcrumb],
			template: () => <kv-breadcrumb items={breadCrumbMock}></kv-breadcrumb>
		});
		component = page.rootInstance;
	});

	describe('when the component renders', () => {
		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct component items', () => {
			expect(component.items).toEqual([
				{
					label: 'Homepage'
				},
				{
					label: 'Product'
				},
				{
					label: 'Contact Form'
				}
			]);
		});
	});
});
