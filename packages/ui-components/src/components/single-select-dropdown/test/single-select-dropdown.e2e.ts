import { newE2EPage } from '@stencil/core/testing';
import type { E2EElement, E2EPage, EventSpy } from '@stencil/core/testing';
import { ADD_OPTION } from '../../select-multi-options/select-multi-options.config';
import { ECreateOptionStatus } from '../../select-multi-options/select-multi-options.types';
import type { ICreateOptionState } from '../../select-multi-options/select-multi-options.types';
import type { ISelectSingleOptions } from '../single-select-dropdown.types';

// None of them matches the name typed to create an option, which leaves the add row as the only row
const OPTIONS: ISelectSingleOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' },
	'option-3': { label: 'Option 3', value: 'option-3' }
};

const NEW_OPTION_NAME = 'new';
const NEW_OPTION_KEY = 'new-key';

// The trigger stays in the dropdown, while the list is portaled to the document's body: its content is queried
// from the list itself
const TRIGGER_SELECTOR = 'kv-single-select-dropdown kv-text-field#dropdown-input';
const PANEL_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-container';
const HEADER_SELECTOR = 'kv-select-multi-options >>> kv-select >>> .select-header-container';
const LIST_SELECTOR = 'kv-select-multi-options >>> kv-virtualized-list';
const ADD_ROW_SELECTOR = `${LIST_SELECTOR} >>> kv-select-option[value="${ADD_OPTION.value}"] >>> .item-label`;
const SEARCH_INPUT_SELECTOR = 'kv-select-multi-options >>> kv-select >>> kv-search >>> kv-text-field >>> input';
const CREATE_FORM_SELECTOR = 'kv-select-multi-options >>> kv-select-create-option';
const CREATE_INPUT_SELECTOR = `${CREATE_FORM_SELECTOR} kv-text-field >>> input`;
const CANCEL_BUTTON_SELECTOR = `${CREATE_FORM_SELECTOR} kv-action-button-icon[part="cancel-button"]`;
// Content slotted into the dropdown is relocated into the list's light DOM, and portaled with it
const SLOT_WRAPPER_SELECTOR = 'kv-select-multi-options [slot="create-new-option"]';
const SLOTTED_CREATE_INPUT_SELECTOR = `${SLOT_WRAPPER_SELECTOR} kv-select-create-option kv-text-field >>> input`;

// kv-select-create-option renders without a shadow root: the default form's text field sits in the list's own,
// and a slotted form's in the document
const CREATE_INPUT_FOCUS_PATH = ['kv-select-multi-options', 'kv-text-field', 'input'];
const SLOTTED_INPUT_FOCUS_PATH = ['kv-text-field', 'input'];
const SEARCH_INPUT_FOCUS_PATH = ['kv-select-multi-options', 'kv-select', 'kv-search', 'kv-text-field', 'input'];

// Clear of the trigger and of the list below it, which sit at the top left of the page
const OUTSIDE_POINT = { x: 700, y: 500 };

const SLOTTED_CREATE_FORM = '<div slot="create-new-option" style="padding: 12px"><kv-select-create-option></kv-select-create-option></div>';
const EMPTY_SLOT_WRAPPER = '<div slot="create-new-option" style="padding: 12px"></div>';

type ElementBox = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>;

type RecordedEvent = { type: string; detail: unknown };

type RecorderWindow = Window & {
	dropdownEvents?: RecordedEvent[];
	documentKeys?: string[];
	slotWrapperHeights?: number[];
	mountedFieldFocus?: 'resolved' | 'rejected';
	clickOutsideLoadingStates?: boolean[];
	mirroredOpenStates?: boolean[];
};

