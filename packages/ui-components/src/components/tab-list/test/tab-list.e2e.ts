import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tab List (end-to-end)', () => {
	let page: E2EPage;
	let childrenEl: E2EElement[];

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-tab-list selectedTabKey='dashboard'>
								<kv-tab-item tab-key="dashboard" label="Dashboard"></kv-tab-item>
								<kv-tab-item tab-key="dashboard2" label="Dashboard"></kv-tab-item>
								<kv-tab-item tab-key="dashboard3" label="Dashboard"></kv-tab-item>
							</kv-tab-list>
			`);
			childrenEl = await page.findAll('kv-tab-item');
		});

		it('should render component and children', () => {
			expect(childrenEl.length).toBe(3);
		});
	});
});
