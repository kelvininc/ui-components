import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tag (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag label="Default Label"></kv-tag>');
		});

		it('should render a tag with the label Default Label', async () => {
			const textComponent = await page.find('kv-tag >>> .tag-label');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText).toBe('Default Label');
		});
	});

	describe('when it renders with a slot', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tag><div class="slot-class" slot="left-slot">Slot Default Label</div></kv-tag>');
		});

		it('should render a tag with a slot with text Slot Default Label', async () => {
			const textComponent = await page.find('kv-tag');
			const slotComponent = await textComponent.find('.slot-class');
			expect(slotComponent).toBeTruthy();
			expect(slotComponent.innerText).toBe('Slot Default Label');
		});
	});
});
