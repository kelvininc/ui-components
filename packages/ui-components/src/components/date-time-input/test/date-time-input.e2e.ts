import { E2EPage, newE2EPage, EventSpy, E2EElement } from '@stencil/core/testing';
import { focusMaskedInput } from './date-time-input.utils';

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

	describe('when the input mask is enabled', () => {
		let input: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-date-time-input use-input-mask></kv-date-time-input>');
			input = await page.find('input');
			await focusMaskedInput(page, input);
		});

		it('should accept minutes above 12', async () => {
			await input.type('15032024103045');
			await page.waitForChanges();

			expect(await input.getProperty('value')).toBe('15-03-2024 10:30:45');
		});

		it('should report the text Inputmask reverts on Escape', async () => {
			const spyChangeEvent = await (await page.find('kv-date-time-input')).spyOnEvent('textChange');
			await input.type('15032024103045');
			await page.waitForChanges();
			await input.press('Backspace');
			await input.press('Escape');
			await page.waitForChanges();

			const value = await input.getProperty('value');
			expect(spyChangeEvent).toHaveReceivedEventDetail(value);
		});

		it('should reject a month above 12', async () => {
			await input.type('1513');
			await page.waitForChanges();

			expect(await input.getProperty('value')).not.toContain('15-13');
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

	it('should keep custom date formats working without a positional mask', async () => {
		page = await newE2EPage();
		await page.setContent('<kv-date-time-input use-input-mask date-format="yyyy/MM/dd" placeholder="yyyy/mm/dd"></kv-date-time-input>');
		const input = await page.find('input');
		await focusMaskedInput(page, input);
		await input.type('20261110');
		await page.waitForChanges();

		expect(await input.getProperty('value')).toBe('2026/11/10');
	});
});
