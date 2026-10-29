import { newE2EPage } from '@stencil/core/testing';
import type { E2EElement, E2EPage } from '@stencil/core/testing';
import type { ISelectMultiOptions } from '../../select-multi-options/select-multi-options.types';
import { DEFAULT_DELAY_CONFIG } from '../../tooltip/tooltip.config';

const OPTIONS: ISelectMultiOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' }
};

const TRIGGER_SELECTOR = 'kv-multi-select-dropdown kv-text-field#dropdown-input';

describe('Multi Select Dropdown (end-to-end)', () => {
	let page: E2EPage;
	let dropdownElement: E2EElement;

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
