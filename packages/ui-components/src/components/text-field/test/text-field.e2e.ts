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

		describe('when the user types past the max length', () => {
			const pageErrors: unknown[] = [];

			beforeEach(async () => {
				pageErrors.length = 0;
				await render('max-length="2"');
				// Puppeteer types a page error as `unknown`; the page only ever throws `Error`s here
				page.on('pageerror', error => pageErrors.push(error as Error));

				await textFieldElement.type('123');
				await settle();
			});

			it('should keep the value within the max length without throwing', async () => {
				expect(await textFieldElement.getProperty('value')).toBe('12');
				expect(pageErrors).toEqual([]);
			});
		});
	});

	describe('value prefix', () => {
		const measure = async (attributes: string) => {
			page = await newE2EPage();
			await page.setContent(
				`<div style="width: 240px"><kv-text-field value-prefix="Polling rate in seconds for every data stream:" fit-content="false" ${attributes}></kv-text-field></div>`
			);
			await page.waitForChanges();

			return page.evaluate(() => {
				const root = document.querySelector('kv-text-field')?.shadowRoot;
				const field = root?.querySelector('.input-container')?.getBoundingClientRect().width ?? 0;
				const prefix = root?.querySelector<HTMLElement>('.value-prefix');

				return {
					field,
					prefix: prefix?.getBoundingClientRect().width ?? 0,
					isCut: prefix ? prefix.scrollWidth > prefix.clientWidth : false
				};
			});
		};

		it('takes at most 70% of the field, cutting a longer prefix', async () => {
			const { field, prefix, isCut } = await measure('value="30"');

			expect(prefix).toBeGreaterThan(0);
			expect(prefix).toBeLessThanOrEqual(field * 0.7);
			expect(isCut).toBe(true);
		});

		const hoverPrefix = async () => {
			const center = await page.evaluate(() => {
				const prefix = document.querySelector('kv-text-field')?.shadowRoot?.querySelector('.value-prefix')?.getBoundingClientRect();

				return prefix ? { x: prefix.x + prefix.width / 2, y: prefix.y + prefix.height / 2 } : null;
			});
			expect(center).not.toBeNull();
			await page.mouse.move(center.x, center.y);
			// Long enough for the tooltip's portal to mount on <body>
			await new Promise(r => setTimeout(r, 600));

			return page.evaluate(() => Array.from(document.querySelectorAll('kv-tooltip-text')).map(tooltip => tooltip.getAttribute('text')));
		};

		it('shows a cut prefix in full in a tooltip on hover', async () => {
			await measure('value="30"');

			expect(await hoverPrefix()).toEqual(['Polling rate in seconds for every data stream:']);
		});

		it('shows no tooltip over a prefix that fits', async () => {
			page = await newE2EPage();
			await page.setContent('<div style="width: 240px"><kv-text-field value-prefix="Rate:" fit-content="false" value="30"></kv-text-field></div>');
			await page.waitForChanges();

			expect(await hoverPrefix()).toEqual([]);
		});

		it('keeps its share while the field is empty with prefix-when-empty', async () => {
			const { field, prefix } = await measure('prefix-when-empty placeholder="Mixed"');

			expect(prefix).toBeGreaterThan(0);
			expect(prefix).toBeLessThanOrEqual(field * 0.7);
		});
	});

	describe('a value wider than the field', () => {
		const LONG_VALUE = 'opc.tcp://plant-01.example.com:4840/objects/line-3/pump-7/discharge-pressure';

		const render = async (attributes: string, value = LONG_VALUE) => {
			page = await newE2EPage();
			await page.setContent(
				// The e2e page loads no design tokens, so the field gets its height here or has none to hover or click
				`<div style="width: 240px"><kv-text-field style="--input-height-large: 40px; --input-height-small: 32px" fit-content="false" value="${value}" ${attributes}></kv-text-field></div>`
			);
			await page.waitForChanges();
		};

		const inputState = () =>
			page.evaluate(() => {
				const input = document.querySelector('kv-text-field')?.shadowRoot?.querySelector('input');

				return {
					scrollLeft: input?.scrollLeft ?? 0,
					maxScroll: (input?.scrollWidth ?? 0) - (input?.clientWidth ?? 0),
					caret: input?.selectionStart ?? null,
					length: input?.value.length ?? 0,
					textOverflow: input ? getComputedStyle(input).textOverflow : ''
				};
			});

		const inputBox = () =>
			page.evaluate(() => {
				const box = document.querySelector('kv-text-field')?.shadowRoot?.querySelector('input')?.getBoundingClientRect();

				return box ? { x: box.x, y: box.y + box.height / 2, width: box.width } : { x: 0, y: 0, width: 0 };
			});

		const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

		describe('with scroll-on-hover', () => {
			it('scrolls to the end while hovered, and back to the start on leave', async () => {
				await render('scroll-on-hover');
				const box = await inputBox();

				await page.mouse.move(box.x + box.width / 2, box.y);
				// It scrolls at a reading pace, so a longer value takes longer: wait for the end
				await page.waitForFunction(
					() => {
						const input = document.querySelector('kv-text-field')?.shadowRoot?.querySelector('input');

						return !!input && input.scrollLeft > 0 && input.scrollLeft >= input.scrollWidth - input.clientWidth - 1;
					},
					{ timeout: 6000 }
				);
				const hovered = await inputState();

				expect(hovered.maxScroll).toBeGreaterThan(0);
				expect(hovered.scrollLeft).toBeGreaterThanOrEqual(hovered.maxScroll - 1);
				// The ellipsis would hide the very text the scroll brings into view
				expect(hovered.textOverflow).toBe('clip');

				await page.mouse.move(0, 0);
				await wait(100);
				const left = await inputState();

				expect(left.scrollLeft).toBe(0);
				expect(left.textOverflow).toBe('ellipsis');
			});

			it('does not move a value that fits', async () => {
				await render('scroll-on-hover', 'Pump 7');
				const box = await inputBox();

				await page.mouse.move(box.x + box.width / 2, box.y);
				await wait(600);

				expect((await inputState()).scrollLeft).toBe(0);
			});
		});

		it('does not scroll on hover by default', async () => {
			await render('');
			const box = await inputBox();

			await page.mouse.move(box.x + box.width / 2, box.y);
			await wait(1500);

			expect((await inputState()).scrollLeft).toBe(0);
		});

		it('puts the caret at the end on focus with caret-at-end-on-focus, wherever the click lands', async () => {
			await render('caret-at-end-on-focus');

			// A click in the middle of the value would put the caret there
			await (await page.find('kv-text-field >>> input')).click();
			await wait(100);
			const { caret, length, scrollLeft, maxScroll } = await inputState();

			expect(caret).toBe(length);
			expect(scrollLeft).toBeGreaterThanOrEqual(maxScroll - 1);
		});

		it('leaves the caret where the click lands by default', async () => {
			await render('');

			await (await page.find('kv-text-field >>> input')).click();
			await wait(100);
			const { caret, length } = await inputState();

			expect(caret).toBeLessThan(length);
		});
	});
});
