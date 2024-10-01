import { E2EPage, newE2EPage, EventSpy, E2EElement } from '@stencil/core/testing';

describe('Text Field (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field></kv-text-field>');
		});

		describe('when user changes text', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('Teste');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit change event', () => {
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
			const labelComponent = await page.find('kv-text-field >>> kv-form-label');
			expect(labelComponent).toBeTruthy();
		});
	});

	describe('when the text field is loading', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field label="Text Field" loading></kv-text-field>');
		});

		it('should render label and loading component', async () => {
			const labelComponent = await page.find('kv-text-field >>> kv-form-label');
			expect(labelComponent).toBeTruthy();
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
			const labelComponent = await page.find('kv-text-field >>> kv-form-label');
			expect(labelComponent).toBeTruthy();
			const helpTextComponent = await page.find('kv-text-field >>> kv-form-help-text');
			expect(helpTextComponent).toBeTruthy();
		});
	});

	describe('when the text field has a required text field', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field label="Text Field" required></kv-text-field>');
		});

		it('should render label and component with required indication', async () => {
			const labelComponent = await page.find('kv-text-field >>> kv-form-label');
			expect(labelComponent).toBeTruthy();
			const errorComponent = await page.find('kv-text-field >>> kv-form-help-text');
			expect(errorComponent).toBeTruthy();
		});
	});

	describe('when the text field has input mask for numeric type', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="number" min="0" max="1" value="0" required use-input-mask=true></kv-text-field>');
		});

		describe('when user inputs 1', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('1');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit change event', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail('1');
			});
		});

		describe('when user changes text but value is higher than max', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('9');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should not emit change event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when user changes text but value is a string', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('a');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should not emit change event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when the text field has input mask for string type with leters only regex', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="text" use-input-mask=true input-mask-regex="[a-zA-Z]+" required use-input-mask=true></kv-text-field>');
		});

		describe('when user inputs a', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('a');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit change event', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail('a');
			});
		});

		describe('when user inputs a number', () => {
			let spyChangeEvent: EventSpy;
			let textFieldComponent: E2EElement;

			beforeEach(async () => {
				textFieldComponent = await page.find('kv-text-field');
				spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

				const textFieldElement = await page.find('kv-text-field >>> input');
				await textFieldElement.type('1');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should not emit change event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
