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

export const NATIVE_INPUT_CASES = Object.freeze(
	[
		{ name: 'Unicode insertion overflow', initial: 'AB', selection: 'end', inserted: '🚀X', limit: 3, expected: 'AB' },
		{ name: 'Unicode insertion at the limit', initial: 'AB', selection: 'end', inserted: '🚀', limit: 3, expected: 'AB🚀' },
		{ name: 'Unicode whole-field replacement', initial: 'CAB', selection: 'all', inserted: 'é🚀A', limit: 3, expected: 'é🚀A' },
		{ name: 'partial native replacement overflow', initial: 'CAB', selection: 'last', inserted: '🚀X', limit: 3, expected: 'CAB' },
		{ name: 'whole native replacement overflow', initial: 'CAB', selection: 'all', inserted: 'é🚀AB', limit: 3, expected: 'CAB' },
		{ name: 'unlimited native insertion', initial: 'AB', selection: 'end', inserted: '🚀X', limit: undefined, expected: 'AB🚀X' },
		{ name: 'zero native limit', initial: 'AB', selection: 'end', inserted: '🚀X', limit: 0, expected: 'AB🚀X' }
	].map(row => Object.freeze(row))
);

export const COMPOSITION_CASES = Object.freeze(
	[
		{ name: 'draft exceeds cap before a valid commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日', limit: 3, expected: 'AB日' },
		{ name: 'overflowing IME commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: 3, expected: 'AB' },
		{ name: 'IME replaces the whole field', initial: 'CAB', selection: 'all', draft: 'にほんご', committed: '日本語', limit: 3, expected: '日本語' },
		{ name: 'canceled IME draft', initial: 'AB', selection: 'end', draft: 'にほん', committed: '', limit: 3, expected: 'AB' },
		{ name: 'unlimited IME commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: undefined, expected: 'AB日本' },
		{ name: 'zero IME limit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: 0, expected: 'AB日本' }
	].map(row => Object.freeze(row))
);

export const INPUT_FALLBACK_CASES = Object.freeze(
	[
		{ name: 'non-cancelable insertion overflow', initial: 'AB', incoming: 'AB🚀X', inputType: 'insertText', expected: 'AB' },
		{ name: 'non-cancelable insertion at the limit', initial: 'AB', incoming: 'AB🚀', inputType: 'insertText', expected: 'AB🚀' },
		{ name: 'deleting from an external over-limit value', initial: 'CABDX', incoming: 'CABD', inputType: 'deleteContentBackward', expected: 'CABD' },
		{ name: 'inserting into an external over-limit value', initial: 'CABD', incoming: 'CABDX', inputType: 'insertText', expected: 'CABD' }
	].map(row => Object.freeze(row))
);
