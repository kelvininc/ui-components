import { newE2EPage } from '@stencil/core/testing';
import type { E2EElement, E2EPage, EventSpy } from '@stencil/core/testing';
import type { ISelectMultiOptions } from '../../select-multi-options/select-multi-options.types';
import { DEFAULT_DELAY_CONFIG } from '../../tooltip/tooltip.config';

const OPTIONS: ISelectMultiOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' },
	'option-3': { label: 'Option 3', value: 'option-3' }
};

// The trigger stays in the dropdown, while the list is portaled to the document's body
const TRIGGER_SELECTOR = 'kv-multi-select-dropdown kv-text-field#dropdown-input';
const PANEL_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-container';

// Clear of the trigger and of the list below it, which sit at the top left of the page
const OUTSIDE_POINT = { x: 700, y: 500 };

describe('Multi Select Dropdown (end-to-end)', () => {
	let page: E2EPage;
	let dropdownElement: E2EElement;

	describe('with a host following and driving its list', () => {
		let openStateChangeSpy: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			// The design tokens size the list, and the page's body is what a click outside lands on
			await page.setContent(`
				<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
				<style>body { margin: 0; min-height: 100vh; }</style>
				<div style="width: 320px; padding: 16px">
					<kv-multi-select-dropdown min-search-options="0" search-debounce="0"></kv-multi-select-dropdown>
				</div>
			`);
			dropdownElement = await page.find('kv-multi-select-dropdown');
			dropdownElement.setProperty('options', OPTIONS);
			await page.waitForChanges();
			openStateChangeSpy = await dropdownElement.spyOnEvent('openStateChange');
		});

		// The target tells the dropdown's own emit from a request its kv-dropdown-base bubbled through it
		const getOpenStates = (): [string, boolean][] => openStateChangeSpy.events.map(({ target, detail }) => [target.tagName, detail]);

		const opened: [string, boolean] = ['KV-MULTI-SELECT-DROPDOWN', true];
		const closed: [string, boolean] = ['KV-MULTI-SELECT-DROPDOWN', false];

		const isDropdownOpen = (): Promise<boolean> => dropdownElement.getProperty('isOpen');

		const isListVisible = async (): Promise<boolean> => (await page.find(PANEL_SELECTOR)).isVisible();

		const clickTrigger = async (): Promise<void> => {
			await (await page.find(TRIGGER_SELECTOR)).click();
			await page.waitForChanges();
		};

		const pressEscape = async (): Promise<void> => {
			await page.keyboard.press('Escape');
			await page.waitForChanges();
		};

		const clickOutside = async (): Promise<void> => {
			await page.mouse.click(OUTSIDE_POINT.x, OUTSIDE_POINT.y);
			await page.waitForChanges();
		};

		const setIsOpen = async (isOpen: boolean): Promise<void> => {
			dropdownElement.setProperty('isOpen', isOpen);
			await page.waitForChanges();
		};

		it('should start with its list closed and report nothing', async () => {
			expect(await isDropdownOpen()).toBe(false);
			expect(await isListVisible()).toBe(false);
			expect(getOpenStates()).toEqual([]);
		});

		it('should report its list opening on a click on the trigger', async () => {
			await clickTrigger();

			expect(await isDropdownOpen()).toBe(true);
			expect(await isListVisible()).toBe(true);
			expect(getOpenStates()).toEqual([opened]);
		});

		it('should close its list on Escape and report it', async () => {
			await clickTrigger();
			await pressEscape();

			expect(await isDropdownOpen()).toBe(false);
			expect(await isListVisible()).toBe(false);
			expect(getOpenStates()).toEqual([opened, closed]);
		});

		it('should close its list on a click outside and report it', async () => {
			await clickTrigger();
			await clickOutside();

			expect(await isDropdownOpen()).toBe(false);
			expect(await isListVisible()).toBe(false);
			expect(getOpenStates()).toEqual([opened, closed]);
		});

		it('should close its list when the host asks for it, without reporting back', async () => {
			await clickTrigger();
			await setIsOpen(false);

			expect(await isListVisible()).toBe(false);
			expect(getOpenStates()).toEqual([opened]);
		});

		it('should open its list when the host asks for it, without reporting back', async () => {
			await setIsOpen(true);

			expect(await isListVisible()).toBe(true);
			expect(getOpenStates()).toEqual([]);
		});

		it('should drop the search it was left with when the host closes its list', async () => {
			const searchChangeSpy = await dropdownElement.spyOnEvent('searchChange');
			await clickTrigger();
			await page.keyboard.type('Option 2');
			await page.waitForChanges();

			await setIsOpen(false);

			expect(searchChangeSpy.lastEvent.detail).toBe('');
		});
	});

	describe('with a display prefix cut to its share of the field', () => {
		const DISPLAY_PREFIX = 'Polling rate in seconds for every data stream:';

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
				<div style="width: 240px; padding: 16px; margin-top: 120px">
					<kv-multi-select-dropdown display-prefix="${DISPLAY_PREFIX}"></kv-multi-select-dropdown>
				</div>
			`);
			dropdownElement = await page.find('kv-multi-select-dropdown');
			dropdownElement.setProperty('options', OPTIONS);
			dropdownElement.setProperty('selectedOptions', { 'option-1': true });
			// The field's own tooltip, which opens only when the value is cut
			dropdownElement.setProperty('inputConfig', { tooltipConfig: { text: 'Full selection' } });
			await page.waitForChanges();
		});

		const hoverPrefix = async () => {
			const center = await page.evaluate((selector: string) => {
				const prefix = document.querySelector(selector)?.shadowRoot?.querySelector('.value-prefix')?.getBoundingClientRect();

				return prefix ? { x: prefix.x + prefix.width / 2, y: prefix.y + prefix.height / 2 } : null;
			}, TRIGGER_SELECTOR);
			expect(center).not.toBeNull();
			await page.mouse.move(center.x, center.y);
			// The tooltip is placed once its delay has passed
			await new Promise(resolve => setTimeout(resolve, DEFAULT_DELAY_CONFIG + 200));
		};

		it('opens only the prefix tooltip, above the field', async () => {
			await hoverPrefix();

			const { texts, tooltipBottom, fieldTop } = await page.evaluate((selector: string) => {
				const tooltips = Array.from(document.querySelectorAll('kv-tooltip-text'));

				return {
					texts: tooltips.map(tooltip => tooltip.getAttribute('text')),
					tooltipBottom: tooltips[0]?.getBoundingClientRect().bottom,
					fieldTop: document.querySelector(selector).shadowRoot.querySelector('.input-container').getBoundingClientRect().top
				};
			}, TRIGGER_SELECTOR);

			expect(texts).toEqual([DISPLAY_PREFIX]);
			expect(tooltipBottom).toBeLessThanOrEqual(fieldTop);
		});
	});
});
