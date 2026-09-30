import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import type { SpecPage } from '@stencil/core/testing';

import { KvSelectMultiOptions } from '../select-multi-options';
import {
	ADD_OPTION,
	ASYNC_CREATE_SUBMIT_LOCK_IN_MS,
	DEFAULT_ADD_OPTION_PLACEHOLDER,
	DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG,
	DEFAULT_SEARCH_DEBOUNCE_IN_MS
} from '../select-multi-options.config';
import { ECreateOptionStatus } from '../select-multi-options.types';
import type { ICreateOptionState, ISelectMultiOptions } from '../select-multi-options.types';
import type { JSX } from '../../../components';
import { KvSelect } from '../../select/select';
import { KvSearch } from '../../search/search';
import { KvTextField } from '../../text-field/text-field';
import { KvSelectCreateOption } from '../../select-create-option/select-create-option';
import { EIllustrationName } from '../../illustration/illustration.types';
import { EValidationState } from '../../text-field/text-field.types';
import { EComponentSize } from '../../../utils/types';

const OPTIONS: ISelectMultiOptions = {
	pump: { label: 'Main Pump', value: 'asset-pump' },
	valve: { label: 'Control Valve', value: 'asset-valve' },
	sensor: { label: 'Pressure Sensor', value: 'sensor-pressure' }
};

describe('KvSelectMultiOptions (unit tests)', () => {
	let page: SpecPage;
	let component: KvSelectMultiOptions;
	let element: HTMLKvSelectMultiOptionsElement;

	const getCurrentOptionValues = (): string[] => component.selectOptions.currentFlatten.map(option => option.value);

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvSelectMultiOptions],
			template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} searchDebounce={0} />
		});
		component = page.rootInstance;
		element = page.root as HTMLKvSelectMultiOptionsElement;
	});

	it('should filter options locally when the search value changes', async () => {
		element.searchValue = 'pump';
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-pump']);
	});

	it('should restore all options when the search value is cleared', async () => {
		element.searchValue = 'pump';
		await page.waitForChanges();
		element.searchValue = '';
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);
	});

	it('should render the no-results state when the local search has no matches', async () => {
		element.searchValue = 'missing';
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual([]);
		expect(page.root.shadowRoot.querySelector('.empty-state-message').textContent).toBe('No results found');
	});

	it('should prefer externally filtered options over local search results', async () => {
		element.searchValue = 'pump';
		element.filteredOptions = { valve: OPTIONS.valve };
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-valve']);
	});

	it('should treat empty externally filtered options as an override', async () => {
		element.searchValue = 'pump';
		element.filteredOptions = {};
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual([]);
	});

	it('should ignore the search value when the dropdown is not searchable', async () => {
		element.searchable = false;
		element.searchValue = 'pump';
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);
	});

	it('should rebuild the options when searchable is turned off after a search', async () => {
		element.searchValue = 'pump';
		await page.waitForChanges();
		element.searchable = false;
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);
	});

	it('should stop filtering locally when the options drop below the search threshold', async () => {
		element.minSearchOptions = 3;
		element.searchValue = 'pump';
		await page.waitForChanges();
		expect(getCurrentOptionValues()).toEqual(['asset-pump']);

		// The search input is hidden below the threshold, so the leftover term must stop applying.
		element.options = { valve: OPTIONS.valve, sensor: OPTIONS.sensor };
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-valve', 'sensor-pressure']);
	});

	it('should still honour externally filtered options when not searchable', async () => {
		element.searchable = false;
		element.filteredOptions = { valve: OPTIONS.valve };
		await page.waitForChanges();

		expect(getCurrentOptionValues()).toEqual(['asset-valve']);
	});

	describe('search debounce', () => {
		// The render queue is driven by `process.nextTick`, so only the debounce's clock is faked.
		const useFakeDebounceClock = () => jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask'] });

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSelectMultiOptions],
				template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} />
			});
			component = page.rootInstance;
			element = page.root as HTMLKvSelectMultiOptionsElement;

			useFakeDebounceClock();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		const advance = async (ms: number): Promise<void> => {
			jest.advanceTimersByTime(ms);
			await page.waitForChanges();
		};

		it('should default the debounce to 300ms', () => {
			expect(component.searchDebounce).toBe(DEFAULT_SEARCH_DEBOUNCE_IN_MS);
		});

		it('should keep the options unfiltered until the debounce elapses', async () => {
			element.searchValue = 'pump';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS - 1);

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);

			await advance(1);

			expect(getCurrentOptionValues()).toEqual(['asset-pump']);
		});

		it('should filter once with the last term typed within the debounce window', async () => {
			element.searchValue = 'p';
			await advance(100);
			element.searchValue = 'pu';
			await advance(100);
			element.searchValue = 'valve';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-valve']);
		});

		it('should restore all options immediately when the search is cleared', async () => {
			element.searchValue = 'pump';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS);
			expect(getCurrentOptionValues()).toEqual(['asset-pump']);

			element.searchValue = '';
			await advance(0);

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);
		});

		it('should drop a pending term when the search is cleared before the debounce elapses', async () => {
			element.searchValue = 'pump';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS - 1);
			element.searchValue = '';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);
		});

		it('should apply a pending term immediately when the debounce is turned off', async () => {
			element.searchValue = 'pump';
			element.searchDebounce = 0;
			await advance(0);

			expect(getCurrentOptionValues()).toEqual(['asset-pump']);
		});

		it('should honour a debounce set before the component loads', async () => {
			jest.useRealTimers();
			page = await newSpecPage({
				components: [KvSelectMultiOptions],
				template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} searchDebounce={1000} />
			});
			component = page.rootInstance;
			element = page.root as HTMLKvSelectMultiOptionsElement;
			useFakeDebounceClock();

			element.searchValue = 'pump';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);

			await advance(1000 - DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-pump']);
		});

		it('should restart a pending term on the new wait when the debounce changes', async () => {
			element.searchValue = 'pump';
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS - 1);
			element.searchDebounce = 1000;
			await advance(DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure']);

			await advance(1000 - DEFAULT_SEARCH_DEBOUNCE_IN_MS);

			expect(getCurrentOptionValues()).toEqual(['asset-pump']);
		});

		it('should filter with the initial search value without waiting for the debounce', async () => {
			jest.useRealTimers();
			page = await newSpecPage({
				components: [KvSelectMultiOptions],
				template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} searchValue="pump" />
			});
			component = page.rootInstance;

			expect(getCurrentOptionValues()).toEqual(['asset-pump']);
		});
	});
});

