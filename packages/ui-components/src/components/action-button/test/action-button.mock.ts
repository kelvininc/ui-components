export const ACTIVATION_KEYS = ['Enter', ' '] as const;
export const ACTIVATION_MODIFIERS = ['altKey', 'ctrlKey', 'metaKey'] as const;

export const ACTION_BUTTON_VARIANTS = [
	{
		name: 'base text',
		tag: 'kv-action-button',
		html: '<kv-action-button type="primary">Deploy connector</kv-action-button>',
		buttonName: 'Deploy connector',
		event: 'clickButton'
	},
	{
		name: 'base explicit name',
		tag: 'kv-action-button',
		html: '<kv-action-button type="tertiary" accessible-label="Remove broker">Remove</kv-action-button>',
		buttonName: 'Remove broker',
		event: 'clickButton'
	},
	{
		name: 'icon',
		tag: 'kv-action-button-icon',
		html: '<kv-action-button-icon type="tertiary" icon="kv-delete" accessible-label="Remove broker"></kv-action-button-icon>',
		buttonName: 'Remove broker',
		event: 'clickButton'
	},
	{
		name: 'text',
		tag: 'kv-action-button-text',
		html: '<kv-action-button-text type="primary" text="Save connection"></kv-action-button-text>',
		buttonName: 'Save connection',
		event: 'clickButton'
	},
	{
		name: 'text explicit name',
		tag: 'kv-action-button-text',
		html: '<kv-action-button-text type="primary" text="Save" accessible-label="Save connection"></kv-action-button-text>',
		buttonName: 'Save connection',
		event: 'clickButton'
	},
	{
		name: 'magic text',
		tag: 'kv-action-button-magic',
		html: '<kv-action-button-magic type="primary" text="Save connection"></kv-action-button-magic>',
		buttonName: 'Save connection',
		event: 'clickButton'
	},
	{
		name: 'magic icon',
		tag: 'kv-action-button-magic',
		html: '<kv-action-button-magic type="tertiary" icon="kv-delete" accessible-label="Remove broker"></kv-action-button-magic>',
		buttonName: 'Remove broker',
		event: 'clickButton'
	},
	{
		name: 'split primary',
		tag: 'kv-action-button-split',
		html: '<kv-action-button-split type="primary" text="Deploy connector" split-icon="kv-arrow-drop-down"></kv-action-button-split>',
		buttonName: 'Deploy connector',
		event: 'clickLeftButton'
	},
	{
		name: 'split secondary',
		tag: 'kv-action-button-split',
		html: '<kv-action-button-split type="primary" text="Deploy connector" split-icon="kv-arrow-drop-down"></kv-action-button-split>',
		buttonName: 'More options',
		event: 'clickRightButton'
	},
	{
		name: 'split explicit names',
		tag: 'kv-action-button-split',
		html: '<kv-action-button-split type="primary" text="Deploy" accessible-label="Deploy connector" split-accessible-label="Deployment options" split-icon="kv-arrow-drop-down"></kv-action-button-split>',
		buttonName: 'Deployment options',
		event: 'clickRightButton'
	}
] as const;

export const ACTION_BUTTON_CONSUMERS: readonly {
	name: string;
	tag: string;
	html: string;
	buttonName: string;
	event: string;
	props?: Record<string, unknown>;
	setup?: 'edit' | 'option-action';
}[] = [
	{ name: 'alert close', tag: 'kv-alert', html: '<kv-alert type="info" label="Connector saved" closable></kv-alert>', buttonName: 'Close', event: 'clickCloseButton' },
	{ name: 'toaster close', tag: 'kv-toaster', html: '<kv-toaster type="info" header="Connector saved"></kv-toaster>', buttonName: 'Close', event: 'clickCloseButton' },
	{
		name: 'inline discard',
		tag: 'kv-inline-editable-field',
		html: '<kv-inline-editable-field value="Connection"><div>Connection</div></kv-inline-editable-field>',
		buttonName: 'Discard changes',
		event: 'clickButton',
		setup: 'edit'
	},
	{
		name: 'inline save',
		tag: 'kv-inline-editable-field',
		html: '<kv-inline-editable-field value="Connection"><div>Connection</div></kv-inline-editable-field>',
		buttonName: 'Save changes',
		event: 'contentEdited',
		setup: 'edit'
	},
	{
		name: 'create cancel',
		tag: 'kv-select-create-option',
		html: '<kv-select-create-option value="Compressor"></kv-select-create-option>',
		buttonName: 'Cancel',
		event: 'clickCancel'
	},
	{
		name: 'create option',
		tag: 'kv-select-create-option',
		html: '<kv-select-create-option value="Compressor"></kv-select-create-option>',
		buttonName: 'Create option',
		event: 'clickCreate'
	},
	{
		name: 'select option action',
		tag: 'kv-select-option',
		html: '<kv-select-option label="Compressor" value="compressor"></kv-select-option>',
		buttonName: 'Remove compressor',
		event: 'clickButton',
		setup: 'option-action'
	},
	{ name: 'select all', tag: 'kv-select', html: '<kv-select selection-all selection-all-enabled></kv-select>', buttonName: 'Select all', event: 'selectAll' },
	{ name: 'select clear', tag: 'kv-select', html: '<kv-select selection-clearable selection-clear-enabled></kv-select>', buttonName: 'Clear all', event: 'clearSelection' },
	{
		name: 'absolute picker back',
		tag: 'kv-absolute-time-picker',
		html: '<kv-absolute-time-picker></kv-absolute-time-picker>',
		props: { displayBackButton: true },
		buttonName: 'Back',
		event: 'backButtonClicked'
	},
	{
		name: 'absolute dropdown cancel',
		tag: 'kv-absolute-time-picker-dropdown',
		html: '<kv-absolute-time-picker-dropdown></kv-absolute-time-picker-dropdown>',
		props: { dropdownOpen: true },
		buttonName: 'Cancel',
		event: 'cancelClicked'
	},
	{ name: 'time picker cancel', tag: 'kv-time-picker', html: '<kv-time-picker is-open show-calendar></kv-time-picker>', buttonName: 'Cancel', event: 'cancelClicked' },
	{
		name: 'wizard footer next',
		tag: 'kv-wizard-footer',
		html: '<kv-wizard-footer show-step-bar="false" show-next-btn next-enabled></kv-wizard-footer>',
		buttonName: 'Next',
		event: 'nextClick'
	}
];
