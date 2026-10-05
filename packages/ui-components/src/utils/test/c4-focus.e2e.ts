import { E2EPage, newE2EPage } from '@stencil/core/testing';
import {
	ACTIVATION_KEYS,
	CONTROL_NAMES,
	CUSTOM_ACTION_FOCUS,
	DROPDOWN_CONSUMERS,
	DROPDOWN_FOCUS_FLAGS,
	GROUP_FOCUS,
	SELECT_CONTROLS,
	TEXT_FIELD_CONSUMERS,
	TEXT_FIELD_FOCUS,
	TOGGLE_CONTROL_MODES,
	TOGGLE_NAME_CONSUMERS,
	TOGGLE_NAMES
} from './c4-focus.matrix';

const focusName = (page: E2EPage) =>
	page.evaluate(() => {
		let active = document.activeElement;
		while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
		return active?.getAttribute('aria-label') || active?.id;
	});

describe.each(TEXT_FIELD_FOCUS)('C4 text field focus: $name', row => {
	it('supports host and explicit focus while preserving editing flags', async () => {
		const page = await newE2EPage();
		await page.setContent(`<button id="before">Before</button><kv-text-field accessible-label="Broker" value="broker" ${row.attributes}></kv-text-field>`);
		const host = await page.find('kv-text-field');
		const changes = await host.spyOnEvent('textChange');
		await page.focus('#before');
		await page.evaluate(() => document.querySelector('kv-text-field').focus());
		await page.waitForChanges();
		expect(await focusName(page)).toBe(row.focused ? 'Broker' : 'before');
		await page.keyboard.press('End');
		await page.keyboard.type('.local');
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(await host.getProperty('value')).toBe(row.editable ? 'broker.local' : 'broker');
		expect(changes.events.length > 0).toBe(row.editable);
		await page.focus('#before');
		await host.callMethod('focusInput');
		await page.waitForChanges();
		expect(await focusName(page)).toBe(row.focused ? 'Broker' : 'before');
	});
});

describe.each(CONTROL_NAMES)('C4 input name in Chromium: $name', row => {
	it('exposes the intended name in the accessibility tree', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-text-field accessible-label="Connection name"></kv-text-field>');
		const host = await page.find('kv-text-field');
		host.setProperty('label', row.label);
		await page.waitForChanges();
		expect(await page.$(`aria/${row.expected}[role="textbox"]`)).not.toBeNull();
	});
});

describe('C4 delegated clicks and slots', () => {
	it('focuses the default input on a non-focusable part without emitting a value change', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-text-field accessible-label="Broker"></kv-text-field>');
		const changes = await (await page.find('kv-text-field')).spyOnEvent('textChange');
		await page.evaluate(() => {
			const area = document.querySelector('kv-text-field').shadowRoot.querySelector<HTMLElement>('.left-slot-container');
			area.style.minWidth = '24px';
			area.style.height = '24px';
		});
		await (await page.find('kv-text-field >>> .left-slot-container')).click();
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Broker');
		expect(changes.events).toHaveLength(0);
	});

	it('preserves a focusable left slot and lets focusInput explicitly reach the input', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-text-field accessible-label="Broker"><button slot="left-slot" id="details">Details</button></kv-text-field>');
		const host = await page.find('kv-text-field');
		await page.focus('#details');
		expect(await focusName(page)).toBe('details');
		await page.evaluate(() => document.querySelector('kv-text-field').focus());
		await page.waitForChanges();
		expect(await focusName(page)).toBe('details');
		await host.callMethod('focusInput');
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Broker');
	});
});

describe.each(TEXT_FIELD_CONSUMERS)('C4 text field consumer: $name', row => {
	it('preserves its public focus method and input event', async () => {
		const page = await newE2EPage();
		await page.setContent(`<button id="before">Before</button>${row.markup}`);
		const host = await page.find(row.selector);
		const changes = await host.spyOnEvent(row.event);
		await page.focus('#before');
		await host.callMethod(row.method);
		await page.waitForChanges();
		await page.keyboard.type('broker');
		await new Promise(resolve => setTimeout(resolve, 300));
		await page.waitForChanges();
		expect(changes.lastEvent.detail).toBe('broker');
		if (row.selector === 'kv-select-create-option') {
			await host.callMethod('blurInput');
			await page.waitForChanges();
		}
		expect(await page.evaluate(() => document.activeElement.tagName)).toBe(row.selector === 'kv-select-create-option' ? 'BODY' : 'KV-SEARCH');
	});
});

