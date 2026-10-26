import { E2EPage, newE2EPage } from '@stencil/core/testing';

const labelConsumers = [
	{ tag: 'kv-form-label', lookup: 'self', flag: 'required', attribute: 'required', label: 'Port name' },
	{ tag: 'kv-text-field', lookup: 'shadow', flag: 'inputRequired', attribute: 'input-required', label: 'Port name' },
	{ tag: 'kv-radio-list', lookup: 'shadow', flag: 'required', attribute: 'required', label: 'Delivery policy' },
	{ tag: 'kv-date-time-input', lookup: 'light', flag: 'required', attribute: 'required', label: 'Maintenance window' }
] as const;

describe.each(['light', 'night'])('required label suffixes in %s', theme => {
	describe.each(['ltr', 'rtl'])('direction=%s', direction => {
		it.each(labelConsumers)('keeps the suffix beside the label in $tag', async row => {
			const page = await newE2EPage();
			await page.setContent(`<${row.tag} label="${row.label}" ${row.attribute}></${row.tag}>`);
			await page.addStyleTag({ url: '/assets/styles/style-dictionary/tokens/index.css' });
			await page.addStyleTag({ url: '/assets/fonts/font-proxima-nova.css' });
			await page.evaluate(
				(theme, direction) => {
					document.body.setAttribute('mode', theme);
					document.body.setAttribute('dir', direction);
				},
				theme,
				direction
			);
			await page.waitForChanges();
			await page.evaluate(() => document.fonts.ready);
			const measure = (gap?: string) =>
				page.evaluate(
					(row, direction, gap) => {
						const host = document.querySelector(row.tag);
						const label = row.lookup === 'self' ? host : (row.lookup === 'shadow' ? host.shadowRoot : host).querySelector<HTMLElement>('kv-form-label');
						if (gap) (label as HTMLElement).style.setProperty('--label-gap', gap);
						const text = label.shadowRoot.querySelector<HTMLElement>('.label');
						const marker = label.shadowRoot.querySelector<HTMLElement>('.required');
						const textBox = text.getBoundingClientRect();
						const markerBox = marker.getBoundingClientRect();
						return {
							order: Array.from(text.parentElement.children).map(child => child.className),
							text: text.textContent,
							ariaHidden: marker.getAttribute('aria-hidden'),
							gap: direction === 'ltr' ? markerBox.left - textBox.right : textBox.left - markerBox.right,
							width: markerBox.width,
							nativeName: host.shadowRoot?.querySelector('input')?.getAttribute('aria-label'),
							groupName: host.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-label'),
							groupRequired: host.shadowRoot?.querySelector('[role="radiogroup"]')?.getAttribute('aria-required')
						};
					},
					row,
					direction,
					gap
				);
			for (const expectedGap of [2, 6]) {
				const actual = await measure(expectedGap === 6 ? '6px' : undefined);
				expect(actual.order).toEqual(['label', 'required']);
				expect(actual.text).toBe(row.label);
				expect(actual.ariaHidden).toBe('true');
				expect(actual.width).toBeGreaterThan(0);
				expect(Math.abs(actual.gap - expectedGap)).toBeLessThanOrEqual(1);
				expect(actual.nativeName).toBe(row.tag === 'kv-text-field' ? row.label : undefined);
				expect(actual.groupName).toBe(row.tag === 'kv-radio-list' ? row.label : undefined);
				expect(actual.groupRequired).toBe(row.tag === 'kv-radio-list' ? 'true' : undefined);
			}
			(await page.find(row.tag)).setProperty(row.flag, false);
			await page.waitForChanges();
			expect(
				await page.evaluate(row => {
					const host = document.querySelector(row.tag);
					const label = row.lookup === 'self' ? host : (row.lookup === 'shadow' ? host.shadowRoot : host).querySelector('kv-form-label');
					return label.shadowRoot.querySelectorAll('.required').length;
				}, row)
			).toBe(0);
		});
	});
});

describe('Form Label (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-label></kv-form-label>');
		});

		it('should not render a label', async () => {
			const labelComponent = await page.find('kv-form-label >>> .label');
			expect(labelComponent).toBeFalsy();
		});
	});

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-label label="Text Field"></kv-form-label>');
		});

		it('should render label', async () => {
			const labelComponent = await page.find('kv-form-label >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
		});
	});

	describe('when the form label is required', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-label label="Text Field" required></kv-form-label>');
		});

		it('should render label and component with required indication', async () => {
			const labelComponent = await page.find('kv-form-label >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText.toLocaleLowerCase()).toBe('text field');
			const errorComponent = await page.find('kv-form-label >>> .required');
			expect(errorComponent).toBeTruthy();
		});
	});
});
