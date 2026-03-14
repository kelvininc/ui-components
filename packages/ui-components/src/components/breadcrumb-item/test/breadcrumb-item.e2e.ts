import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('KvBreadcrumbItem (end-to-end)', () => {
	let page: E2EPage;

	afterAll(async () => {
		await page.close();
	});

	describe('when renders with default props', () => {
		let itemElement: E2EElement;
		let containerElement: E2EElement;
		let linkElement: E2EElement;
		let clickEventSpy: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-breadcrumb-item label='Awesome Label'></kv-breadcrumb-item>`);
			itemElement = await page.find('kv-breadcrumb-item');
			containerElement = await page.find('kv-breadcrumb-item >>> div');
			linkElement = await page.find('kv-breadcrumb-item >>> kv-link');
		});

		it('should render label', () => {
			expect(linkElement).not.toBeNull();
			expect(linkElement.getAttribute('label')).toBe('Awesome Label');
		});

		describe('and the user clicks on the item', () => {
			beforeEach(async () => {
				clickEventSpy = await itemElement.spyOnEvent('breadcrumbItemClick');
				await containerElement.click();
			});

			it('should emit an event with the clicked item', () => {
				expect(clickEventSpy).toHaveReceivedEventDetail({
					label: 'Awesome Label'
				});
			});
		});
	});
});