describe.each(SELECT_CONTROLS)('C4 select focus: %s', tag => {
	describe.each(['button', 'search'])('configured %s action', type => {
		it('honors an explicit actionElement through its public focus API', async () => {
			const page = await newE2EPage();
			const action = type === 'button' ? '<button id="action">Choose assets</button>' : '<kv-search id="action" label="Find assets"></kv-search>';
			await page.setContent(`${action}<${tag} accessible-label="Assets"></${tag}>`);
			await page.evaluate(tag => {
				(document.querySelector(tag) as HTMLKvSingleSelectDropdownElement).actionElement = document.querySelector<HTMLElement>('#action');
			}, tag);
			await page.waitForChanges();
			await (await page.find(tag)).callMethod('setFocus');
			await page.waitForChanges();
			expect(await focusName(page)).toBe(type === 'button' ? 'action' : 'Find assets');
		});
	});

	it('focuses and names its default trigger without opening or selecting', async () => {
		const page = await newE2EPage();
		await page.setContent(`<${tag} accessible-label="Assets" auto-focus="false"></${tag}>`);
		const host = await page.find(tag);
		const open = await host.spyOnEvent('openStateChange');
		const selection = await host.spyOnEvent(tag === 'kv-single-select-dropdown' ? 'optionSelected' : 'optionsSelected');
		await host.callMethod('setFocus');
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Assets');
		expect(await page.$('aria/Assets[role="textbox"]')).not.toBeNull();
		expect(open.events).toHaveLength(0);
		expect(selection.events).toHaveLength(0);
	});

	it('keeps visible label precedence and does not focus a disabled trigger', async () => {
		const page = await newE2EPage();
		await page.setContent(`<button id="before">Before</button><${tag} label="Plant assets" accessible-label="Assets" disabled></${tag}>`);
		expect(await page.$('aria/Plant assets[role="textbox"]')).not.toBeNull();
		await page.focus('#before');
		await (await page.find(tag)).callMethod('setFocus');
		expect(await focusName(page)).toBe('before');
	});

	describe.each(['button', 'search'])('custom %s trigger', type => {
		it('focuses the projected action through its public API', async () => {
			const page = await newE2EPage();
			const action =
				type === 'button'
					? '<button id="action" slot="dropdown-action">Choose assets</button>'
					: '<kv-search id="action" label="Find assets" slot="dropdown-action"></kv-search>';
			await page.setContent(`<${tag}>${action}</${tag}>`);
			const host = await page.find(tag);
			await host.callMethod('setFocus');
			await page.waitForChanges();
			expect(await focusName(page)).toBe(type === 'button' ? 'action' : 'Find assets');
		});
	});

	it('preserves focusSearch and option selection after the dropdown opens', async () => {
		const page = await newE2EPage();
		await page.setContent(`<${tag} accessible-label="Assets" searchable auto-focus="false" search-placeholder="Find assets"></${tag}>`);
		const host = await page.find(tag);
		host.setProperty('options', { north: { value: 'north', label: 'North line' }, south: { value: 'south', label: 'South line' } });
		host.setProperty('minSearchOptions', 0);
		await page.waitForChanges();
		await (await page.$('aria/Assets[role="textbox"]')).click();
		await page.waitForChanges();
		await host.callMethod('focusSearch');
		await page.waitForChanges();
		expect(
			await page.evaluate(() => {
				let active = document.activeElement;
				while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
				return active?.getAttribute('placeholder');
			})
		).toBe('Find assets');
		const selection = await host.spyOnEvent(tag === 'kv-single-select-dropdown' ? 'optionSelected' : 'optionsSelected');
		await (await page.$('pierce/kv-select-option[label="North line"]')).click();
		await page.waitForChanges();
		expect(selection.events).toHaveLength(1);
		expect(selection.lastEvent.detail).toEqual(tag === 'kv-single-select-dropdown' ? 'north' : { north: true });
	});
});

