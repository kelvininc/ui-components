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

	describe('when renders with description and read more stuffs', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setViewport({
				width: 375,
				height: 667,
				deviceScaleFactor: 1
			});
			await page.setContent(
				`<kv-info-label
					label-title="DESCRIPTION"
					description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
					description-height="34"
					description-collapsed-text="Read more"
					description-opened-text="Read less"
				/>`
			);

			await page.waitForChanges();
		});

		it('should render a title', async () => {
			const titleComponent = await page.find('kv-info-label >>> .title');
			expect(titleComponent).toBeTruthy();
			expect(titleComponent.innerText.toLocaleLowerCase()).toBe('description');
		});

		it('should render a description', async () => {
			const textComponent = await page.find('kv-info-label >>> .text');
			expect(textComponent).toBeTruthy();
		});

		it('should render a expand button', async () => {
			const expandButtonComponent = await page.find('kv-info-label >>> .expand-description-button');
			expect(expandButtonComponent).toBeTruthy();
			const textExpandButtonComponent = await page.find('kv-info-label >>> .expand-description-button >>> span');
			expect(textExpandButtonComponent).toBeTruthy();
			expect(textExpandButtonComponent.innerText.toLocaleLowerCase()).toBe('read more');
			expandButtonComponent.click();
			await page.waitForChanges();
			expect(textExpandButtonComponent.innerText.toLocaleLowerCase()).toBe('read less');
		});

		it('should render a description wrapper with defined heigth', async () => {
			const descWrapperComponent = await page.find('kv-info-label >>> .description-wrapper');
			expect(descWrapperComponent).toBeTruthy();
			const styles = await descWrapperComponent.getComputedStyle();
			expect(styles.height).toBe('34px');
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
