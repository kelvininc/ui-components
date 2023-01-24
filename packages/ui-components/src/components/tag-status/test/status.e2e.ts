import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Status (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with state, icon and label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-status state="unknown" icon="kv-error" label="unknown"></kv-tag-status>');
		});

		it('should render the correct text', async () => {
			const typeComponent = await page.find('kv-tag-status >>> span');
			expect(typeComponent.innerText).toBe('unknown');
		});

		it('should render the correct icon', async () => {
			const useComponent = await page.find('kv-tag-status >>> kv-icon');
			const iconName = await useComponent.getProperty('name');
			expect(iconName).toBe('kv-error');
		});

		it('should render the correct icon color', async () => {
			const firstChild = await page.find('kv-tag-status >>> div');
			expect(firstChild).toHaveClass('status-unknown');
		});
	});

	describe('when it renders without label and state error', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-status state="error" icon="kv-error"></kv-tag-status>');
		});

		it('should render the correct icon', async () => {
			const useComponent = await page.find('kv-tag-status >>> kv-icon');
			const iconName = await useComponent.getProperty('name');
			expect(iconName).toBe('kv-error');
		});

		it('should render the correct icon color', async () => {
			const firstChild = await page.find('kv-tag-status >>> div');
			expect(firstChild).toHaveClass('status-error');
		});
	});
});
