import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Action Button Icon (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-icon type="primary" icon="kv-add"></kv-action-button>');
		});

		it('should render icon', async () => {
			const iconElement = await page.find('kv-action-button-icon >>> kv-icon');
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

	describe('when has a badge', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-icon type="primary" icon="kv-add" badge-label="12"></kv-action-button>');
		});

		it('should render badge', async () => {
			const badgeElement = await page.find('kv-action-button-icon >>> kv-badge');
			expect(badgeElement).toBeTruthy();
			expect(badgeElement.innerText).toEqual('12');
		});
	});
});
