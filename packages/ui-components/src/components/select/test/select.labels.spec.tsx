import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { KvSelect } from '../select';
import { CLEAR_SELECTION_LABEL, SELECT_ALL_LABEL } from '../select.config';
import { SELECT_LABEL_SHAPES } from './select.labels.matrix';

const renderSelect = () =>
	newSpecPage({
		components: [KvSelect],
		template: () => <kv-select selectionAll selectionAllEnabled selectionClearable selectionClearEnabled />
	});

const actionTexts = (host: HTMLElement) => Array.from(host.shadowRoot.querySelectorAll('kv-action-button-text')).map(action => action.getAttribute('text'));

describe.each(SELECT_LABEL_SHAPES)('select action labels: $name', row => {
	it('renders core defaults for missing labels and preserves explicit text', async () => {
		const page = await renderSelect();
		Object.assign(page.root, row.labels);
		await page.waitForChanges();
		expect(actionTexts(page.root)).toEqual(row.expected);
	});
});

describe.each([undefined, null])('select label removal: %s', removed => {
	it('restores defaults on the same select and keeps action states', async () => {
		const page = await renderSelect();
		const host = page.root;
		Object.assign(host, { clearSelectionLabel: 'Clear topics', selectAllLabel: 'Select every topic' });
		await page.waitForChanges();
		expect(actionTexts(host)).toEqual(['Select every topic', 'Clear topics']);
		Object.assign(host, { clearSelectionLabel: removed, selectAllLabel: removed, selectionClearEnabled: false, selectionAllEnabled: false });
		await page.waitForChanges();
		expect(page.root).toBe(host);
		expect(actionTexts(host)).toEqual([SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL]);
		expect(Array.from(host.shadowRoot.querySelectorAll('kv-action-button-text')).every(action => action.hasAttribute('disabled'))).toBe(true);
	});
});
