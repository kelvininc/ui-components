import { CLEAR_SELECTION_LABEL, SELECT_ALL_LABEL } from '../select.config';

type Labels = Partial<Record<'clearSelectionLabel' | 'selectAllLabel', string | null | undefined>>;
type LabelShape = { name: string; labels: Labels; expected: readonly [string, string] };

export const SELECT_LABEL_SHAPES: readonly LabelShape[] = Object.freeze(
	[
		{ name: 'omitted', labels: {}, expected: [SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL] },
		{ name: 'undefined', labels: { clearSelectionLabel: undefined, selectAllLabel: undefined }, expected: [SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL] },
		{ name: 'null', labels: { clearSelectionLabel: null, selectAllLabel: null }, expected: [SELECT_ALL_LABEL, CLEAR_SELECTION_LABEL] },
		{ name: 'custom', labels: { clearSelectionLabel: 'Clear topics', selectAllLabel: 'Select every topic' }, expected: ['Select every topic', 'Clear topics'] },
		{ name: 'clear override', labels: { clearSelectionLabel: 'Clear topics' }, expected: [SELECT_ALL_LABEL, 'Clear topics'] },
		{ name: 'select-all override', labels: { selectAllLabel: 'Select every topic' }, expected: ['Select every topic', CLEAR_SELECTION_LABEL] },
		{ name: 'empty strings', labels: { clearSelectionLabel: '', selectAllLabel: '' }, expected: ['', ''] }
	].map(row => Object.freeze({ ...row, labels: Object.freeze(row.labels), expected: Object.freeze(row.expected) })) as LabelShape[]
);

const options = Object.freeze({
	north: Object.freeze({ value: 'north', label: 'North line' }),
	south: Object.freeze({ value: 'south', label: 'South line' })
});

export const SELECT_LABEL_CONSUMERS = Object.freeze([
	{ tag: 'kv-select', dropdown: false, props: { selectionClearEnabled: true, selectionAllEnabled: true } },
	{ tag: 'kv-select-multi-options', dropdown: false, props: { options, selectedOptions: { north: true }, searchable: false } },
	{ tag: 'kv-single-select-dropdown', dropdown: true, props: { options, selectedOption: 'north', searchable: false } },
	{ tag: 'kv-multi-select-dropdown', dropdown: true, props: { options, selectedOptions: { north: true }, searchable: false } }
]);
SELECT_LABEL_CONSUMERS.forEach(row => {
	Object.values(row.props).forEach(value => {
		if (value && typeof value === 'object') Object.freeze(value);
	});
	Object.freeze(row.props);
	Object.freeze(row);
});
