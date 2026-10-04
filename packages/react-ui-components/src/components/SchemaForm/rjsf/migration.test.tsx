// @vitest-environment jsdom

import { EComponentSize, EIconName } from '@kelvininc/ui-components';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { ARRAY_SHAPES, OBJECT_SHAPES } from '../test-utils/matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
});

const buttonWithIcon = (icon: EIconName, index = 0) => [...container.querySelectorAll('kv-action-button-icon')].filter(button => propsOf(button).icon === icon)[index];

describe('SchemaForm on RJSF 6', () => {
	it('reads text sizing, object widths and default helpers from registry.formContext', async () => {
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={{ type: 'object', properties: { host: { type: 'string', default: 'broker-1.local' } } }}
					formData={{ host: 'broker-2.local' }}
					formContext={{ componentSize: EComponentSize.Small, inputConfig: { width: '240px' }, showDefaultValueHelper: true, defaultValueHelperPrefix: 'Default: ' }}
				/>
			)
		);

		expect(propsOf('root_host').size).toBe(EComponentSize.Small);
		expect(container.querySelector('[style*="240px"]')).not.toBeNull();
		expect([...container.querySelectorAll('kv-form-help-text')].map(element => propsOf(element).helpText)).toContain('Default: broker-1.local');
	});

	it.each(['radio', 'RadioListWidget'])('keeps allowClearInputs for the %s widget', async widget => {
		const onChange = vi.fn();
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={{ type: 'string', enum: ['telemetry', 'alarms'] }}
					formData="telemetry"
					uiSchema={{ 'ui:widget': widget }}
					formContext={{ allowClearInputs: true }}
					onChange={onChange}
				/>
			)
		);
		const selected = [...container.querySelectorAll('kv-radio-list-item')].find(element => propsOf(element).checked)!;

		await act(async () => {
			fireStencilEvent(selected, 'onOptionClick');
		});

		expect(onChange.mock.lastCall?.[0].formData).toBeUndefined();
	});

	it('keeps the select configuration in registry.formContext', async () => {
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={{ type: 'string', enum: ['telemetry', 'alarms'] }}
					formData="telemetry"
					formContext={{ componentSize: EComponentSize.Small, allowClearInputs: true, dropdownConfig: { minWidth: '240px', zIndex: 42 } }}
				/>
			)
		);

		expect(propsOf('root')).toMatchObject({ inputSize: EComponentSize.Small, selectionClearable: true, minWidth: '240px', zIndex: 42, selectedOption: 'telemetry' });
	});

	it('passes the root boolean value through an empty field path', async () => {
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm schema={{ type: 'boolean', title: 'TLS' }} formData={true} onChange={onChange} />));
		const choices = container.querySelectorAll('kv-radio-list-item');
		expect(choices).toHaveLength(2);
		expect(propsOf(choices[1]).checked).toBe(false);

		await act(async () => {
			fireStencilEvent(choices[1], 'onOptionClick');
		});

		expect(onChange.mock.lastCall?.[0].formData).toBe(false);
	});

	it('changes a nested boolean without replacing its array or sibling fields', async () => {
		const brokers = ARRAY_SHAPES.find(row => row.name === 'object list')!;
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm {...brokers} onChange={onChange} />));
		const choices = container.querySelectorAll('kv-radio-list-item');
		expect(choices).toHaveLength(6);
		expect(propsOf(choices[1]).checked).toBe(false);

		await act(async () => {
			fireStencilEvent(choices[1], 'onOptionClick');
		});

		expect(onChange.mock.lastCall?.[0].formData).toEqual([
			{ host: 'broker-1.local', port: 1883, tls: { enabled: false } },
			{ host: 'broker-2.local', port: 8883, tls: { enabled: false } },
			{ host: 'broker-3.local', port: 1883, tls: { enabled: true } }
		]);
	});

	describe.each(OBJECT_SHAPES.filter(row => row.name.startsWith('additionalProperties')))('$name', row => {
		it('adds, renames and removes an additional property', async () => {
			const onChange = vi.fn();
			await act(async () => root.render(<KvSchemaForm {...row} onChange={onChange} />));
			await act(async () => {
				fireStencilEvent(buttonWithIcon(EIconName.Add), 'onClickButton');
			});
			const added = onChange.mock.lastCall?.[0].formData;
			expect(added).toEqual({ site: 'lisbon', newKey: 'New Value' });

			await act(async () => {
				fireStencilEvent('root_newKey-key', 'onTextFieldBlur', 'plant');
			});
			expect(onChange.mock.lastCall?.[0].formData).toEqual({ site: 'lisbon', plant: 'New Value' });
			await act(async () => {
				fireStencilEvent(buttonWithIcon(EIconName.Delete, 1), 'onClickButton');
			});
			expect(onChange.mock.lastCall?.[0].formData).toEqual({ site: 'lisbon' });
		});
	});

	it('renders an object that contains boolean property schemas', async () => {
		const row = OBJECT_SHAPES.find(row => row.name === 'boolean property schemas')!;
		await act(async () => root.render(<KvSchemaForm {...row} />));

		expect(propsOf('root_host').value).toBe('broker-1.local');
	});

	it('moves and removes list items with the existing Kelvin buttons', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'string list')!;
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm {...row} onChange={onChange} />));
		expect(propsOf(buttonWithIcon(EIconName.AlignTop, 0)).disabled).toBe(true);
		expect(propsOf(buttonWithIcon(EIconName.AlignBottom, 2)).disabled).toBe(true);
		expect(propsOf(buttonWithIcon(EIconName.AlignBottom, 0)).tabIndex).toBe(-1);

		await act(async () => {
			fireStencilEvent(buttonWithIcon(EIconName.AlignBottom, 0), 'onClickButton');
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(['alarms', 'telemetry', 'commands']);
		await act(async () => {
			fireStencilEvent(buttonWithIcon(EIconName.AlignTop, 1), 'onClickButton');
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.formData);
		await act(async () => {
			fireStencilEvent(buttonWithIcon(EIconName.Delete, 1), 'onClickButton');
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(['telemetry', 'commands']);
	});

	it('adds up to maxItems', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'one below maxItems')!;
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm {...row} onChange={onChange} />));
		await act(async () => {
			fireStencilEvent(buttonWithIcon(EIconName.Add), 'onClickButton');
		});
		expect(onChange.mock.lastCall?.[0].formData).toHaveLength(2);
		expect(buttonWithIcon(EIconName.Add)).toBeUndefined();
	});

	it('keeps readonly list actions disabled', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'readonly')!;
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm {...row} onChange={onChange} />));
		const buttons = [...container.querySelectorAll('kv-action-button-icon')];
		expect(buttons.length).toBeGreaterThan(0);
		expect(buttons.every(button => propsOf(button).disabled === true)).toBe(true);
		onChange.mockClear();
		buttons.forEach(button => expect(() => fireStencilEvent(button, 'onClickButton')).toThrow('is disabled'));
		expect(onChange).not.toHaveBeenCalled();
	});

	it('renders nested custom array templates and preserves item prefixes and fieldsets', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'object list with a custom inner list template')!;
		await act(async () =>
			root.render(<KvSchemaForm {...row} uiSchema={{ ...row.uiSchema, items: { ...row.uiSchema!.items, 'ui:itemPrefix': 'Group', 'ui:fieldset': true } }} />)
		);

		expect(container.querySelectorAll('[data-custom-inner-list]')).toHaveLength(3);
		expect(propsOf('root_2_tags_2').value).toBe('line-9');
		expect(container.textContent).toContain('Group 1');
		expect(container.textContent).toContain('Group 3');
		expect(container.querySelectorAll('[class*="FieldsetStyle"]')).toHaveLength(3);
	});
});
