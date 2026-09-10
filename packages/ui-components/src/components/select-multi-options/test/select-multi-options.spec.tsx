import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import type { SpecPage } from '@stencil/core/testing';

import { KvSelectMultiOptions } from '../select-multi-options';
import { DEFAULT_SEARCH_DEBOUNCE_IN_MS } from '../select-multi-options.config';
import type { ISelectMultiOptions } from '../select-multi-options.types';

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
		expect(page.root.shadowRoot.querySelector('.no-results-found')).not.toBeNull();
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
