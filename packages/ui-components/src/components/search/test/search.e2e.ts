import { EventSpy } from '@stencil/core/internal';
import { E2EPage, newE2EPage, E2EElement } from '@stencil/core/testing';

describe('Search (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search></kv-search>');
		});

		describe('and blur event is emitted', () => {
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

	describe('when value is defined', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test to ixon"></kv-search>');
		});

		describe('and tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-slot-container >>> kv-icon');
			});

			it('should find button', () => {
				expect(resetIcon).not.toBeNull();
			});
		});
	});

	describe('when renders with disable', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value="Test" disabled></kv-search>');
		});

		describe('when tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-icon-container >>> kv-icon');
			});

			it('should not find button', () => {
				expect(resetIcon).toBeNull();
			});
		});
	});

	describe('when value is defined but its empty', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-search value=""></kv-search>');
		});

		describe('when tries to press button', () => {
			let resetIcon: E2EElement;

			beforeEach(async () => {
				resetIcon = await page.find('kv-search >>> kv-text-field >>> .right-icon-container >>> kv-icon');
			});

			it('should not find button', () => {
				expect(resetIcon).toBeNull();
			});
		});
	});
});
