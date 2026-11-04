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
			await page.setContent('<kv-info-label label-title="DESCRIPTION"><kv-tag label="Test" /></kv-info-label>');
			await page.waitForChanges();
		});

		it('should render a title', async () => {
			const titleComponent = await page.find('kv-info-label >>> .title');
			expect(titleComponent).toBeTruthy();
			expect(titleComponent.innerText.toLocaleLowerCase()).toBe('description');
		});

		it('should render a component', async () => {
			const externalComponent = await page.find('kv-tag');
			expect(externalComponent).toBeTruthy();
		});
	});

	describe('when the content grows while expanded', () => {
		const waitForHeightTransition = () => new Promise(resolve => setTimeout(resolve, 600));
		const heights = () =>
			page.$eval('kv-info-label', host => ({
				wrapper: host.shadowRoot.querySelector('.description-wrapper').clientHeight,
				content: host.shadowRoot.querySelector('.description').clientHeight
			}));

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(
				`<div id="parent" style="width: 400px"><kv-info-label description="${'Long payload value that wraps. '.repeat(30)}" description-height="40" /></div>`
			);
			await page.waitForChanges();
		});

		it('should keep the whole description visible, then collapse back to the cap', async () => {
			await (await page.find('kv-info-label >>> .expand-description-button')).click();
			await waitForHeightTransition();
			const expanded = await heights();

			// Narrowing the parent rewraps the text onto more lines
			await page.$eval('#parent', parent => ((parent as HTMLElement).style.width = '200px'));
			await waitForHeightTransition();
			const narrowed = await heights();
			expect(narrowed.content).toBeGreaterThan(expanded.content);
			expect(narrowed.wrapper).toBe(narrowed.content);

			await (await page.find('kv-info-label >>> .expand-description-button')).click();
			await waitForHeightTransition();
			expect((await heights()).wrapper).toBe(40);
		});
	});
});