describe.each(DROPDOWN_CONSUMERS)('C4 dropdown consumer: $name', row => {
	it('retains its default trigger and focuses it through the dropdown API', async () => {
		const page = await newE2EPage();
		await page.setContent(`<button id="before">Before</button>${row.markup}`);
		await page.focus('#before');
		const tag = await page.evaluate(async ({ selector, shadow }) => {
			const host = document.querySelector(selector);
			const root = shadow ? host.shadowRoot : host;
			const dropdown = root.querySelector('kv-dropdown') as HTMLKvDropdownElement;
			await dropdown.setFocus();
			let active = document.activeElement;
			while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
			return active?.tagName;
		}, row);
		expect(tag).toBe('INPUT');
	});
});

describe.each(DROPDOWN_FOCUS_FLAGS)('C4 generic dropdown focus: $name', row => {
	it('respects the default input configuration', async () => {
		const page = await newE2EPage();
		await page.setContent('<button id="before">Before</button><kv-dropdown></kv-dropdown>');
		const host = await page.find('kv-dropdown');
		host.setProperty('inputConfig', { ...row.config, accessibleLabel: 'Assets' });
		await page.waitForChanges();
		await page.focus('#before');
		await host.callMethod('setFocus');
		await page.waitForChanges();
		expect(await focusName(page)).toBe(row.expected);
	});
});

describe.each(CUSTOM_ACTION_FOCUS)('C4 custom trigger flags: $name', row => {
	describe.each(['projected', 'configured'])('%s action', actionKind => {
		describe.each(['button', 'search'])('%s control', controlKind => {
			it('checks the active trigger state without using fallback input flags', async () => {
				const page = await newE2EPage();
				const slot = actionKind === 'projected' ? ' slot="dropdown-action"' : '';
				const action = controlKind === 'button' ? `<button id="action"${slot}>Choose assets</button>` : `<kv-search id="action" label="Find assets"${slot}></kv-search>`;
				await page.setContent(
					`<button id="before">Before</button>${actionKind === 'configured' ? action : ''}<kv-dropdown>${actionKind === 'projected' ? action : ''}</kv-dropdown>`
				);
				const host = await page.find('kv-dropdown');
				host.setProperty('inputConfig', row.config);
				host.setProperty('disabled', row.disabled);
				if (actionKind === 'configured') {
					await page.evaluate(() => (document.querySelector('kv-dropdown').actionElement = document.querySelector<HTMLElement>('#action')));
				}
				await page.waitForChanges();
				const changes = await host.spyOnEvent('openStateChange');
				await page.focus('#before');
				await host.callMethod('setFocus');
				await page.waitForChanges();
				expect(await focusName(page)).toBe(row.disabled ? 'before' : controlKind === 'button' ? 'action' : 'Find assets');
				expect(changes.events).toHaveLength(0);
			});
		});
	});
});

describe('C4 projected trigger ownership', () => {
	it('focuses the outer default input and the nested custom action independently', async () => {
		const page = await newE2EPage();
		await page.setContent(
			'<kv-dropdown id="outer"><kv-dropdown id="inner" slot="left-slot"><button id="region" slot="dropdown-action">Region</button></kv-dropdown></kv-dropdown>'
		);
		const outer = await page.find('#outer');
		outer.setProperty('inputConfig', { accessibleLabel: 'Assets' });
		await page.waitForChanges();
		await outer.callMethod('setFocus');
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Assets');
		await (await page.find('#inner')).callMethod('setFocus');
		await page.waitForChanges();
		expect(await focusName(page)).toBe('region');
	});
});

