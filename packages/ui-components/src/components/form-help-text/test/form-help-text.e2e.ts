import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { DESIGN_TOKEN_CSS } from '../../../utils/test/design-tokens';

const HELP_TEXT_CONSUMERS = [
	{ name: 'direct help text', tag: 'kv-form-help-text' },
	{ name: 'text field', tag: 'kv-text-field' },
	{ name: 'date-time input', tag: 'kv-date-time-input' }
] as const;

const HELP_TEXT_WEIGHT_CASES = [
	...HELP_TEXT_CONSUMERS.flatMap(row => [false, true].map(invalid => ({ ...row, invalid, errorWeight: 600 }))),
	{ name: 'direct help text without an override', tag: 'kv-form-help-text', invalid: true, errorWeight: undefined }
];

describe('help text weight contracts in Chromium', () => {
	it.each(HELP_TEXT_CONSUMERS.flatMap(row => [false, true].map(invalid => ({ ...row, invalid }))))(
		'aligns description and error text for $name with invalid=$invalid',
		async row => {
			const page = await newE2EPage({ html: `<${row.tag} help-text="Set the broker URL" state="${row.invalid ? 'invalid' : 'none'}"></${row.tag}>` });
			await page.addStyleTag({ content: DESIGN_TOKEN_CSS });
			const inset = await page.evaluate(tag => {
				const host = document.querySelector(tag);
				const help = tag === 'kv-form-help-text' ? host : (host.shadowRoot ?? host).querySelector('kv-form-help-text');
				return help.shadowRoot.querySelector('.help-text').getBoundingClientRect().left - host.getBoundingClientRect().left;
			}, row.tag);
			expect(inset).toBe(0);
		}
	);

	it('uses the public left-spacing override', async () => {
		const page = await newE2EPage({ html: '<kv-form-help-text help-text="Set the broker URL" style="--help-text-left-spacing:12px"></kv-form-help-text>' });
		await page.addStyleTag({ content: DESIGN_TOKEN_CSS });
		const inset = await page.evaluate(() => {
			const host = document.querySelector('kv-form-help-text');
			return host.shadowRoot.querySelector('.help-text').getBoundingClientRect().left - host.getBoundingClientRect().left;
		});
		expect(inset).toBe(12);
	});

	it.each(HELP_TEXT_WEIGHT_CASES)('inherits error weight for $name with invalid=$invalid', async row => {
		const override = row.errorWeight === undefined ? '' : `--help-text-error-font-weight:${row.errorWeight};`;
		const page = await newE2EPage({
			html: `<div style="${override}--font-weight-regular:400"><${row.tag} help-text="Set the broker URL" state="${row.invalid ? 'invalid' : 'none'}"></${row.tag}></div>`
		});
		const weight = await page.evaluate(tag => {
			const host = document.querySelector(tag);
			const help = tag === 'kv-form-help-text' ? host : (host.shadowRoot ?? host).querySelector('kv-form-help-text');
			return getComputedStyle(help.shadowRoot.querySelector('.help-text')).fontWeight;
		}, row.tag);
		expect(weight).toBe(row.invalid && row.errorWeight !== undefined ? String(row.errorWeight) : '400');
	});
});

describe('Form Help Text (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-help-text></kv-form-help-text>');
		});

		it('should not render a help-text-container', async () => {
			const helpTextContainer = await page.find('kv-form-help-text >>> .help-text-container');
			expect(helpTextContainer).toBeFalsy();
		});
	});

	describe('when has a help text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-help-text help-text="Text Field"></kv-form-help-text>');
		});

		it('should render help text', async () => {
			const helpTextComponent = await page.find('kv-form-help-text >>> .help-text');
			expect(helpTextComponent).toBeTruthy();
			expect(helpTextComponent.innerText.toLocaleLowerCase()).toBe('text field');
		});
	});

	describe('when has a help text and state is invalid', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-form-help-text help-text="Help Text" state="invalid" show-icon></kv-form-help-text>');
		});

		it('should render help text and icon', async () => {
			const helpTextComponent = await page.find('kv-form-help-text >>> .help-text');
			expect(helpTextComponent).toBeTruthy();
			expect(helpTextComponent.innerText.toLocaleLowerCase()).toBe('help text');

			const iconComponent = await page.find('kv-form-help-text >>> kv-icon');
			expect(iconComponent).toBeTruthy();
		});
	});
});
