import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { CLIPBOARD_CASES } from './text-area.mock';

describe('text area contracts in Chromium', () => {
	it.each([false, true])('delegates host focus and keyboard input with disabled=%s', async disabled => {
		const page = await newE2EPage({ html: `<button id="previous">Previous field</button><kv-text-area text="Broker" disabled="${disabled}"></kv-text-area>` });
		const host = await page.find('kv-text-area');
		const changed = await host.spyOnEvent('textChange');
		await page.focus('#previous');
		await page.evaluate(() => document.querySelector<HTMLElement>('kv-text-area').focus());
		expect(await page.evaluate(() => document.querySelector('kv-text-area').shadowRoot.activeElement?.classList.contains('input') ?? false)).toBe(!disabled);
		await page.keyboard.press('End');
		await page.keyboard.type(' TLS');
		await page.waitForChanges();
		const expected = disabled ? 'Broker' : 'Broker TLS';
		expect(await page.evaluate(() => (document.querySelector('kv-text-area').shadowRoot.querySelector('.input') as HTMLElement).innerText)).toBe(expected);
		expect(changed).toHaveReceivedEventTimes(disabled ? 0 : 4);
		expect(changed.lastEvent?.detail).toBe(disabled ? undefined : expected);
	});

	it('delegates focus when clicking non-focusable host padding', async () => {
		const page = await newE2EPage({ html: '<button id="previous">Previous field</button><kv-text-area text="Broker" style="display:block;padding:16px"></kv-text-area>' });
		await page.focus('#previous');
		const point = await page.$eval('kv-text-area', host => {
			const { x, y } = host.getBoundingClientRect();
			return { x: x + 4, y: y + 4 };
		});
		await page.mouse.click(point.x, point.y);
		await page.waitForChanges();
		expect(await page.evaluate(() => document.querySelector('kv-text-area').shadowRoot.activeElement?.classList.contains('input') ?? false)).toBe(true);
	});

	it('exposes its name, placeholder and live validation state', async () => {
		const page = await newE2EPage({ html: '<kv-text-area accessible-label="Connection notes" placeholder="Describe the broker" state="invalid"></kv-text-area>' });
		const input = await page.$('aria/Connection notes[role="textbox"]');
		expect(input).not.toBeNull();
		expect(await input.evaluate(element => [element.getAttribute('aria-multiline'), element.getAttribute('aria-placeholder'), element.getAttribute('aria-invalid')])).toEqual([
			'true',
			'Describe the broker',
			'true'
		]);
		const host = await page.find('kv-text-area');
		for (const state of ['valid', 'none']) {
			host.setProperty('state', state);
			await page.waitForChanges();
			expect(host.getAttribute('state')).toBe(state);
			expect(await input.evaluate(element => element.getAttribute('aria-invalid'))).toBeNull();
		}
	});

	it.each(CLIPBOARD_CASES)('pastes native clipboard HTML as plain text with $name', async row => {
		const attributes = row.limit === undefined ? '' : `max-char-length="${row.limit}"`;
		const page = await newE2EPage({ html: `<kv-text-area accessible-label="Connection notes" text="${row.initial}" ${attributes}></kv-text-area>` });
		const context = page.browserContext();
		try {
			await context.overridePermissions(new URL(page.url()).origin, ['clipboard-read', 'clipboard-sanitized-write']);
			await page.evaluate(
				async ({ plain, html }) => {
					await navigator.clipboard.write([
						new ClipboardItem({
							'text/plain': new Blob([plain], { type: 'text/plain' }),
							'text/html': new Blob([html], { type: 'text/html' })
						})
					]);
				},
				{ plain: row.pasted, html: `<strong>${row.pasted}</strong>` }
			);
			const host = await page.find('kv-text-area');
			const changed = await host.spyOnEvent('textChange');
			const input = await page.find('kv-text-area >>> .input');
			await input.focus();
			await page.keyboard.press('End');
			if (row.disabled) {
				host.setProperty('disabled', true);
				await page.waitForChanges();
			}
			await page.keyboard.down('Control');
			await page.keyboard.press('V');
			await page.keyboard.up('Control');
			await page.waitForChanges();

			const expected = row.allowed ? row.initial + row.pasted : row.initial;
			expect(await page.evaluate(() => (document.querySelector('kv-text-area').shadowRoot.querySelector('.input') as HTMLElement).innerText)).toBe(expected);
			expect(await page.evaluate(() => document.querySelector('kv-text-area').shadowRoot.querySelector('.input').querySelector('strong, b, span'))).toBeNull();
			expect(changed).toHaveReceivedEventTimes(row.allowed ? 1 : 0);
			expect(changed.events.map(event => event.detail)).toEqual(row.allowed ? [expected] : []);
		} finally {
			await context.clearPermissionOverrides();
		}
	});

	it.each([false, true])('uses custom validation borders through hover and focus with disabled=%s', async disabled => {
		const page = await newE2EPage({
			html: `<kv-text-area text="Broker notes" state="invalid"
				style="--text-area-border-thickness-default:1px;--border-color-error:rgb(210,30,40);--border-color-disabled:rgb(80,90,100)"></kv-text-area>`
		});
		const border = () => page.evaluate(() => getComputedStyle(document.querySelector('kv-text-area').shadowRoot.querySelector('.text-area-wrapper')).borderColor);
		const input = await page.find('kv-text-area >>> .input');
		await page.mouse.move(700, 500);
		await input.focus();
		const host = await page.find('kv-text-area');
		host.setProperty('disabled', disabled);
		await page.waitForChanges();
		const expected = disabled ? 'rgb(80, 90, 100)' : 'rgb(210, 30, 40)';
		expect(await border()).toBe(expected);
		await page.hover('kv-text-area');
		expect(await border()).toBe(expected);
		await input.focus();
		expect(await border()).toBe(expected);
	});
});

