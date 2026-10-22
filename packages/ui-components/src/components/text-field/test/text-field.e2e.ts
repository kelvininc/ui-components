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

	describe('when the text field is a number field', () => {
		let spyChangeEvent: EventSpy;
		let textFieldComponent: E2EElement;
		let textFieldElement: E2EElement;

		const render = async (attributes: string) => {
			page = await newE2EPage();
			await page.setContent(`<kv-text-field type="number" ${attributes}></kv-text-field>`);

			textFieldComponent = await page.find('kv-text-field');
			spyChangeEvent = await textFieldComponent.spyOnEvent('textChange');
			textFieldElement = await page.find('kv-text-field >>> input');

			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		};

		const settle = async () => {
			await page.waitForChanges();
			await new Promise(r => setTimeout(r, 300));
		};

		const focusAndBlur = async () => {
			await textFieldElement.click();
			await textFieldElement.press('Tab');
			await settle();
		};

		it('should render a native number input', async () => {
			await render('');

			expect(await textFieldElement.getProperty('type')).toBe('number');
		});

		describe.each(['123456789012345.67', '999999999999999.9', '11.023422523129753', '1e-7', '-0.25'])('when created with the value %s', value => {
			beforeEach(async () => {
				await render(`value="${value}"`);
			});

			it('should show the value as written without emitting changes', async () => {
				expect(await textFieldElement.getProperty('value')).toBe(value);
				expect(await textFieldComponent.getProperty('value')).toBe(value);
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});

			it('should keep the value when the user focuses and blurs the field', async () => {
				await focusAndBlur();

				expect(await textFieldElement.getProperty('value')).toBe(value);
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when a number is set programmatically', () => {
			beforeEach(async () => {
				await render('');

				textFieldComponent.setProperty('value', 123456789012345.67);
				await settle();
			});

			it('should show the number as written without emitting changes', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('123456789012345.67');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when the field has min and max limits', () => {
			beforeEach(async () => {
				await render('min="1" max="10"');
			});

			it('should pass the limits to the native input', async () => {
				expect(await textFieldElement.getProperty('min')).toBe('1');
				expect(await textFieldElement.getProperty('max')).toBe('10');
			});

			it('should not clamp a value outside the limits when the user focuses and blurs the field', async () => {
				textFieldComponent.setProperty('value', '15');
				await settle();

				await focusAndBlur();

				expect(await textFieldElement.getProperty('value')).toBe('15');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe('when the field has no limits', () => {
			beforeEach(async () => {
				await render('value="10000000000000000"');
			});

			it('should not add limits to the native input', async () => {
				expect(await textFieldElement.getProperty('min')).toBe('');
				expect(await textFieldElement.getProperty('max')).toBe('');
			});

			it('should keep a value past the largest safe integer when the user focuses and blurs the field', async () => {
				await focusAndBlur();

				expect(await textFieldElement.getProperty('value')).toBe('10000000000000000');
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});

		describe.each(['-0.25', '0.0000001', '1e-7', '123456789012345.67'])('when the user types %s', typed => {
			beforeEach(async () => {
				await render('');

				await textFieldElement.type(typed);
				await settle();
			});

			it('should keep the typed text and emit it', async () => {
				expect(await textFieldElement.getProperty('value')).toBe(typed);
				expect(spyChangeEvent).toHaveReceivedEventDetail(typed);
			});
		});

		describe('when the user clears a field that has a minimum', () => {
			beforeEach(async () => {
				await render('min="1" value="5"');

				await textFieldElement.click({ clickCount: 3 });
				await textFieldElement.press('Backspace');
				await settle();
			});

			it('should leave the field empty and emit the change', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('');
				expect(spyChangeEvent).toHaveReceivedEventDetail('');
			});

			it('should keep the field empty when the user blurs the field', async () => {
				await textFieldElement.press('Tab');
				await settle();

				expect(await textFieldElement.getProperty('value')).toBe('');
			});
		});

		describe('when a consumer feeds the typed text back as the value', () => {
			beforeEach(async () => {
				await render('');

				await page.$eval('kv-text-field', element => {
					element.addEventListener('textChange', (event: CustomEvent<string>) => {
						(element as HTMLKvTextFieldElement).value = event.detail;
					});
				});

				await textFieldElement.type('-0.25');
				await settle();
			});

			it('should keep the incomplete steps of the typed number', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('-0.25');
				expect(await textFieldComponent.getProperty('value')).toBe('-0.25');
			});
		});
	});
});
