import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Status (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders without type', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-status></kv-tag-status>');
		});

		it('should render the correct text', async () => {
			const typeComponent = await page.find('kv-tag-status >>> span');
			expect(typeComponent.innerText).toBe('Unknown');
		});

		it('should render the correct icon', async () => {
			const useComponent = await page.find('kv-tag-status >>> kv-icon');
			const iconName = await useComponent.getProperty('name');
			expect(iconName).toBe('kv-error');
		});

		it('should render the correct icon color', async () => {
			const firstChild = await page.find('kv-tag-status >>> div');
			expect(firstChild).toHaveClass('status-none');
		});
	});

	describe('when it renders with type', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-status type="running"></kv-tag-status>');
		});

		it('should render the correct text', async () => {
			const typeComponent = await page.find('kv-tag-status >>> span');
			expect(typeComponent.innerText).toBe('Running');
		});

		it('should render the correct icon', async () => {
			const useComponent = await page.find('kv-tag-status >>> kv-icon');
			const iconName = await useComponent.getProperty('name');
			expect(iconName).toBe('kv-success');
		});

		it('should render the correct icon color', async () => {
			const firstChild = await page.find('kv-tag-status >>> div');
			expect(firstChild).toHaveClass('status-success');
		});
	});
});
