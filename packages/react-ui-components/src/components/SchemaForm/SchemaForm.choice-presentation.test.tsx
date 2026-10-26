// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import {
	CHOICE_SCHEMAS,
	CHOICE_DISPATCH_SHAPES,
	CHOICE_VALUE_SHAPES,
	CHOICE_WIDGET_SHAPES,
	CHOICE_INTERACTION_SHAPES,
	DEFAULTED_CHOICE_SHAPES,
	RADIO_KEYBOARD_SHAPES,
	CHOICE_CLEAR_NAME_SHAPES,
	OPTION_SOURCES,
	VALUE_CASES,
	CUSTOM_FIELDS,
	choiceForm
} from './test-utils/matrix';
import widgets from './Widgets';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
beforeEach(() => {
	container = document.createElement('div');
	document.body.append(container);
	root = createRoot(container);
});
afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
});
const notSet = () => Array.from(container.querySelectorAll('span')).filter(element => element.textContent === 'Not set');
const clearActions = () => Array.from(container.querySelectorAll<HTMLButtonElement>('button')).filter(button => button.textContent === 'Clear selection');
type RadioProps = {
	accessibleLabel: string;
	required: boolean;
	invalid: boolean;
	selectedOption?: string;
	options: { optionId: string; label: string; disabled: boolean; description?: string; accessibleDescriptionElements: Element[] }[];
};

describe.each(CHOICE_SCHEMAS)('choice presentation: $name', row => {
	for (const widget of CHOICE_WIDGET_SHAPES.filter(widget => widget.kind !== 'checkbox' || row.name === 'boolean')) {
		describe(widget.name, () => {
			it.each(VALUE_CASES)('annotates only unset for $name', async ({ value, isUnset }) => {
				await act(async () => root.render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': widget.widget } }} formData={{ choice: value }} />));
				expect(notSet()).toHaveLength(widget.kind !== 'checkbox' && isUnset ? 1 : 0);
				const radio = widget.kind === 'radio' || (widget.kind === 'default' && row.name === 'boolean');
				expect(clearActions()).toHaveLength(radio ? 1 : 0);
				if (radio) {
					expect(clearActions()[0].getAttribute('aria-disabled')).toBe(String(isUnset));
					expect(clearActions()[0].tabIndex).toBe(isUnset ? -1 : 0);
				}
			});

			describe.each([false, true])('required=%s', required => {
				it.each(CHOICE_INTERACTION_SHAPES)('applies the clear policy for $name', async ({ disabled, readonly }) => {
					const value = row.values[0];
					await act(async () =>
						root.render(
							<KvSchemaForm
								schema={choiceForm(row, { required })}
								uiSchema={{ choice: { 'ui:widget': widget.widget, 'ui:options': { allowClearInputs: true } } }}
								formData={{ choice: value }}
								disabled={disabled}
								readonly={readonly}
							/>
						)
					);
					const radio = widget.kind === 'radio' || (widget.kind === 'default' && row.name === 'boolean');
					expect(clearActions()).toHaveLength(radio && !required && !disabled && !readonly ? 1 : 0);
					if (radio) {
						const props = propsOf<RadioProps>('root_choice');
						expect(props.accessibleLabel).toBe(row.schema.title);
						expect(props.required).toBe(required);
						expect(props.options.every(option => option.disabled)).toBe(disabled || readonly);
					}
				});
			});
		});
	}

	it.each(OPTION_SOURCES)('gives $name an explicit opt-out', async source => {
		const props = source.build('choice', { allowClearInputs: false });
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={choiceForm(row)}
					{...props}
					uiSchema={{ ...props.uiSchema, choice: { ...props.uiSchema.choice, 'ui:widget': 'radio' } }}
					formData={{ choice: row.values[0] }}
				/>
			)
		);
		expect(clearActions()).toHaveLength(0);
	});

	it('leaves custom fields in charge of presentation', async () => {
		await act(async () => root.render(<KvSchemaForm schema={choiceForm(row)} fields={CUSTOM_FIELDS} uiSchema={{ choice: { 'ui:field': 'Connection' } }} />));
		expect(container.querySelector('[data-custom-field]')).not.toBeNull();
		expect(notSet()).toHaveLength(0);
		expect(clearActions()).toHaveLength(0);
	});

	it('treats the registered default field name as standard', async () => {
		const field = row.name === 'boolean' ? 'BooleanField' : row.name.startsWith('integer') ? 'NumberField' : 'StringField';
		await act(async () => root.render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:field': field, 'ui:widget': 'radio' } }} />));
		expect(notSet()).toHaveLength(1);
		expect(clearActions()).toHaveLength(1);
	});
});

describe.each(CHOICE_VALUE_SHAPES.filter(row => !row.multiple))('raw radio choice: $name', row => {
	it.each(['radio', 'RadioListWidget'])('preserves values and selected clicks with %s', async widget => {
		const onChange = vi.fn();
		await act(async () =>
			root.render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': widget } }} formData={{ choice: row.values[0] }} onChange={onChange} />)
		);
		const props = propsOf<RadioProps>('root_choice');
		expect(props.options.map(option => option.label)).toEqual(row.labels);
		expect(props.selectedOption).toBe('0');
		for (const index of [1, 1, 0]) {
			onChange.mockClear();
			await act(async () => fireStencilEvent('root_choice', 'onOptionSelected', props.options[index].optionId));
			expect(onChange).toHaveBeenCalledOnce();
			expect(onChange.mock.lastCall?.[0].formData.choice).toEqual(row.values[index]);
		}
	});
});

