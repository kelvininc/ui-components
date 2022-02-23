import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { EAnchorTarget } from '../../../utils/types';

describe('KvBreadcrumbItem (end-to-end)', () => {
	let page: E2EPage;

	afterAll(async () => {
		await page.close();
	});

	describe('when the component renders', () => {
		let breadcrumbItemEl: E2EElement;
		let listItemEl: E2EElement;
		let labelEl: E2EElement;
		let clickEventSpy: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-breadcrumb-item
					label='Awesome Label'
					href='https://kelvin.ai'
					target='_blank'>
				</kv-breadcrumb-item>`);
			breadcrumbItemEl = await page.find('kv-breadcrumb-item');
			listItemEl = await page.find('kv-breadcrumb-item >>> li');
			labelEl = await page.find('kv-breadcrumb-item >>> a');
		});

		it('should render label', () => {
			expect(labelEl.innerText).toContain('Awesome Label');
		});

		it('should set the href attribute', () => {
			expect(labelEl.getAttribute('href')).toEqual('https://kelvin.ai');
		});

		it('should set the target attribute', () => {
			expect(labelEl.getAttribute('target')).toEqual(EAnchorTarget.NewTab);
		});

		describe('and the user clicks on the item', () => {
			beforeEach(async () => {
				clickEventSpy = await breadcrumbItemEl.spyOnEvent('breadcrumbItemClick');
				await labelEl.click();
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
