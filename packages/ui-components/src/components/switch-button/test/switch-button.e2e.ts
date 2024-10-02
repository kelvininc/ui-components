import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Switch Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button></kv-switch-button>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const switchButtonElement = await page.find('kv-switch-button');
				spyChangeEvent = await switchButtonElement.spyOnEvent('switchChange');

				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click();

				await new Promise(resolve => setTimeout(resolve, 300));
			});

			it('should change `checked` to true', async () => {
				expect(await page.find('kv-switch-button')).toHaveAttribute('checked');
			});

			it('should emit switchChange event with true', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail(true);
			});
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button disabled></kv-switch-button>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;
			let switchButtonElement: E2EElement;

			beforeEach(async () => {
				switchButtonElement = await page.find('kv-switch-button');
				spyChangeEvent = await switchButtonElement.spyOnEvent('switchChange');

				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click();

				await new Promise(resolve => setTimeout(resolve, 300));
			});

			it('should not change `checked` to true', async () => {
				expect(switchButtonElement).not.toHaveAttribute('checked');
			});

			it('should not emit switchChange event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when is ON', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-switch-button checked></kv-switch-button>');
		});

		describe('and user clicks on the switch', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const switchButtonElement = await page.find('kv-switch-button');
				spyChangeEvent = await switchButtonElement.spyOnEvent('switchChange');

				const buttonElement = await page.find('kv-switch-button >>> .switch-button');
				await buttonElement.click();

				await new Promise(resolve => setTimeout(resolve, 300));
			});

			it('should change `checked` to false', async () => {
				const switchButtonElement = await page.find('kv-switch-button');
				expect(switchButtonElement).not.toHaveAttribute('checked');
			});

			it('should emit switchChange event with false', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail(false);
			});
		});
	});
});