describe.each(['kv-radio-list', 'kv-toggle-button-group'])('C4 group focus: %s', tag => {
	describe.each(GROUP_FOCUS)('$name', row => {
		it('focuses the current Tab stop without changing selection', async () => {
			const page = await newE2EPage();
			await page.setContent(`<button id="before">Before</button><${tag}></${tag}>`);
			await page.evaluate(
				({ tag, row }) => {
					const values = row.empty ? [] : ['telemetry', 'alarms', 'commands'];
					const options = values.map(value => ({ value, optionId: value, label: value[0].toUpperCase() + value.slice(1), disabled: row.disabled.includes(value) }));
					if (tag === 'kv-radio-list') {
						const list = document.querySelector('kv-radio-list');
						list.options = options;
						list.selectedOption = row.selected;
					} else {
						const group = document.querySelector('kv-toggle-button-group');
						group.buttons = options;
						group.withRadio = true;
						group.selectedButtons = row.selected ? { [row.selected]: true } : {};
					}
				},
				{ tag, row }
			);
			await page.waitForChanges();
			const host = await page.find(tag);
			const selection = await host.spyOnEvent(tag === 'kv-radio-list' ? 'optionSelected' : 'checkedChange');
			await page.focus('#before');
			await host.callMethod('setFocus');
			await page.waitForChanges();
			expect(await focusName(page)).toBe(row.expected);
			expect(selection.events).toHaveLength(0);
		});
	});
});

describe.each(['checkbox', 'button'])('C4 %s toggle group', type => {
	it('focuses the first enabled button even if a later button is checked', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-toggle-button-group></kv-toggle-button-group>');
		await page.evaluate(type => {
			const group = document.querySelector('kv-toggle-button-group');
			group.buttons = [
				{ value: 'alarms', label: 'Alarms', disabled: true },
				{ value: 'telemetry', label: 'Telemetry' },
				{ value: 'commands', label: 'Commands', checked: true }
			];
			group.withRadio = type === 'checkbox';
			group.radioControlType = 'checkbox' as HTMLKvToggleButtonGroupElement['radioControlType'];
		}, type);
		await page.waitForChanges();
		await (await page.find('kv-toggle-button-group')).callMethod('setFocus');
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Telemetry');
	});
});

describe.each(ACTIVATION_KEYS)('C4 switch activation: %s', key => {
	it('focuses a named switch, changes once and never submits its enclosing form', async () => {
		const page = await newE2EPage();
		await page.setContent('<form><button id="before" type="button">Before</button><kv-switch-button accessible-label="Show Calendar"></kv-switch-button></form>');
		await page.evaluate(() =>
			document.querySelector('form').addEventListener('submit', event => {
				event.preventDefault();
				document.querySelector('form').dataset.submitted = 'true';
			})
		);
		const host = await page.find('kv-switch-button');
		const changes = await host.spyOnEvent('switchChange');
		await page.focus('#before');
		await page.evaluate(() => document.querySelector('kv-switch-button').focus());
		expect(await focusName(page)).toBe('Show Calendar');
		const control = await page.$('aria/Show Calendar[role="switch"]');
		expect(control).not.toBeNull();
		await page.keyboard.press(key);
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(changes.events).toHaveLength(1);
		expect(changes.lastEvent.detail).toBe(true);
		expect(await control.evaluate(button => button.getAttribute('aria-checked'))).toBe('true');
		expect((await page.find('form')).getAttribute('data-submitted')).toBeNull();
	});

	it('preserves the time-picker Show Calendar callback', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-time-picker is-open></kv-time-picker>');
		const changes = await (await page.find('kv-time-picker')).spyOnEvent('showCalendarStateChange');
		const control = await page.$('aria/Show Calendar[role="switch"]');
		expect(control).not.toBeNull();
		await control.focus();
		await page.keyboard.press(key);
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(changes.events).toHaveLength(1);
		expect(changes.lastEvent.detail).toBe(true);
	});
});

describe('C4 disabled switch', () => {
	it('blocks delegated focus and activation and skips its Tab stop', async () => {
		const page = await newE2EPage();
		await page.setContent(
			'<button id="before">Before</button><kv-switch-button accessible-label="Show Calendar" disabled></kv-switch-button><button id="after">After</button>'
		);
		const host = await page.find('kv-switch-button');
		const changes = await host.spyOnEvent('switchChange');
		await page.focus('#before');
		await page.evaluate(() => document.querySelector('kv-switch-button').focus());
		expect(await focusName(page)).toBe('before');
		await page.keyboard.press('Tab');
		expect(await focusName(page)).toBe('after');
		await (await page.find('kv-switch-button >>> [part="button"]')).click();
		await page.waitForChanges();
		expect(changes.events).toHaveLength(0);
	});
});

