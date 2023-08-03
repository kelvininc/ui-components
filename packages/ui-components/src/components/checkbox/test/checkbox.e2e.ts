import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { EOtherIconName } from '../../icon/icon.types';

describe('Radio (end-to-end)', () => {
	let page: E2EPage;

	describe('when the checkbox is checked', () => {
		let checkboxElement: E2EElement;
		let iconElement: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-checkbox checked></kv-checkbox>');

			checkboxElement = await page.find('kv-checkbox');
			iconElement = await page.find('kv-checkbox >>> kv-icon');
		});

		it('should render the checked icon', async () => {
			expect(iconElement).toEqualAttribute('name', EOtherIconName.IconCheckState);
		});

		describe('and the user clicks on the checkbox', () => {
			let spyClickCheckboxEvent: EventSpy;

			beforeEach(async () => {
				spyClickCheckboxEvent = await checkboxElement.spyOnEvent('clickCheckbox');
				await checkboxElement.click();
			});

			it('should emit the clicked event', async () => {
				expect(spyClickCheckboxEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when the checkbox is unchecked', () => {
		let checkboxElement: E2EElement;
		let iconElement: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-checkbox></kv-checkbox>');

			checkboxElement = await page.find('kv-checkbox');
			iconElement = await page.find('kv-checkbox >>> kv-icon');
		});

		it('should render the unchecked icon', async () => {
			expect(iconElement).toEqualAttribute('name', EOtherIconName.IconUncheckState);
		});

		describe('and the user clicks on the checkbox', () => {
			let spyClickCheckboxEvent: EventSpy;

			beforeEach(async () => {
				spyClickCheckboxEvent = await checkboxElement.spyOnEvent('clickCheckbox');

				await checkboxElement.click();
			});

			it('should emit the clicked event', async () => {
				expect(spyClickCheckboxEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when the checkbox is indeterminate', () => {
		let checkboxElement: E2EElement;
		let iconElement: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-checkbox indeterminate></kv-checkbox>');

			checkboxElement = await page.find('kv-checkbox');
			iconElement = await page.find('kv-checkbox >>> kv-icon');
		});

		it('should render the indeterminate icon', async () => {
			expect(iconElement).toEqualAttribute('name', EOtherIconName.IconIndeterminateState);
		});

		describe('and the user clicks on the checkbox', () => {
			let spyClickCheckboxEvent: EventSpy;

			beforeEach(async () => {
				spyClickCheckboxEvent = await checkboxElement.spyOnEvent('clickCheckbox');

				await checkboxElement.click();
			});

			it('should emit the clicked event', async () => {
				expect(spyClickCheckboxEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when the checkbox is disabled and the user clicks on the checkbox', () => {
		let checkboxElement: E2EElement;
		let spyClickCheckboxEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-checkbox disabled></kv-checkbox>');

			checkboxElement = await page.find('kv-checkbox');
			spyClickCheckboxEvent = await checkboxElement.spyOnEvent('clickCheckbox');

			await checkboxElement.click();
		});

		it('should not emit the clicked event', async () => {
			expect(spyClickCheckboxEvent).not.toHaveReceivedEvent();
		});
	});
});
