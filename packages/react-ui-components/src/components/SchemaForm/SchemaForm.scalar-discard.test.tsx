// @vitest-environment jsdom

import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { buildDefaultFormStateBehavior, getDefaultValidator, getInitialFormData, normalizeSchema } from '../../utils';
import { KvSchemaForm } from './SchemaForm';
import { EApplyDefaults, SchemaFormContext } from './types';
import { R2ScalarValue, R2_SCALAR_DISCARD_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

type ScalarForm = Form<R2ScalarValue, RJSFSchema, SchemaFormContext>;
type ScalarFormProps = FormProps<R2ScalarValue, RJSFSchema, SchemaFormContext>;

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

describe.each(R2_SCALAR_DISCARD_SHAPES)('scalar discard: $name', row => {
	it('emits the exact saved value and restores the pinned RJSF default state', async () => {
		const schema = normalizeSchema(row.schema).schema;
		const validator = getDefaultValidator<R2ScalarValue, RJSFSchema, SchemaFormContext>();
		const expectedData = getInitialFormData(schema, row.submittedData, validator, EApplyDefaults.All, false);
		const baseline = new Form<R2ScalarValue, RJSFSchema, SchemaFormContext>({
			schema,
			validator,
			formData: row.submittedData,
			experimental_defaultFormStateBehavior: buildDefaultFormStateBehavior(EApplyDefaults.All)
		});
		expect(expectedData).toBe(baseline.state.formData);

		const ref = createRef<ScalarForm>();
		const onChange = vi.fn<NonNullable<ScalarFormProps['onChange']>>();
		await act(async () =>
			root.render(
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
			)
		);
		expect(ref.current?.state.formData).toBe(row.formData);
		expect(propsOf('Discard Changes').disabled).toBe(false);
		onChange.mockClear();
		await act(async () => {
			fireStencilEvent('Discard Changes', 'onClickButton');
		});
		expect(onChange).toHaveBeenCalled();
		// RJSF can notify again after applying defaults to an omitted saved value.
		expect(onChange.mock.calls[0][0].formData).toBe(row.submittedData);
		expect(ref.current?.state.formData).toBe(expectedData);
	});
});
