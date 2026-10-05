import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { ACTION_BUTTON_VARIANTS, ACTIVATION_MODIFIERS } from './action-button.mock';

describe('action button keyboard', () => {
	it.each(ACTION_BUTTON_VARIANTS)('names and activates $name once through host focus', async variant => {
		const page = await newE2EPage();
		await page.setContent(variant.html);
		const host = await page.find(variant.tag);
		const activation = await host.spyOnEvent(variant.event);
		const nativeClick = await host.spyOnEvent('click');
		const control = await page.$(`aria/${variant.buttonName}[role="button"]`);
		expect(control).not.toBeNull();

		await page.evaluate(tag => document.querySelector<HTMLElement>(tag).focus(), variant.tag);
		if (variant.event === 'clickRightButton') await page.keyboard.press('Tab');
		expect(await control.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true);
		for (const key of ['Enter', 'Space'] as const) {
			await page.keyboard.down(key);
			await page.keyboard.down(key);
			await page.keyboard.up(key);
		}
		await page.waitForChanges();

		expect(activation).toHaveReceivedEventTimes(2);
		expect(nativeClick).toHaveReceivedEventTimes(2);
	});

	it.each(ACTION_BUTTON_VARIANTS.flatMap(variant => ['Enter', 'Space'].map(key => ({ ...variant, key }))))(
		'consumes held $key after $name disables on activation',
		async variant => {
			const page = await newE2EPage();
			await page.setContent(variant.html);
			const host = await page.find(variant.tag);
			const activation = await host.spyOnEvent(variant.event);
			const nativeClick = await host.spyOnEvent('click');
			const pageKeyDown = await page.spyOnEvent('keydown');
			const control = await page.$(`aria/${variant.buttonName}[role="button"]`);
			expect(control).not.toBeNull();
			await page.evaluate(({ tag, event }) => {
				const host = document.querySelector<HTMLElement & { disabled: boolean }>(tag);
				host.addEventListener(
					event,
					() => {
						host.disabled = true;
					},
					{ once: true }
				);
			}, variant);
			await control.evaluate(element =>
				element.addEventListener('keydown', (event: KeyboardEvent) => {
					const presses = JSON.parse(document.body.dataset.presses ?? '[]');
					presses.push({ repeat: event.repeat, prevented: event.defaultPrevented });
					document.body.dataset.presses = JSON.stringify(presses);
				})
			);
			await control.focus();
			await page.keyboard.down(variant.key);
			await page.waitForChanges();
			expect(await control.evaluate(element => element.getAttribute('aria-disabled'))).toBe('true');
			expect(await control.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true);
			await page.keyboard.down(variant.key);
			await page.keyboard.up(variant.key);
			await page.waitForChanges();

			expect(await page.evaluate(() => JSON.parse(document.body.dataset.presses))).toEqual([
				{ repeat: false, prevented: true },
				{ repeat: true, prevented: true }
			]);
			expect(activation).toHaveReceivedEventTimes(1);
			expect(nativeClick).toHaveReceivedEventTimes(1);
			expect(pageKeyDown).not.toHaveReceivedEvent();
		}
	);

	it('tabs through the button once and skips it when disabled', async () => {
		const page = await newE2EPage();
		await page.setContent('<button id="before">Before</button><kv-action-button type="primary">Deploy connector</kv-action-button><button id="after">After</button>');
		await page.focus('#before');
		await page.keyboard.press('Tab');
		const control = await page.$('aria/Deploy connector[role="button"]');
		expect(control).not.toBeNull();
		expect(await control.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true);
		await page.keyboard.press('Tab');
		expect(await page.evaluate(() => document.activeElement.id)).toBe('after');

		const host = await page.find('kv-action-button');
		host.setProperty('disabled', true);
		await page.waitForChanges();
		expect(await control.evaluate(element => element.getAttribute('aria-disabled'))).toBe('true');
		expect(host.getAttribute('aria-disabled')).toBeNull();
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await page.evaluate(() => document.activeElement.id)).toBe('after');
		const activation = await host.spyOnEvent('clickButton');
		const nativeClick = await host.spyOnEvent('click');
		await control.focus();
		await page.keyboard.press('Enter');
		await page.keyboard.press('Space');
		await page.waitForChanges();
		expect(activation).not.toHaveReceivedEvent();
		expect(nativeClick).not.toHaveReceivedEvent();
	});

	it.each(ACTIVATION_MODIFIERS)('leaves %s activation shortcuts to the page', async modifier => {
		const page = await newE2EPage();
		await page.setContent('<kv-action-button type="primary">Deploy connector</kv-action-button>');
		const host = await page.find('kv-action-button');
		const activation = await host.spyOnEvent('clickButton');
		const nativeClick = await host.spyOnEvent('click');
		const pageKeyDown = await page.spyOnEvent('keydown');
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter' || event.key === ' ') {
					document.body.dataset.shortcuts = String(Number(document.body.dataset.shortcuts ?? 0) + 1);
					document.body.dataset.prevented = String(event.defaultPrevented);
				}
			})
		);
		await page.evaluate(() => document.querySelector('kv-action-button').focus());
		const key = { altKey: 'Alt', ctrlKey: 'Control', metaKey: 'Meta' }[modifier] as 'Alt' | 'Control' | 'Meta';
		await page.keyboard.down(key);
		await page.keyboard.press('Enter');
		await page.keyboard.press('Space');
		await page.keyboard.up(key);
		await page.waitForChanges();

		expect(activation).not.toHaveReceivedEvent();
		expect(nativeClick).not.toHaveReceivedEvent();
		expect(pageKeyDown).toHaveReceivedEventTimes(3);
		expect(await page.evaluate(() => document.body.dataset.shortcuts)).toBe('2');
		expect(await page.evaluate(() => document.body.dataset.prevented)).toBe('false');
	});

	it('consumes activation keys while preserving canceled keys and other keys', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-action-button type="primary">Deploy connector</kv-action-button>');
		const host = await page.find('kv-action-button');
		const activation = await host.spyOnEvent('clickButton');
		const pageKeyDown = await page.spyOnEvent('keydown');
		await page.evaluate(() => document.querySelector('kv-action-button').focus());
		await page.keyboard.press('Enter');
		await page.keyboard.press('Space');
		await page.keyboard.press('a');
		await page.waitForChanges();
		expect(activation).toHaveReceivedEventTimes(2);
		expect(pageKeyDown).toHaveReceivedEventTimes(1);

		await page.evaluate(() => {
			const button = document.querySelector('kv-action-button').shadowRoot.querySelector('[part="button"]');
			button.addEventListener('keydown', event => event.preventDefault(), { capture: true });
		});
		await page.keyboard.press('Enter');
		await page.keyboard.press('Space');
		await page.waitForChanges();
		expect(activation).toHaveReceivedEventTimes(2);
	});

	it('leaves a slotted native button activation to that button', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-action-button type="primary"><button id="inner">Save connection</button></kv-action-button>');
		const host = await page.find('kv-action-button');
		const activation = await host.spyOnEvent('clickButton');
		const inner = await page.find('#inner');
		const click = await inner.spyOnEvent('click');
		await page.focus('#inner');
		await page.keyboard.press('Enter');
		await page.waitForChanges();

		expect(click).toHaveReceivedEventTimes(1);
		expect(activation).toHaveReceivedEventTimes(1);
	});
});

describe('Action Button (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button type="primary">Click</kv-action-button>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button >>> .action-button');
				await actionButtonElement.click();
			});

			it('should emit clickButton event', () => {
				expect(spyChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-action-button type="primary" disabled>Click</kv-action-button>');
		});

		describe('and user clicks on the button', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				const actionButtonIconElement = await page.find('kv-action-button');
				spyChangeEvent = await actionButtonIconElement.spyOnEvent('clickButton');

				const actionButtonElement = await page.find('kv-action-button >>> .action-button');
				await actionButtonElement.click();
			});

			it('should not emit clickButton event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
