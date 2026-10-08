import { EIconName } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import { R2_FILE_ERROR_VISIBILITY_SHAPES } from '../../test-utils/matrix';

const fileOwner = (container: Element) => container.querySelector('input[type="file"]')!.closest('[data-schema-form-field]')!;
const fileRows = (container: Element) =>
	Array.from(fileOwner(container).querySelectorAll<HTMLKvIconElement>('kv-icon'))
		.filter(icon => icon.name === EIconName.File)
		.map(icon => icon.parentElement!.parentElement!);
const errorMessages = (container: Element) =>
	Array.from(fileOwner(container).querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
		.filter(help => help.state === 'invalid')
		.flatMap(help => help.helpText as string[]);

function tokenBorderColor(owner: Element, token: string): string {
	const probe = document.createElement('span');
	probe.style.border = `1px solid var(${token})`;
	owner.append(probe);
	const color = getComputedStyle(probe).borderTopColor;
	probe.remove();
	return color;
}

describe.each(R2_FILE_ERROR_VISIBILITY_SHAPES)('file error visibility in Chromium: $name', row => {
	const { message, rowCount } = row;
	const form = (displayErrors = false, extraErrors = row.extraErrors, onChange = vi.fn()) => (
		<KvSchemaForm
			schema={row.schema}
			uiSchema={row.uiSchema}
			formData={row.formData}
			submittedData={row.submittedData}
			extraErrors={extraErrors}
			displayErrors={displayErrors}
			allowDiscardChanges
			showErrorList={false}
			onChange={onChange}
		/>
	);
	const expectVisibility = async (container: Element, visible: boolean) => {
		await expect.poll(() => errorMessages(container)).toEqual(visible ? [message] : []);
		const owner = fileOwner(container);
		const errorColor = tokenBorderColor(owner, '--input-border-color-error');
		const defaultColor = tokenBorderColor(owner, '--input-border-color-default');
		expect(errorColor).not.toBe(defaultColor);
		expect(fileRows(container)).toHaveLength(rowCount);
		await expect.poll(() => fileRows(container).map(file => getComputedStyle(file).borderTopColor)).toEqual(Array(rowCount).fill(visible ? errorColor : defaultColor));
	};
	const focusBrowse = (container: Element) => fileOwner(container).querySelector<HTMLKvActionButtonTextElement>('kv-action-button-text')!.focus();

	it('shows its own error and border when the real Browse button receives focus', async () => {
		const onChange = vi.fn();
		const screen = await render(form(false, row.extraErrors, onChange));
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, false);
		onChange.mockClear();
		focusBrowse(screen.container);
		await expectVisibility(screen.container, true);
		await screen.getByRole('textbox', { name: 'Host', exact: true }).click();
		await expectVisibility(screen.container, true);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('follows displayErrors and removes the real error border when errors clear', async () => {
		const screen = await render(form());
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, false);
		await screen.rerender(form(true));
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, true);
		await screen.rerender(form());
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, false);
		await screen.rerender(form(true, {}));
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, false);
	});

	it('resets the touched file border and message after discarding the host edit', async () => {
		const onChange = vi.fn();
		const screen = await render(form(false, row.extraErrors, onChange));
		await whenAllKelvinReady(screen.container);
		focusBrowse(screen.container);
		await expectVisibility(screen.container, true);
		const discard = screen.getByRole('button', { name: 'Discard changes', exact: true });
		await expect.element(discard).toBeEnabled();
		onChange.mockClear();
		await discard.click();
		await whenAllKelvinReady(screen.container);
		await expectVisibility(screen.container, false);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.submittedData);
	});
});
