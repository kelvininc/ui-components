// @vitest-environment jsdom

import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import Form, { FormProps } from '@rjsf/core';
import { ErrorSchema, RJSFSchema } from '@rjsf/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { SchemaFormContext } from './types';
import { R2NativeSubmitData, R2_NATIVE_SUBMIT_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

type ConnectionForm = Form<R2NativeSubmitData, RJSFSchema, SchemaFormContext>;
type ConnectionFormProps = FormProps<R2NativeSubmitData, RJSFSchema, SchemaFormContext>;

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

const errorMessages = () =>
	Array.from(container.querySelectorAll('kv-form-help-text'))
		.filter(element => propsOf(element).state === 'invalid')
		.flatMap(element => propsOf(element).helpText as string[]);

describe.each(R2_NATIVE_SUBMIT_SHAPES)('native submission visibility: $name', row => {
	it.each(['requestSubmit', 'imperative submit'])('reveals untouched errors via %s and hides them on discard', async method => {
		const ref = createRef<ConnectionForm>();
		const onSubmit = vi.fn<NonNullable<ConnectionFormProps['onSubmit']>>();
		const onError = vi.fn<NonNullable<ConnectionFormProps['onError']>>();
		const onChange = vi.fn<NonNullable<ConnectionFormProps['onChange']>>();
		await act(async () =>
			root.render(
				<KvSchemaForm<R2NativeSubmitData>
					schema={row.schema}
					uiSchema={row.uiSchema}
					formData={row.formData}
					submittedData={row.submittedData}
					extraErrors={row.extraErrors as unknown as ErrorSchema<R2NativeSubmitData>}
					extraErrorsBlockSubmit={false}
					liveValidate={false}
					showErrorList={false}
					focusOnFirstError={false}
					allowDiscardChanges
					formReference={ref}
					onSubmit={onSubmit}
					onError={onError}
					onChange={onChange}
				>
					<button type="submit">Submit connection</button>
				</KvSchemaForm>
			)
		);
		expect(errorMessages()).toEqual([]);
		expect(propsOf('Discard Changes').disabled).toBe(false);
		await act(async () => {
			if (method === 'requestSubmit') container.querySelector('form')!.requestSubmit();
			else ref.current!.submit();
		});
		if (row.accepted) {
			expect(onSubmit).toHaveBeenCalledOnce();
			expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: row.formData, status: 'submitted' });
			expect(onSubmit.mock.lastCall?.[1].type).toBe('submit');
			expect(onError).not.toHaveBeenCalled();
		} else {
			expect(onError).toHaveBeenCalledOnce();
			expect(onError.mock.lastCall?.[0]).toEqual([expect.objectContaining({ property: 'secret', message: row.message })]);
			expect(onSubmit).not.toHaveBeenCalled();
		}
		expect(ref.current?.state.formData).toEqual(row.formData);
		expect(errorMessages()).toEqual([row.message]);
		const secretOwner = container.querySelector('#root_secret')!.closest('[data-schema-form-field]')!;
		expect(propsOf(secretOwner.querySelector('kv-form-help-text')!).helpText).toEqual([row.message]);

		await act(async () => {
			fireStencilEvent('Discard Changes', 'onClickButton');
		});
		expect(errorMessages()).toEqual([]);
		expect(ref.current?.state.formData).toEqual(row.submittedData);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.submittedData);
		expect(onSubmit).toHaveBeenCalledTimes(row.accepted ? 1 : 0);
		expect(onError).toHaveBeenCalledTimes(row.accepted ? 0 : 1);
	});
});