describe('KvSelectMultiOptions empty states (unit tests)', () => {
	const COMPONENTS = [KvSelectMultiOptions, KvSelect, KvSearch, KvTextField, KvSelectCreateOption];

	let page: SpecPage;
	let component: KvSelectMultiOptions;
	let element: HTMLKvSelectMultiOptionsElement;

	const renderSelectMultiOptions = async (props: JSX.KvSelectMultiOptions = {}): Promise<void> => {
		page = await newSpecPage({
			components: COMPONENTS,
			template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} searchDebounce={0} {...props} />
		});
		component = page.rootInstance;
		element = page.root as HTMLKvSelectMultiOptionsElement;
	};

	const getShadowElement = <T extends Element = HTMLElement>(selector: string): T | null => page.root.shadowRoot.querySelector<T>(selector);
	const getSelect = () => getShadowElement<HTMLKvSelectElement>('kv-select');
	const getMessage = () => getShadowElement('.empty-state-message');
	const getIllustrationMessage = (containerClass: string) => getShadowElement(`.${containerClass} kv-illustration-message`);
	const getCurrentOptionValues = (): string[] => component.selectOptions.currentFlatten.map(option => option.value);

	const setSearchValue = async (searchValue: string): Promise<void> => {
		element.searchValue = searchValue;
		await page.waitForChanges();
	};

	describe('when the search matches no option', () => {
		it('should show the no results message as a status in the list header', async () => {
			await renderSelectMultiOptions();
			await setSearchValue('missing');

			expect(getCurrentOptionValues()).toEqual([]);
			expect(getMessage().textContent).toBe('No results found');
			expect(getMessage().getAttribute('slot')).toBe('select-header-actions');
			expect(getMessage().getAttribute('role')).toBe('status');
			expect(getSelect().hasLabelContent).toBe(true);
		});

		it('should show no illustration by default', async () => {
			await renderSelectMultiOptions();
			await setSearchValue('missing');

			expect(getShadowElement('.no-results-found')).toBeNull();
			expect(getShadowElement('.no-data-available')).toBeNull();
		});

		it('should list the add option below the no results message', async () => {
			await renderSelectMultiOptions({ canAddItems: true });
			await setSearchValue('missing');

			expect(getCurrentOptionValues()).toEqual([ADD_OPTION.value]);
			expect(getMessage().textContent).toBe('No results found');
		});

		it('should show the no results message when the externally filtered options are empty', async () => {
			await renderSelectMultiOptions({ filteredOptions: {} });

			expect(getMessage().textContent).toBe('No results found');
		});

		it('should show only the header of a no results config without an illustration', async () => {
			await renderSelectMultiOptions({ noResultsFoundConfig: { header: 'No Insight Types found', description: 'Try another name' } });
			await setSearchValue('missing');

			expect(getMessage().textContent).toBe('No Insight Types found');
			expect(getShadowElement('.no-results-found')).toBeNull();
		});

		it('should show the illustration of a no results config with one, in place of the message', async () => {
			await renderSelectMultiOptions({
				noResultsFoundConfig: { illustration: EIllustrationName.NoResultsFound, header: 'No Results Found', description: 'Try another name' }
			});
			await setSearchValue('missing');

			expect(getIllustrationMessage('no-results-found').getAttribute('illustration')).toBe(EIllustrationName.NoResultsFound);
			expect(getIllustrationMessage('no-results-found').getAttribute('header')).toBe('No Results Found');
			expect(getMessage()).toBeNull();
			expect(getSelect().hasLabelContent).toBe(false);
		});

		it('should show nothing for a no results config with neither an illustration nor a header', async () => {
			await renderSelectMultiOptions({ noResultsFoundConfig: { header: '' } });
			await setSearchValue('missing');

			expect(getMessage()).toBeNull();
			expect(getShadowElement('.no-results-found')).toBeNull();
			expect(getSelect().hasLabelContent).toBe(false);
		});

		it('should fall back to the default no results message when the config is cleared', async () => {
			await renderSelectMultiOptions();
			element.noResultsFoundConfig = null;
			await setSearchValue('missing');

			expect(getMessage().textContent).toBe('No results found');
		});

		it('should fall back to the default no results message when a parent forwards the config unset', async () => {
			await renderSelectMultiOptions({ noResultsFoundConfig: undefined });
			await setSearchValue('missing');

			expect(getMessage().textContent).toBe('No results found');
		});

		it('should hide the select all and clear actions while the message shows', async () => {
			await renderSelectMultiOptions({ selectionAll: true, selectionClearable: true, selectedOptions: { 'asset-pump': true } });
			await setSearchValue('missing');

			expect(getSelect().selectionAll).toBe(false);
			expect(getSelect().selectionClearable).toBe(false);
		});

		it('should keep the select all and clear actions, disabled, beside an illustration', async () => {
			await renderSelectMultiOptions({
				selectionAll: true,
				selectionClearable: true,
				selectedOptions: { 'asset-pump': true },
				noResultsFoundConfig: { illustration: EIllustrationName.NoResultsFound, header: 'No Results Found' }
			});
			await setSearchValue('missing');

			expect(getSelect().selectionAll).toBe(true);
			expect(getSelect().selectionAllEnabled).toBe(false);
			expect(getSelect().selectionClearable).toBe(true);
			expect(getSelect().selectionClearEnabled).toBe(false);
		});
	});

	describe('when there are no options', () => {
		it('should show the no data illustration by default', async () => {
			await renderSelectMultiOptions({ options: {} });

			expect(getIllustrationMessage('no-data-available').getAttribute('illustration')).toBe(DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG.illustration);
			expect(getIllustrationMessage('no-data-available').getAttribute('header')).toBe(DEFAULT_NO_DATA_AVAILABLE_ILLUSTRATION_CONFIG.header);
			expect(getMessage()).toBeNull();
		});

		it('should list the add option below the no data illustration', async () => {
			await renderSelectMultiOptions({ options: {}, canAddItems: true });

			expect(getCurrentOptionValues()).toEqual([ADD_OPTION.value]);
			expect(getShadowElement('.no-data-available')).not.toBeNull();
			expect(getMessage()).toBeNull();
		});

		it('should keep the no data illustration while searching', async () => {
			await renderSelectMultiOptions({ options: {}, canAddItems: true });
			await setSearchValue('missing');

			expect(getShadowElement('.no-data-available')).not.toBeNull();
			expect(getShadowElement('.no-results-found')).toBeNull();
			expect(getMessage()).toBeNull();
		});

		it('should show only the header of a no data config without an illustration, in the list header', async () => {
			await renderSelectMultiOptions({ options: {}, canAddItems: true, noDataAvailableConfig: { header: 'No tags yet' } });

			expect(getMessage().textContent).toBe('No tags yet');
			expect(getShadowElement('.no-data-available')).toBeNull();
			expect(getCurrentOptionValues()).toEqual([ADD_OPTION.value]);
		});
	});

	describe('when nothing is listed below the header', () => {
		it('should mark the select as empty when only the no results message shows', async () => {
			await renderSelectMultiOptions();
			await setSearchValue('missing');

			expect(getSelect().classList.contains('empty')).toBe(true);
		});

		it.each<[string, JSX.KvSelectMultiOptions]>([
			['the options', {}],
			['the add option', { canAddItems: true, searchValue: 'missing' }],
			['an illustration', { searchValue: 'missing', noResultsFoundConfig: { illustration: EIllustrationName.NoResultsFound, header: 'No Results Found' } }]
		])('should not mark the select as empty with %s below the header', async (_case, props) => {
			await renderSelectMultiOptions(props);

			expect(getSelect().classList.contains('empty')).toBe(false);
		});
	});

	describe('when options are listed', () => {
		it('should show no empty state', async () => {
			await renderSelectMultiOptions({ canAddItems: true });
			await setSearchValue('pump');

			expect(getMessage()).toBeNull();
			expect(getShadowElement('.no-results-found')).toBeNull();
			expect(getShadowElement('.no-data-available')).toBeNull();
			expect(getSelect().hasLabelContent).toBe(false);
		});
	});

	describe('when the create form is open', () => {
		it.each<[string, JSX.KvSelectMultiOptions]>([
			['no options', { options: {} }],
			['a search matching no option', { searchValue: 'missing' }]
		])('should show no empty state with %s', async (_case, props) => {
			await renderSelectMultiOptions({ canAddItems: true, ...props });

			component['selectOption'](ADD_OPTION.value);
			await page.waitForChanges();

			expect(getMessage()).toBeNull();
			expect(getShadowElement('.no-data-available')).toBeNull();
			expect(getShadowElement('.no-results-found')).toBeNull();
			expect(getSelect().hasLabelContent).toBe(false);
			// The create form is below the header
			expect(getSelect().classList.contains('empty')).toBe(false);
		});
	});
});

