import { newE2EPage } from '@stencil/core/testing';
import type { E2EElement, E2EPage, EventSpy } from '@stencil/core/testing';
import { ADD_OPTION, DEFAULT_NO_RESULTS_FOUND_CONFIG } from '../select-multi-options.config';
import { ECreateOptionStatus } from '../select-multi-options.types';
import type { ICreateOptionState, ISelectMultiOptions } from '../select-multi-options.types';
import { EValidationState } from '../../text-field/text-field.types';

const OPTIONS: ISelectMultiOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' },
	'option-3': { label: 'Option 3', value: 'option-3' },
	'option-4': { label: 'Option 4', value: 'option-4' },
	'option-5': { label: 'Option 5', value: 'option-5' }
};

type ElementBox = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>;

type KeyRecorderWindow = Window & { documentKeys?: string[] };
type ListRecorderWindow = Window & { openedList?: Element };

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

	const pressKey = async (key: 'ArrowUp' | 'ArrowDown' | 'Enter' | 'Escape', shiftKey = false): Promise<void> => {
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

	describe('create flow', () => {
		// More options than the list renders around its viewport: the add row, always the last one, is only
		// rendered once the list is scrolled to the bottom
		const CREATE_FLOW_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1).reduce<ISelectMultiOptions>((options, optionNumber) => {
			options[`option-${optionNumber}`] = { label: `Option ${optionNumber}`, value: `option-${optionNumber}` };

			return options;
		}, {});

		const PANEL_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-container';
		const HEADER_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-header-container';
		const LIST_SELECTOR = 'kv-select-multi-options >>> kv-virtualized-list';
		const OPTIONS_CONTAINER_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-options-container';
		const EMPTY_STATE_MESSAGE_SELECTOR = 'kv-select-multi-options >>> .empty-state-message';
		const NO_DATA_ILLUSTRATION_SELECTOR = 'kv-select-multi-options >>> .no-data-available';
		const CREATE_FORM_SELECTOR = 'kv-select-multi-options >>> kv-select-create-option';
		const CREATE_TEXT_FIELD_SELECTOR = `${CREATE_FORM_SELECTOR} kv-text-field`;
		const CREATE_INPUT_SELECTOR = `${CREATE_TEXT_FIELD_SELECTOR} >>> input`;
		const CREATE_BUTTON_SELECTOR = `${CREATE_FORM_SELECTOR} kv-action-button-icon[part="create-button"]`;
		const CANCEL_BUTTON_SELECTOR = `${CREATE_FORM_SELECTOR} kv-action-button-icon[part="cancel-button"]`;

		// kv-select-create-option renders without a shadow root, so its text field sits in the list's own
		const CREATE_INPUT_FOCUS_PATH = ['kv-select-multi-options', 'kv-text-field', 'input'];
		const SEARCH_INPUT_FOCUS_PATH = ['kv-select-multi-options', 'kv-select', 'kv-search', 'kv-text-field', 'input'];

		let optionCreatedSpy: EventSpy;
		let createFormToggleSpy: EventSpy;

		const setSearchValue = async (searchValue: string): Promise<void> => {
			// The consumer owns the search value: a standalone list doesn't adopt the typed text
			selectElement.setProperty('searchValue', searchValue);
			await page.waitForChanges();
		};

		const setCreateOptionState = async (createOptionState: ICreateOptionState): Promise<void> => {
			selectElement.setProperty('createOptionState', createOptionState);
			await page.waitForChanges();
		};

		const getBox = (selector: string): Promise<ElementBox> =>
			page.evaluate((deepSelector: string) => {
				// As in `page.find`, each `>>>` steps into the shadow root of the element matched so far
				const [hostSelector, ...shadowSelectors] = deepSelector.split('>>>');
				const element = shadowSelectors.reduce((parent, shadowSelector) => parent.shadowRoot.querySelector(shadowSelector), document.querySelector(hostSelector));
				const { top, right, bottom, left, width, height } = element.getBoundingClientRect();

				return { top, right, bottom, left, width, height };
			}, selector);

		const getRenderedRowValues = async (): Promise<string[]> => (await page.findAll(`${LIST_SELECTOR} >>> kv-select-option`)).map(row => row.getAttribute('value'));

		const getListScrollTop = (): Promise<number> =>
			page.evaluate(() => document.querySelector('kv-select-multi-options').shadowRoot.querySelector('kv-virtualized-list').shadowRoot.querySelector('.container').scrollTop);

		const scrollListToBottom = async (): Promise<void> => {
			await page.evaluate(() => {
				const listContainer = document.querySelector('kv-select-multi-options').shadowRoot.querySelector('kv-virtualized-list').shadowRoot.querySelector('.container');
				listContainer.scrollTop = listContainer.scrollHeight;
			});
			// The list renders the rows around its new viewport from a throttled scroll handler
			await page.waitForFunction(
				(addOptionValue: string) =>
					document
						.querySelector('kv-select-multi-options')
						.shadowRoot.querySelector('kv-virtualized-list')
						.shadowRoot.querySelector(`kv-select-option[value="${addOptionValue}"]`) !== null,
				{},
				ADD_OPTION.value
			);
			await page.waitForChanges();
		};

		const openCreateForm = async (): Promise<void> => {
			await scrollListToBottom();
			await clickOption(ADD_OPTION.value);
		};

		const clickFormButton = async (selector: string): Promise<void> => {
			await (await page.find(selector)).click();
			await page.waitForChanges();
		};

		const getActiveElementPath = (): Promise<string[]> =>
			page.evaluate(() => {
				const path: string[] = [];

				for (let element = document.activeElement; element !== null; element = element.shadowRoot?.activeElement ?? null) {
					path.push(element.tagName.toLowerCase());
				}

				return path;
			});

		const getCreateFormToggles = (): boolean[] => createFormToggleSpy.events.map(({ detail }) => detail);

		const submitAsyncCreation = async (): Promise<void> => {
			await setCreateOptionState({ status: ECreateOptionStatus.Idle });
			await setSearchValue('zzz');
			await openCreateForm();
			await pressKey('Enter');
		};

		beforeEach(async () => {
			page = await newE2EPage();
			// The design tokens size the list and the create form. The list is positioned the way a dropdown
			// positions it, so that it is as wide as its content.
			await page.setContent(`
				<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
				<div style="position: absolute; top: 0; left: 0">
					<kv-select-multi-options></kv-select-multi-options>
				</div>
			`);
			selectElement = await page.find('kv-select-multi-options');
			selectElement.setProperty('options', CREATE_FLOW_OPTIONS);
			selectElement.setProperty('canAddItems', true);
			selectElement.setProperty('minSearchOptions', 0);
			selectElement.setProperty('searchDebounce', 0);
			await page.waitForChanges();
			optionsSelectedSpy = await selectElement.spyOnEvent('optionsSelected');
			optionSelectedSpy = await selectElement.spyOnEvent('optionSelected');
			optionCreatedSpy = await selectElement.spyOnEvent('optionCreated');
			createFormToggleSpy = await selectElement.spyOnEvent('createFormToggle');
		});

		it('should show the no results message left-aligned in the header, above the add row, when the search matches no option', async () => {
			await setSearchValue('zzz');

			const message = await page.find(EMPTY_STATE_MESSAGE_SELECTOR);
			expect(message).toEqualText(DEFAULT_NO_RESULTS_FOUND_CONFIG.header);
			expect(message).toEqualAttribute('role', 'status');
			expect(await message.isVisible()).toBe(true);

			const messageBox = await getBox(EMPTY_STATE_MESSAGE_SELECTOR);
			const headerBox = await getBox(HEADER_SELECTOR);
			const searchBox = await getBox('kv-select-multi-options >>> kv-select >>> kv-search');
			const headerActionsBox = await getBox('kv-select-multi-options >>> kv-select >>> .footer-actions');
			const { paddingLeft: headerPaddingLeft } = await (await page.find(HEADER_SELECTOR)).getComputedStyle();
			// In the header's row under the search, where the header's actions start
			expect(messageBox.top).toBeGreaterThanOrEqual(searchBox.bottom);
			expect(messageBox.bottom).toBeLessThanOrEqual(headerBox.bottom);
			expect(messageBox.left).toBeCloseTo(headerBox.left + parseFloat(headerPaddingLeft));
			expect(messageBox.left).toBeCloseTo(headerActionsBox.left);
			expect(await getRenderedRowValues()).toEqual([ADD_OPTION.value]);
		});

		it('should end the panel under the no results message, with neither a divider nor an empty list, when nothing can be added', async () => {
			selectElement.setProperty('canAddItems', false);
			await setSearchValue('zzz');

			expect((await (await page.find(HEADER_SELECTOR)).getComputedStyle()).borderBottomWidth).toBe('0px');
			expect((await (await page.find(OPTIONS_CONTAINER_SELECTOR)).getComputedStyle()).display).toBe('none');

			// As far below the message as the search is below the panel's top
			const messageBox = await getBox(EMPTY_STATE_MESSAGE_SELECTOR);
			const searchBox = await getBox('kv-select-multi-options >>> kv-select >>> kv-search');
			const panelBox = await getBox(PANEL_SELECTOR);
			expect(Math.abs(panelBox.bottom - messageBox.bottom - (searchBox.top - panelBox.top))).toBeLessThanOrEqual(1);
		});

		it('should show the no data illustration with the add row below it when there are no options', async () => {
			selectElement.setProperty('options', {});
			await page.waitForChanges();

			const illustration = await page.find(`${NO_DATA_ILLUSTRATION_SELECTOR} kv-illustration-message`);
			expect(await illustration.isVisible()).toBe(true);
			expect(await page.find(EMPTY_STATE_MESSAGE_SELECTOR)).toBeNull();
			expect(await getRenderedRowValues()).toEqual([ADD_OPTION.value]);

			const illustrationBox = await getBox(NO_DATA_ILLUSTRATION_SELECTOR);
			const addRowBox = await getBox(`${LIST_SELECTOR} >>> kv-select-option[value="${ADD_OPTION.value}"]`);
			const panelBox = await getBox(PANEL_SELECTOR);
			expect(addRowBox.height).toBeGreaterThan(0);
			expect(addRowBox.top).toBeGreaterThanOrEqual(illustrationBox.bottom);
			expect(addRowBox.bottom).toBeLessThanOrEqual(panelBox.bottom);
		});

		it('should collapse the list to the create form row, keeping its width, when the add row is clicked', async () => {
			await scrollListToBottom();
			const panelBoxBefore = await getBox(PANEL_SELECTOR);

			await clickOption(ADD_OPTION.value);

			const panelBox = await getBox(PANEL_SELECTOR);
			expect((await (await page.find(HEADER_SELECTOR)).getComputedStyle()).visibility).toBe('hidden');
			expect((await getBox(HEADER_SELECTOR)).height).toBe(0);
			expect(await (await page.find(LIST_SELECTOR)).isVisible()).toBe(false);
			expect((await getBox(LIST_SELECTOR)).height).toBe(0);
			expect(await (await page.find(CREATE_FORM_SELECTOR)).isVisible()).toBe(true);
			// The form's 56px row within the panel's borders
			expect(panelBox.height).toBeGreaterThanOrEqual(56);
			expect(panelBox.height).toBeLessThanOrEqual(58);
			expect(panelBox.width).toBeCloseTo(panelBoxBefore.width);
		});

		it.each<[string, () => Promise<void>]>([
			['the cancel button is clicked', () => clickFormButton(CANCEL_BUTTON_SELECTOR)],
			['escape is pressed', () => pressKey('Escape')]
		])('should restore the rendered rows, their scroll position and the search focus when %s in the create form', async (_, cancelCreateForm) => {
			await scrollListToBottom();
			const rowValuesBefore = await getRenderedRowValues();
			const scrollTopBefore = await getListScrollTop();
			expect(scrollTopBefore).toBeGreaterThan(0);
			await clickOption(ADD_OPTION.value);

			await cancelCreateForm();

			// Straight away: the list stayed mounted, so it has no resize to wait for before rendering its rows
			expect(await getRenderedRowValues()).toEqual(rowValuesBefore);
			expect(await getListScrollTop()).toBe(scrollTopBefore);
			expect(await getActiveElementPath()).toEqual(SEARCH_INPUT_FOCUS_PATH);
			expect(getCreateFormToggles()).toEqual([true, false]);
		});

		it('should create and select the typed value when enter is pressed in the create input with the shortcuts on', async () => {
			await enableShortcuts();
			await setSearchValue('zzz');
			await openCreateForm();
			expect(await getActiveElementPath()).toEqual(CREATE_INPUT_FOCUS_PATH);

			await page.keyboard.press('End');
			await page.keyboard.type(' new');
			await pressKey('Enter');

			// Not the search term: the shortcuts don't select the highlighted add row again on the same enter
			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(optionCreatedSpy.lastEvent.detail).toBe('zzz new');
			expect(optionSelectedSpy).toHaveReceivedEventTimes(1);
			expect(optionSelectedSpy.lastEvent.detail).toBe('zzz new');
			expect(optionsSelectedSpy).toHaveReceivedEventTimes(0);
			// Re-selecting the add row would have reopened the form, prefilled with the search term
			expect(await page.find(CREATE_FORM_SELECTOR)).toBeNull();
			expect(getCreateFormToggles()).toEqual([true, false]);
		});

		it('should keep enter and escape pressed in the create input from reaching the document', async () => {
			await enableShortcuts();
			await setSearchValue('zzz');
			const dismissSpy = await selectElement.spyOnEvent('dismiss');
			await page.evaluate(() => {
				const recorderWindow = window as KeyRecorderWindow;
				recorderWindow.documentKeys = [];
				document.addEventListener('keydown', ({ key }) => recorderWindow.documentKeys.push(key));
			});

			await openCreateForm();
			await pressKey('Escape');
			await openCreateForm();
			await page.keyboard.type('x');
			await pressKey('Enter');

			// Any other key still reaches the document
			expect(await page.evaluate(() => (window as KeyRecorderWindow).documentKeys)).toEqual(['x']);
			expect(dismissSpy).toHaveReceivedEventTimes(0);
			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(getCreateFormToggles()).toEqual([true, false, true, false]);
		});

		it('should only emit optionCreated, keeping the create form open, when the creation is asynchronous', async () => {
			await submitAsyncCreation();

			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(optionCreatedSpy.lastEvent.detail).toBe('zzz');
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
			expect(await page.find(CREATE_FORM_SELECTOR)).not.toBeNull();
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should ignore enter, the create button and the cancel button while the creation is loading', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await pressKey('Enter');
			await clickFormButton(CREATE_BUTTON_SELECTOR);
			await clickFormButton(CANCEL_BUTTON_SELECTOR);

			expect(await (await page.find(CREATE_INPUT_SELECTOR)).getProperty('readOnly')).toBe(true);
			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
			expect(await page.find(CREATE_FORM_SELECTOR)).not.toBeNull();
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should show why the creation failed under the create input until the value is edited', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

			const helpText = await page.find(`${CREATE_TEXT_FIELD_SELECTOR} >>> kv-form-help-text`);
			expect(await helpText.isVisible()).toBe(true);
			expect(await helpText.getProperty('helpText')).toEqual(['Already exists']);
			expect(await (await page.find(CREATE_TEXT_FIELD_SELECTOR)).getProperty('state')).toBe(EValidationState.Invalid);

			await page.keyboard.type('z');
			await page.waitForChanges();

			expect(await page.find(`${CREATE_TEXT_FIELD_SELECTOR} >>> kv-form-help-text`)).toBeNull();
			expect(await (await page.find(CREATE_TEXT_FIELD_SELECTOR)).getProperty('state')).not.toBe(EValidationState.Invalid);
		});

		it('should let enter submit again, from the refocused input, once a loading creation fails', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });
			await clickFormButton(CREATE_BUTTON_SELECTOR);

			await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });
			expect(await getActiveElementPath()).toEqual(CREATE_INPUT_FOCUS_PATH);
			await pressKey('Enter');

			expect(optionCreatedSpy).toHaveReceivedEventTimes(2);
			expect(optionCreatedSpy.lastEvent.detail).toBe('zzz');
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should leave focus where the user moved it when a loading creation fails', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });
			await page.evaluate(() => {
				const elsewhere = document.createElement('input');
				elsewhere.id = 'elsewhere';
				document.body.appendChild(elsewhere);
				elsewhere.focus();
			});

			// The request failed while the user was typing somewhere else
			await setCreateOptionState({ status: ECreateOptionStatus.Error });

			expect(await page.evaluate(() => document.activeElement?.id)).toBe('elsewhere');
		});

		it('should select the created option and show the header again when the creation succeeds', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'zzz-key' });

			expect(optionSelectedSpy).toHaveReceivedEventTimes(1);
			expect(optionSelectedSpy.lastEvent.detail).toBe('zzz-key');
			expect(await page.find(CREATE_FORM_SELECTOR)).toBeNull();
			expect((await (await page.find(HEADER_SELECTOR)).getComputedStyle()).visibility).toBe('visible');
			expect((await getBox(HEADER_SELECTOR)).height).toBeGreaterThan(0);
			expect(getCreateFormToggles()).toEqual([true, false]);
		});

		it('should select the submitted value when the creation succeeds without a key', async () => {
			await submitAsyncCreation();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await setCreateOptionState({ status: ECreateOptionStatus.Success });

			expect(optionSelectedSpy).toHaveReceivedEventTimes(1);
			expect(optionSelectedSpy.lastEvent.detail).toBe('zzz');
			expect(await page.find(CREATE_FORM_SELECTOR)).toBeNull();
		});

		it('should show the secondary create button loading inside the list while the creation is loading', async () => {
			await setSearchValue('zzz');
			await openCreateForm();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			// The loading look itself is kv-action-button's, covered by its own suite
			const createButton = await page.find(`${CREATE_BUTTON_SELECTOR} >>> kv-action-button`);
			expect(createButton.getAttribute('type')).toBe('secondary');
			expect(createButton.getAttribute('aria-busy')).toBe('true');
		});

		it('should keep the same list mounted when the create form opens from a search that matches no option', async () => {
			await setSearchValue('zzz');
			await page.evaluate(() => {
				(window as ListRecorderWindow).openedList = document.querySelector('kv-select-multi-options').shadowRoot.querySelector('kv-virtualized-list');
			});

			await openCreateForm();
			await clickFormButton(CANCEL_BUTTON_SELECTOR);

			// The no results message leaves as the form arrives: the list must be moved, not rebuilt
			expect(
				await page.evaluate(() => {
					const { openedList } = window as ListRecorderWindow;

					return openedList.isConnected && openedList === document.querySelector('kv-select-multi-options').shadowRoot.querySelector('kv-virtualized-list');
				})
			).toBe(true);
		});
	});
});
