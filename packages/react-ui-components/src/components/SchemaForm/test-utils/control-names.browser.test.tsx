import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { CONTROL_NAME_SHAPES } from './matrix';

describe.each(CONTROL_NAME_SHAPES)('choice control names in Chromium: $name', row => {
	it('finds each control by name and changes its value with Space', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		for (const name of row.labels) {
			await expect.element(screen.getByRole(row.role, { name, exact: true })).toBeVisible();
		}
		const control = screen.getByRole(row.role, { name: row.labels[0], exact: true });
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard(' ');
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.nextValue);
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});
