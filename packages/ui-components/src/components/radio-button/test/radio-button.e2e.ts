import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Radio Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio-button label="Option 1"></kv-radio-button>');
		});

		it('should render a label', async () => {
			const labelComponent = await page.find('kv-radio-button >>> .radio-button');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText).toBe('Option 1');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioElement: E2EElement;

			beforeEach(async () => {
				radioElement = await page.find('kv-radio-button');
				spyCheckedChangeEvent = await radioElement.spyOnEvent('checkedChange');

				const radioBtn = await page.find('kv-radio-button >>> .radio-button');
				await radioBtn.click();
				await page.waitForTimeout(300);
			});

			it('should emit state change with value `true`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with disabled prop', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio-button label="Option 1" disabled></kv-radio-button>');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioElement: E2EElement;

			beforeEach(async () => {
				radioElement = await page.find('kv-radio-button');
				spyCheckedChangeEvent = await radioElement.spyOnEvent('checkedChange');

				const radio = await page.find('kv-radio-button >>> .radio-button');
				await radio.click();
				await page.waitForTimeout(300);
			});

			it('should not emit `true` state', () => {
				expect(spyCheckedChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
