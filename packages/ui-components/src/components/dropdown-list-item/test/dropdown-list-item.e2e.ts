import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Dropdown List Item (end-to-end)', () => {
	let page: E2EPage;

	afterAll(async () => {
		await page.close();
	});

	describe('when the component renders', () => {
		let dropdownListItemEl: E2EElement;
		let itemEl: E2EElement;
		let labelEl: E2EElement;
		let clickEventSpy: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-dropdown-list-item
					label='Option 1'
					value='option1'
					selected=true>
				</kv-dropdown-list-item>`);
			dropdownListItemEl = await page.find('kv-dropdown-list-item');
			itemEl = await page.find('kv-dropdown-list-item >>> .dropdown-list-item');
			labelEl = await page.find('kv-dropdown-list-item >>> .item-label');
		});

		it('should render label', () => {
			expect(labelEl.innerText).toContain('Option 1');
		});

		describe('and the user clicks on the item', () => {
			beforeEach(async () => {
				clickEventSpy = await dropdownListItemEl.spyOnEvent('itemSelected');
				await labelEl.click();
			});

			it('should emit an event with the clicked item', () => {
				expect(clickEventSpy).toHaveReceivedEventDetail('option1');
			});
		});

		describe('and the item is selected', () => {
			it('should have the .selected class', () => {
				expect(itemEl).toHaveClass('selected');
			});
		});
	});
});
