type PasteCase = {
	name: string;
	initial: string;
	pasted: string;
	limit?: number;
	allowed: boolean;
	disabled?: boolean;
};

export const PASTE_CASES: readonly PasteCase[] = Object.freeze(
	[
		{ name: 'no limit', initial: 'Broker', pasted: ' notes', allowed: true },
		{ name: 'multiple lines', initial: 'Broker', pasted: ' notes\nTLS required', allowed: true },
		{ name: 'blank line', initial: '', pasted: '\n', allowed: true },
		{ name: 'spaces', initial: '', pasted: '  ', allowed: true },
		{ name: 'zero limit', initial: 'Broker', pasted: ' notes', limit: 0, allowed: true },
		{ name: 'below the limit', initial: 'Broker', pasted: ' notes', limit: 13, allowed: true },
		{ name: 'at the limit', initial: 'Broker', pasted: ' notes', limit: 12, allowed: true },
		{ name: 'over the limit', initial: 'Broker', pasted: ' notes', limit: 11, allowed: false },
		{ name: 'Unicode code points', initial: 'TLS', pasted: '🔒', limit: 4, allowed: true }
	].map(row => Object.freeze(row))
);

export const CLIPBOARD_CASES: readonly PasteCase[] = Object.freeze([
	...PASTE_CASES.filter(row => row.name !== 'below the limit'),
	Object.freeze({ name: 'disabled editing', initial: 'Broker', pasted: ' notes', allowed: false, disabled: true })
]);

export const CONTROLLED_TEXT_CASES = Object.freeze(
	[false, true].flatMap(disabled =>
		[
			{ name: 'replacement', text: 'TLS required', expected: 'TLS required' },
			{ name: 'multiline Unicode', text: 'é🚀\nTLS required', expected: 'é🚀\nTLS required' },
			{ name: 'empty string', text: '', expected: '' },
			{ name: 'undefined', text: undefined, expected: '' },
			{ name: 'newline', text: '\n', expected: '\n' },
			{ name: 'consecutive spaces', text: 'CA  notes', expected: 'CA  notes' },
			{ name: 'multiline whitespace', text: '  CA\nTLS  ', expected: '  CA\nTLS  ' }
		].map(row => Object.freeze({ ...row, disabled, name: `${row.name}, disabled=${disabled}` }))
	)
);

export const REPLACEMENT_CASES = Object.freeze([
	Object.freeze({ name: 'whole field at the limit', initial: 'CAB', selection: 'all', replacement: 'TLS', limit: 3, typed: 'TLS', pasted: 'TLS' }),
	Object.freeze({ name: 'last character at the limit', initial: 'CAB', selection: 'last', replacement: 'X', limit: 3, typed: 'CAX', pasted: 'CAX' }),
	Object.freeze({ name: 'selected Unicode code point', initial: 'Aé🚀', selection: 'last', replacement: 'Z', limit: 3, typed: 'AéZ', pasted: 'AéZ' }),
	Object.freeze({ name: 'partial replacement overflow', initial: 'CAB', selection: 'last', replacement: 'XY', limit: 3, typed: 'CAX', pasted: 'CAB' }),
	Object.freeze({ name: 'whole replacement overflow', initial: 'CAB', selection: 'all', replacement: 'TLSX', limit: 3, typed: 'TLS', pasted: 'CAB' }),
	Object.freeze({ name: 'Unicode replacement at the limit', initial: 'CAB', selection: 'all', replacement: 'é🚀A', limit: 3, typed: 'é🚀A', pasted: 'é🚀A' }),
	Object.freeze({ name: 'selected multiline text', initial: 'CA\nB', selection: 'all', replacement: 'TLS', limit: 4, typed: 'TLS', pasted: 'TLS' })
]);

export const SELECTION_SCOPE_CASES = Object.freeze([
	Object.freeze({ name: 'selection inside the control', composed: false, anchorInside: true, focusInside: true, selected: true, allowed: true }),
	Object.freeze({ name: 'selection outside the control', composed: false, anchorInside: false, focusInside: false, selected: true, allowed: false }),
	Object.freeze({ name: 'selection ending outside the control', composed: false, anchorInside: true, focusInside: false, selected: true, allowed: false }),
	Object.freeze({ name: 'selection starting outside the control', composed: false, anchorInside: false, focusInside: true, selected: true, allowed: false }),
	Object.freeze({ name: 'no selection', composed: false, anchorInside: false, focusInside: false, selected: false, allowed: false }),
	Object.freeze({ name: 'composed selection inside the control', composed: true, anchorInside: true, focusInside: true, selected: true, allowed: true }),
	Object.freeze({ name: 'composed selection ending outside the control', composed: true, anchorInside: true, focusInside: false, selected: true, allowed: false }),
	Object.freeze({ name: 'composed selection starting outside the control', composed: true, anchorInside: false, focusInside: true, selected: true, allowed: false })
]);
