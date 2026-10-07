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
			{ name: 'newline', text: '\n', expected: '\n' }
		].map(row => Object.freeze({ ...row, disabled, name: `${row.name}, disabled=${disabled}` }))
	)
);