describe('Text Area (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newE2EPage({
				html: '<kv-text-area max-char-length=100 />'
			});
		});

		describe('when user changes text', () => {
			let textChangeEventSpy: EventSpy;
			let textAreaComponent: E2EElement;

			beforeEach(async () => {
				textAreaComponent = await page.find('kv-text-area');
				textChangeEventSpy = await textAreaComponent.spyOnEvent('textChange');

				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.type('Input Test');

				await page.waitForChanges();
			});

			it('should emit `textChange` event', () => {
				expect(textChangeEventSpy).toHaveReceivedEvent();
			});
		});

		describe('when focus shifts to another element', () => {
			let textChangeBlurEventSpy: EventSpy;
			let textAreaComponent: E2EElement;

			beforeEach(async () => {
				textAreaComponent = await page.find('kv-text-area');
				textChangeBlurEventSpy = await textAreaComponent.spyOnEvent('textChangeBlur');

				textAreaComponent.triggerEvent('textChangeBlur');
				await page.waitForChanges();
			});

			it('should emit `textChange` event', () => {
				expect(textChangeBlurEventSpy).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with counter', () => {
		describe('and counter is not always visible (default behavior)', () => {
			beforeEach(async () => {
				page = await newE2EPage({
					html: '<kv-text-area max-char-length="100" counter="true" />'
				});
			});

			it('should not display counter when not focused', async () => {
				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(false);
			});

			it('should display counter when focused', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.focus();
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});
		});

		describe('and counter is always visible', () => {
			beforeEach(async () => {
				page = await newE2EPage({
					html: '<kv-text-area max-char-length="100" counter="true" counter-always-visible="true" />'
				});
			});

			it('should display counter when not focused', async () => {
				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});

			it('should display counter when focused', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.focus();
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const isVisible = await counterElement.isVisible();
				expect(isVisible).toBe(true);
			});

			it('should update counter as user types', async () => {
				const textAreaInputEl = await page.find('kv-text-area >>> .input');
				await textAreaInputEl.type('Hello');
				await page.waitForChanges();

				const counterElement = await page.find('kv-text-area >>> .character-counter');
				const counterText = await counterElement.innerText;
				expect(counterText).toContain('5/100');
			});

			it('should have counter-always-visible class on container', async () => {
				const containerElement = await page.find('kv-text-area >>> .text-area-container');
				const hasClass = containerElement.classList.contains('counter-always-visible');
				expect(hasClass).toBe(true);
			});
		});
	});
});
