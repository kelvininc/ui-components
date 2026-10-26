import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import React, { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { RESET_STATE_ACTIONS, RESET_STATE_SHAPES } from './test-utils/matrix';
import { SchemaFormContext } from './types';
import fileStyles from './Widgets/FileWidget/FileWidget.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

describe.each([StyleMode.Light, StyleMode.Night])('uncontrolled reset in %s', theme => {
	describe.each([false, true])('with liveValidate=%s', liveValidate => {
		describe.each(RESET_STATE_ACTIONS)('$name', action => {
			it.each(RESET_STATE_SHAPES)('restores $name and keeps mounted fields and footer focus', async row => {
				setThemeMode(theme);
				const ref = createRef<Form<unknown, RJSFSchema, SchemaFormContext>>();
				const onChange = vi.fn();
				const screen = await render(
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
				);
				await whenAllKelvinReady(screen.container);
				const form = ref.current;
				const fields = Array.from(screen.container.querySelectorAll('kv-text-field,kv-checkbox,input[type="file"]'));
				const footerAction = screen.getByRole('button', { name: action.label, exact: true });
				const footerElement = footerAction.element();
				await expect.element(footerAction).toBeDisabled();
				if (row.control.kind === 'files') {
					for (const name of row.control.names) await screen.getByRole('button', { name: `Remove ${name}`, exact: true }).click();
				} else {
					const field = screen.getByLabelText(row.control.label, { exact: true });
					if (row.control.kind === 'checkbox') await field.click();
					else await field.fill(String(row.control.editValue));
				}
				await expect.poll(() => ref.current?.state.formData).toEqual(row.editedData);
				await expect.element(footerAction).toBeEnabled();
				onChange.mockClear();
				await footerAction.click();
				await whenAllKelvinReady(screen.container);
				await expect.poll(() => onChange.mock.calls.length).toBe(1);
				expect(onChange.mock.calls[0][0].formData).toEqual(row.formData);
				expect(ref.current).toBe(form);
				await expect.element(footerAction).toBeDisabled();
				await expect.poll(() => ref.current?.state.formData).toEqual(row.formData);
				if (row.control.kind === 'files') {
					expect(Array.from(screen.container.querySelectorAll(`.${fileStyles.FileName}`)).map(element => element.textContent)).toEqual(row.control.names);
					for (const name of row.control.names) await expect.element(screen.getByRole('button', { name: `Remove ${name}`, exact: true })).toBeVisible();
					const downloads = Array.from(screen.container.querySelectorAll('kv-action-button-icon')).filter(host => host.accessibleLabel?.startsWith('Download '));
					expect(downloads.map(host => host.accessibleLabel)).toEqual(row.control.downloads.map(name => `Download ${name}`));
					for (const name of row.control.downloads) await expect.element(screen.getByRole('button', { name: `Download ${name}`, exact: true })).toBeVisible();
				} else {
					const field = screen.getByLabelText(row.control.label, { exact: true });
					if (row.control.kind === 'checkbox') await expect.element(field).not.toBeChecked();
					else await expect.poll(() => (field.element() as HTMLInputElement).value).toBe(String(row.control.value));
				}
				const restoredFields = Array.from(screen.container.querySelectorAll('kv-text-field,kv-checkbox,input[type="file"]'));
				expect(restoredFields).toHaveLength(fields.length);
				fields.forEach((field, index) => expect(restoredFields[index]).toBe(field));
				expect(footerAction.element()).toBe(footerElement);
				await expect.poll(focusedControl).toBe(footerElement);
			});
		});
	});
});
