import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { KvTextField } from '../../components/text-field/text-field';
import { KvSingleSelectDropdown } from '../../components/single-select-dropdown/single-select-dropdown';
import { KvMultiSelectDropdown } from '../../components/multi-select-dropdown/multi-select-dropdown';
import { KvSwitchButton } from '../../components/switch-button/switch-button';
import { CONTROL_NAMES } from './c4-focus.matrix';

describe.each(CONTROL_NAMES)('C4 text field name: $name', row => {
	it('names the input without duplicating an accessible-only label visually', async () => {
		const page = await newSpecPage({
			components: [KvTextField],
			template: () => <kv-text-field label={row.label} accessibleLabel="Connection name" />
		});
		expect(page.root.shadowRoot.querySelector('input').getAttribute('aria-label')).toBe(row.expected);
		expect(page.root.shadowRoot.querySelector('kv-form-label')?.getAttribute('label')).toBe(row.label || undefined);
	});
});

describe.each([
	{ tag: 'kv-single-select-dropdown', component: KvSingleSelectDropdown },
	{ tag: 'kv-multi-select-dropdown', component: KvMultiSelectDropdown }
])('C4 select name: $tag', ({ tag, component }) => {
	it('forwards its accessible label through the existing input configuration', async () => {
		const page = await newSpecPage({ components: [component], html: `<${tag} auto-focus="false" accessible-label="Connection name"></${tag}>` });
		expect((page.root.querySelector('kv-dropdown') as HTMLKvDropdownElement).inputConfig.accessibleLabel).toBe('Connection name');
	});

	it('preserves the input configuration name when the wrapper name is absent', async () => {
		const page = await newSpecPage({ components: [component], html: `<${tag} auto-focus="false"></${tag}>` });
		(page.root as HTMLKvSingleSelectDropdownElement).inputConfig = { accessibleLabel: 'Connection name' };
		await page.waitForChanges();
		expect((page.root.querySelector('kv-dropdown') as HTMLKvDropdownElement).inputConfig.accessibleLabel).toBe('Connection name');
	});
});

describe('C4 switch semantics', () => {
	it('names a native non-submit switch button and reflects checked/disabled state', async () => {
		const page = await newSpecPage({ components: [KvSwitchButton], html: '<kv-switch-button accessible-label="Show Calendar" checked disabled></kv-switch-button>' });
		const control = page.root.shadowRoot.querySelector('button');
		expect(control).not.toBeNull();
		expect(control.getAttribute('type')).toBe('button');
		expect(control.getAttribute('role')).toBe('switch');
		expect(control.getAttribute('aria-label')).toBe('Show Calendar');
		expect(control.getAttribute('aria-checked')).toBe('true');
		expect(control).toHaveAttribute('disabled');
	});
});