describe.each(ACTIVATION_KEYS)('C4 plain toggle consumers: %s', key => {
	it('keeps toggle-switch selection callbacks and skips disabled buttons', async () => {
		const page = await newE2EPage();
		await page.setContent('<button id="before">Before</button><kv-toggle-switch></kv-toggle-switch><button id="after">After</button>');
		await page.evaluate(() => {
			const host = document.querySelector('kv-toggle-switch');
			host.options = [
				{ value: 'alarms', label: 'Alarms', disabled: true },
				{ value: 'telemetry', label: 'Telemetry' }
			];
			host.addEventListener('checkedChange', (event: CustomEvent<string>) => {
				host.selectedOption = event.detail;
			});
		});
		await page.waitForChanges();
		const changes = await (await page.find('kv-toggle-switch')).spyOnEvent('checkedChange');
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName(page)).toBe('Telemetry');
		await page.keyboard.press(key);
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(changes.events).toHaveLength(1);
		expect(changes.lastEvent.detail).toBe('telemetry');
		const control = await page.$('aria/Telemetry[role="button"]');
		expect(await control.evaluate(button => button.getAttribute('aria-pressed'))).toBe('true');
		await page.keyboard.press('Tab');
		expect(await focusName(page)).toBe('after');
	});

	it('activates a plain group through its focus API without submitting a form', async () => {
		const page = await newE2EPage();
		await page.setContent('<form><kv-toggle-button-group></kv-toggle-button-group></form>');
		await page.evaluate(() => {
			const group = document.querySelector('kv-toggle-button-group');
			group.buttons = [{ value: 'telemetry', label: 'Telemetry' }];
			document.querySelector('form').addEventListener('submit', event => {
				event.preventDefault();
				document.querySelector('form').dataset.submitted = 'true';
			});
		});
		await page.waitForChanges();
		const host = await page.find('kv-toggle-button-group');
		const changes = await host.spyOnEvent('checkedChange');
		await host.callMethod('setFocus');
		await page.keyboard.press(key);
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(changes.events).toHaveLength(1);
		expect(changes.lastEvent.detail).toBe('telemetry');
		expect((await page.find('form')).getAttribute('data-submitted')).toBeNull();
	});
});

describe.each(TOGGLE_NAMES)('C4 toggle name: $name', row => {
	describe.each(TOGGLE_CONTROL_MODES)('$name control', mode => {
		it('names the focusable control and preserves its label and keyboard callback', async () => {
			const page = await newE2EPage();
			await page.setContent('<kv-toggle-button icon="kv-add" value="telemetry"></kv-toggle-button>');
			const host = await page.find('kv-toggle-button');
			host.setProperty('label', row.label);
			host.setProperty('tooltip', row.tooltip);
			host.setProperty('accessibleLabel', row.accessibleLabel);
			host.setProperty('withRadio', mode.withRadio);
			host.setProperty('radioControlType', mode.controlType);
			await page.waitForChanges();
			const changes = await host.spyOnEvent('checkedChange');
			expect(await page.$(`aria/${row.expected}[role="${mode.role}"]`)).not.toBeNull();
			await page.evaluate(() => document.querySelector('kv-toggle-button').focus());
			expect(await focusName(page)).toBe(row.expected);
			expect(changes.events).toHaveLength(0);
			expect(await page.evaluate(() => document.querySelector('kv-toggle-button').shadowRoot.querySelector('[part="toggle-label"]')?.textContent.trim() || null)).toBe(
				row.label || null
			);
			await page.keyboard.press('Space');
			await page.waitForChanges();
			await new Promise(resolve => setTimeout(resolve, 300));
			expect(changes.events).toHaveLength(1);
			expect(changes.lastEvent.detail).toBe('telemetry');
		});
	});
});

