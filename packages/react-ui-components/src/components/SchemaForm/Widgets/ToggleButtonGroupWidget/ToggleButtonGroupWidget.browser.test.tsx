import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import { TOGGLE_BUTTON_GROUP_SHAPES, TOGGLE_SHARED_TEXT_CHOICES } from '../../test-utils/matrix';

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

describe.each(TOGGLE_BUTTON_GROUP_SHAPES)('toggle widget in Chromium: $name', row => {
	it('preserves selection on arrows and toggles an asset by keyboard', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const north = screen.getByRole('checkbox', { name: 'North line' });
		const south = screen.getByRole('checkbox', { name: 'South line' });
		await expect.element(north).toHaveAttribute('aria-checked', 'true');
		await expect.element(south).toHaveAttribute('aria-checked', 'false');
		(north.element() as HTMLElement).focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect.poll(focusedControl).toBe(north.element());
		expect(onChange).not.toHaveBeenCalled();
		if (row.nextValue === 'south-line') {
			await userEvent.keyboard('{Tab}');
			await expect.poll(focusedControl).toBe(south.element());
		} else {
			await expect.element(south).toHaveAttribute('aria-disabled', 'true');
		}
		await userEvent.keyboard(' ');
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.nextSelection);
	});
});

describe('toggle widget in Chromium: choices that read the same as text', () => {
	it('checks only the choice whose value matches, and selects the other on its own', async () => {
		const { selected, other, nextSelection, ...form } = TOGGLE_SHARED_TEXT_CHOICES;
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...form} formData={[...form.formData]} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('checkbox', { name: selected })).toHaveAttribute('aria-checked', 'true');
		await expect.element(screen.getByRole('checkbox', { name: other })).toHaveAttribute('aria-checked', 'false');
		await userEvent.click(screen.getByRole('checkbox', { name: other }));
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(nextSelection);
	});
});
