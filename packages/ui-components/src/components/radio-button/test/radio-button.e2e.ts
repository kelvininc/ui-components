import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Radio Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio-button></kv-radio-button>');
		});

		it('should not render a label', async () => {
			const labelEl = await page.find('kv-radio-button >>> .label');
			expect(labelEl).toBeFalsy();
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioButtonElement: E2EElement;

			beforeEach(async () => {
				radioButtonElement = await page.find('kv-radio-button');
				spyCheckedChangeEvent = await radioButtonElement.spyOnEvent('checkedChange');

				const radioBtn = await page.find('kv-radio-button >>> .radio-button-container');
				await radioBtn.click();
				await page.waitForTimeout(300);
			});

			it('should emit state change with value `true`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEventDetail(true);
			});
		});
	});

	describe('when rendering with a label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio-button label="Accepted"></kv-radio-button>');
		});

		it('should render label', async () => {
			const labelComponent = await page.find('kv-radio-button >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText).toBe('Accepted');
		});
	});

	describe('when rendering with disabled prop', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio-button disabled></kv-radio-button>');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioButtonElement: E2EElement;

			beforeEach(async () => {
				radioButtonElement = await page.find('kv-radio-button');
				spyCheckedChangeEvent = await radioButtonElement.spyOnEvent('checkedChange');

				const radioBtn = await page.find('kv-radio-button >>> .radio-button-container');
				await radioBtn.click();
				await page.waitForTimeout(300);
			});

			it('should not emit `true` state', () => {
				expect(spyCheckedChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
