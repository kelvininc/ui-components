export const DESCRIPTION_CONSUMERS = Object.freeze([
	{ name: 'text field', tag: 'kv-text-field', markup: '<kv-text-field accessible-label="Broker"></kv-text-field>', mode: 'direct', role: 'textbox', label: 'Broker' },
	{ name: 'text area', tag: 'kv-text-area', markup: '<kv-text-area accessible-label="Notes"></kv-text-area>', mode: 'direct', role: 'textbox', label: 'Notes' },
	{ name: 'radio', tag: 'kv-radio', markup: '<kv-radio label="Telemetry"></kv-radio>', mode: 'direct', role: 'radio', label: 'Telemetry' },
	{ name: 'checkbox', tag: 'kv-checkbox', markup: '<kv-checkbox label="TLS"></kv-checkbox>', mode: 'direct', role: 'checkbox', label: 'TLS' },
	{
		name: 'radio list item',
		tag: 'kv-radio-list-item',
		markup: '<kv-radio-list-item option-id="telemetry" label="Telemetry"></kv-radio-list-item>',
		mode: 'direct',
		role: 'radio',
		label: 'Telemetry'
	},
	{
		name: 'toggle button',
		tag: 'kv-toggle-button',
		markup: '<kv-toggle-button value="telemetry" label="Telemetry"></kv-toggle-button>',
		mode: 'direct',
		role: 'button',
		label: 'Telemetry'
	},
	{
		name: 'radio toggle',
		tag: 'kv-toggle-button',
		markup: '<kv-toggle-button value="telemetry" label="Telemetry" with-radio></kv-toggle-button>',
		mode: 'direct',
		role: 'radio',
		label: 'Telemetry'
	},
	{
		name: 'checkbox toggle',
		tag: 'kv-toggle-button',
		markup: '<kv-toggle-button value="telemetry" label="Telemetry" with-radio radio-control-type="checkbox"></kv-toggle-button>',
		mode: 'direct',
		role: 'checkbox',
		label: 'Telemetry'
	},
	{ name: 'search', tag: 'kv-search', markup: '<kv-search label="Broker"></kv-search>', mode: 'direct', role: 'textbox', label: 'Broker' },
	{ name: 'dropdown', tag: 'kv-dropdown', markup: '<kv-dropdown></kv-dropdown>', mode: 'input', role: 'textbox', label: 'Broker' },
	{
		name: 'time picker',
		tag: 'kv-time-picker',
		markup: '<kv-time-picker display-timezone-dropdown="false" display-calendar-toggle="false" display-customize-interval="false"></kv-time-picker>',
		mode: 'input',
		role: 'textbox',
		label: 'Time range'
	},
	{
		name: 'absolute time picker dropdown',
		tag: 'kv-absolute-time-picker-dropdown',
		markup: '<kv-absolute-time-picker-dropdown></kv-absolute-time-picker-dropdown>',
		mode: 'input',
		role: 'textbox',
		label: 'Start date'
	},
	{ name: 'create option', tag: 'kv-select-create-option', markup: '<kv-select-create-option></kv-select-create-option>', mode: 'input', role: 'textbox', label: 'Broker' },
	{
		name: 'single select',
		tag: 'kv-single-select-dropdown',
		markup: '<kv-single-select-dropdown accessible-label="Broker" auto-focus="false"></kv-single-select-dropdown>',
		mode: 'input',
		role: 'textbox',
		label: 'Broker'
	},
	{
		name: 'multi select',
		tag: 'kv-multi-select-dropdown',
		markup: '<kv-multi-select-dropdown accessible-label="Broker" auto-focus="false"></kv-multi-select-dropdown>',
		mode: 'input',
		role: 'textbox',
		label: 'Broker'
	},
	{ name: 'radio list', tag: 'kv-radio-list', markup: '<kv-radio-list></kv-radio-list>', mode: 'options', role: 'radio', label: 'Telemetry' },
	{ name: 'toggle group', tag: 'kv-toggle-button-group', markup: '<kv-toggle-button-group></kv-toggle-button-group>', mode: 'buttons', role: 'button', label: 'Telemetry' },
	{
		name: 'radio toggle group',
		tag: 'kv-toggle-button-group',
		markup: '<kv-toggle-button-group with-radio></kv-toggle-button-group>',
		mode: 'buttons',
		role: 'radio',
		label: 'Telemetry'
	},
	{ name: 'toggle switch', tag: 'kv-toggle-switch', markup: '<kv-toggle-switch></kv-toggle-switch>', mode: 'options', role: 'button', label: 'Telemetry' }
] as const);
