import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('select option checkbox keyboard activation', () => {
	it('names its checkbox and selects once on held Space and once on a click', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-select-option label="North line" value="north-line" togglable></kv-select-option>');
		const option = await page.find('kv-select-option');
		const spy = await option.spyOnEvent('itemSelected');
		const checkbox = await page.$('aria/North line[role="checkbox"]');
		expect(checkbox).not.toBeNull();
		await checkbox.focus();
		await page.keyboard.down('Space');
		await page.keyboard.down('Space');
		await page.keyboard.up('Space');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
		expect(spy.lastEvent.detail).toBe('north-line');
		await checkbox.click();
		await page.waitForChanges();
		expect(spy.events).toHaveLength(2);
	});
});

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
			expect(itemEl).toHaveClass('select-option--selected');
		});
	});

	describe('when the component renders with selectable flag with false', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'
					selectable='false'>
				</kv-select-option>`);
			selectOptionEl = await page.find('kv-select-option');
			itemEl = await page.find('kv-select-option >>> .select-option');
			labelEl = await page.find('kv-select-option >>> .item-label');
		});

		it('should not have the .selectable class', () => {
			expect(itemEl).not.toHaveClass('select-option--selectable');
		});

		describe('and the user clicks on the item', () => {
			let clickEventSpy: EventSpy;

			beforeEach(async () => {
				clickEventSpy = await selectOptionEl.spyOnEvent('itemSelected');
				await labelEl.click();
			});

			it('should not emit an event with the clicked item', () => {
				expect(clickEventSpy).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when the component renders with disabled flag', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`
				<kv-select-option
					label='Option 1'
					value='option1'
					disabled>
				</kv-select-option>`);
			selectOptionEl = await page.find('kv-select-option');
			itemEl = await page.find('kv-select-option >>> .select-option');
		});

		it('should have the .disabled class', () => {
			expect(itemEl).toHaveClass('select-option--disabled');
		});
	});
});
