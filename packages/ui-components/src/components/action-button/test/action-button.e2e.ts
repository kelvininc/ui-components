import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

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

	describe.each(['secondary', 'tertiary'])('when a %s button is disabled and loading on an opaque surface', type => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
				<div style="background: var(--slider-background-default); padding: 12px">
					<kv-action-button type="${type}" disabled loading>Click</kv-action-button>
				</div>
			`);
		});

		it('should run the loading sweep above the surface, over a transparent face', async () => {
			const button = await page.find('kv-action-button >>> .action-button');
			const buttonStyle = await button.getComputedStyle();

			expect((await button.getComputedStyle('::before')).animationName).toBe('loadingrotate');
			// Keeps the sweep, painted below the button's content, from being covered by the surface
			expect(buttonStyle.isolation).toBe('isolate');
			// A disabled fill would hide it: it is the sweep's own colour in the light theme
			expect(buttonStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
		});

		it('should announce itself as busy', async () => {
			expect(await (await page.find('kv-action-button')).getAttribute('aria-busy')).toBe('true');
		});
	});

	describe.each(['primary', 'danger'])('when a %s button is loading', type => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
				<kv-action-button type="${type}" loading>Click</kv-action-button>
			`);
			// The semantic tokens, such as the button fills, are defined per theme
			await page.evaluate(() => document.body.setAttribute('mode', 'light'));
			await page.waitForChanges();
		});

		it('should run the loading sweep over its own fill, which its light label needs', async () => {
			const button = await page.find('kv-action-button >>> .action-button');
			const buttonStyle = await button.getComputedStyle();

			expect((await button.getComputedStyle('::before')).animationName).toBe('loadingrotate');
			expect(buttonStyle.isolation).toBe('isolate');
			expect(buttonStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		});
	});
});
