import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { ACTION_NAME_SHAPES } from './matrix';

describe.each(ACTION_NAME_SHAPES)('action names in Chromium: $name', row => {
	it('finds every action by its name', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />);
		await whenAllKelvinReady(screen.container);
		for (const name of [...row.labels, 'Submit']) {
			await expect.element(screen.getByRole('button', { name, exact: true })).toBeVisible();
		}
		expect(screen.getByRole('button', { name: '', exact: true }).query()).toBeNull();
	});

	it.each(['{Enter}', ' '])('activates the named action once with %s', async key => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('button', { name: row.action.label, exact: true });
		await expect.element(control).toBeVisible();
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard(key);
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.action.nextData);
	});
});

describe.each(ACTION_NAME_SHAPES.filter(row => row.download))('download action: $name', row => {
	it.each(['{Enter}', ' '])('uses the anchor click path once with %s', async key => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const clicked = vi.fn((event: MouseEvent) => event.preventDefault());
		const anchor = screen.container.querySelector<HTMLAnchorElement>('a[download]')!;
		anchor.addEventListener('click', clicked);
		const control = screen.getByRole('button', { name: row.download, exact: true });
		await expect.element(control).toBeVisible();
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard(key);
		expect(clicked).toHaveBeenCalledTimes(1);
		expect(clicked.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
		expect(anchor.download).toBe('ca.pem');
		expect(anchor.href).toBe(row.name === 'single file' ? row.formData : (row.formData as string[])[0]);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe.each(ACTION_NAME_SHAPES.filter(row => row.download))('Browse File action: $name', row => {
	it.each([
		{ key: '{Enter}', disabled: false, clicks: 1 },
		{ key: ' ', disabled: false, clicks: 1 },
		{ key: '{Enter}', disabled: true, clicks: 0 },
		{ key: ' ', disabled: true, clicks: 0 }
	])('forwards $key to the file input with disabled=$disabled', async ({ key, disabled, clicks }) => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} disabled={disabled} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const input = screen.container.querySelector<HTMLInputElement>('input[type="file"]')!;
		const clicked = vi.fn((event: MouseEvent) => event.preventDefault());
		input.addEventListener('click', clicked);
		const control = screen.getByRole('button', { name: 'Browse File', exact: true });
		await expect.element(control).toBeVisible();
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		expect((control.element().getRootNode() as ShadowRoot).activeElement).toBe(control.element());
		await userEvent.keyboard(key);

		expect(clicked).toHaveBeenCalledTimes(clicks);
		expect(clicked.mock.calls.map(([event]) => event.target)).toEqual(Array(clicks).fill(input));
		expect(onChange).not.toHaveBeenCalled();
	});
});
