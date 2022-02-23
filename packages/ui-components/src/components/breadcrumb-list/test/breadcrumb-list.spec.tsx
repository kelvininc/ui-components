import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvBreadcrumbList } from '../breadcrumb-list';
import { h } from '@stencil/core';

describe('KvBreadcrumbItem (unit tests)', () => {
	let page: SpecPage;
	let component: KvBreadcrumbList;

	describe('when the component loads', () => {
		describe('and doesnt have a separator', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvBreadcrumbList],
					html: '<kv-breadcrumb-list></kv-breadcrumb-list>'
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and has a separator', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvBreadcrumbList],
					html: "<kv-breadcrumb-list separator='/'></kv-breadcrumb-list>"
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});
	});
});