describe('KvSelectMultiOptions with canAddItems (unit tests)', () => {
	// The create form focuses its text field when it opens, and the search when it is cancelled, so
	// every component on those paths is registered: a bare element has none of their methods.
	const COMPONENTS = [KvSelectMultiOptions, KvSelect, KvSearch, KvTextField, KvSelectCreateOption];
	const RECORDED_EVENTS = ['optionCreated', 'optionSelected', 'optionsSelected', 'dismiss'];

	let page: SpecPage;
	let component: KvSelectMultiOptions;
	let element: HTMLKvSelectMultiOptionsElement;
	let emittedEvents: [string, unknown][];
	let createFormToggles: boolean[];

	const renderSelectMultiOptions = async (props: JSX.KvSelectMultiOptions = {}): Promise<void> => {
		emittedEvents = [];
		createFormToggles = [];
		page = await newSpecPage({
			components: COMPONENTS,
			// Listening from the template, so that an emission during the initial load would be recorded too
			template: () => (
				<kv-select-multi-options
					options={OPTIONS}
					minSearchOptions={0}
					searchDebounce={0}
					canAddItems
					{...props}
					onCreateFormToggle={({ detail: isOpen }: CustomEvent<boolean>) => createFormToggles.push(isOpen)}
				/>
			)
		});
		component = page.rootInstance;
		element = page.root as HTMLKvSelectMultiOptionsElement;

		RECORDED_EVENTS.forEach(eventName => element.addEventListener(eventName, ({ type, detail }: CustomEvent) => emittedEvents.push([type, detail])));
	};

	const getShadowElement = <T extends Element = HTMLElement>(selector: string): T | null => page.root.shadowRoot.querySelector<T>(selector);
	const getSelect = () => getShadowElement<HTMLKvSelectElement>('kv-select');
	const getEmptyStateMessage = () => getShadowElement('.empty-state-message');
	const getCurrentOptionValues = (): string[] => component.selectOptions.currentFlatten.map(option => option.value);
	const getAddRow = () => component.selectOptions.currentFlatten.find(option => option.value === ADD_OPTION.value);

	const setSearchValue = async (searchValue: string): Promise<void> => {
		element.searchValue = searchValue;
		await page.waitForChanges();
	};

	const getCreateForm = () => getShadowElement('.create-new-option-form');
	const getCreateOption = () => getShadowElement<HTMLKvSelectCreateOptionElement>('kv-select-create-option');

	const openCreateForm = async (): Promise<void> => {
		// The add row is only rendered by kv-virtualized-list, so it is picked the way a click on it is
		component['selectOption'](ADD_OPTION.value);
		await page.waitForChanges();
	};

	// The events the create form drives the component with, as kv-select-create-option emits them
	const dispatchCreateFormEvent = (type: 'valueChanged' | 'clickCreate' | 'clickCancel', detail?: string): void => {
		getCreateOption().dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
	};

	const typeNewOption = async (value: string): Promise<void> => {
		dispatchCreateFormEvent('valueChanged', value);
		await page.waitForChanges();
	};

	const submitNewOption = async (): Promise<void> => {
		dispatchCreateFormEvent('clickCreate');
		await page.waitForChanges();
	};

	const cancelNewOption = async (): Promise<void> => {
		dispatchCreateFormEvent('clickCancel');
		await page.waitForChanges();
	};

	// As a consumer reports it: a new object each time, even for the same status
	const setCreateOptionState = async (createOptionState: ICreateOptionState): Promise<void> => {
		element.createOptionState = createOptionState;
		await page.waitForChanges();
	};

	const pressDocumentKey = async (key: string): Promise<void> => {
		page.doc.dispatchEvent(new KeyboardEvent('keydown', { key }));
		await page.waitForChanges();
	};

	const highlightAddOption = async (): Promise<void> => {
		// The add row is the last one, where the highlight stops
		const rowsCount = component.selectOptions.currentSelectable.length;

		for (let row = 0; row < rowsCount; row++) {
			await pressDocumentKey('ArrowDown');
		}
	};

	describe('when options are listed', () => {
		beforeEach(() => renderSelectMultiOptions());

		it('should list the add option after the matching options', async () => {
			await setSearchValue('pump');

			expect(getCurrentOptionValues()).toEqual(['asset-pump', ADD_OPTION.value]);
		});
	});

	describe('when counting the options', () => {
		it('should not count the add option in the selection counter', async () => {
			await renderSelectMultiOptions({ counter: true });

			expect(getShadowElement('.selected-items-label').textContent).toBe('Selected: 0/3');
		});

		it('should keep the add option as the last listed row', async () => {
			await renderSelectMultiOptions();

			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure', ADD_OPTION.value]);
		});

		it('should disable the select all and clear actions when only the add option is listed', async () => {
			await renderSelectMultiOptions({
				selectionAll: true,
				selectionClearable: true,
				selectedOptions: { 'asset-pump': true },
				noResultsFoundConfig: { illustration: EIllustrationName.NoResultsFound, header: 'No Results Found' }
			});
			await setSearchValue('missing');

			expect(getCurrentOptionValues()).toEqual([ADD_OPTION.value]);
			expect(getSelect().selectionAllEnabled).toBe(false);
			expect(getSelect().selectionClearEnabled).toBe(false);
		});

		it('should enable the select all and clear actions while options are listed', async () => {
			await renderSelectMultiOptions({ selectionAll: true, selectionClearable: true, selectedOptions: { 'asset-pump': true } });
			await setSearchValue('pump');

			expect(getSelect().selectionAllEnabled).toBe(true);
			expect(getSelect().selectionClearEnabled).toBe(true);
		});

		it('should not count the add option in the search results footer', async () => {
			await renderSelectMultiOptions({ shortcuts: true, showShortcuts: true });
			await setSearchValue('pump');

			expect(getShadowElement('.counter').textContent).toBe('1 result');
		});

		it('should not count the add option towards the search threshold', async () => {
			await renderSelectMultiOptions({ options: { pump: OPTIONS.pump, valve: OPTIONS.valve }, minSearchOptions: 3 });

			expect(component.selectOptions.searchAvailable).toBe(false);
			expect(getSelect().searchable).toBe(false);
		});

		it('should show the search once the options alone reach the search threshold', async () => {
			await renderSelectMultiOptions({ minSearchOptions: 3 });

			expect(component.selectOptions.searchAvailable).toBe(true);
			expect(getSelect().searchable).toBe(true);
		});
	});

	describe('when the add option inputs change', () => {
		it('should relabel the add row when the create option placeholder changes', async () => {
			await renderSelectMultiOptions();
			expect(getAddRow().label).toBe(DEFAULT_ADD_OPTION_PLACEHOLDER);

			element.createOptionPlaceholder = 'Create "Pump"';
			await page.waitForChanges();

			expect(getAddRow().label).toBe('Create "Pump"');
		});

		it('should add and remove the add row when canAddItems is toggled', async () => {
			await renderSelectMultiOptions({ canAddItems: false });
			expect(getAddRow()).toBeUndefined();

			element.canAddItems = true;
			await page.waitForChanges();
			expect(getCurrentOptionValues()).toEqual(['asset-pump', 'asset-valve', 'sensor-pressure', ADD_OPTION.value]);

			element.canAddItems = false;
			await page.waitForChanges();
			expect(getAddRow()).toBeUndefined();
		});
	});

	describe('when the add option is picked', () => {
		it('should open the create form', async () => {
			await renderSelectMultiOptions();
			await openCreateForm();

			expect(component.isCreating).toBe(true);
			expect(getCreateForm()).not.toBeNull();
			expect(getCreateOption()).not.toBeNull();
		});

		it('should open the create form from the keyboard', async () => {
			await renderSelectMultiOptions({ options: {}, shortcuts: true });
			await highlightAddOption();
			expect(component.highlightedOption).toBe(ADD_OPTION.value);

			await pressDocumentKey('Enter');

			expect(component.isCreating).toBe(true);
			expect(getCreateForm()).not.toBeNull();
		});

		it('should prefill the create form with the search term', async () => {
			await renderSelectMultiOptions({ searchValue: 'Maintenance' });
			await openCreateForm();

			expect(component.createdOptionValue).toBe('Maintenance');
			expect(getCreateOption().value).toBe('Maintenance');
		});

		it('should hide the no results message while creating', async () => {
			await renderSelectMultiOptions({ searchValue: 'missing' });
			expect(getEmptyStateMessage()).not.toBeNull();

			await openCreateForm();

			expect(getEmptyStateMessage()).toBeNull();
			expect(getSelect().hasLabelContent).toBe(false);
		});

		it('should mark the select as creating and drop its footers while the create form is open', async () => {
			await renderSelectMultiOptions({ shortcuts: true, showShortcuts: true });
			expect(getShadowElement('kv-select-shortcuts-label')).not.toBeNull();

			await openCreateForm();

			expect(getSelect().classList.contains('creating')).toBe(true);
			expect(getShadowElement('kv-select-shortcuts-label')).toBeNull();
			expect(getShadowElement('slot[name="select-footer"]')).toBeNull();
		});

		it('should keep the search mounted while creating', async () => {
			await renderSelectMultiOptions();
			await openCreateForm();

			expect(getSelect().shadowRoot.querySelector('kv-search')).not.toBeNull();
		});

		it('should configure the default create form', async () => {
			await renderSelectMultiOptions({
				createInputPlaceholder: 'Insight Type name',
				createOptionConfig: { disabled: true, size: EComponentSize.Large, inputConfig: { helpText: 'Already exists' } }
			});
			await openCreateForm();

			expect(getCreateOption().disabled).toBe(true);
			expect(getCreateOption().size).toBe(EComponentSize.Large);
			expect(getCreateOption().inputConfig).toEqual({ placeholder: 'Insight Type name', helpText: 'Already exists' });
		});

		it('should prefer the create form config placeholder over the create input placeholder', async () => {
			await renderSelectMultiOptions({ createInputPlaceholder: 'Insight Type name', createOptionConfig: { inputConfig: { placeholder: 'Name' } } });
			await openCreateForm();

			expect(getCreateOption().inputConfig).toEqual({ placeholder: 'Name' });
		});

		it('should render the default create form small, enabled and not loading', async () => {
			await renderSelectMultiOptions();
			await openCreateForm();

			expect(getCreateOption().disabled).toBe(false);
			expect(getCreateOption().size).toBe(EComponentSize.Small);
			expect(getCreateOption().loading).toBe(false);
		});

		it('should pass the loading state to the default create form', async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Idle } });
			await openCreateForm();

			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			expect(getCreateOption().loading).toBe(true);
		});
	});

	describe('when the create form is open', () => {
		beforeEach(async () => {
			await renderSelectMultiOptions();
			await openCreateForm();
			await typeNewOption('Foo');
		});

		it('should emit optionCreated and then optionSelected with the typed value', async () => {
			await submitNewOption();

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionSelected', 'Foo']
			]);
		});

		it('should close the create form', async () => {
			await submitNewOption();

			expect(component.isCreating).toBe(false);
			expect(getCreateForm()).toBeNull();
		});

		it('should close the create form without creating on cancel', async () => {
			await cancelNewOption();

			expect(emittedEvents).toEqual([]);
			expect(component.isCreating).toBe(false);
			expect(getCreateForm()).toBeNull();
		});

		it('should close the create form when options can no longer be added', async () => {
			element.canAddItems = false;
			await page.waitForChanges();

			expect(component.isCreating).toBe(false);
			expect(getCreateForm()).toBeNull();
			expect(getAddRow()).toBeUndefined();
		});
	});

	describe('when the search term is submitted unedited', () => {
		it('should create and select the search term', async () => {
			await renderSelectMultiOptions({ searchValue: 'Maintenance' });
			await openCreateForm();

			await submitNewOption();

			expect(emittedEvents).toEqual([
				['optionCreated', 'Maintenance'],
				['optionSelected', 'Maintenance']
			]);
		});
	});

	describe('when options are created asynchronously', () => {
		beforeEach(async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Idle } });
			await openCreateForm();
			await typeNewOption('Foo');
		});

		it('should only emit optionCreated on submit', async () => {
			await submitNewOption();

			expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);
		});

		it('should keep the create form open after the submit', async () => {
			await submitNewOption();

			expect(component.isCreating).toBe(true);
			expect(getCreateForm()).not.toBeNull();
		});

		it('should emit optionCreated once for two submits made before the state reports back', async () => {
			dispatchCreateFormEvent('clickCreate');
			dispatchCreateFormEvent('clickCreate');
			await page.waitForChanges();

			expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);
		});

		it('should allow a new submit once the value is edited', async () => {
			dispatchCreateFormEvent('clickCreate');
			dispatchCreateFormEvent('valueChanged', 'Bar');
			dispatchCreateFormEvent('clickCreate');
			await page.waitForChanges();

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionCreated', 'Bar']
			]);
		});

		it('should hold off a second submit until the submit lock expires, even when no state reaches the form', async () => {
			// The render queue is driven by `process.nextTick`, so only the lock's clock is faked
			jest.useFakeTimers({ doNotFake: ['nextTick', 'queueMicrotask'] });

			try {
				await submitNewOption();
				jest.advanceTimersByTime(ASYNC_CREATE_SUBMIT_LOCK_IN_MS - 50);
				await submitNewOption();

				expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);

				jest.advanceTimersByTime(100);
				await submitNewOption();

				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionCreated', 'Foo']
				]);
			} finally {
				jest.useRealTimers();
			}
		});

		it('should show the create action loading while loading', async () => {
			await submitNewOption();

			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			expect(getCreateOption().loading).toBe(true);
		});

		it('should ignore a submit while loading', async () => {
			await submitNewOption();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await submitNewOption();

			expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);
		});

		it('should ignore a cancel while loading', async () => {
			await submitNewOption();
			await setCreateOptionState({ status: ECreateOptionStatus.Loading });

			await cancelNewOption();

			expect(component.isCreating).toBe(true);
			expect(getCreateForm()).not.toBeNull();
		});

		it('should still close the create form on cancel before loading', async () => {
			await submitNewOption();

			await cancelNewOption();

			expect(component.isCreating).toBe(false);
		});

		describe('when the submit succeeds', () => {
			it('should select the created option by its key and close the create form', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Loading });
				const focusSearchSpy = jest.spyOn(KvSelect.prototype, 'focusSearch');

				await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' });

				// The selection closes a dropdown, so the search is left alone
				expect(focusSearchSpy).not.toHaveBeenCalled();
				focusSearchSpy.mockRestore();
				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionSelected', 'insight-type-foo']
				]);
				expect(component.isCreating).toBe(false);
				expect(getCreateForm()).toBeNull();
				expect(createFormToggles).toEqual([true, false]);
			});

			it.each([
				['no key', undefined],
				['an empty key', '']
			])('should select the submitted value with %s', async (_case, optionKey) => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Loading });

				await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey });

				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionSelected', 'Foo']
				]);
			});

			it('should select the submitted value rather than one typed after the submit', async () => {
				await submitNewOption();
				await typeNewOption('Bar');

				await setCreateOptionState({ status: ECreateOptionStatus.Success });

				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionSelected', 'Foo']
				]);
			});

			it('should complete on a success reported without loading first', async () => {
				await submitNewOption();

				await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' });

				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionSelected', 'insight-type-foo']
				]);
			});
		});

		describe('when the submit fails', () => {
			const getInputConfig = () => getCreateOption().inputConfig;

			it('should show why on the default create form, which stays open', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Loading });

				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

				expect(getInputConfig()).toEqual(expect.objectContaining({ state: EValidationState.Invalid, helpText: 'Already exists' }));
				expect(getCreateOption().loading).toBe(false);
				expect(component.isCreating).toBe(true);
				expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);
			});

			it('should show the invalid state alone for an error without a message', async () => {
				await submitNewOption();

				await setCreateOptionState({ status: ECreateOptionStatus.Error });

				expect(getInputConfig().state).toBe(EValidationState.Invalid);
				expect(getInputConfig().helpText).toBeUndefined();
			});

			it('should keep the configured text field options under the error', async () => {
				element.createOptionConfig = { inputConfig: { maxLength: 20, helpText: 'Up to 20 characters' } };
				await submitNewOption();

				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

				expect(getInputConfig()).toEqual(expect.objectContaining({ maxLength: 20, state: EValidationState.Invalid, helpText: 'Already exists' }));
			});

			it('should allow a new submit', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

				await submitNewOption();

				expect(emittedEvents).toEqual([
					['optionCreated', 'Foo'],
					['optionCreated', 'Foo']
				]);
			});

			it('should hide the error once the value is edited', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

				await typeNewOption('Bar');

				expect(getInputConfig().state).toBeUndefined();
				expect(getInputConfig().helpText).toBeUndefined();
			});

			it('should hide the earlier error on a new submit until the create state answers it', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });
				await typeNewOption('Bar');

				await submitNewOption();

				expect(getInputConfig().state).toBeUndefined();

				await setCreateOptionState({ status: ECreateOptionStatus.Loading });
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Name too long' });

				expect(getInputConfig()).toEqual(expect.objectContaining({ state: EValidationState.Invalid, helpText: 'Name too long' }));
			});

			it('should show the error again when the new submit fails the same way', async () => {
				await submitNewOption();
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });
				await typeNewOption('Bar');
				await submitNewOption();

				// The status is the same, so only a new object reaches the form
				await setCreateOptionState({ status: ECreateOptionStatus.Error, error: 'Already exists' });

				expect(getInputConfig()).toEqual(expect.objectContaining({ state: EValidationState.Invalid, helpText: 'Already exists' }));
			});
		});
	});

	describe('when the create state is reported from within the optionCreated listener', () => {
		// A listener that answers straight away, with no framework batching its update
		const reportFromListener = (createOptionState: ICreateOptionState): void => {
			element.addEventListener('optionCreated', () => (element.createOptionState = createOptionState), { once: true });
		};

		beforeEach(async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Idle } });
			await openCreateForm();
			await typeNewOption('Foo');
		});

		it('should show the reported error', async () => {
			reportFromListener({ status: ECreateOptionStatus.Error, error: 'Already exists' });

			await submitNewOption();

			expect(getCreateOption().inputConfig).toEqual(expect.objectContaining({ state: EValidationState.Invalid, helpText: 'Already exists' }));
			expect(component.isCreating).toBe(true);
		});

		it('should allow a new submit after the reported error', async () => {
			reportFromListener({ status: ECreateOptionStatus.Error, error: 'Already exists' });
			await submitNewOption();

			await submitNewOption();

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionCreated', 'Foo']
			]);
		});

		it('should complete on the reported success', async () => {
			reportFromListener({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' });

			await submitNewOption();

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionSelected', 'insight-type-foo']
			]);
			expect(component.isCreating).toBe(false);
		});
	});

	describe('when the create state is left over from an earlier submit', () => {
		it('should not complete on its success, only on a new one', async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Success, optionKey: 'insight-type-bar' } });
			await openCreateForm();
			await typeNewOption('Foo');
			await submitNewOption();

			// A render of the consumer hands the same status over again
			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-bar' });

			expect(emittedEvents).toEqual([['optionCreated', 'Foo']]);
			expect(component.isCreating).toBe(true);

			await setCreateOptionState({ status: ECreateOptionStatus.Loading });
			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' });

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionSelected', 'insight-type-foo']
			]);
		});

		it('should not show its error on a new create form', async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Error, error: 'Already exists' } });

			await openCreateForm();

			expect(getCreateOption().inputConfig.state).toBeUndefined();
			expect(getCreateOption().inputConfig.helpText).toBeUndefined();
		});
	});

	describe('when the create state reports a success with no create form open', () => {
		it('should emit nothing', async () => {
			await renderSelectMultiOptions({ createOptionState: { status: ECreateOptionStatus.Idle } });

			await setCreateOptionState({ status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' });

			expect(emittedEvents).toEqual([]);
			expect(createFormToggles).toEqual([]);
		});
	});

	describe('when the create form opens or closes', () => {
		beforeEach(() => renderSelectMultiOptions());

		it('should not emit createFormToggle on the initial load', () => {
			expect(createFormToggles).toEqual([]);
		});

		it('should emit createFormToggle once the create form has rendered', async () => {
			const isFormRendered = jest.fn();
			element.addEventListener('createFormToggle', () => isFormRendered(getCreateForm() !== null));

			component['selectOption'](ADD_OPTION.value);
			expect(createFormToggles).toEqual([]);

			await page.waitForChanges();

			expect(createFormToggles).toEqual([true]);
			expect(isFormRendered).toHaveBeenCalledTimes(1);
			expect(isFormRendered).toHaveBeenCalledWith(true);
		});

		it('should not bubble createFormToggle', async () => {
			const onDocumentCreateFormToggle = jest.fn();
			page.doc.addEventListener('createFormToggle', onDocumentCreateFormToggle);

			await openCreateForm();

			expect(onDocumentCreateFormToggle).not.toHaveBeenCalled();
		});

		it('should emit createFormToggle once while the create form stays open', async () => {
			await openCreateForm();

			component['selectOption'](ADD_OPTION.value);
			await setSearchValue('pump');

			expect(createFormToggles).toEqual([true]);
		});

		it.each<[string, () => Promise<unknown>]>([
			['a cancel', () => cancelNewOption()],
			['a submit', () => submitNewOption()],
			[
				'a success',
				async () => {
					element.createOptionState = { status: ECreateOptionStatus.Success, optionKey: 'insight-type-foo' };
				}
			],
			['closeCreatePopup', () => element.closeCreatePopup()],
			[
				'options can no longer be added',
				async () => {
					element.canAddItems = false;
				}
			]
		])('should emit createFormToggle once the create form is removed after %s', async (_trigger, closeCreateForm) => {
			await openCreateForm();
			await typeNewOption('Foo');
			const isFormRendered = jest.fn();
			element.addEventListener('createFormToggle', () => isFormRendered(getCreateForm() !== null));

			await closeCreateForm();
			await page.waitForChanges();

			expect(createFormToggles).toEqual([true, false]);
			expect(isFormRendered).toHaveBeenCalledTimes(1);
			expect(isFormRendered).toHaveBeenCalledWith(false);
		});

		it('should emit createFormToggle once when the create form is closed twice', async () => {
			await openCreateForm();

			await element.closeCreatePopup();
			await element.closeCreatePopup();
			await setSearchValue('pump');

			expect(createFormToggles).toEqual([true, false]);
		});

		it('should not emit createFormToggle when closing with no create form open', async () => {
			await element.closeCreatePopup();
			await page.waitForChanges();

			expect(createFormToggles).toEqual([]);
		});

		it('should emit createFormToggle again when the create form reopens', async () => {
			await openCreateForm();
			await cancelNewOption();

			await openCreateForm();

			expect(createFormToggles).toEqual([true, false, true]);
		});
	});

	describe('when the shortcuts are on and the create form is open', () => {
		beforeEach(async () => {
			await renderSelectMultiOptions({ shortcuts: true });
			// A real option stays highlighted behind the form, which a key reaching the list would select
			await pressDocumentKey('ArrowDown');
			await openCreateForm();
			await typeNewOption('Foo');
		});

		it('should not move the highlight on ArrowDown', async () => {
			await pressDocumentKey('ArrowDown');

			expect(component.highlightedOption).toBe('asset-pump');
			expect(component.createdOptionValue).toBe('Foo');
			expect(emittedEvents).toEqual([]);
		});

		it('should neither select the highlighted option nor reset the typed value on Enter', async () => {
			await pressDocumentKey('Enter');

			expect(emittedEvents).toEqual([]);
			expect(component.highlightedOption).toBe('asset-pump');
			expect(component.createdOptionValue).toBe('Foo');
			expect(component.isCreating).toBe(true);
		});

		it('should not dismiss on Escape', async () => {
			await pressDocumentKey('Escape');

			expect(emittedEvents).toEqual([]);
			expect(component.highlightedOption).toBe('asset-pump');
			expect(component.createdOptionValue).toBe('Foo');
			expect(component.isCreating).toBe(true);
		});
	});

	describe('when a key from inside the create form closes it', () => {
		// A form that handles its own keys closes before they reach the document
		const pressCreateFormKey = async (key: 'Enter' | 'Escape'): Promise<void> => {
			const formContainer = getShadowElement('.form-container');
			formContainer.addEventListener('keydown', () => dispatchCreateFormEvent(key === 'Enter' ? 'clickCreate' : 'clickCancel'));
			formContainer.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
			await page.waitForChanges();
		};

		beforeEach(async () => {
			await renderSelectMultiOptions({ shortcuts: true });
			await highlightAddOption();
			await pressDocumentKey('Enter');
			await typeNewOption('Foo');
		});

		it('should not reopen the create form on the Enter that submitted it', async () => {
			await pressCreateFormKey('Enter');

			expect(emittedEvents).toEqual([
				['optionCreated', 'Foo'],
				['optionSelected', 'Foo']
			]);
			expect(component.isCreating).toBe(false);
			expect(createFormToggles).toEqual([true, false]);
		});

		it('should not dismiss on the Escape that cancelled it', async () => {
			await pressCreateFormKey('Escape');

			expect(emittedEvents).toEqual([]);
			expect(component.isCreating).toBe(false);
			expect(component.highlightedOption).toBe(ADD_OPTION.value);
		});
	});
});
