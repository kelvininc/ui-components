import { E2EPage, newE2EPage, EventSpy, E2EElement } from '@stencil/core/testing';

describe('Date Time Input (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-date-time-input></kv-date-time-input>');
		});

		describe('when user changes text', () => {
			let spyChangeEvent: EventSpy;
			let dateTimeInputComponent: E2EElement;

			beforeEach(async () => {
				dateTimeInputComponent = await page.find('kv-date-time-input');
				spyChangeEvent = await dateTimeInputComponent.spyOnEvent('textChange');

				const dateTimeInputElement = await page.find('input');
				await dateTimeInputElement.type('Teste');

				await page.waitForChanges();
			});

			it('should emit change event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});

		describe('when blur event is emitted', () => {
			let spyBlurEvent: EventSpy;
			let dateTimeInputComponent: E2EElement;

			beforeEach(async () => {
				dateTimeInputComponent = await page.find('kv-date-time-input');
				spyBlurEvent = await dateTimeInputComponent.spyOnEvent('dateTimeBlur');

				dateTimeInputComponent.triggerEvent('dateTimeBlur');

				await page.waitForChanges();
			});

			it('should emit blur event', () => {
				expect(spyBlurEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-date-time-input label="Date Time Label"></kv-date-time-input>');
		});

		it('should render label', async () => {
			const labelComponent = await page.find('kv-form-label');
			expect(labelComponent).toBeTruthy();
		});
	});
});
