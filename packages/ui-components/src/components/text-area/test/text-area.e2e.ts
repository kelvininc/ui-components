import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Text Area (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newE2EPage({
				html: '<kv-text-area max-char-length=100 />'
			});
		});

		describe('when user changes text', () => {
			let textChangeEventSpy: EventSpy;
			let textAreaComponent: E2EElement;

			beforeEach(async () => {
				textAreaComponent = await page.find('kv-text-area');
				textChangeEventSpy = await textAreaComponent.spyOnEvent('textChange');

				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.type('Input Test');

				await page.waitForChanges();
			});

			it('should emit `textChange` event', () => {
				expect(textChangeEventSpy).toHaveReceivedEvent();
			});
		});

		describe('when focus shifts to another element', () => {
			let textChangeBlurEventSpy: EventSpy;
			let textAreaComponent: E2EElement;

			beforeEach(async () => {
				textAreaComponent = await page.find('kv-text-area');
				textChangeBlurEventSpy = await textAreaComponent.spyOnEvent('textChangeBlur');

				textAreaComponent.triggerEvent('textChangeBlur');
				await page.waitForChanges();
			});

			it('should emit `textChange` event', () => {
				expect(textChangeBlurEventSpy).toHaveReceivedEvent();
			});
		});
	});
});
