import { E2EPage, newE2EPage, EventSpy, E2EElement } from '@stencil/core/testing';

describe('Text Field (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field></kv-text-field>');
		});

		it('should not render a label', async () => {
			const labelComponent = await page.find('kv-text-field >>> .label');
			expect(labelComponent).toBeFalsy();
		});

		describe('when user changes text', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('Teste');

				await page.waitForTimeout(300);
			});

			it('should emit chage event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});

		describe('when blur event is emitted', () => {
			let spyBlurEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyBlurEvent = await textFieldComponent.spyOnEvent('textFieldBlur');

				textFieldComponent.triggerEvent('textFieldBlur');

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
			await page.setContent('<kv-text-field label="Text Field"></kv-text-field>');
		});

		it('should render label', async () => {
			const labelComponent = await page.find('kv-text-field >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
		});
	});

	describe('when the text field is loading', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field label="Text Field" loading></kv-text-field>');
		});

		it('should render label and loading component', async () => {
			const labelComponent = await page.find('kv-text-field >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
			const loadingComponent = await page.find('kv-text-field >>> .input-container-loading');
			expect(loadingComponent).toBeTruthy();
		});
	});

	describe('when the text field has a help text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field label="Text Field" help-text="Help Text"></kv-text-field>');
		});

		it('should render label and component with help text', async () => {
			const labelComponent = await page.find('kv-text-field >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
			const helpTextComponent = await page.find('kv-text-field >>> .text-elem');
			expect(helpTextComponent).toBeTruthy();
			expect(helpTextComponent.innerText.toLocaleLowerCase()).toBe('help text');
		});
	});

	describe('when the text field has a required text field', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field label="Text Field" required></kv-text-field>');
		});

		it('should render label and component with required error indication', async () => {
			const labelComponent = await page.find('kv-text-field >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
			const errorComponent = await page.find('kv-text-field >>> .error');
			expect(errorComponent).toBeTruthy();
		});
	});
});
