import { newSpecPage } from '@stencil/core/testing';
import { KvCheckbox } from '../../components/checkbox/checkbox';
import { KvDropdown } from '../../components/dropdown/dropdown';
import { KvMultiSelectDropdown } from '../../components/multi-select-dropdown/multi-select-dropdown';
import { KvRadio } from '../../components/radio/radio';
import { KvRadioList } from '../../components/radio-list/radio-list';
import { KvRadioListItem } from '../../components/radio-list-item/radio-list-item';
import { KvSearch } from '../../components/search/search';
import { KvSelect } from '../../components/select/select';
import { KvSelectCreateOption } from '../../components/select-create-option/select-create-option';
import { KvSingleSelectDropdown } from '../../components/single-select-dropdown/single-select-dropdown';
import { KvTextArea } from '../../components/text-area/text-area';
import { KvTextField } from '../../components/text-field/text-field';
import { KvToggleButton } from '../../components/toggle-button/toggle-button';
import { KvToggleButtonGroup } from '../../components/toggle-button-group/toggle-button-group';
import { KvToggleSwitch } from '../../components/toggle-switch/toggle-switch';
import { DESCRIPTION_CONSUMERS } from './accessible-description.matrix';

const components = [
	KvCheckbox,
	KvDropdown,
	KvMultiSelectDropdown,
	KvRadio,
	KvRadioList,
	KvRadioListItem,
	KvSearch,
	KvSelectCreateOption,
	KvSingleSelectDropdown,
	KvTextArea,
	KvTextField,
	KvToggleButton,
	KvToggleButtonGroup,
	KvToggleSwitch
];

const valueControl = (host: HTMLElement): HTMLKvTextFieldElement => {
	if (['kv-text-field', 'kv-text-area', 'kv-radio'].includes(host.localName) || (host.localName === 'kv-toggle-button' && !(host as HTMLKvToggleButtonElement).withRadio)) {
		return host as HTMLKvTextFieldElement;
	}
	for (const child of Array.from(host.shadowRoot?.children ?? host.children)) {
		const found = valueControl(child as HTMLElement);
		if (found) return found;
	}
	return undefined;
};

describe.each(DESCRIPTION_CONSUMERS)('description configuration: $name', row => {
	it('forwards readonly element references without reflecting them into an attribute', async () => {
		const page = await newSpecPage({ components, html: row.markup });
		const references = Object.freeze([document.createElement('div')]);
		const configure = (elements?: readonly Element[]) => {
			if (row.mode === 'input') page.root.inputConfig = { accessibleLabel: 'Broker', accessibleDescriptionElements: elements };
			else if (row.mode === 'buttons') page.root.buttons = [{ value: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: elements }];
			else if (row.mode === 'options') {
				page.root.options = [
					row.tag === 'kv-radio-list'
						? { optionId: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: elements }
						: { value: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: elements }
				];
			} else page.root.accessibleDescriptionElements = elements;
		};
		configure(references);
		await page.waitForChanges();
		const control = valueControl(page.root);
		expect(control).toBeDefined();
		expect(control.accessibleDescriptionElements).toEqual(references);
		expect(control.accessibleDescriptionElements[0]).toBe(references[0]);
		expect(control.hasAttribute('accessible-description-elements')).toBe(false);
		configure();
		await page.waitForChanges();
		expect(valueControl(page.root).accessibleDescriptionElements).toBeUndefined();
	});
});

describe('accessible description baseline: searchable select', () => {
	it('keeps its search input undescribed and forwards controlled search changes', async () => {
		const page = await newSpecPage({
			components: [KvSelect, KvSearch, KvTextField],
			html: '<kv-select searchable search-value="broker" search-placeholder="Find assets"></kv-select>'
		});
		const host = page.root as HTMLKvSelectElement;
		const field = valueControl(host);
		const input = field.shadowRoot.querySelector('input');
		const searchChange = jest.fn((event: CustomEvent<string>) => (host.searchValue = event.detail));
		host.addEventListener('searchChange', searchChange);
		expect(field.accessibleDescriptionElements).toBeUndefined();
		expect(input.getAttribute('aria-describedby')).toBeNull();
		expect(input.getAttribute('aria-label')).toBeNull();
		expect(input.placeholder).toBe('Find assets');
		input.value = 'telemetry';
		input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		await page.waitForChanges();
		expect(searchChange).toHaveBeenCalledTimes(1);
		expect(searchChange.mock.calls[0][0].detail).toBe('telemetry');
		expect(host.searchValue).toBe('telemetry');
		expect(field.value).toBe('telemetry');
		expect(input.value).toBe('telemetry');
		expect(field.accessibleDescriptionElements).toBeUndefined();
		expect(input.getAttribute('aria-describedby')).toBeNull();
	});
});
