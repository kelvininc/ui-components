// @vitest-environment jsdom

import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { RESET_STATE_ACTIONS, RESET_STATE_SHAPES, ResetStateShape } from './test-utils/matrix';
import { SchemaFormContext } from './types';
import fileStyles from './Widgets/FileWidget/FileWidget.module.scss';

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

const fileActions = (prefix: string) =>
	Array.from(container.querySelectorAll('kv-action-button-icon')).filter(host => (propsOf(host).accessibleLabel as string)?.startsWith(prefix));
const assertValue = (row: ResetStateShape) => {
	if (row.control.kind === 'files') {
		expect(Array.from(container.querySelectorAll(`.${fileStyles.FileName}`)).map(element => element.textContent)).toEqual(row.control.names);
		expect(fileActions('Remove ').map(host => propsOf(host).accessibleLabel)).toEqual(row.control.names.map(name => `Remove ${name}`));
		expect(fileActions('Download ').map(host => propsOf(host).accessibleLabel)).toEqual(row.control.downloads.map(name => `Download ${name}`));
	} else {
		expect(propsOf(row.control.key)[row.control.kind === 'checkbox' ? 'checked' : 'value']).toBe(row.control.value);
	}
};
const editRow = async (row: ResetStateShape) => {
	if (row.control.kind === 'files') {
		for (let index = 0; index < row.control.names.length; index++) {
			await act(async () => fireStencilEvent(fileActions('Remove ')[0], 'onClickButton'));
		}
		expect(fileActions('Remove ')).toHaveLength(0);
	} else {
		const control = row.control;
		await act(async () => {
			if (control.kind === 'checkbox') fireStencilEvent(control.key, 'onClickCheckbox');
			else fireStencilEvent(control.key, 'onTextChange', control.editValue);
		});
	}
};

describe.each([false, true])('uncontrolled reset with liveValidate=%s', liveValidate => {
	describe.each(RESET_STATE_ACTIONS)('$name', action => {
		it.each(RESET_STATE_SHAPES)('restores $name when incoming data is unchanged', async row => {
			const ref = createRef<Form<unknown, RJSFSchema, SchemaFormContext>>();
			const onChange = vi.fn();
			await act(async () =>
				root.render(
					<KvSchemaForm<unknown>
						schema={row.schema}
						uiSchema={row.uiSchema}
						applyDefaults={row.applyDefaults}
						formData={row.formData}
						submittedData={row.formData}
						allowDiscardChanges
						allowResetToDefaults
						liveValidate={liveValidate}
						formReference={ref}
						onChange={onChange}
						showErrorList={false}
					/>
				)
			);
			expect(propsOf(action.label).disabled).toBe(true);
			assertValue(row);
			const form = ref.current;
			const fields = Array.from(container.querySelectorAll('kv-text-field,kv-checkbox,input[type="file"]'));
			await editRow(row);
			expect(ref.current?.state.formData).toEqual(row.editedData);
			expect(propsOf(action.label).disabled).toBe(false);
			onChange.mockClear();
			await act(async () => fireStencilEvent(action.label, 'onClickButton'));
			expect(onChange).toHaveBeenCalledOnce();
			expect(onChange.mock.calls[0][0].formData).toEqual(row.formData);
			expect(ref.current).toBe(form);
			expect(propsOf(action.label).disabled).toBe(true);
			expect(ref.current?.state.formData).toEqual(row.formData);
			assertValue(row);
			const restoredFields = Array.from(container.querySelectorAll('kv-text-field,kv-checkbox,input[type="file"]'));
			expect(restoredFields).toHaveLength(fields.length);
			fields.forEach((field, index) => expect(restoredFields[index]).toBe(field));
		});
	});
});