describe('Single Select Dropdown (end-to-end)', () => {
	let page: E2EPage;
	let dropdownElement: E2EElement;
	let createFormToggleSpy: EventSpy;

	const setUpDropdown = async (dropdownContent = ''): Promise<void> => {
		page = await newE2EPage();
		// The design tokens size the list and its create form, and the page's body is what a click outside lands on
		await page.setContent(`
			<link rel="stylesheet" href="/assets/styles/style-dictionary/tokens/index.css" />
			<style>body { margin: 0; min-height: 100vh; }</style>
			<div style="width: 320px; padding: 16px">
				<kv-single-select-dropdown can-add-items min-search-options="0" search-debounce="0">${dropdownContent}</kv-single-select-dropdown>
			</div>
		`);
		dropdownElement = await page.find('kv-single-select-dropdown');
		dropdownElement.setProperty('options', OPTIONS);
		await page.waitForChanges();
		createFormToggleSpy = await dropdownElement.spyOnEvent('createFormToggle');
	};

	const getBox = (selector: string): Promise<ElementBox> =>
		page.evaluate((deepSelector: string) => {
			// As in `page.find`, each `>>>` steps into the shadow root of the element matched so far
			const [hostSelector, ...shadowSelectors] = deepSelector.split('>>>');
			const element = shadowSelectors.reduce((parent, shadowSelector) => parent.shadowRoot.querySelector(shadowSelector), document.querySelector(hostSelector));
			const { top, right, bottom, left, width, height } = element.getBoundingClientRect();

			return { top, right, bottom, left, width, height };
		}, selector);

	const getActiveElementPath = (): Promise<string[]> =>
		page.evaluate(() => {
			const path: string[] = [];

			for (let element = document.activeElement; element !== null; element = element.shadowRoot?.activeElement ?? null) {
				path.push(element.tagName.toLowerCase());
			}

			return path;
		});

	// The trigger is a text field in the document too, so a focus path alone doesn't tell them apart
	const isFocusWithin = (selector: string): Promise<boolean> =>
		page.evaluate((containerSelector: string) => document.querySelector(containerSelector).contains(document.activeElement), selector);

	const getRenderedRowValues = async (): Promise<string[]> => (await page.findAll(`${LIST_SELECTOR} >>> kv-select-option`)).map(row => row.getAttribute('value'));

	const getCreateFormToggles = (): boolean[] => createFormToggleSpy.events.map(({ detail }) => detail);

	const setCreateOptionState = async (createOptionState: ICreateOptionState): Promise<void> => {
		dropdownElement.setProperty('createOptionState', createOptionState);
		await page.waitForChanges();
	};

	const isDropdownOpen = (): Promise<boolean> => dropdownElement.getProperty('isOpen');

	const isVisible = async (selector: string): Promise<boolean> => (await page.find(selector)).isVisible();

	const openDropdown = async (): Promise<void> => {
		await (await page.find(TRIGGER_SELECTOR)).click();
		await page.waitForChanges();
	};

	const clickAddRow = async (): Promise<void> => {
		await (await page.find(ADD_ROW_SELECTOR)).click();
		await page.waitForChanges();
	};

	const openCreateForm = async (): Promise<void> => {
		await openDropdown();
		await (await page.find(SEARCH_INPUT_SELECTOR)).type(NEW_OPTION_NAME);
		await page.waitForChanges();
		await clickAddRow();
	};

	const pressKey = async (key: 'Enter' | 'Escape'): Promise<void> => {
		await page.keyboard.press(key);
		await page.waitForChanges();
	};

	const clickFormButton = async (selector: string): Promise<void> => {
		await (await page.find(selector)).click();
		await page.waitForChanges();
	};

	const clickOutside = async (): Promise<void> => {
		await page.mouse.click(OUTSIDE_POINT.x, OUTSIDE_POINT.y);
		await page.waitForChanges();
	};

	// Records the given events in the order they reach the dropdown
	const recordDropdownEvents = (eventTypes: string[]): Promise<void> =>
		page.evaluate((types: string[]) => {
			const recorderWindow = window as RecorderWindow;
			const dropdown = document.querySelector('kv-single-select-dropdown');
			recorderWindow.dropdownEvents = [];

			for (const type of types) {
				dropdown.addEventListener(type, ({ detail }: CustomEvent) => recorderWindow.dropdownEvents.push({ type, detail }));
			}
		}, eventTypes);

	const getDropdownEvents = (): Promise<RecordedEvent[]> => page.evaluate(() => (window as RecorderWindow).dropdownEvents);

	const recordDocumentKeys = (): Promise<void> =>
		page.evaluate(() => {
			const recorderWindow = window as RecorderWindow;
			recorderWindow.documentKeys = [];
			document.addEventListener('keydown', ({ key }) => recorderWindow.documentKeys.push(key));
		});

	const getDocumentKeys = (): Promise<string[]> => page.evaluate(() => (window as RecorderWindow).documentKeys);

	describe('with the default create form', () => {
		beforeEach(async () => {
			await setUpDropdown();
		});

		it('should emit optionCreated, then optionSelected and then close when enter is pressed in the create input', async () => {
			const windowOptionCreatedSpy = await page.spyOnEvent('optionCreated');
			await openCreateForm();
			expect(await getActiveElementPath()).toEqual(CREATE_INPUT_FOCUS_PATH);
			expect(await (await page.find(CREATE_INPUT_SELECTOR)).getProperty('value')).toBe(NEW_OPTION_NAME);
			await recordDropdownEvents(['optionCreated', 'optionSelected', 'openStateChange']);

			await pressKey('Enter');

			expect(await getDropdownEvents()).toEqual([
				{ type: 'optionCreated', detail: NEW_OPTION_NAME },
				{ type: 'optionSelected', detail: NEW_OPTION_NAME },
				{ type: 'openStateChange', detail: false }
			]);
			expect(await isDropdownOpen()).toBe(false);
			expect(await isVisible(PANEL_SELECTOR)).toBe(false);
			expect(getCreateFormToggles()).toEqual([true, false]);
			// The list's own optionCreated stops at the dropdown, which re-emits it
			expect(windowOptionCreatedSpy.events.map(({ target }) => target.tagName)).toEqual(['KV-SINGLE-SELECT-DROPDOWN']);
		});

		it('should re-emit createFormToggle from the dropdown itself, without bubbling, when the create form opens and closes', async () => {
			const windowCreateFormToggleSpy = await page.spyOnEvent('createFormToggle');

			await openCreateForm();
			expect(getCreateFormToggles()).toEqual([true]);

			await clickFormButton(CANCEL_BUTTON_SELECTOR);

			expect(getCreateFormToggles()).toEqual([true, false]);
			// The dropdown is the event's target, not the list inside it
			expect(createFormToggleSpy.events.map(({ target }) => target.tagName)).toEqual(['KV-SINGLE-SELECT-DROPDOWN', 'KV-SINGLE-SELECT-DROPDOWN']);
			expect(windowCreateFormToggleSpy).toHaveReceivedEventTimes(0);
			expect(await isDropdownOpen()).toBe(true);
		});

		it('should show the list with an empty search when reopened after being closed through isOpen while creating', async () => {
			await openCreateForm();
			const openStateChangeSpy = await dropdownElement.spyOnEvent('openStateChange');
			const searchChangeSpy = await dropdownElement.spyOnEvent('searchChange');

			dropdownElement.setProperty('isOpen', false);
			await page.waitForChanges();

			expect(getCreateFormToggles()).toEqual([true, false]);
			expect(searchChangeSpy).toHaveReceivedEventTimes(1);
			expect(searchChangeSpy).toHaveReceivedEventDetail('');
			// Closed by its consumer, the dropdown doesn't report it back
			expect(openStateChangeSpy).toHaveReceivedEventTimes(0);

			dropdownElement.setProperty('isOpen', true);
			await page.waitForChanges();

			expect(await page.find(CREATE_FORM_SELECTOR)).toBeNull();
			expect(await isVisible(PANEL_SELECTOR)).toBe(true);
			expect(await isVisible(LIST_SELECTOR)).toBe(true);
			expect((await getBox(HEADER_SELECTOR)).height).toBeGreaterThan(0);
			expect(await (await page.find(SEARCH_INPUT_SELECTOR)).getProperty('value')).toBe('');
			expect(await getRenderedRowValues()).toEqual([...Object.keys(OPTIONS), ADD_OPTION.value]);
			expect(getCreateFormToggles()).toEqual([true, false]);
		});
	});

	describe('with a slotted create form', () => {
		beforeEach(async () => {
			await setUpDropdown(SLOTTED_CREATE_FORM);
			// As kv-ui-apps' OptionCreate does, the consumer controls the slotted create option's value
			await page.evaluate(() => {
				const createOption = document.querySelector<HTMLKvSelectCreateOptionElement>('[slot="create-new-option"] kv-select-create-option');
				createOption.addEventListener('valueChanged', ({ detail }: CustomEvent<string>) => (createOption.value = detail));
			});
			// So that a key leaking out of the form would also act on the list
			dropdownElement.setProperty('shortcuts', true);
			await page.waitForChanges();
		});

		it('should focus the slotted create input and collapse the list to the slotted row when the add row is clicked', async () => {
			await openDropdown();

			await clickAddRow();

			expect(await getActiveElementPath()).toEqual(SLOTTED_INPUT_FOCUS_PATH);
			expect(await isFocusWithin(SLOT_WRAPPER_SELECTOR)).toBe(true);
			expect((await (await page.find(HEADER_SELECTOR)).getComputedStyle()).visibility).toBe('hidden');
			expect((await getBox(HEADER_SELECTOR)).height).toBe(0);
			expect((await getBox(LIST_SELECTOR)).height).toBe(0);
			// The slotted row's own 56px within the panel's borders
			const panelBox = await getBox(PANEL_SELECTOR);
			expect(panelBox.height).toBeGreaterThanOrEqual(56);
			expect(panelBox.height).toBeLessThanOrEqual(58);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should create, select and close when enter is pressed in the slotted create input, without the key reaching the document', async () => {
			await openDropdown();
			await clickAddRow();
			await recordDocumentKeys();
			await recordDropdownEvents(['optionCreated', 'optionSelected', 'openStateChange']);

			await (await page.find(SLOTTED_CREATE_INPUT_SELECTOR)).type(NEW_OPTION_NAME);
			await pressKey('Enter');

			expect(await getDropdownEvents()).toEqual([
				{ type: 'optionCreated', detail: NEW_OPTION_NAME },
				{ type: 'optionSelected', detail: NEW_OPTION_NAME },
				{ type: 'openStateChange', detail: false }
			]);
			expect(await isDropdownOpen()).toBe(false);
			// Only the typed characters reach the document
			expect(await getDocumentKeys()).toEqual(NEW_OPTION_NAME.split(''));
		});

		it('should return to the list, with the search focused, when escape is pressed in the slotted create form', async () => {
			const dismissSpy = await dropdownElement.spyOnEvent('dismiss');
			await openDropdown();
			await clickAddRow();
			await recordDocumentKeys();

			await pressKey('Escape');

			expect(getCreateFormToggles()).toEqual([true, false]);
			expect(await isDropdownOpen()).toBe(true);
			expect(dismissSpy).toHaveReceivedEventTimes(0);
			expect(await getDocumentKeys()).toEqual([]);
			expect(await isVisible(LIST_SELECTOR)).toBe(true);
			expect(await getRenderedRowValues()).toEqual([...Object.keys(OPTIONS), ADD_OPTION.value]);
			expect(await getActiveElementPath()).toEqual(SEARCH_INPUT_FOCUS_PATH);
		});
	});

	describe('with a create form mounted once it opens', () => {
		beforeEach(async () => {
			await setUpDropdown(EMPTY_SLOT_WRAPPER);
		});

		it.each<[string, boolean]>([
			['in the next animation frame', false],
			['50ms later', true]
		])('should have laid the slot out when createFormToggle reports the form open, so a text field mounted %s can focus itself', async (_, isMountedOnTimeout) => {
			await page.evaluate((mountsOnTimeout: boolean) => {
				const recorderWindow = window as RecorderWindow;
				const dropdown = document.querySelector('kv-single-select-dropdown');
				const slotWrapper = document.querySelector<HTMLDivElement>('[slot="create-new-option"]');
				recorderWindow.slotWrapperHeights = [];

				// A consumer that only renders its create row, focusing it once, when the create form opens
				const mountTextField = () => {
					const textField = document.createElement('kv-text-field');
					slotWrapper.appendChild(textField);
					textField.focusInput().then(
						() => (recorderWindow.mountedFieldFocus = 'resolved'),
						() => (recorderWindow.mountedFieldFocus = 'rejected')
					);
				};

				dropdown.addEventListener('createFormToggle', ({ detail: isOpen }: CustomEvent<boolean>) => {
					if (!isOpen) {
						return;
					}

					recorderWindow.slotWrapperHeights.push(slotWrapper.getBoundingClientRect().height);

					if (mountsOnTimeout) {
						setTimeout(mountTextField, 50);
					} else {
						requestAnimationFrame(mountTextField);
					}
				});
			}, isMountedOnTimeout);
			await openDropdown();

			await clickAddRow();
			await page.waitForFunction(() => (window as RecorderWindow).mountedFieldFocus !== undefined);

			const slotWrapperHeights = await page.evaluate(() => (window as RecorderWindow).slotWrapperHeights);
			expect(slotWrapperHeights).toHaveLength(1);
			expect(slotWrapperHeights[0]).toBeGreaterThan(0);
			expect(await page.evaluate(() => (window as RecorderWindow).mountedFieldFocus)).toBe('resolved');
			expect(await getActiveElementPath()).toEqual(SLOTTED_INPUT_FOCUS_PATH);
			expect(await isFocusWithin(SLOT_WRAPPER_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});
	});

	describe('with a create form mounted as it reports opening', () => {
		beforeEach(async () => {
			await setUpDropdown(EMPTY_SLOT_WRAPPER);
		});

		it('should focus a text field that a createFormToggle listener mounts right away', async () => {
			await page.evaluate(() => {
				const dropdown = document.querySelector('kv-single-select-dropdown');
				const slotWrapper = document.querySelector('[slot="create-new-option"]');

				// Mounted from the event, without focusing it: the dropdown's own focus comes after the event
				dropdown.addEventListener('createFormToggle', ({ detail: isOpen }: CustomEvent<boolean>) => {
					if (isOpen) {
						slotWrapper.appendChild(document.createElement('kv-text-field'));
					}
				});
			});
			await openDropdown();

			await clickAddRow();
			await page.waitForFunction(() => document.querySelector('[slot="create-new-option"]').contains(document.activeElement));

			expect(await getActiveElementPath()).toEqual(SLOTTED_INPUT_FOCUS_PATH);
			expect(await isFocusWithin(SLOT_WRAPPER_SELECTOR)).toBe(true);
		});
	});

	describe('with a slotted form that cancels itself on escape', () => {
		beforeEach(async () => {
			await setUpDropdown('<div slot="create-new-option" style="padding: 12px"><input id="plain-create-input" /></div>');
			// The shortcuts would dismiss the whole dropdown on an escape that reached them
			dropdownElement.setProperty('shortcuts', true);
			await page.waitForChanges();
			await page.evaluate(() => {
				const input = document.querySelector<HTMLInputElement>('#plain-create-input');

				// A custom form closing the create form on its own key, and letting the key go on
				input.addEventListener('keydown', ({ key }) => {
					if (key === 'Escape') {
						input.dispatchEvent(new CustomEvent('clickCancel', { bubbles: true, composed: true }));
					}
				});
			});
		});

		it('should return to the list, without the escape also dismissing the dropdown', async () => {
			const dismissSpy = await dropdownElement.spyOnEvent('dismiss');
			await openCreateForm();
			await page.focus('#plain-create-input');

			await pressKey('Escape');

			expect(dismissSpy).toHaveReceivedEventTimes(0);
			expect(await isDropdownOpen()).toBe(true);
			expect(getCreateFormToggles()).toEqual([true, false]);
			expect(await getRenderedRowValues()).toContain(ADD_OPTION.value);
		});
	});

	describe('when the creation is asynchronous', () => {
		let optionCreatedSpy: EventSpy;
		let optionSelectedSpy: EventSpy;

		const submitCreation = async (): Promise<void> => {
			await openCreateForm();
			await pressKey('Enter');
		};

		// The consumer's request creating the option is running
		const setCreationLoading = (): Promise<void> => setCreateOptionState({ status: ECreateOptionStatus.Loading });

		beforeEach(async () => {
			await setUpDropdown();
			await setCreateOptionState({ status: ECreateOptionStatus.Idle });
			optionCreatedSpy = await dropdownElement.spyOnEvent('optionCreated');
			optionSelectedSpy = await dropdownElement.spyOnEvent('optionSelected');
		});

		it('should only emit optionCreated, keeping the dropdown and its create form open, when the create form is submitted', async () => {
			await submitCreation();

			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(optionCreatedSpy).toHaveReceivedEventDetail(NEW_OPTION_NAME);
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
			expect(await isDropdownOpen()).toBe(true);
			expect(await isVisible(CREATE_FORM_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should stay open, emitting clickOutside but no openStateChange, when clicked outside while the creation is loading', async () => {
			await submitCreation();
			await setCreationLoading();
			const openStateChangeSpy = await dropdownElement.spyOnEvent('openStateChange');
			const clickOutsideSpy = await dropdownElement.spyOnEvent('clickOutside');

			await clickOutside();

			expect(clickOutsideSpy).toHaveReceivedEventTimes(1);
			expect(openStateChangeSpy).toHaveReceivedEventTimes(0);
			expect(await isDropdownOpen()).toBe(true);
			expect(await isVisible(CREATE_FORM_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should keep a consumer that mirrors openStateChange into isOpen from closing it, when clicked outside as the creation starts loading', async () => {
			await submitCreation();
			await page.$eval(
				'kv-single-select-dropdown',
				(dropdown: HTMLKvSingleSelectDropdownElement, loadingState: ICreateOptionState) => {
					const recorderWindow = window as RecorderWindow;
					recorderWindow.mirroredOpenStates = [];
					dropdown.addEventListener('openStateChange', ({ detail: isOpen }: CustomEvent<boolean>) => {
						recorderWindow.mirroredOpenStates.push(isOpen);
						dropdown.isOpen = isOpen;
					});

					// Before any render: the list still closes on a click outside, so only the dropdown's guard holds
					dropdown.createOptionState = loadingState;
					document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 700, clientY: 500 }));
				},
				{ status: ECreateOptionStatus.Loading }
			);
			await page.waitForChanges();

			expect(await page.evaluate(() => (window as RecorderWindow).mirroredOpenStates)).toEqual([]);
			expect(await isDropdownOpen()).toBe(true);
			expect(await isVisible(CREATE_FORM_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should stay open when the trigger is clicked while the creation is loading', async () => {
			await submitCreation();
			await setCreationLoading();
			const openStateChangeSpy = await dropdownElement.spyOnEvent('openStateChange');

			await (await page.find(TRIGGER_SELECTOR)).click();
			await page.waitForChanges();

			expect(openStateChangeSpy).toHaveReceivedEventTimes(0);
			expect(await isDropdownOpen()).toBe(true);
			expect(await isVisible(CREATE_FORM_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should stay open for a consumer that closes it on clickOutside but skips that while its creation is loading', async () => {
			await submitCreation();
			await setCreationLoading();
			await page.evaluate((loadingStatus: ECreateOptionStatus) => {
				const recorderWindow = window as RecorderWindow;
				const dropdown = document.querySelector('kv-single-select-dropdown');
				recorderWindow.clickOutsideLoadingStates = [];

				// As a table cell editor closes its dropdown, guarded
				dropdown.addEventListener('clickOutside', () => {
					const isCreating = dropdown.createOptionState?.status === loadingStatus;
					recorderWindow.clickOutsideLoadingStates.push(isCreating);

					if (!isCreating) {
						dropdown.isOpen = false;
					}
				});
			}, ECreateOptionStatus.Loading);

			await clickOutside();

			// clickOutside is still emitted while the creation is loading, which is why the consumer must skip it
			expect(await page.evaluate(() => (window as RecorderWindow).clickOutsideLoadingStates)).toEqual([true]);
			expect(await isDropdownOpen()).toBe(true);
			expect(await isVisible(CREATE_FORM_SELECTOR)).toBe(true);
			expect(getCreateFormToggles()).toEqual([true]);
		});

		it('should drop the loading creation for a consumer that closes it on clickOutside without skipping that while creating', async () => {
			await submitCreation();
			await setCreationLoading();
			await page.evaluate(() => {
				const dropdown = document.querySelector('kv-single-select-dropdown');

				// As a table cell editor closes its dropdown, unguarded
				dropdown.addEventListener('clickOutside', () => (dropdown.isOpen = false));
			});

			await clickOutside();

			expect(await isDropdownOpen()).toBe(false);
			expect(await isVisible(PANEL_SELECTOR)).toBe(false);
			expect(getCreateFormToggles()).toEqual([true, false]);
			// The running request's success no longer selects anything
			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: NEW_OPTION_KEY });
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
		});

		it('should close on a click outside again once the creation fails', async () => {
			await submitCreation();
			await setCreationLoading();

			await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });
			await clickOutside();

			expect(await isDropdownOpen()).toBe(false);
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
		});

		it('should let enter submit again after a failure reported before the dropdown rendered its loading', async () => {
			await submitCreation();
			// The request failed within one frame: the loading goes on and off before the dropdown renders
			await page.$eval(
				'kv-single-select-dropdown',
				(dropdown: HTMLKvSingleSelectDropdownElement, loadingState: ICreateOptionState, errorState: ICreateOptionState) => {
					dropdown.createOptionState = loadingState;
					dropdown.createOptionState = errorState;
				},
				{ status: ECreateOptionStatus.Loading },
				{ status: ECreateOptionStatus.Error }
			);
			await page.waitForChanges();

			await pressKey('Enter');

			expect(optionCreatedSpy).toHaveReceivedEventTimes(2);
			expect(optionSelectedSpy).toHaveReceivedEventTimes(0);
		});

		it('should select the created option and close when the creation succeeds', async () => {
			await submitCreation();
			await setCreationLoading();
			// The consumer adds the created option before reporting the success
			dropdownElement.setProperty('options', { ...OPTIONS, [NEW_OPTION_KEY]: { label: NEW_OPTION_NAME, value: NEW_OPTION_KEY } });
			await page.waitForChanges();
			await recordDropdownEvents(['optionSelected', 'openStateChange', 'createFormToggle']);

			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: NEW_OPTION_KEY });

			expect(await getDropdownEvents()).toEqual([
				{ type: 'optionSelected', detail: NEW_OPTION_KEY },
				{ type: 'openStateChange', detail: false },
				{ type: 'createFormToggle', detail: false }
			]);
			expect(await isDropdownOpen()).toBe(false);
			expect(optionCreatedSpy).toHaveReceivedEventTimes(1);
			expect(optionSelectedSpy).toHaveReceivedEventTimes(1);
		});
	});
});
