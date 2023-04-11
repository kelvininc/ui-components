import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Radio List Item (end to end)', () => {
	let page: E2EPage;
	let element: E2EElement;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-radio-list-item option-id='k3s' label='K3S' />`);
			element = await page.find('kv-radio-list-item');
		});

		describe('and the optionClick event is emitted', () => {
			let optionClickSpy: EventSpy;
			let itemComponent: E2EElement;

			beforeEach(async () => {
				optionClickSpy = await element.spyOnEvent('optionClick');
				itemComponent = await page.find('kv-radio-list-item >>> .radio-list-item-container');
				await itemComponent.click();
				await page.waitForChanges();
			});

			it('should emit a optionClick event', () => {
				expect(optionClickSpy).toHaveReceivedEventDetail('k3s');
			});
		});
	});
});
