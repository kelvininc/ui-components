import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import type { SpecPage } from '@stencil/core/testing';

import { KvSelectMultiOptions } from '../select-multi-options';
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
			template: () => <kv-select-multi-options options={OPTIONS} minSearchOptions={0} />
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
});
