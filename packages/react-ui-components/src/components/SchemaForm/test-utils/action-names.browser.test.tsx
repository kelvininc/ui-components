import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { getDefaultValidator } from '../../../utils';
import { CustomForm, KvSchemaForm } from '../SchemaForm';
import { FormStateProvider } from '../contexts';
import { ACTION_NAME_SHAPES, SUBMIT_BUTTON_SHAPES } from './matrix';

describe.each(SUBMIT_BUTTON_SHAPES)('native form submission: $name', row => {
	it.each(['{Enter}', ' '])('submits once with %s unless disabled', async key => {
		const onSubmit = vi.fn();
		const onError = vi.fn();
		const screen = await render(
			<FormStateProvider initialFormData={row.formData}>
				<CustomForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} validator={getDefaultValidator()} onSubmit={onSubmit} onError={onError} />
			</FormStateProvider>
		);
		await whenAllKelvinReady(screen.container);
		const nativeSubmit = screen.container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
		const host = nativeSubmit.querySelector<HTMLKvActionButtonTextElement>('kv-action-button-text')!;
		expect(host.text).toBe(row.label);
		const submit = vi.fn();
		screen.container.querySelector('form')!.addEventListener('submit', submit);
		host.focus();
		await userEvent.keyboard(key);

		expect(submit).toHaveBeenCalledTimes(row.disabled ? 0 : 1);
		if (row.disabled) {
			expect(onSubmit).not.toHaveBeenCalled();
		} else {
			await expect.poll(() => onSubmit.mock.calls.length).toBe(1);
			expect(onSubmit.mock.lastCall?.[0].formData).toEqual(row.formData);
			expect((submit.mock.lastCall?.[0] as SubmitEvent).submitter).toBe(nativeSubmit);
		}
		expect(onError).not.toHaveBeenCalled();
	});
});

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
		if (row.action.menu) await screen.getByRole('button', { name: row.action.menu, exact: true }).click();
		const control = row.action.menu ? page.getByRole('menuitem', { name: row.action.label, exact: true }) : screen.getByRole('button', { name: row.action.label, exact: true });
		await expect.element(control).toBeVisible();
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard(key);
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.action.nextData);
	});
});

describe.each(ACTION_NAME_SHAPES.filter(row => row.download))('download action: $name', row => {
	it.each(['{Enter}', ' '])('downloads through one temporary anchor with %s', async key => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const clicked = vi.fn((event: MouseEvent) => {
			if (event.target instanceof HTMLAnchorElement && event.target.hasAttribute('download')) event.preventDefault();
		});
		document.addEventListener('click', clicked);
		const control = screen.getByRole('button', { name: row.download, exact: true });
		await expect.element(control).toBeVisible();
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard(key);
		document.removeEventListener('click', clicked);
		const downloads = clicked.mock.calls
			.map(([event]) => event.target)
			.filter((target): target is HTMLAnchorElement => target instanceof HTMLAnchorElement && target.hasAttribute('download'));
		expect(downloads).toHaveLength(1);
		const [anchor] = downloads;
		expect(anchor.isConnected).toBe(false);
		expect(screen.container.querySelector('a[download]')).toBeNull();
		expect(anchor.download).toBe('ca.pem');
		expect(anchor.href).toBe(row.name === 'single file' ? row.formData : (row.formData as string[])[0]);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe.each(ACTION_NAME_SHAPES.filter(row => row.download))('file picker action: $name', row => {
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
		const control = screen.getByRole('button', { name: row.labels[row.labels.length - 1], exact: true });
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
