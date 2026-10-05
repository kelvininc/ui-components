/** Shared rows for the public focus and naming contracts. */
export const CONTROL_NAMES = Object.freeze([
	{ name: 'accessible name without a visible label', label: undefined, expected: 'Connection name' },
	{ name: 'empty visible label', label: '', expected: 'Connection name' },
	{ name: 'whitespace visible label', label: '   ', expected: 'Connection name' },
	{ name: 'visible label wins', label: 'Broker', expected: 'Broker' }
]);

export const TEXT_FIELD_FOCUS = Object.freeze([
	{ name: 'enabled', attributes: '', focused: true, editable: true },
	{ name: 'readonly', attributes: 'input-readonly', focused: true, editable: false },
	{ name: 'disabled', attributes: 'input-disabled', focused: false, editable: false },
	{ name: 'loading', attributes: 'loading', focused: false, editable: false }
]);

export const SELECT_CONTROLS = Object.freeze(['kv-single-select-dropdown', 'kv-multi-select-dropdown'] as const);
export const ACTIVATION_KEYS = Object.freeze(['Enter', 'Space'] as const);

export const DROPDOWN_FOCUS_FLAGS = Object.freeze([
	{ name: 'enabled', config: {}, expected: 'Assets' },
	{ name: 'input disabled', config: { inputDisabled: true }, expected: 'before' },
	{ name: 'loading', config: { loading: true }, expected: 'before' }
]);

export const GROUP_FOCUS = Object.freeze([
	{ name: 'selected enabled', selected: 'commands', disabled: [], empty: false, expected: 'Commands' },
	{ name: 'unselected', selected: undefined, disabled: [], empty: false, expected: 'Telemetry' },
	{ name: 'disabled selection', selected: 'commands', disabled: ['commands'], empty: false, expected: 'Telemetry' },
	{ name: 'first disabled', selected: undefined, disabled: ['telemetry'], empty: false, expected: 'Alarms' },
	{ name: 'all disabled', selected: 'commands', disabled: ['telemetry', 'alarms', 'commands'], empty: false, expected: 'before' },
	{ name: 'empty', selected: undefined, disabled: [], empty: true, expected: 'before' }
]);

export const TEXT_FIELD_CONSUMERS = Object.freeze([
	{ name: 'search', markup: '<kv-search label="Broker"></kv-search>', selector: 'kv-search', method: 'focusInput', event: 'textChange' },
	{ name: 'create option', markup: '<kv-select-create-option></kv-select-create-option>', selector: 'kv-select-create-option', method: 'focusInput', event: 'valueChanged' }
]);

export const DROPDOWN_CONSUMERS = Object.freeze([
	{ name: 'time picker', markup: '<kv-time-picker></kv-time-picker>', selector: 'kv-time-picker', shadow: false },
	{
		name: 'absolute time dropdown',
		markup: '<kv-absolute-time-picker-dropdown></kv-absolute-time-picker-dropdown>',
		selector: 'kv-absolute-time-picker-dropdown',
		shadow: false
	},
	{
		name: 'relative time timezone',
		markup: '<kv-relative-time-picker timezone-content-visible></kv-relative-time-picker>',
		selector: 'kv-relative-time-picker',
		shadow: true
	}
]);

[...CONTROL_NAMES, ...TEXT_FIELD_FOCUS, ...GROUP_FOCUS, ...TEXT_FIELD_CONSUMERS, ...DROPDOWN_CONSUMERS, ...DROPDOWN_FOCUS_FLAGS].forEach(row => {
	Object.values(row).forEach(value => {
		if (value && typeof value === 'object') Object.freeze(value);
	});
	Object.freeze(row);
});
