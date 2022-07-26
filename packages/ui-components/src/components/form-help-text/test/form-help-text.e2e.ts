import { E2EPage, newE2EPage } from '@stencil/core/testing';

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
			await page.setContent('<kv-form-help-text help-text="Help Text" state="invalid"></kv-form-help-text>');
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
