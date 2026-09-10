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
			await page.setContent('<kv-text-field label="Text Field" input-required></kv-text-field>');
		});

		it('should render label and component with required indication', async () => {
			const labelComponent = await page.find('kv-text-field >>> kv-form-label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent).toEqualAttribute('required', '');
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

	describe('when a native input type rejects the provided value', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="datetime-local" value="2024-01-01T10:00:00.000Z"></kv-text-field>');

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		});

		it('should keep the value on the component without emitting changes', async () => {
			expect(await textFieldComponent.getProperty('value')).toBe('2024-01-01T10:00:00.000Z');
			expect(spyChangeEvent).not.toHaveReceivedEvent();
		});
	});

	describe('when a masked field cannot represent the provided value', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="number" use-input-mask=true value="abc"></kv-text-field>');

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');

			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		});

		it('should keep the value on the component without emitting changes', async () => {
			expect(await textFieldComponent.getProperty('value')).toBe('abc');
			expect(spyChangeEvent).not.toHaveReceivedEvent();
		});
	});

	describe('when the value is set programmatically on an empty text field', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;
		let textFieldElement: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field></kv-text-field>');

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');
			textFieldElement = await page.find('kv-text-field >>> input');

			textFieldComponent.setProperty('value', 'Chuck');
			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		});

		it('should render the value and keep it on the component', async () => {
			expect(await textFieldElement.getProperty('value')).toBe('Chuck');
			expect(await textFieldComponent.getProperty('value')).toBe('Chuck');
		});

		it('should not emit change events for the programmatic write', () => {
			expect(spyChangeEvent).not.toHaveReceivedEvent();
		});
	});

	describe('when the value is set programmatically on an empty masked number field', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;
		let textFieldElement: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="number" min="1" max="10" use-input-mask=true></kv-text-field>');

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');
			textFieldElement = await page.find('kv-text-field >>> input');

			textFieldComponent.setProperty('value', '5');
			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		});

		it('should render the value and keep it on the component', async () => {
			expect(await textFieldElement.getProperty('value')).toBe('5');
			expect(await textFieldComponent.getProperty('value')).toBe('5');
		});

		it('should not emit change events for the programmatic write', () => {
			expect(spyChangeEvent).not.toHaveReceivedEvent();
		});
	});

	describe('when the text field has a numeric input mask with min and max limits', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;
		let textFieldElement: E2EElement;

		const clearInput = async () => {
			await textFieldElement.click({ clickCount: 3 });
			await textFieldElement.press('Backspace');
			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		};

		const blurInput = async () => {
			await textFieldElement.press('Tab');
			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		};

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-text-field type="number" min="1" max="10" value="2.5" use-input-mask=true></kv-text-field>');

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');
			textFieldElement = await page.find('kv-text-field >>> input');
		});

		describe('when the user clears the field', () => {
			beforeEach(async () => {
				await clearInput();
			});

			it('should leave the field empty and emit the change', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('');
				expect(spyChangeEvent).toHaveReceivedEventDetail('');
			});
		});

		describe('when the user clears the field and blurs', () => {
			beforeEach(async () => {
				await clearInput();
				await blurInput();
			});

			it('should keep the field empty instead of writing the min value', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('');
			});
		});

		describe('when the user clears the field and types a new value', () => {
			beforeEach(async () => {
				await clearInput();
				await textFieldElement.type('5');
				await new Promise(r => setTimeout(r, 300));
			});

			it('should accept the value on the integer part', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('5');
				expect(spyChangeEvent).toHaveReceivedEventDetail('5');
			});
		});

		describe('when the user leaves a below-min value and blurs', () => {
			beforeEach(async () => {
				await clearInput();
				await textFieldElement.type('0');
				await new Promise(r => setTimeout(r, 300));
				await blurInput();
			});

			it('should clamp the value to the min and propagate the change', async () => {
				const value = await textFieldElement.getProperty('value');
				expect(value).toBe('1');
				expect(spyChangeEvent).toHaveReceivedEventDetail(value);
			});
		});

		describe('when the value is set programmatically above the max', () => {
			beforeEach(async () => {
				textFieldComponent.setProperty('value', '15');
				await page.waitForChanges();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should render the value as-is without clamping', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('15');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when the value is set programmatically below the min', () => {
			beforeEach(async () => {
				textFieldComponent.setProperty('value', '0.5');
				await page.waitForChanges();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should render the value as-is without clamping', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('0.5');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when a programmatic out-of-range value is focused and blurred by the user', () => {
			beforeEach(async () => {
				textFieldComponent.setProperty('value', '15');
				await page.waitForChanges();
				await new Promise(r => setTimeout(r, 300));

				await textFieldElement.click();
				await blurInput();
			});

			it('should clamp the value to the max and propagate the change', async () => {
				const value = await textFieldElement.getProperty('value');
				expect(value).toBe('10');
				expect(spyChangeEvent).toHaveReceivedEventDetail(value);
			});
		});

		describe('when the user types a value above the max', () => {
			beforeEach(async () => {
				await textFieldElement.click();
				await textFieldElement.press('Home');
				await textFieldElement.type('9');

				await new Promise(r => setTimeout(r, 300));
			});

			it('should reject the keystroke and keep the previous value', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('2.5');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
