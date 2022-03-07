import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { EActionButtonType } from '../../action-button/action-button.types';

describe('Action Button Split (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down"></kv-action-button-split>');
		});

		it('should render left action button', async () => {
			const leftButtonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
			expect(leftButtonElement).toBeTruthy();
			expect(leftButtonElement.getAttribute('type')).toEqual(EActionButtonType.Primary);
		});

		it('should render right action button', async () => {
			const rightButtonElement = await page.find('kv-action-button-split >>> kv-action-button');
			expect(rightButtonElement).toBeTruthy();
			expect(rightButtonElement.getAttribute('type')).toEqual(EActionButtonType.Primary);
		});

		describe('and user clicks on the left button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const leftActionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await leftActionButtonIconElement.spyOnEvent('buttonClick');

				const leftActionButtonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
				await leftActionButtonElement.click();
			});

			it('should emit buttonClick event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});

		describe('and user clicks on the right button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const rightctionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await rightctionButtonIconElement.spyOnEvent('buttonClick');

				const rightctionButtonElement = await page.find('kv-action-button-split >>> kv-action-button');
				await rightctionButtonElement.click();
			});

			it('should emit buttonClick event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when has icon', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down" icon="kv-add"></kv-action-button-split>');
		});

		it('should render icon', async () => {
			const buttonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
			expect(buttonElement).toBeTruthy();
			expect(buttonElement.getAttribute('icon')).toEqual('kv-add');
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button-split type="primary" text="Split Button" split-button="kv-arrow-drop-down" disabled></kv-action-button-split>');
		});

		describe('and user clicks on the left button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const leftActionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await leftActionButtonIconElement.spyOnEvent('buttonClick');

				const leftActionButtonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
				await leftActionButtonElement.click();
			});

			it('should not emit buttonClick event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('and user clicks on the right button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const rightctionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await rightctionButtonIconElement.spyOnEvent('splitButtonClick');

				const rightctionButtonElement = await page.find('kv-action-button-split >>> kv-action-button');
				await rightctionButtonElement.click();
			});

			it('should not emit buttonClick event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