describe.each(TOGGLE_NAME_CONSUMERS)('C4 toggle name forwarding: $name', mode => {
	it('names an icon-only option and preserves its keyboard callback', async () => {
		const page = await newE2EPage();
		await page.setContent(`<${mode.tag}></${mode.tag}>`);
		await page.evaluate(mode => {
			const option = { value: 'telemetry', icon: 'kv-add', accessibleLabel: 'Add telemetry' };
			if (mode.tag === 'kv-toggle-button-group') {
				const group = document.querySelector('kv-toggle-button-group');
				group.buttons = [option as (typeof group.buttons)[number]];
				group.withRadio = mode.withRadio;
				group.radioControlType = mode.controlType as typeof group.radioControlType;
			} else document.querySelector('kv-toggle-switch').options = [option as HTMLKvToggleSwitchElement['options'][number]];
		}, mode);
		await page.waitForChanges();
		const host = await page.find(mode.tag);
		const changes = await host.spyOnEvent('checkedChange');
		const control = await page.$(`aria/Add telemetry[role="${mode.role}"]`);
		expect(control).not.toBeNull();
		await control.focus();
		expect(await focusName(page)).toBe('Add telemetry');
		expect(changes.events).toHaveLength(0);
		await page.keyboard.press('Space');
		await page.waitForChanges();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(changes.events).toHaveLength(1);
		expect(changes.lastEvent.detail).toBe('telemetry');
	});
});

describe.each(['large', 'small'])('C4 switch dimensions: %s', size => {
	it('preserves plain-toggle dimensions with the native button', async () => {
		const page = await newE2EPage();
		await page.setContent(
			`<kv-toggle-button size="${size}" label="Telemetry" style="--button-height-${size}:24px;--button-width:96px;--button-padding-${size}:0px;--border-size:0px;--border-left-size:0px;--border-right-size:0px;--border-color-default:transparent"></kv-toggle-button>`
		);
		const dimensions = await page.evaluate(() => {
			const button = document.querySelector('kv-toggle-button').shadowRoot.querySelector('button');
			const rect = button.getBoundingClientRect();
			const style = getComputedStyle(button);
			return { width: rect.width, height: rect.height, padding: style.padding, border: style.borderWidth };
		});
		expect(dimensions).toEqual({ width: 96, height: 24, padding: '0px', border: '0px' });
	});

	it('preserves the button part dimensions and exposes a configurable keyboard outline', async () => {
		const page = await newE2EPage();
		await page.setContent(
			`<button id="before">Before</button><kv-switch-button size="${size}" accessible-label="Show Calendar" style="--switch-height-${size}:24px;--switch-width-${size}:48px;--switch-focus-outline-color:rgb(20,40,80);--border-width-strong:2px;--spacing-2xs:2px"></kv-switch-button>`
		);
		await page.focus('#before');
		await page.keyboard.press('Tab');
		const style = await page.evaluate(() => {
			const button = document.querySelector('kv-switch-button').shadowRoot.querySelector('button');
			const rect = button.getBoundingClientRect();
			const style = getComputedStyle(button);
			return {
				width: rect.width,
				height: rect.height,
				padding: style.padding,
				border: style.borderWidth,
				outlineColor: style.outlineColor,
				outlineWidth: style.outlineWidth
			};
		});
		expect(style).toEqual({ width: 48, height: 24, padding: '0px', border: '0px', outlineColor: 'rgb(20, 40, 80)', outlineWidth: '2px' });
	});
});

describe('C4 switch padding focus', () => {
	it('focuses from host padding without changing its checked state', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-switch-button accessible-label="Show Calendar" style="padding:12px;--switch-height-large:24px;--switch-width-large:48px"></kv-switch-button>');
		const host = await page.find('kv-switch-button');
		const changes = await host.spyOnEvent('switchChange');
		const point = await page.evaluate(() => {
			const rect = document.querySelector('kv-switch-button').getBoundingClientRect();
			return { x: rect.left + 6, y: rect.top + 6 };
		});
		await page.mouse.click(point.x, point.y);
		await page.waitForChanges();
		expect(await focusName(page)).toBe('Show Calendar');
		expect(changes.events).toHaveLength(0);
	});
});
