import { newSpecPage } from '@stencil/core/testing';
import { KvSelectShortcutsLabel } from '../select-shortcuts-label';

const getLabels = (page: { root?: HTMLElement }): string[] => Array.from(page.root?.querySelectorAll('.label') ?? []).map(label => label.textContent);

describe('Select Shortcuts Label', () => {
	it('should not advertise the range shortcut by default', async () => {
		const page = await newSpecPage({
			components: [KvSelectShortcutsLabel],
			html: '<kv-select-shortcuts-label></kv-select-shortcuts-label>'
		});

		expect(getLabels(page)).toEqual(['To navigate', 'To select', 'To dismiss']);
	});

	it('should advertise the range shortcut when range selection is enabled', async () => {
		const page = await newSpecPage({
			components: [KvSelectShortcutsLabel],
			html: '<kv-select-shortcuts-label range-selection="true"></kv-select-shortcuts-label>'
		});

		expect(getLabels(page)).toEqual(['To navigate', 'To select', 'To select a range', 'To dismiss']);
	});
});
