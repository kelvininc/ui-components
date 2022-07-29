import { E2EPage, newE2EPage } from '@stencil/core/testing';

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
