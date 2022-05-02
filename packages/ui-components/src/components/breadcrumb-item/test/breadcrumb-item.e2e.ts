import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { EAnchorTarget } from '../../../utils/types';

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
				<kv-breadcrumb-item
					label='Awesome Label'
					href='https://kelvin.ai'
					target='_blank'>
				</kv-breadcrumb-item>`);
			itemElement = await page.find('kv-breadcrumb-item');
			labelElement = await page.find('kv-breadcrumb-item >>> a');
		});

		it('should render label', () => {
			expect(labelElement.innerText).toContain('Awesome Label');
		});

		it('should set the href attribute', () => {
			expect(labelElement.getAttribute('href')).toEqual('https://kelvin.ai');
		});

		it('should set the target attribute', () => {
			expect(labelElement.getAttribute('target')).toEqual(EAnchorTarget.NewTab);
		});

		describe('and the user clicks on the item', () => {
			beforeEach(async () => {
				clickEventSpy = await itemElement.spyOnEvent('breadcrumbItemClick');
				await labelElement.click();
			});

			it('should emit an event with the clicked item', () => {
				expect(clickEventSpy).toHaveReceivedEventDetail({
					label: 'Awesome Label',
					href: 'https://kelvin.ai',
					target: EAnchorTarget.NewTab
				});
			});
		});
	});
});
