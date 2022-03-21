import { EventSpy } from '@stencil/core/internal';
import { E2EPage, newE2EPage, E2EElement } from '@stencil/core/testing';

describe('Search (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search></kv-search>');
		});

		describe('when blur event is emitted', () => {
			let spyBlurEvent: EventSpy;
			let searchComponent: E2EElement;

			beforeEach(async () => {
				searchComponent = await page.find('kv-search');
				spyBlurEvent = await searchComponent.spyOnEvent('textFieldBlur');

				searchComponent.triggerEvent('textFieldBlur');

				await page.waitForChanges();
			});

			it('should emit blur event', () => {
				expect(spyBlurEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when renders with value and its not disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test to the value"></kv-search>');
		});

		describe('when reset button is clicked', () => {
			let spyResetEvent: EventSpy;

			beforeEach(async () => {
				const searchComponent = await page.find('kv-search');
				spyResetEvent = await searchComponent.spyOnEvent('clickResetButton');

				const resetIcon = await page.find('kv-search >>> kv-svg-icon');
				await resetIcon.click();
			});

			it('should emit click event', () => {
				expect(spyResetEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when renders with disable', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test" disabled></kv-search>');
		});

		describe('when tries to press button', () => {
			beforeEach(async () => {
				const resetIcon = await page.find('kv-search >>> kv-svg-icon');

				it('should not find button', () => {
					expect(resetIcon).toBeNull();
				});
			});
		});
	});

	describe('when value is defined but its empty', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value=""></kv-search>');
		});

		describe('when tries to press button', () => {
			beforeEach(async () => {
				const resetIcon = await page.find('kv-search >>> kv-svg-icon');

				it('should not find button', () => {
					expect(resetIcon).toBeNull();
				});
			});
		});
	});
});
