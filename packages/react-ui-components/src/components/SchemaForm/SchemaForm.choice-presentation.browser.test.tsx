import React, { useState } from 'react';
import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady, whenKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	CHOICE_SCHEMAS,
	CHOICE_DISPATCH_SHAPES,
	CHOICE_WIDGET_SHAPES,
	CHOICE_INTERACTION_SHAPES,
	CHOICE_VALUE_SHAPES,
	DEFAULTED_CHOICE_SHAPES,
	RADIO_KEYBOARD_SHAPES,
	RADIO_STYLE_THEMES,
	RADIO_INLINE_STYLE_SHAPES,
	CHOICE_CLEAR_NAME_SHAPES,
	RADIO_FOCUS_SHAPES,
	OPTION_SOURCES,
	TOGGLE_FOCUS_MODES,
	VALUE_CASES,
	choiceForm
} from './test-utils/matrix';
import widgets from './Widgets';

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};
const clearButton = (host: Element): HTMLButtonElement =>
	Array.from(host.closest('[data-schema-form-field]')!.querySelectorAll('button')).find(button => button.textContent === 'Clear selection')!;
const unsetAnnotations = (container: Element) => Array.from(container.querySelectorAll('span')).filter(element => element.textContent === 'Not set');

describe.each(RADIO_STYLE_THEMES)('radio presentation in $name', ({ mode }) => {
	describe.each(RADIO_KEYBOARD_SHAPES)('inline $name', ({ widget }) => {
		it.each(RADIO_INLINE_STYLE_SHAPES)('fills groups and stretches cards for $name', async row => {
			try {
				setThemeMode(mode);
				const screen = await render(
					<div style={{ width: '600px' }}>
						<KvSchemaForm
							schema={choiceForm(row)}
							uiSchema={{ choice: { 'ui:widget': widget, 'ui:options': { inline: true, enumDescriptions: row.descriptions, enumDisabled: row.enumDisabled } } }}
							formData={{ choice: row.value }}
						/>
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const host = screen.container.querySelector('kv-radio-list')!;
				const group = host.shadowRoot!.querySelector('[part="items-container"]')!;
				const items = Array.from(group.querySelectorAll('kv-radio-list-item'));
				const width = group.getBoundingClientRect().width;
				const gap = Number.parseFloat(getComputedStyle(group).columnGap);
				expect(Math.abs(width - host.getBoundingClientRect().width)).toBeLessThan(1);
				expect(Math.abs(items[0].getBoundingClientRect().width - items[1].getBoundingClientRect().width)).toBeLessThan(1);
				expect(Math.abs(items[0].getBoundingClientRect().width * 2 + gap - width)).toBeLessThan(1);
				const cards = items.map(item => item.shadowRoot!.querySelector('.radio-list-item-container')!);
				expect(Math.abs(cards[0].getBoundingClientRect().height - cards[1].getBoundingClientRect().height)).toBeLessThan(1);
				cards.forEach((card, index) => {
					const bounds = card.getBoundingClientRect();
					const itemBounds = items[index].getBoundingClientRect();
					expect(Math.abs(bounds.width - itemBounds.width)).toBeLessThan(1);
					expect(Math.abs(bounds.height - itemBounds.height)).toBeLessThan(1);
				});
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
	it.each(RADIO_KEYBOARD_SHAPES)('preserves $name typography and background', async ({ widget }) => {
		try {
			setThemeMode(mode);
			const screen = await render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} uiSchema={{ choice: { 'ui:widget': widget } }} />);
			await whenAllKelvinReady(screen.container);
			await userEvent.hover(screen.getByRole('button', { name: 'Submit', exact: true }).element());
			const item = screen.container.querySelector('kv-radio-list')!.shadowRoot!.querySelector('kv-radio-list-item')!;
			const label = item.shadowRoot!.querySelector('.label')!;
			const card = item.shadowRoot!.querySelector('.radio-list-item-container')!;
			const probe = document.createElement('div');
			probe.style.backgroundColor = widget === 'radio' ? 'var(--input-background-default)' : 'var(--background-container-radio-selector-default)';
			screen.container.append(probe);
			expect(getComputedStyle(label).fontSize).toBe(widget === 'radio' ? '14px' : '16px');
			expect(getComputedStyle(label).lineHeight).toBe(widget === 'radio' ? '20px' : '24px');
			expect(getComputedStyle(label).fontWeight).toBe('600');
			expect(getComputedStyle(card).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
		} finally {
			setThemeMode(StyleMode.Night);
		}
	});
});

it.each(CHOICE_CLEAR_NAME_SHAPES)('names the clear action with $name', async ({ uiSchema, expected }) => {
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} uiSchema={{ choice: uiSchema }} formData={{ choice: false }} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	await screen.getByRole('button', { name: expected, exact: true }).click();
	await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toBeUndefined();
	expect(onChange).toHaveBeenCalledOnce();
});

describe.each(CHOICE_SCHEMAS)('real choice annotation: $name', row => {
	for (const widget of CHOICE_WIDGET_SHAPES.filter(widget => widget.kind !== 'checkbox' || row.name === 'boolean')) {
		it.each(VALUE_CASES)(widget.name + ': $name', async ({ value, isUnset }) => {
			const screen = await render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': widget.widget } }} formData={{ choice: value }} />);
			await whenAllKelvinReady(screen.container);
			expect(unsetAnnotations(screen.container)).toHaveLength(widget.kind !== 'checkbox' && isUnset ? 1 : 0);
			const radio = widget.kind === 'radio' || (widget.kind === 'default' && row.name === 'boolean');
			if (radio) {
				const group = screen.getByRole('radiogroup', { name: row.schema.title, exact: true });
				await expect.element(group).toBeVisible();
				const clear = clearButton(screen.container.querySelector('kv-radio-list')!);
				expect(clear.getAttribute('aria-disabled')).toBe(String(isUnset));
			}
		});
	}
});

describe.each(CHOICE_VALUE_SHAPES.filter(row => !row.multiple))('real raw radio: $name', row => {
	it.each(RADIO_KEYBOARD_SHAPES)('preserves raw values through $name clicks', async ({ widget }) => {
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': widget } }} formData={{ choice: row.values[0] }} onChange={onChange} />
		);
		await whenAllKelvinReady(screen.container);
		for (const index of [1, 1, 0]) {
			onChange.mockClear();
			await screen.getByRole('radio', { name: row.labels[index], exact: true }).click();
			await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(row.values[index]);
			expect(onChange).toHaveBeenCalledOnce();
			await expect.element(screen.getByRole('radio', { name: row.labels[index], exact: true })).toBeChecked();
			expect(unsetAnnotations(screen.container)).toHaveLength(0);
		}
	});
});

describe.each(RADIO_KEYBOARD_SHAPES)('real grouped keyboard: $name', ({ widget }) => {
	it('keeps one radio Tab stop, wraps arrows and skips a disabled option', async () => {
		const schema = { type: 'string' as const, title: 'Topics', enum: ['telemetry', 'alarms', 'commands'], enumNames: ['Telemetry', 'Alarms', 'Commands'] };
		const onChange = vi.fn();
		const screen = await render(
			<>
				<button>Before topics</button>
				<KvSchemaForm
					schema={choiceForm({ schema })}
					uiSchema={{ choice: { 'ui:widget': widget, 'ui:options': { inline: true, enumDisabled: ['alarms'], allowClearInputs: false } } }}
					formData={{ choice: 'telemetry' }}
					onChange={onChange}
				/>
				<button>After topics</button>
			</>
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('button', { name: 'Before topics', exact: true }).click();
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(screen.getByRole('radio', { name: 'Telemetry', exact: true }).element());
		for (const [key, label, value] of [
			['{ArrowRight}', 'Commands', 'commands'],
			['{ArrowDown}', 'Telemetry', 'telemetry'],
			['{ArrowLeft}', 'Commands', 'commands']
		]) {
			onChange.mockClear();
			await userEvent.keyboard(key);
			await expect.poll(focusedControl).toBe(screen.getByRole('radio', { name: label, exact: true }).element());
			await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toBe(value);
			expect(onChange).toHaveBeenCalledOnce();
		}
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(screen.getByRole('button', { name: 'Submit', exact: true }).element());
		await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
		await expect.poll(focusedControl).toBe(screen.getByRole('radio', { name: 'Commands', exact: true }).element());
	});

	describe.each([false, true])('required=%s', required => {
		it('announces required and visible invalid state, then clears invalid', async () => {
			const props = { schema: choiceForm(CHOICE_SCHEMAS[0], { required }), uiSchema: { choice: { 'ui:widget': widget } }, formData: { choice: false }, displayErrors: true };
			const screen = await render(<KvSchemaForm<Record<string, unknown>> {...props} extraErrors={{ choice: { __errors: ['TLS policy unavailable.'] } }} />);
			await whenAllKelvinReady(screen.container);
			const group = screen.getByRole('radiogroup', { name: 'TLS', exact: true });
			await expect.element(group).toHaveAttribute('aria-invalid', 'true');
			expect(group.element().getAttribute('aria-required')).toBe(required ? 'true' : null);
			await screen.rerender(<KvSchemaForm {...props} extraErrors={{}} />);
			await expect.element(group).not.toHaveAttribute('aria-invalid');
		});
	});

	it.each(CHOICE_SCHEMAS.slice(0, 2))('announces touched errors and honors hideError for $name', async row => {
		const props = { schema: choiceForm(row), formData: { choice: row.values[0] }, extraErrors: { choice: { __errors: ['Review this choice.'] } } };
		const screen = await render(<KvSchemaForm {...props} uiSchema={{ choice: { 'ui:widget': widget } }} displayErrors={false} />);
		await whenAllKelvinReady(screen.container);
		const group = screen.getByRole('radiogroup', { name: row.schema.title, exact: true });
		await expect.element(group).not.toHaveAttribute('aria-invalid');
		await screen.getByRole('radio', { name: row.name === 'boolean' ? 'No' : String(row.values[1]), exact: true }).click();
		await expect.element(group).toHaveAttribute('aria-invalid', 'true');
		await screen.rerender(<KvSchemaForm {...props} uiSchema={{ choice: { 'ui:widget': widget, 'ui:hideError': true } }} displayErrors />);
		await expect.element(group).not.toHaveAttribute('aria-invalid');
	});

	it.each(CHOICE_INTERACTION_SHAPES.filter(row => row.name !== 'editable'))('keeps a $name group unchanged', async flags => {
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} uiSchema={{ choice: { 'ui:widget': widget } }} formData={{ choice: false }} onChange={onChange} {...flags} />
		);
		await whenAllKelvinReady(screen.container);
		const yes = screen.getByRole('radio', { name: 'Yes', exact: true });
		await expect.element(yes).toBeDisabled();
		await yes.click({ force: true });
		expect(onChange).not.toHaveBeenCalled();
		expect(clearButton(screen.container.querySelector('kv-radio-list')!)).toBeUndefined();
	});

	it.each(RADIO_FOCUS_SHAPES)('clears once and preserves focus for $name', async row => {
		const onChange = vi.fn();
		const props = {
			schema: choiceForm(CHOICE_SCHEMAS[1]),
			uiSchema: { choice: { 'ui:widget': widget, 'ui:options': { enumDisabled: [...row.disabledValues] } } },
			formData: { choice: 'at-least-once' }
		};
		const screen = await render(<KvSchemaForm {...props} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const host = await whenKelvinReady(screen.container.querySelector<HTMLKvRadioListElement>('kv-radio-list'));
		const clear = clearButton(host);
		await userEvent.click(clear);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toBeUndefined();
		expect(onChange).toHaveBeenCalledOnce();
		expect(clearButton(host)).toBe(clear);
		if (row.expected) await expect.poll(focusedControl).toBe(screen.getByRole('radio', { name: row.expected, exact: true }).element());
		else await expect.poll(focusedControl).toBe(clear);
		expect(unsetAnnotations(screen.container)).toHaveLength(1);
		for (const label of ['at-most-once', 'at-least-once']) await expect.element(screen.getByRole('radio', { name: label, exact: true })).not.toBeChecked();
	});

	it.each(OPTION_SOURCES)('respects the $name clear opt-out', async source => {
		const props = source.build('choice', { allowClearInputs: false });
		const screen = await render(
			<KvSchemaForm
				schema={choiceForm(CHOICE_SCHEMAS[0])}
				{...props}
				uiSchema={{ ...props.uiSchema, choice: { ...props.uiSchema.choice, 'ui:widget': widget } }}
				formData={{ choice: false }}
			/>
		);
		await whenAllKelvinReady(screen.container);
		expect(clearButton(screen.container.querySelector('kv-radio-list')!)).toBeUndefined();
	});
});

describe.each(DEFAULTED_CHOICE_SHAPES)('real defaulted radio: $name', row => {
	it('clears to undefined, retains no checked radio and moves focus to the first option', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': 'radio' } }} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const host = screen.container.querySelector('kv-radio-list')!;
		await userEvent.click(clearButton(host));
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toBeUndefined();
		expect(unsetAnnotations(screen.container)).toHaveLength(1);
		const radios = screen.getByRole('radio').elements();
		await expect.poll(focusedControl).toBe(radios[0]);
		for (const radio of radios) await expect.element(radio).not.toBeChecked();
	});
});

it('keeps described-option links intact and ignores their arrow keys', async () => {
	const schema = {
		type: 'string' as const,
		title: 'QoS',
		oneOf: [
			{ const: 'at-most-once', title: 'At most once', description: 'Read the [documentation](https://docs.kelvininc.com).' },
			{ const: 'at-least-once', title: 'At least once' }
		]
	};
	const onChange = vi.fn();
	const screen = await render(
		<KvSchemaForm schema={choiceForm({ schema })} uiSchema={{ choice: { 'ui:widget': 'RadioListWidget' } }} formData={{ choice: 'at-most-once' }} onChange={onChange} />
	);
	await whenAllKelvinReady(screen.container);
	const link = screen.getByRole('link', { name: 'documentation', exact: true });
	await expect.element(link).toHaveAttribute('href', 'https://docs.kelvininc.com');
	(link.element() as HTMLElement).focus();
	await userEvent.keyboard('{ArrowRight}');
	expect(onChange).not.toHaveBeenCalled();
	await expect.poll(focusedControl).toBe(link.element());
});

it('focuses the cleared field without moving another field or another form', async () => {
	const onChange = vi.fn();
	const schema = {
		type: 'object' as const,
		title: 'Connection',
		properties: { tls: { type: 'boolean' as const, title: 'TLS' }, audit: { type: 'boolean' as const, title: 'Audit' } }
	};
	const screen = await render(
		<>
			<KvSchemaForm schema={schema} idPrefix="north" formData={{ tls: false, audit: false }} onChange={onChange} />
			<KvSchemaForm schema={schema} idPrefix="south" formData={{ tls: true, audit: true }} />
		</>
	);
	await whenAllKelvinReady(screen.container);
	const cleared = screen.container.querySelector('kv-radio-list#north_audit')!;
	expect(clearButton(screen.container.querySelector('kv-radio-list#north_tls')!).getAttribute('aria-label')).toBe('Clear selection for TLS');
	expect(clearButton(cleared).getAttribute('aria-label')).toBe('Clear selection for Audit');
	await userEvent.click(clearButton(cleared));
	await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual({ tls: false, audit: undefined });
	const group = (cleared as HTMLKvRadioListElement).shadowRoot!.querySelector('[role="radiogroup"]')!;
	await expect.poll(focusedControl).toBe(group.querySelector('kv-radio-list-item')!.shadowRoot!.querySelector('kv-radio')!.shadowRoot!.querySelector('[role="radio"]'));
	const south = screen.container.querySelector<HTMLKvRadioListElement>('kv-radio-list#south_audit')!;
	expect(south.selectedOption).toBe('0');
});

it('cancels pending focus when the clearing callback unmounts its field', async () => {
	const Demo = () => {
		const [visible, show] = useState(true);
		return (
			<>
				<button>Outside connection</button>
				{visible && <KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[0])} formData={{ choice: false }} onChange={() => show(false)} />}
			</>
		);
	};
	const screen = await render(<Demo />);
	await whenAllKelvinReady(screen.container);
	const host = screen.container.querySelector<HTMLKvRadioListElement>('kv-radio-list')!;
	await userEvent.click(clearButton(host));
	await expect.poll(() => screen.container.querySelector('kv-radio-list')).toBeNull();
	await screen.getByRole('button', { name: 'Outside connection', exact: true }).click();
	await expect.poll(focusedControl).toBe(screen.getByRole('button', { name: 'Outside connection', exact: true }).element());
});

