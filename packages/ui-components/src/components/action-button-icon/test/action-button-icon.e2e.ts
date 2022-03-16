import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Action Button Icon (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-icon type="primary" icon="kv-add"></kv-action-button>');
		});

		it('should render icon', async () => {
			const iconElement = await page.find('kv-action-button-icon >>> kv-svg-icon');
			expect(iconElement).toBeTruthy();
			expect(iconElement.getAttribute('name')).toEqual('kv-add');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button-icon');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button-icon >>> kv-action-button');
				await actionButtonElement.click();
			});

			it('should emit clickButton event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-icon type="primary" icon="kv-add" disabled></kv-action-button>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button-icon');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button-icon >>> kv-action-button');
				await actionButtonElement.click();
			});

			it('should not emit clickButton event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