it.each([
	{ name: 'registered radio alias', widget: 'connectionRadio', registered: { connectionRadio: widgets.RadioWidget } },
	{ name: 'radio component identity', widget: widgets.RadioWidget, registered: {} },
	{ name: 'radio list component identity', widget: widgets.RadioListWidget, registered: {} }
])('recognizes $name for extras', async row => {
	const onChange = vi.fn();
	await act(async () =>
		root.render(
			<KvSchemaForm
				schema={choiceForm(CHOICE_SCHEMAS[0])}
				uiSchema={{ choice: { 'ui:widget': row.widget } }}
				widgets={row.registered}
				formData={{ choice: false }}
				onChange={onChange}
			/>
		)
	);
	const clear = clearActions()[0];
	expect(clear).toBeDefined();
	const setFocus = vi.fn().mockImplementation(() => {
		expect(propsOf<RadioProps>('root_choice').selectedOption).toBeUndefined();
		return Promise.resolve();
	});
	Object.assign(container.querySelector('kv-radio-list')!, { setFocus });
	await act(async () => clear.click());
	expect(setFocus).toHaveBeenCalledOnce();
	expect(onChange).toHaveBeenCalledOnce();
	expect(onChange.mock.lastCall?.[0].formData.choice).toBeUndefined();
	expect(propsOf<RadioProps>('root_choice').selectedOption).toBeUndefined();
	expect(notSet()).toHaveLength(1);
	onChange.mockClear();
	await act(async () => clear.click());
	expect(onChange).not.toHaveBeenCalled();
	expect(clearActions()[0]).toBe(clear);
});

describe.each(DEFAULTED_CHOICE_SHAPES)('defaulted radio clear: $name', row => {
	it('clears once without RJSF restoring the default', async () => {
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': 'radio' } }} onChange={onChange} />));
		expect(propsOf<RadioProps>('root_choice').selectedOption).toBeDefined();
		Object.assign(container.querySelector('kv-radio-list')!, { setFocus: vi.fn().mockResolvedValue(undefined) });
		await act(async () => clearActions()[0].click());
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData.choice).toBeUndefined();
		expect(notSet()).toHaveLength(1);
	});
});

it.each(CHOICE_DISPATCH_SHAPES)('follows actual widget dispatch for $name', async row => {
	const registered = row.formatWidget === 'radio' ? { EmailWidget: widgets.RadioWidget } : row.formatWidget === 'custom' ? { EmailWidget: widgets.ReadOnlyValueWidget } : {};
	await act(async () => root.render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ ...row.uiSchema, choice: row.uiSchema }} widgets={registered} />));
	expect(notSet()).toHaveLength(row.expected === 'radio' || row.expected === 'select' ? 1 : 0);
	expect(clearActions()).toHaveLength(row.expected === 'radio' ? 1 : 0);
	expect(container.querySelectorAll('kv-radio-list')).toHaveLength(row.expected === 'radio' ? 1 : 0);
});

describe.each(RADIO_KEYBOARD_SHAPES)('radio error policy: $name', ({ widget }) => {
	it.each(CHOICE_SCHEMAS.slice(0, 2))('forwards visible errors and hideError for $name', async row => {
		const base = { schema: choiceForm(row), formData: { choice: row.values[0] }, extraErrors: { choice: { __errors: ['Review this choice.'] } } };
		await act(async () => root.render(<KvSchemaForm {...base} uiSchema={{ choice: { 'ui:widget': widget } }} displayErrors={false} />));
		expect(propsOf<RadioProps>('root_choice').invalid).toBe(false);
		await act(async () => fireStencilEvent('root_choice', 'onOptionSelected', '1'));
		expect(propsOf<RadioProps>('root_choice').invalid).toBe(true);
		await act(async () => root.render(<KvSchemaForm {...base} uiSchema={{ choice: { 'ui:widget': widget, 'ui:hideError': true } }} displayErrors />));
		expect(propsOf<RadioProps>('root_choice').invalid).toBe(false);
	});
});

it.each(CHOICE_CLEAR_NAME_SHAPES)('names the clear action with $name', async ({ uiSchema, expected }) => {
	await act(async () => root.render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} uiSchema={{ choice: uiSchema }} formData={{ choice: false }} />));
	expect(clearActions()[0].getAttribute('aria-label')).toBe(expected);
});

it('leaves an arbitrary custom widget in charge of its unset value', async () => {
	const ConnectionChoice = () => <span>Choose connection</span>;
	await act(async () => root.render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} uiSchema={{ choice: { 'ui:widget': ConnectionChoice } }} />));
	expect(notSet()).toHaveLength(0);
	expect(clearActions()).toHaveLength(0);
});