it.each(CHOICE_INTERACTION_SHAPES.filter(row => row.name !== 'editable'))('cancels clear focus while the form becomes $name', async flags => {
	const Demo = () => {
		const [saving, save] = useState(false);
		return (
			<>
				<button onClick={() => save(false)}>Finish saving</button>
				<KvSchemaForm
					schema={choiceForm(CHOICE_SCHEMAS[0])}
					formData={{ choice: false }}
					disabled={flags.disabled && saving}
					readonly={flags.readonly && saving}
					onChange={() => save(true)}
				/>
			</>
		);
	};
	const screen = await render(<Demo />);
	await whenAllKelvinReady(screen.container);
	const host = screen.container.querySelector('kv-radio-list')!;
	await userEvent.click(clearButton(host));
	await expect.element(screen.getByRole('radio', { name: 'Yes', exact: true })).toBeDisabled();
	const finish = screen.getByRole('button', { name: 'Finish saving', exact: true });
	await finish.click();
	await expect.element(screen.getByRole('radio', { name: 'Yes', exact: true })).toBeEnabled();
	await expect.poll(focusedControl).toBe(finish.element());
});

it.each(CHOICE_DISPATCH_SHAPES)('renders extras for the actual $name widget', async row => {
	const registered = row.formatWidget === 'radio' ? { EmailWidget: widgets.RadioWidget } : row.formatWidget === 'custom' ? { EmailWidget: widgets.ReadOnlyValueWidget } : {};
	const screen = await render(<KvSchemaForm schema={choiceForm(row)} uiSchema={{ ...row.uiSchema, choice: row.uiSchema }} widgets={registered} />);
	await whenAllKelvinReady(screen.container);
	expect(unsetAnnotations(screen.container)).toHaveLength(row.expected === 'radio' || row.expected === 'select' ? 1 : 0);
	expect(screen.container.querySelectorAll('kv-radio-list')).toHaveLength(row.expected === 'radio' ? 1 : 0);
	const clears = Array.from(screen.container.querySelectorAll('button')).filter(button => button.textContent === 'Clear selection');
	expect(clears).toHaveLength(row.expected === 'radio' ? 1 : 0);
});

describe.each(TOGGLE_FOCUS_MODES)('real named toggle group: $name', ({ withRadio }) => {
	it('exposes the widget label on a native group wrapper', async () => {
		const schema = { type: 'array' as const, title: 'Assets', uniqueItems: true, items: { type: 'string' as const, enum: ['north-line', 'south-line'] } };
		const screen = await render(
			<KvSchemaForm
				schema={choiceForm({ schema })}
				uiSchema={{ choice: { 'ui:widget': 'toggleButtonGroup', 'ui:options': { withRadio }, 'ui:title': 'Plant assets' } }}
				formData={{ choice: ['north-line'] }}
			/>
		);
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('group', { name: 'Plant assets', exact: true })).toBeVisible();
	});
});
