import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { CLIPBOARD_CASES, COMPOSITION_CASES, CONTROLLED_TEXT_CASES, NATIVE_INPUT_CASES, REPLACEMENT_CASES } from './text-area.mock';
import { DESIGN_TOKEN_CSS } from '../../../utils/test/design-tokens';

const readText = (page: E2EPage) => page.evaluate(() => (document.querySelector('kv-text-area').shadowRoot.querySelector('.input') as HTMLElement).innerText);

describe('text area contracts in Chromium', () => {
	it.each([180, 800].flatMap(width => [false, true].flatMap(disabled => ['none', 'invalid'].map(state => ({ width, disabled, state })))))(
		'keeps the icon inside the border at $width px, disabled=$disabled, state=$state',
		async ({ width, disabled, state }) => {
			const page = await newE2EPage({
				html: `<button id="previous">Previous field</button><kv-text-area icon="kv-notes" text="Inspect the cooling loop." max-char-length="1000" counter-always-visible="true" disabled="${disabled}" state="${state}" style="display:block;width:${width}px"></kv-text-area>`
			});
			await page.addStyleTag({ content: DESIGN_TOKEN_CSS });
			const geometry = await page.evaluate(async () => {
				const host = document.querySelector('kv-text-area');
				const root = host.shadowRoot;
				const wrapper = root.querySelector('.text-area-wrapper');
				await Promise.all(wrapper.getAnimations().map(animation => animation.finished));
				const frame = wrapper.getBoundingClientRect();
				const icon = root.querySelector('kv-icon').getBoundingClientRect();
				const input = root.querySelector('.input').getBoundingClientRect();
				const counter = root.querySelector('.character-counter').getBoundingClientRect();
				return {
					hostLeft: host.getBoundingClientRect().left,
					frameLeft: frame.left,
					frameRight: frame.right,
					frameBottom: frame.bottom,
					iconLeft: icon.left,
					iconRight: icon.right,
					inputLeft: input.left,
					inputRight: input.right,
					inputBottom: input.bottom,
					counterTop: counter.top,
					counterRight: counter.right,
					counterBottom: counter.bottom
				};
			});
			expect(geometry.frameLeft).toBe(geometry.hostLeft);
			expect(geometry.iconLeft).toBeGreaterThan(geometry.frameLeft);
			expect(geometry.iconRight).toBeLessThan(geometry.inputLeft);
			expect(geometry.inputRight).toBeLessThan(geometry.frameRight);
			expect(geometry.inputBottom).toBeLessThanOrEqual(geometry.counterTop);
			expect(geometry.counterRight).toBeLessThan(geometry.frameRight);
			expect(geometry.counterBottom).toBeLessThan(geometry.frameBottom);
			await (await page.find('#previous')).focus();
			await (await page.find('kv-text-area >>> kv-icon')).click();
			expect(await page.evaluate(() => document.querySelector('kv-text-area').shadowRoot.activeElement?.classList.contains('input') ?? false)).toBe(!disabled);
		}
	);

	it.each([180, 800])('keeps the counter inside the border while text scrolls at %ipx', async width => {
		const page = await newE2EPage({ html: `<button>Next field</button><kv-text-area style="display:block;width:${width}px" max-char-length="1000"></kv-text-area>` });
		await page.addStyleTag({ content: DESIGN_TOKEN_CSS });
		const host = await page.find('kv-text-area');
		host.setProperty('text', Array.from({ length: 12 }, () => 'Inspect the sensor before restarting ingestion.').join('\n'));
		await page.waitForChanges();
		await (await page.find('kv-text-area >>> .input')).focus();
		await page.waitForChanges();
		const layout = await page.evaluate(async () => {
			const root = document.querySelector('kv-text-area').shadowRoot;
			const wrapper = root.querySelector('.text-area-wrapper');
			await Promise.all(wrapper.getAnimations().map(animation => animation.finished));
			const input = root.querySelector('.input') as HTMLElement;
			const counter = root.querySelector('.character-counter');
			const field = wrapper.getBoundingClientRect();
			const editable = input.getBoundingClientRect();
			const count = counter.getBoundingClientRect();
			input.scrollTop = input.scrollHeight;
			return {
				inputBottom: editable.bottom,
				counterTop: count.top,
				counterBottom: count.bottom,
				counterRight: count.right,
				fieldBottom: field.bottom,
				fieldRight: field.right,
				scrolled: input.scrollTop,
				afterScroll: counter.getBoundingClientRect().top,
				height: field.height
			};
		});
		expect(layout.counterTop).toBeGreaterThanOrEqual(layout.inputBottom);
		expect(layout.counterBottom).toBeLessThan(layout.fieldBottom);
		expect(layout.counterRight).toBeLessThan(layout.fieldRight);
		expect(layout.scrolled).toBeGreaterThan(0);
		expect(layout.afterScroll).toBe(layout.counterTop);
		await page.click('button');
		await page.waitForChanges();
		const blurredHeight = await page.evaluate(() => document.querySelector('kv-text-area').shadowRoot.querySelector('.text-area-wrapper').getBoundingClientRect().height);
		expect(blurredHeight).toBe(layout.height);
	});

	it.each(NATIVE_INPUT_CASES)('enforces native input with $name', async row => {
		const attributes = row.limit === undefined ? '' : `max-char-length="${row.limit}"`;
		const page = await newE2EPage({ html: `<kv-text-area text="${row.initial}" ${attributes}></kv-text-area>` });
		const host = await page.find('kv-text-area');
		await host.focus();
		if (row.selection === 'all') {
			await page.keyboard.down('Control');
			await page.keyboard.press('A');
			await page.keyboard.up('Control');
		} else {
			await page.keyboard.press('End');
			if (row.selection === 'last') {
				await page.keyboard.down('Shift');
				await page.keyboard.press('ArrowLeft');
				await page.keyboard.up('Shift');
			}
		}
		const changed = await host.spyOnEvent('textChange');
		const session = await page.createCDPSession();
		try {
			await session.send('Input.insertText', { text: row.inserted });
			await page.waitForChanges();
			expect(await readText(page)).toBe(row.expected);
			expect(changed.events.length).toBe(row.expected === row.initial ? 0 : 1);
		} finally {
			await session.detach();
		}
	});

	it.each(COMPOSITION_CASES)('handles real IME input with $name', async row => {
		const attributes = row.limit === undefined ? '' : `max-char-length="${row.limit}"`;
		const page = await newE2EPage({ html: `<kv-text-area text="${row.initial}" ${attributes}></kv-text-area>` });
		const host = await page.find('kv-text-area');
		await host.focus();
		await page.keyboard.press('End');
		if (row.selection === 'all') {
			await page.keyboard.down('Control');
			await page.keyboard.press('A');
			await page.keyboard.up('Control');
		}
		const changed = await host.spyOnEvent('textChange');
		const session = await page.createCDPSession();
		try {
			await session.send('Input.imeSetComposition', { text: row.draft, selectionStart: row.draft.length, selectionEnd: row.draft.length });
			await page.waitForChanges();
			expect(await readText(page)).toBe((row.selection === 'all' ? '' : row.initial) + row.draft);
			expect(changed.events).toHaveLength(0);
			if (row.committed) await session.send('Input.insertText', { text: row.committed });
			else await session.send('Input.imeSetComposition', { text: '', selectionStart: 0, selectionEnd: 0 });
			await page.waitForChanges();
			expect(await readText(page)).toBe(row.expected);
			expect(changed.events.length).toBe(row.expected === row.initial ? 0 : 1);
		} finally {
			await session.detach();
		}
	});

	it('keeps focus and a usable caret after restoring an overflowing IME commit', async () => {
		const page = await newE2EPage({ html: '<kv-text-area text="AB" max-char-length="3"></kv-text-area>' });
		const host = await page.find('kv-text-area');
		await host.focus();
		await page.keyboard.press('End');
		const changed = await host.spyOnEvent('textChange');
		const session = await page.createCDPSession();
		try {
			await session.send('Input.imeSetComposition', { text: 'にほん', selectionStart: 3, selectionEnd: 3 });
			await session.send('Input.insertText', { text: '日本' });
			await page.waitForChanges();
			expect(await readText(page)).toBe('AB');
			expect(changed.events).toHaveLength(0);
			await page.keyboard.press('ArrowLeft');
			await page.keyboard.press('Backspace');
			await page.waitForChanges();
			expect(await readText(page)).toBe('B');
			expect(changed.lastEvent.detail).toBe('B');
		} finally {
			await session.detach();
		}
	});

	describe.each(REPLACEMENT_CASES)('selected replacement: $name', row => {
		it.each(['keyboard', 'paste'])('applies the prospective limit during %s replacement', async mode => {
			const page = await newE2EPage({ html: `<kv-text-area max-char-length="${row.limit}"></kv-text-area>` });
			const host = await page.find('kv-text-area');
			host.setProperty('text', row.initial);
			await page.waitForChanges();
			const context = page.browserContext();
			try {
				if (mode === 'paste') {
					await context.overridePermissions(new URL(page.url()).origin, ['clipboard-read', 'clipboard-sanitized-write']);
					await page.evaluate(async text => {
						await navigator.clipboard.writeText(text);
					}, row.replacement);
				}
				const changed = await host.spyOnEvent('textChange');
				await host.focus();
				if (row.selection === 'all') {
					await page.keyboard.down('Control');
					await page.keyboard.press('A');
					await page.keyboard.up('Control');
				} else {
					await page.keyboard.press('End');
					await page.keyboard.down('Shift');
					await page.keyboard.press('ArrowLeft');
					await page.keyboard.up('Shift');
				}
				if (mode === 'keyboard') await page.keyboard.type(row.replacement);
				else {
					await page.keyboard.down('Control');
					await page.keyboard.press('V');
					await page.keyboard.up('Control');
				}
				await page.waitForChanges();
				const expected = mode === 'keyboard' ? row.typed : row.pasted;
				expect(await readText(page)).toBe(expected);
				expect(changed.events.length > 0).toBe(expected !== row.initial);
				expect(changed.lastEvent?.detail).toBe(expected === row.initial ? undefined : expected);
			} finally {
				await context.clearPermissionOverrides();
			}
		});
	});

	it.each(CONTROLLED_TEXT_CASES)('synchronizes external text with $name without emitting input', async row => {
		const page = await newE2EPage({ html: `<kv-text-area text="Broker" max-char-length="100" disabled="${row.disabled}"></kv-text-area>` });
		const host = await page.find('kv-text-area');
		const changed = await host.spyOnEvent('textChange');
		host.setProperty('text', row.text);
		await page.waitForChanges();
		const input = await page.find('kv-text-area >>> .input');
		expect(await readText(page)).toBe(row.expected);
		expect(input.classList.contains('placeholder')).toBe(row.expected === '');
		const counter = await page.find('kv-text-area >>> .character-counter');
		expect(await counter.innerText).toContain(`${[...row.expected].length} / 100`);
		expect(changed).toHaveReceivedEventTimes(0);
	});

	it('emits an empty string and restores the placeholder and counter after native clearing', async () => {
		const page = await newE2EPage({ html: '<kv-text-area text="Broker" placeholder="Connection notes" max-char-length="10"></kv-text-area>' });
		const host = await page.find('kv-text-area');
		const changed = await host.spyOnEvent('textChange');
		await host.focus();
		await page.keyboard.down('Control');
		await page.keyboard.press('A');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
		await page.waitForChanges();
		expect(changed).toHaveReceivedEventTimes(1);
		expect(changed.lastEvent.detail).toBe('');
		const input = await page.find('kv-text-area >>> .input');
		expect(await readText(page)).toBe('');
		expect(input.classList.contains('placeholder')).toBe(true);
		const counter = await page.find('kv-text-area >>> .character-counter');
		expect(await counter.innerText).toContain('0 / 10');
	});

	it('preserves intentional blank lines during native editing', async () => {
		const page = await newE2EPage({ html: '<kv-text-area accessible-label="Connection notes"></kv-text-area>' });
		const host = await page.find('kv-text-area');
		const changed = await host.spyOnEvent('textChange');
		await host.focus();
		await page.keyboard.press('Enter');
		await page.waitForChanges();
		expect(changed).toHaveReceivedEventTimes(1);
		expect(changed.lastEvent.detail).toContain('\n');
		const input = await page.find('kv-text-area >>> .input');
		expect(await readText(page)).toBe(changed.lastEvent.detail);
		expect(input.classList.contains('placeholder')).toBe(false);
	});

	it('preserves the caret while a consumer echoes every edit through the text prop', async () => {
		const page = await newE2EPage({ html: '<kv-text-area text="Broker"></kv-text-area>' });
		await page.evaluate(() => {
			const host = document.querySelector('kv-text-area');
			host.addEventListener('textChange', (event: CustomEvent<string>) => {
				host.text = event.detail;
			});
			host.focus();
		});
		await page.keyboard.press('Home');
		await page.keyboard.press('ArrowRight');
		await page.keyboard.type('é🚀');
		await page.waitForChanges();
		const host = await page.find('kv-text-area');
		expect(await readText(page)).toBe('Bé🚀roker');
		expect(await host.getProperty('text')).toBe('Bé🚀roker');
		await page.keyboard.type('T');
		await page.waitForChanges();
		expect(await readText(page)).toBe('Bé🚀Troker');
	});

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
				expect(counterText).toContain('5 / 100');
			});

			it('should have counter-always-visible class on container', async () => {
				const containerElement = await page.find('kv-text-area >>> .text-area-container');
				const hasClass = containerElement.classList.contains('counter-always-visible');
				expect(hasClass).toBe(true);
			});
		});
	});
});
