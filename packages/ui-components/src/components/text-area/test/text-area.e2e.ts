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

	describe('when rendering with counter', () => {
		describe('and counter is not always visible (default behavior)', () => {
			beforeEach(async () => {
				page = await newE2EPage({
					html: '<kv-text-area max-char-length="100" counter="true" />'
				});
			});

			it('should not display counter when not focused', async () => {
				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(false);
			});

			it('should display counter when focused', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.focus();
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});
		});

		describe('and counter is always visible', () => {
			beforeEach(async () => {
				page = await newE2EPage({
					html: '<kv-text-area max-char-length="100" counter="true" counter-always-visible="true" />'
				});
			});

			it('should display counter when not focused', async () => {
				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});

			it('should display counter when focused', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.focus();
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});

			it('should update counter as user types', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.type('Hello');
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const counterText = await counterElement.innerText;
				expect(counterText).toContain('5/100');
			});

			it('should have counter-always-visible class on container', async () => {
				const containerElement = await page.find('kv-text-area >>> .text-area-container');
				const hasClass = containerElement.classList.contains('counter-always-visible');
				expect(hasClass).toBe(true);
			});
		});
	});
});
