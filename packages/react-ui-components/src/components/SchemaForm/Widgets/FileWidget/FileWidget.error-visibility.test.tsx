// @vitest-environment jsdom

import { EIconName } from '@kelvininc/ui-components';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../../test-utils';
import { KvSchemaForm } from '../../SchemaForm';
import { R2_FILE_ERROR_VISIBILITY_SHAPES } from '../../test-utils/matrix';
import styles from './FileWidget.module.scss';

vi.mock('../../../../stencil-generated', async () => (await import('../../../../test-utils')).stencilMocks);

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

const fileOwner = () => container.querySelector('input[type="file"]')!.closest('[data-schema-form-field]')!;
const browse = () => fileOwner().querySelector('kv-action-button-text')!;
const fileRows = () =>
	Array.from(fileOwner().querySelectorAll('kv-icon'))
		.filter(icon => propsOf(icon).name === EIconName.File)
		.map(icon => icon.parentElement!.parentElement!);
const errorMessages = () =>
	Array.from(fileOwner().querySelectorAll('kv-form-help-text'))
		.filter(help => propsOf(help).state === 'invalid')
		.flatMap(help => propsOf(help).helpText as string[]);

describe.each(R2_FILE_ERROR_VISIBILITY_SHAPES)('file error visibility: $name', row => {
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
	const renderForm = async (element: React.ReactElement) => act(async () => root.render(element));
	const expectVisibility = (visible: boolean) => {
		expect(errorMessages()).toEqual(visible ? [message] : []);
		const rows = fileRows();
		expect(rows).toHaveLength(rowCount);
		for (const file of rows) expect(file.classList.contains(styles.HasError)).toBe(visible);
	};

	it.each(['onFocusButton', 'onBlurButton'] as const)('shows its own error when Browse emits %s', async event => {
		const onChange = vi.fn();
		await renderForm(form(false, row.extraErrors, onChange));
		expectVisibility(false);
		onChange.mockClear();
		await act(async () => fireStencilEvent(browse(), event));
		expectVisibility(true);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('follows explicit error visibility and clears styling when errors disappear', async () => {
		await renderForm(form());
		expectVisibility(false);
		await renderForm(form(true));
		expectVisibility(true);
		await renderForm(form());
		expectVisibility(false);
		await renderForm(form(true, {}));
		expectVisibility(false);
	});

	it('hides touched errors after discarding the changed host', async () => {
		const onChange = vi.fn();
		await renderForm(form(false, row.extraErrors, onChange));
		await act(async () => fireStencilEvent(browse(), 'onFocusButton'));
		expectVisibility(true);
		expect(propsOf('Discard changes').disabled).toBe(false);
		onChange.mockClear();
		await act(async () => fireStencilEvent('Discard changes', 'onClickButton'));
		expectVisibility(false);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.submittedData);
	});
});
