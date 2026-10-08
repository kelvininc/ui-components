import React, { createRef } from 'react';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { getDefaultValidator, getInitialFormData, normalizeSchema } from '../../utils';
import { KvSchemaForm } from './SchemaForm';
import { EApplyDefaults, SchemaFormContext } from './types';
import { R2ScalarValue, R2_SCALAR_DISCARD_SHAPES } from './test-utils/matrix';

type ScalarForm = Form<R2ScalarValue, RJSFSchema, SchemaFormContext>;
type ScalarFormProps = FormProps<R2ScalarValue, RJSFSchema, SchemaFormContext>;

describe.each(R2_SCALAR_DISCARD_SHAPES.filter(row => row.submittedData === undefined))('real scalar discard: $name', row => {
	it('clears the edited field or restores its default while emitting undefined', async () => {
		const ref = createRef<ScalarForm>();
		const onChange = vi.fn<NonNullable<ScalarFormProps['onChange']>>();
		const validator = getDefaultValidator<R2ScalarValue, RJSFSchema, SchemaFormContext>();
		const expectedData = getInitialFormData(normalizeSchema(row.schema).schema, row.submittedData, validator, EApplyDefaults.All, false);
		const screen = await render(
			<KvSchemaForm<R2ScalarValue>
				schema={row.schema}
				uiSchema={row.uiSchema}
				formData={row.formData}
				submittedData={row.submittedData}
				applyDefaults={EApplyDefaults.All}
				allowDiscardChanges
				liveValidate={false}
				showErrorList={false}
				formReference={ref}
				onChange={onChange}
			/>
		);
		await whenAllKelvinReady(screen.container);
		const field = row.control === 'checkbox' ? screen.getByRole('checkbox', { name: row.label, exact: true }) : screen.getByLabelText(row.label, { exact: true });
		if (row.control === 'checkbox') await expect.element(field).toBeChecked();
		else await expect.poll(() => (field.element() as HTMLInputElement).value).toBe(String(row.formData));
		expect(ref.current?.state.formData).toBe(row.formData);
		const discard = screen.getByRole('button', { name: 'Discard changes', exact: true });
		await expect.element(discard).toBeEnabled();
		onChange.mockClear();
		await discard.click();
		await whenAllKelvinReady(screen.container);
		await expect.poll(() => onChange.mock.calls.length).toBeGreaterThan(0);
		expect(onChange.mock.calls[0][0].formData).toBeUndefined();
		await expect.poll(() => ref.current?.state.formData).toBe(expectedData);
		if (row.control === 'checkbox') await expect.element(field).not.toBeChecked();
		else await expect.poll(() => (field.element() as HTMLInputElement).value).toBe(expectedData === undefined ? '' : String(expectedData));
	});
});
