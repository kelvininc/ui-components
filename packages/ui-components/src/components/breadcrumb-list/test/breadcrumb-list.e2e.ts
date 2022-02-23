import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('KvBreadcrumbList (end-to-end)', () => {
	let page: E2EPage;
	let listEl: E2EElement;
	let childrenEl: E2EElement[];

	afterAll(async () => {
		await page.close();
	});

	describe('when the component has no children', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-breadcrumb-list></kv-breadcrumb-list>`);
			listEl = await page.find('kv-breadcrumb-list');
			childrenEl = await page.findAll('kv-breadcrumb-item');
		});

		it('should render the component with no children', () => {
			expect(childrenEl.length).toBe(0);
		});
	});

	describe('when the component has children', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-breadcrumb-list>
					<kv-breadcrumb-item
						label='Awesome Label 1'
						link='https://kelvin.ai'
						target='_blank'>
					</kv-breadcrumb-item>
					<kv-breadcrumb-item
						label='Awesome Label 2'
						link='https://kelvin.ai'
						target='_blank'>
					</kv-breadcrumb-item>
					<kv-breadcrumb-item
						label='Awesome Label 3'
						link='https://kelvin.ai'
						target='_blank'
						active>
					</kv-breadcrumb-item>
				</kv-breadcrumb-list>`);
			listEl = await page.find('kv-breadcrumb-list');
			childrenEl = await page.findAll('kv-breadcrumb-item');
		});

		it('should render component and children', async () => {
			expect(childrenEl.length).toBe(3);
		});
	});
});
