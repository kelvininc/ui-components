import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { KvMultiSelectDropdown } from '../multi-select-dropdown';
import { KvDropdown } from '../../dropdown/dropdown';
import { ISelectMultiOptions } from '../../select-multi-options/select-multi-options.types';

const OPTIONS: ISelectMultiOptions = {
	'option-1': { label: 'Option 1', value: 'option-1' },
	'option-2': { label: 'Option 2', value: 'option-2' }
};

describe('Multi Select Dropdown (unit tests)', () => {
	let page: SpecPage;
	let comp: KvMultiSelectDropdown;

	// The list is the inner dropdown's: it reports a click on the trigger, an Escape and a click outside
	const getDropdown = (): HTMLKvDropdownElement => page.root.querySelector('kv-dropdown');

	// Reports an open state as the inner dropdown does, which is every way the list opens or closes by itself
	const reportOpenState = async (state: boolean): Promise<void> => {
		getDropdown().dispatchEvent(new CustomEvent('openStateChange', { detail: state, bubbles: true }));
		await page.waitForChanges();
	};

	const search = async (searchValue: string): Promise<void> => {
		page.root.querySelector('kv-select-multi-options').dispatchEvent(new CustomEvent('searchChange', { detail: searchValue }));
		await page.waitForChanges();
	};

	const setIsOpen = async (isOpen: boolean): Promise<void> => {
		page.root.isOpen = isOpen;
		await page.waitForChanges();
	};

	beforeEach(async () => {
		page = await newSpecPage({
			// The dropdown holding the list is loaded too: it is what carries the open state in and out
			components: [KvMultiSelectDropdown, KvDropdown],
			template: () => <kv-multi-select-dropdown options={OPTIONS} autoFocus={false} />
		});
		comp = page.rootInstance;

		// Only the dropdown itself is loaded here, so the list it holds is an element without its own methods
		const selectElement = page.root.querySelector('kv-select-multi-options');
		selectElement.clearHighlightedOption = jest.fn();
		selectElement.focusSearch = jest.fn();

		jest.spyOn(comp.openStateChange, 'emit');
		jest.spyOn(comp.searchChange, 'emit');
	});

	it('should start with its list closed', () => {
		expect(comp.isOpen).toBe(false);
		expect(getDropdown().isOpen).toBe(false);
	});

	it('should report its list opening', async () => {
		await reportOpenState(true);

		expect(comp.openStateChange.emit).toHaveBeenCalledWith(true);
		expect(comp.isOpen).toBe(true);
		expect(getDropdown().isOpen).toBe(true);
	});

	it('should report its list closing', async () => {
		await reportOpenState(true);
		await reportOpenState(false);

		expect(comp.openStateChange.emit).toHaveBeenLastCalledWith(false);
		expect(comp.isOpen).toBe(false);
		expect(getDropdown().isOpen).toBe(false);
	});

	it('should report a dismiss as its list closing', async () => {
		await reportOpenState(true);
		page.root.querySelector('kv-select-multi-options').dispatchEvent(new CustomEvent('dismiss'));
		await page.waitForChanges();

		expect(comp.openStateChange.emit).toHaveBeenLastCalledWith(false);
		expect(comp.isOpen).toBe(false);
	});

	it('should open its list when the host asks for it', async () => {
		await setIsOpen(true);

		expect(getDropdown().isOpen).toBe(true);
	});

	it('should close its list when the host asks for it', async () => {
		await reportOpenState(true);
		await setIsOpen(false);

		expect(getDropdown().isOpen).toBe(false);
	});

	it('should not report back an open state the host set itself', async () => {
		await setIsOpen(true);
		await setIsOpen(false);

		expect(comp.openStateChange.emit).not.toHaveBeenCalled();
	});

	it('should stop the request it acts on from reaching its host twice', async () => {
		const hostOpenStates: boolean[] = [];
		page.root.addEventListener('openStateChange', ({ detail }: CustomEvent<boolean>) => hostOpenStates.push(detail));

		await reportOpenState(true);
		await reportOpenState(false);

		// The dropdown's own two emits, and neither of the requests it acted on
		expect(hostOpenStates).toEqual([true, false]);
	});

	it('should ignore an open state a dropdown slotted into its trigger reports', async () => {
		const slottedDropdown = page.doc.createElement('kv-dropdown');
		getDropdown().appendChild(slottedDropdown);

		slottedDropdown.dispatchEvent(new CustomEvent('openStateChange', { detail: true, bubbles: true }));
		await page.waitForChanges();

		expect(comp.isOpen).toBe(false);
		expect(comp.openStateChange.emit).not.toHaveBeenCalled();
	});

	it('should drop the search when the host closes its list', async () => {
		await reportOpenState(true);
		await search('option-2');
		await setIsOpen(false);

		expect(comp.searchChange.emit).toHaveBeenLastCalledWith('');
	});

	it('should drop the search only once when it closes its list itself', async () => {
		await reportOpenState(true);
		await search('option-2');
		(comp.searchChange.emit as jest.Mock).mockClear();

		await reportOpenState(false);

		expect(comp.searchChange.emit).toHaveBeenCalledTimes(1);
		expect(comp.searchChange.emit).toHaveBeenCalledWith('');
	});

	it('should clear the highlighted option whenever its list opens or closes', async () => {
		const { clearHighlightedOption } = page.root.querySelector('kv-select-multi-options');

		await reportOpenState(true);
		await reportOpenState(false);

		expect(clearHighlightedOption).toHaveBeenCalled();
	});
});
