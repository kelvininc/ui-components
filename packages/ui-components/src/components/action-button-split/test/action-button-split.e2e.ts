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
			const actionButtons = await page.findAll('kv-action-button-split >>> kv-action-button');
			const rightActionButtonElement = actionButtons[actionButtons.length - 1];
			expect(rightActionButtonElement).toBeTruthy();
			expect(rightActionButtonElement.getAttribute('type')).toEqual(EActionButtonType.Primary);
		});

		describe('and user clicks on the left button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const leftActionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await leftActionButtonIconElement.spyOnEvent('clickLeftButton');

				const leftActionButtonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
				await leftActionButtonElement.click();
			});

			it('should emit clickLeftButton event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});

		describe('and user clicks on the right button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const rightActionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await rightActionButtonIconElement.spyOnEvent('clickRightButton');

				const actionButtons = await page.findAll('kv-action-button-split >>> kv-action-button');
				const rightActionButtonElement = actionButtons[actionButtons.length - 1];
				await rightActionButtonElement.click();
			});

			it('should emit clickRightButton event', () => {
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
				spyChangeEvent = await leftActionButtonIconElement.spyOnEvent('clickLeftButton');

				const leftActionButtonElement = await page.find('kv-action-button-split >>> kv-action-button-text');
				await leftActionButtonElement.click();
			});

			it('should not emit clickLeftButton event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('and user clicks on the right button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const rightActionButtonIconElement = await page.find('kv-action-button-split');
				spyChangeEvent = await rightActionButtonIconElement.spyOnEvent('clickRightButton');

				const actionButtons = await page.findAll('kv-action-button-split >>> kv-action-button');
				const rightActionButtonElement = actionButtons[actionButtons.length - 1];
				await rightActionButtonElement.click();
			});

			it('should not emit clickRightButton event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
