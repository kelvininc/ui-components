import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Info Label (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-info-label label-title="Default" />');
		});

		it('should render a title', async () => {
			const titleComponent = await page.find('kv-info-label >>> .title');
			expect(titleComponent).toBeTruthy();
			expect(titleComponent.innerText.toLocaleLowerCase()).toBe('default');
		});
	});

	describe('when renders with copy values props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-info-label label-title="TYPE" description="data-model" copy-value="data-model" />');
		});

		it('should render a title', async () => {
			const titleComponent = await page.find('kv-info-label >>> .title');
			expect(titleComponent).toBeTruthy();
			expect(titleComponent.innerText.toLocaleLowerCase()).toBe('type');
		});

		it('should render a description', async () => {
			const descriptionComponent = await page.find('kv-info-label >>> .text');
			expect(descriptionComponent).toBeTruthy();
			expect(descriptionComponent.innerText.toLocaleLowerCase()).toBe('data-model');
		});

		it('should render a copy icon', async () => {
			const copyIconComponent = await page.find('kv-info-label >>> .copy-icon');
			expect(copyIconComponent).toBeTruthy();
		});
	});

	describe('when renders with a component', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-info-label label-title="DESCRIPTION"><kv-tag-letter label="Test" tag-letter="T" /></kv-info-label>');
			await page.waitForChanges();
		});

		it('should render a title', async () => {
			const titleComponent = await page.find('kv-info-label >>> .title');
			expect(titleComponent).toBeTruthy();
			expect(titleComponent.innerText.toLocaleLowerCase()).toBe('description');
		});

		it('should render a component', async () => {
			const externalComponent = await page.find('kv-tag-letter');
			expect(externalComponent).toBeTruthy();
		});
	});
});
