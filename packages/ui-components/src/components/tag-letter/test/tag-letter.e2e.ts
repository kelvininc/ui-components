import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tag Letter (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-letter label="Tag Letter Default"></kv-tag-letter>');
		});

		it('should render a label with text setted', async () => {
			const textComponent = await page.find('kv-tag-letter >>> .label');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('tag letter default');
		});
	});

	describe('when it renders with tag letter', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag-letter label="Tag Letter" tag-letter="T"></kv-tag-letter>');
		});

		it('should render a label with text setted', async () => {
			const textComponent = await page.find('kv-tag-letter >>> .label');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('tag letter');
			const tagComponent = await page.find('kv-tag-letter >>> .avatar');
			expect(tagComponent).toBeTruthy();
			expect(tagComponent.innerText.toLocaleLowerCase()).toBe('t');
		});
	});
});
