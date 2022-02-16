import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { cloneDeep } from 'lodash-es';
import { KvBreadcrumb } from '../breadcrumb';
import { BREADCRUMBS_MOCK } from './breadcrumb.mock';
import { EAnchorTarget } from '../../../utils/types';

describe('KvBreadcrumb (unit tests)', () => {
	let page: SpecPage;
	let component: KvBreadcrumb;

	const breadCrumbMock = cloneDeep(BREADCRUMBS_MOCK);

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvBreadcrumb],
			template: () => <kv-breadcrumb items={breadCrumbMock}></kv-breadcrumb>,
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
					label: 'Homepage',
					href: 'https://kelvin.ai',
					target: EAnchorTarget.NewTab
				},
				{
					label: 'Product',
					href: 'https://kelvin.ai/product/',
					target: EAnchorTarget.NewTab
				},
				{
					label: 'Contact Form',
					href: 'https://kelvin.ai/product#form',
					target: EAnchorTarget.NewTab
				}
			]);
		})
	});
});
