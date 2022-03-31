import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Action Button Text (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-text type="primary" text="Primary Button"></kv-action-button-text>');
		});

		it('should render text', async () => {
			const textElement = await page.find('kv-action-button-text >>> .action-button-text');
			expect(textElement).toBeTruthy();
			expect(textElement.innerText.toLocaleLowerCase()).toBe('primary button');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button-text');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button-text >>> kv-action-button');
				await actionButtonElement.click();
			});

			it('should emit clickButton event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when has icon', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-text type="primary" text="Primary Button" icon="kv-add"></kv-action-button-text>');
		});

		it('should render icon', async () => {
			const iconElement = await page.find('kv-action-button-text >>> kv-icon');
			expect(iconElement).toBeTruthy();
			expect(iconElement.getAttribute('name')).toEqual('kv-add');
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-text disabled type="primary" text="Primary Button"></kv-action-button-text>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button-text');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button-text >>> kv-action-button');
				await actionButtonElement.click();
			});

			it('should not emit clickButton event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
