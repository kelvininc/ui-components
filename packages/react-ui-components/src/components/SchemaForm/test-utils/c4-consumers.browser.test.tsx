import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { FOCUS_EDITING_FLAGS, INPUT_FOCUS_SHAPES, OBJECT_SHAPES, SELECT_FOCUS_SHAPES, TOGGLE_BUTTON_GROUP_SHAPES, TOGGLE_FOCUS_MODES } from './matrix';

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

describe.each(INPUT_FOCUS_SHAPES)('C4 SchemaForm input: $name', row => {
	it('names the actual input, delegates focus and preserves the change payload', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const host = screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field')!;
		expect(host.accessibleLabel).toBe(row.label);
		const control = screen.getByLabelText(row.label, { exact: true });
		await expect.element(control).toBeVisible();
		host.focus();
		await expect.poll(focusedControl).toBe(control.element());
		expect((control.element() as HTMLInputElement).value).toBe(String(row.formData));
		onChange.mockClear();
		await control.fill(row.nextText);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.nextValue);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	describe.each(FOCUS_EDITING_FLAGS)('focus in $name forms', flags => {
		it('keeps disabled and readonly fields out of delegated host focus', async () => {
			const screen = await render(
				<>
					<button type="button">Before field</button>
					<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} disabled={flags.disabled} readonly={flags.readonly} />
				</>
			);
			await whenAllKelvinReady(screen.container);
			const host = screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field')!;
			await screen.getByRole('button', { name: 'Before field', exact: true }).click();
			host.focus();
			const expected = flags.focused
				? screen.getByLabelText(row.label, { exact: true }).element()
				: screen.getByRole('button', { name: 'Before field', exact: true }).element();
			await expect.poll(focusedControl).toBe(expected);
		});
	});
});

describe.each(SELECT_FOCUS_SHAPES)('C4 SchemaForm select: $name', row => {
	it('names and focuses its trigger through the component API and preserves selection', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const host = screen.container.querySelector<HTMLKvSingleSelectDropdownElement | HTMLKvMultiSelectDropdownElement>(row.tag)!;
		expect(host.accessibleLabel).toBe(row.label);
		const trigger = screen.getByRole('textbox', { name: row.label, exact: true });
		await expect.element(trigger).toBeVisible();
		await host.setFocus();
		await expect.poll(focusedControl).toBe(trigger.element());
		expect(onChange).not.toHaveBeenCalled();
		await trigger.click();
		await page.getByText('South line', { exact: true }).click();
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.nextValue);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	describe.each(FOCUS_EDITING_FLAGS)('focus in $name forms', flags => {
		it('respects disabled and readonly focus behavior', async () => {
			const screen = await render(
				<>
					<button type="button">Before field</button>
					<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} disabled={flags.disabled} readonly={flags.readonly} />
				</>
			);
			await whenAllKelvinReady(screen.container);
			const host = screen.container.querySelector<HTMLKvSingleSelectDropdownElement | HTMLKvMultiSelectDropdownElement>(row.tag)!;
			await screen.getByRole('button', { name: 'Before field', exact: true }).click();
			await host.setFocus();
			const expected = flags.focused
				? screen.getByRole('textbox', { name: row.label, exact: true }).element()
				: screen.getByRole('button', { name: 'Before field', exact: true }).element();
			await expect.poll(focusedControl).toBe(expected);
		});
	});
});

describe.each(OBJECT_SHAPES.filter(row => row.name === 'additionalProperties true' || row.name === 'additionalProperties schema'))('C4 additional key: $name', row => {
	it('keeps its visible key name and focus/change API', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'site Key', exact: true });
		const host = screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field[id$="-key"]')!;
		host.focus();
		await expect.poll(focusedControl).toBe(control.element());
		await control.fill('plant');
		await userEvent.keyboard('{Tab}');
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual({ plant: 'lisbon' });
	});
});

describe.each(TOGGLE_BUTTON_GROUP_SHAPES)('C4 toggle widget focus: $name', row => {
	describe.each(TOGGLE_FOCUS_MODES)('$name controls', mode => {
		it('focuses its first enabled control without changing form data', async () => {
			const onChange = vi.fn();
			const uiSchema = { ...row.uiSchema, 'ui:options': { ...row.uiSchema['ui:options'], withRadio: mode.withRadio } };
			const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={uiSchema} formData={row.formData} onChange={onChange} />);
			await whenAllKelvinReady(screen.container);
			await screen.container.querySelector<HTMLKvToggleButtonGroupElement>('kv-toggle-button-group')!.setFocus();
			await expect.poll(focusedControl).toBe(screen.getByRole(mode.role, { name: 'North line', exact: true }).element());
			expect(onChange).not.toHaveBeenCalled();
			await userEvent.keyboard(' ');
			await expect.poll(() => onChange.mock.lastCall?.[0].formData).toBeUndefined();
			expect(onChange).toHaveBeenCalledTimes(1);
		});
	});
});

describe.each(['{Enter}', ' '])('C4 Show All Errors switch: %s', key => {
	it('exposes a named switch that reveals errors once without submitting', async () => {
		const onSubmit = vi.fn();
		const onChange = vi.fn();
		const row = INPUT_FOCUS_SHAPES[0];
		const screen = await render(
			<KvSchemaForm<unknown>
				schema={row.schema}
				formData={row.formData}
				extraErrors={{ __errors: ['Broker unavailable'] }}
				showErrorsSwitch
				showErrorList={false}
				onSubmit={onSubmit}
				onChange={onChange}
			/>
		);
		await whenAllKelvinReady(screen.container);
		expect(screen.container.querySelector<HTMLKvSwitchButtonElement>('kv-switch-button')!.accessibleLabel).toBe('Show All Errors');
		const control = screen.getByRole('switch', { name: 'Show All Errors', exact: true });
		await expect.element(control).toHaveAttribute('aria-checked', 'false');
		const host = screen.container.querySelector<HTMLKvSwitchButtonElement>('kv-switch-button')!;
		const change = vi.fn();
		host.addEventListener('switchChange', change);
		host.focus();
		await expect.poll(focusedControl).toBe(control.element());
		await userEvent.keyboard(key);
		await expect.element(control).toHaveAttribute('aria-checked', 'true');
		await expect.element(screen.getByText('Broker unavailable', { exact: true })).toBeVisible();
		expect(change).toHaveBeenCalledTimes(1);
		expect(onSubmit).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
	});
});
