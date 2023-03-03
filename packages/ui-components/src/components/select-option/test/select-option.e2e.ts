import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Select Item (end-to-end)', () => {
	let page: E2EPage;
	let selectOptionEl: E2EElement;
	let itemEl: E2EElement;
	let labelEl: E2EElement;

	describe('when the component renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'>
				</kv-select-option>`);
			selectOptionEl = await page.find('kv-select-option');
			itemEl = await page.find('kv-select-option >>> .select-option');
			labelEl = await page.find('kv-select-option >>> .item-label');
		});

		it('should render label', () => {
			expect(labelEl.innerText).toContain('Option 1');
		});

		describe('and the user clicks on the item', () => {
			let clickEventSpy: EventSpy;

			beforeEach(async () => {
				clickEventSpy = await selectOptionEl.spyOnEvent('itemSelected');
				await labelEl.click();
			});

			it('should emit an event with the clicked item', () => {
				expect(clickEventSpy).toHaveReceivedEventDetail('option1');
			});
		});
	});

	describe('when the component renders with selected flag', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'
					selected>
				</kv-select-option>`);
			selectOptionEl = await page.find('kv-select-option');
			itemEl = await page.find('kv-select-option >>> .select-option');
		});

		it('should have the .selected class', () => {
			expect(itemEl).toHaveClass('selected');
		});
	});

	describe('when the component renders with a bottom slot', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'
				>
					<div slot="text-bottom-slot">Bottom Slot</div>
				</kv-select-option>`);
			selectOptionEl = await page.find('kv-select-option');
			itemEl = await page.find('kv-select-option >>> .select-option');
		});

		it('should have the .has-bottom-slot class', () => {
			expect(itemEl).toHaveClass('has-bottom-slot');
		});
	});

	describe('when the component renders with a right slot', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'
				>
					<div class="slot-class" slot="text-right-slot">Right Slot</div>
				</kv-select-option>`);
		});

		it('should have the content of the right slot', async () => {
			const selectOptionComponent = await page.find('kv-select-option');
			const slotComponent = await selectOptionComponent.find('.slot-class');
			expect(slotComponent).toBeTruthy();
			expect(slotComponent.innerText).toBe('Right Slot');
		});
	});
});
