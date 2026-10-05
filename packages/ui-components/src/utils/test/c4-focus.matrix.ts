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

export const TOGGLE_NAMES = Object.freeze([
	{ name: 'icon-only accessible label', label: undefined, tooltip: undefined, accessibleLabel: 'Add telemetry', expected: 'Add telemetry' },
	{ name: 'explicit label wins', label: 'Telemetry', tooltip: 'Choose a topic', accessibleLabel: 'Telemetry topic', expected: 'Telemetry topic' },
	{ name: 'visible label fallback', label: 'Telemetry', tooltip: 'Choose a topic', accessibleLabel: undefined, expected: 'Telemetry' },
	{ name: 'tooltip fallback', label: undefined, tooltip: 'Add telemetry', accessibleLabel: undefined, expected: 'Add telemetry' },
	{ name: 'empty accessible label fallback', label: 'Telemetry', tooltip: undefined, accessibleLabel: '', expected: 'Telemetry' }
]);

export const TOGGLE_CONTROL_MODES = Object.freeze([
	{ name: 'plain', withRadio: false, controlType: 'radio', role: 'button' },
	{ name: 'radio', withRadio: true, controlType: 'radio', role: 'radio' },
	{ name: 'checkbox', withRadio: true, controlType: 'checkbox', role: 'checkbox' }
]);

export const TOGGLE_NAME_CONSUMERS = Object.freeze([
	...TOGGLE_CONTROL_MODES.map(mode => ({ ...mode, tag: 'kv-toggle-button-group' })),
	{ name: 'switch', withRadio: false, controlType: 'radio', role: 'button', tag: 'kv-toggle-switch' }
]);

export const DROPDOWN_FOCUS_FLAGS = Object.freeze([
	{ name: 'enabled', config: {}, expected: 'Assets' },
	{ name: 'input disabled', config: { inputDisabled: true }, expected: 'before' },
	{ name: 'loading', config: { loading: true }, expected: 'before' }
]);

export const CUSTOM_ACTION_FOCUS = Object.freeze([
	{ name: 'fallback input disabled', config: { inputDisabled: true }, disabled: false },
	{ name: 'fallback input loading', config: { loading: true }, disabled: false },
	{ name: 'dropdown disabled', config: {}, disabled: true }
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

[
	...CONTROL_NAMES,
	...TEXT_FIELD_FOCUS,
	...GROUP_FOCUS,
	...TEXT_FIELD_CONSUMERS,
	...DROPDOWN_CONSUMERS,
	...DROPDOWN_FOCUS_FLAGS,
	...CUSTOM_ACTION_FOCUS,
	...TOGGLE_NAMES,
	...TOGGLE_CONTROL_MODES,
	...TOGGLE_NAME_CONSUMERS
].forEach(row => {
	Object.values(row).forEach(value => {
		if (value && typeof value === 'object') Object.freeze(value);
	});
	Object.freeze(row);
});
