import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('KvBreadcrumbItem (end-to-end)', () => {
	let page: E2EPage;

	afterAll(async () => {
		await page.close();
	});

	describe('when renders with default props', () => {
		let itemElement: E2EElement;
		let labelElement: E2EElement;
		let clickEventSpy: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-breadcrumb-item label='Awesome Label'></kv-breadcrumb-item>`);
			itemElement = await page.find('kv-breadcrumb-item');
			labelElement = await page.find('kv-breadcrumb-item >>> div');
		});

		it('should render label', () => {
			expect(labelElement.innerText).toContain('Awesome Label');
		});

		describe('and the user clicks on the item', () => {
			beforeEach(async () => {
				clickEventSpy = await itemElement.spyOnEvent('breadcrumbItemClick');
				await labelElement.click();
			});

			it('should emit an event with the clicked item', () => {
				expect(clickEventSpy).toHaveReceivedEventDetail({
					label: 'Awesome Label'
				});
			});
		});
	});
});
