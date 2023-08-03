import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvBreadcrumbList } from '../breadcrumb-list';

describe('KvBreadcrumbItem (unit tests)', () => {
	let page: SpecPage;

	describe('when the component loads', () => {
		describe('and doesnt have a separator', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvBreadcrumbList],
					html: '<kv-breadcrumb-list></kv-breadcrumb-list>'
				});
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});
	});
});
