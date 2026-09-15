import { newE2EPage } from '@stencil/core/testing';
import type { E2EElement, E2EPage, EventSpy } from '@stencil/core/testing';
import type { ISelectMultiOptions } from '../select-multi-options.types';

const OPTIONS: ISelectMultiOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' },
	'option-3': { label: 'Option 3', value: 'option-3' },
	'option-4': { label: 'Option 4', value: 'option-4' },
	'option-5': { label: 'Option 5', value: 'option-5' }
};

describe('Select Multi Options (end-to-end)', () => {
	let page: E2EPage;
	let selectElement: E2EElement;
	let optionsSelectedSpy: EventSpy;
	let optionSelectedSpy: EventSpy;

	const setSelectedOptions = async (selectedOptions: Record<string, boolean>): Promise<void> => {
		selectElement.setProperty('selectedOptions', selectedOptions);
		await page.waitForChanges();
	};

	const clickOption = async (optionValue: string, shiftKey = false): Promise<void> => {
		const optionLabel = await page.find(`kv-select-multi-options >>> kv-virtualized-list >>> kv-select-option[value="${optionValue}"] >>> .item-label`);

		if (shiftKey) {
			await page.keyboard.down('Shift');
		}

		await optionLabel.click();

		if (shiftKey) {
			await page.keyboard.up('Shift');
		}

		await page.waitForChanges();
	};

	const pressKey = async (key: 'ArrowUp' | 'ArrowDown' | 'Enter', shiftKey = false): Promise<void> => {
		if (shiftKey) {
			await page.keyboard.down('Shift');
		}

		await page.keyboard.press(key);

		if (shiftKey) {
			await page.keyboard.up('Shift');
		}

		await page.waitForChanges();
	};

	const enableShortcuts = async (): Promise<void> => {
		selectElement.setProperty('shortcuts', true);
		await page.waitForChanges();
	};

	beforeEach(async () => {
		page = await newE2EPage();
		await page.setContent('<kv-select-multi-options></kv-select-multi-options>');
		selectElement = await page.find('kv-select-multi-options');
		selectElement.setProperty('options', OPTIONS);
		await page.waitForChanges();
		optionsSelectedSpy = await selectElement.spyOnEvent('optionsSelected');
		optionSelectedSpy = await selectElement.spyOnEvent('optionSelected');
	});

	it('should select an inclusive range when shift-clicking after a normal selection', async () => {
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy).toHaveReceivedEventTimes(2);
		expect(optionSelectedSpy).toHaveReceivedEventTimes(2);
		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
		expect(optionSelectedSpy.lastEvent.detail).toBe('option-5');
	});

	it('should select an inclusive range in reverse visual order', async () => {
		await clickOption('option-4');
		await setSelectedOptions({ 'option-4': true });
		await clickOption('option-2', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true
		});
	});

	it('should select the range even when the anchor click deselected the option', async () => {
		await setSelectedOptions({
			'option-2': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
		await clickOption('option-2');
		await setSelectedOptions({ 'option-3': true, 'option-4': true, 'option-5': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
	});

	it('should shrink the range when shift-clicking back towards the anchor', async () => {
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await clickOption('option-5', true);
		await setSelectedOptions({
			'option-2': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
		await clickOption('option-3', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true
		});
	});

	it('should deselect the listed options outside the range', async () => {
		await setSelectedOptions({ 'option-1': true, 'option-5': true });
		await clickOption('option-2');
		await setSelectedOptions({ 'option-1': true, 'option-2': true, 'option-5': true });
		await clickOption('option-3', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true
		});
	});

	it('should keep the selections hidden by the current search', async () => {
		selectElement.setProperty('filteredOptions', {
			'option-3': OPTIONS['option-3'],
			'option-4': OPTIONS['option-4'],
			'option-5': OPTIONS['option-5']
		});
		await setSelectedOptions({ 'option-1': true });
		await clickOption('option-3');
		await setSelectedOptions({ 'option-1': true, 'option-3': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-1': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
	});

	it('should skip group headings when building the range', async () => {
		const groupedOptions: ISelectMultiOptions = {
			group: {
				label: 'Group',
				value: 'group',
				selectable: false,
				options: {
					'child-1': { label: 'Child 1', value: 'child-1' },
					'child-2': { label: 'Child 2', value: 'child-2' }
				}
			},
			sibling: { label: 'Sibling', value: 'sibling' }
		};
		selectElement.setProperty('options', groupedOptions);
		await page.waitForChanges();

		await clickOption('child-1');
		await setSelectedOptions({ 'child-1': true });
		await clickOption('sibling', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'child-1': true,
			'child-2': true,
			'sibling': true
		});
	});

	it('should use only visible enabled selectable options to build the range', async () => {
		selectElement.setProperty('options', {
			...OPTIONS,
			'option-2': { ...OPTIONS['option-2'], disabled: true },
			'option-3': { ...OPTIONS['option-3'], selectable: false }
		});
		selectElement.setProperty('filteredOptions', {
			'option-1': OPTIONS['option-1'],
			'option-2': { ...OPTIONS['option-2'], disabled: true },
			'option-3': { ...OPTIONS['option-3'], selectable: false },
			'option-5': OPTIONS['option-5']
		});
		await page.waitForChanges();

		await clickOption('option-1');
		await setSelectedOptions({ 'option-1': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-1': true,
			'option-5': true
		});
	});

	it('should select from the anchor toward the endpoint until maxSelectable is reached', async () => {
		selectElement.setProperty('maxSelectable', 3);
		await page.waitForChanges();

		await clickOption('option-1');
		await setSelectedOptions({ 'option-1': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-1': true,
			'option-2': true,
			'option-3': true
		});
	});

	it('should shift-click a range from the first selected option when there is no anchor', async () => {
		await setSelectedOptions({ 'option-2': true });
		await selectElement.callMethod('clearHighlightedOption');
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
	});

	it('should treat a shift-click as a normal toggle when nothing is selected', async () => {
		await clickOption('option-3', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({ 'option-3': true });
	});

	it('should select the range up to the highlighted option on shift enter', async () => {
		await enableShortcuts();
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');

		await pressKey('Enter', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true
		});
		expect(optionSelectedSpy.lastEvent.detail).toBe('option-4');
	});

	it('should shrink the range when shift enter lands closer to the anchor', async () => {
		await enableShortcuts();
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');
		await pressKey('Enter', true);
		await setSelectedOptions({ 'option-2': true, 'option-3': true, 'option-4': true });

		await pressKey('ArrowUp');
		await pressKey('Enter', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({ 'option-2': true, 'option-3': true });
	});

	it('should leave the selection untouched while navigating towards the endpoint', async () => {
		await enableShortcuts();
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });

		await pressKey('ArrowDown');
		await pressKey('ArrowDown');

		expect(optionsSelectedSpy).toHaveReceivedEventTimes(1);
	});

	it('should shift enter a range from the first selected option when there is no anchor', async () => {
		await setSelectedOptions({ 'option-2': true });
		await enableShortcuts();
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');

		await pressKey('Enter', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-2': true,
			'option-3': true,
			'option-4': true
		});
	});

	it('should toggle the highlighted option on shift enter when nothing is selected', async () => {
		await enableShortcuts();
		await pressKey('ArrowDown');

		await pressKey('Enter', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({ 'option-1': true });
	});

	it('should treat shift enter as a normal toggle when range selection is off', async () => {
		selectElement.setProperty('rangeSelection', false);
		await enableShortcuts();
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');

		await pressKey('Enter', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({ 'option-2': true, 'option-4': true });
	});

	it('should replace a capped selection when shift-clicking a new endpoint', async () => {
		selectElement.setProperty('maxSelectable', 3);
		await page.waitForChanges();
		await clickOption('option-1');
		await setSelectedOptions({ 'option-1': true });
		await clickOption('option-2');
		await setSelectedOptions({ 'option-1': true, 'option-2': true });
		await clickOption('option-3');
		await setSelectedOptions({ 'option-1': true, 'option-2': true, 'option-3': true });

		// option-5 is only disabled because the cap is reached, and the range frees the slots
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({
			'option-3': true,
			'option-4': true,
			'option-5': true
		});
	});

	it('should not select a capped option on a plain click', async () => {
		selectElement.setProperty('maxSelectable', 1);
		await page.waitForChanges();
		await clickOption('option-1');
		await setSelectedOptions({ 'option-1': true });

		await clickOption('option-3');

		expect(optionsSelectedSpy).toHaveReceivedEventTimes(1);
		expect(optionSelectedSpy).toHaveReceivedEventTimes(1);
	});

	it('should ignore enter on an option that is not selectable', async () => {
		selectElement.setProperty('options', {
			...OPTIONS,
			'option-3': { ...OPTIONS['option-3'], selectable: false }
		});
		await enableShortcuts();
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');
		await pressKey('ArrowDown');

		await pressKey('Enter');

		expect(optionsSelectedSpy).toHaveReceivedEventTimes(0);
		expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
	});

	it('should treat a shift-click as a normal toggle when range selection is off', async () => {
		selectElement.setProperty('rangeSelection', false);
		await page.waitForChanges();
		await clickOption('option-2');
		await setSelectedOptions({ 'option-2': true });
		await clickOption('option-5', true);

		expect(optionsSelectedSpy.lastEvent.detail).toEqual({ 'option-2': true, 'option-5': true });
	});
});
