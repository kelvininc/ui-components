// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { FormProps, FormState } from '@rjsf/core';
import { WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { R2_MIXED_ERROR_SHAPES, R2_SUBMIT_CASES } from '../test-utils/matrix';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;

describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('RJSF submit contract through $name', ({ FormComponent }) => {
	it.each(R2_SUBMIT_CASES)('$name', async row => {
		const container = document.createElement('div');
		document.body.append(container);
		const root = createRoot(container);
		const formReference = createRef<Form>();
		const onSubmit = vi.fn<NonNullable<FormProps['onSubmit']>>();
		const onError = vi.fn<NonNullable<FormProps['onError']>>();
		const onChange = vi.fn<NonNullable<FormProps['onChange']>>();
		let changeHost: WidgetProps['onChange'];
		const HostInput = ({ id, label, value, onChange }: WidgetProps) => {
			changeHost = onChange;
			return <input id={id} aria-label={label} value={value ?? ''} onChange={event => onChange(event.target.value)} />;
		};
		try {
			await act(async () =>
				root.render(
					<FormComponent
						ref={formReference}
						schema={row.schema}
						formData={row.formData}
						validator={validator}
						widgets={{ HostInput }}
						uiSchema={{ host: { 'ui:widget': 'HostInput' } }}
						omitExtraData={row.omitExtraData}
						liveOmit={row.liveOmit}
						noValidate={row.noValidate}
						extraErrors={row.extraErrors as FormProps['extraErrors']}
						extraErrorsBlockSubmit={row.extraErrorsBlockSubmit}
						customValidate={row.customValidate}
						transformErrors={row.transformErrors}
						onSubmit={onSubmit}
						onError={onError}
						onChange={onChange}
						noHtml5Validate
					/>
				)
			);
			await act(async () => changeHost(row.nextHost));
			expect(onChange.mock.lastCall?.[0].formData).toEqual(row.changedData);
			const form = formReference.current!;
			expect(form.state.formData).toEqual(row.changedData);
			const actualOnSubmit = form.onSubmit;
			const onFormSubmit = vi.spyOn(form, 'onSubmit').mockImplementation(event => {
				expect(event.target).toBe(container.querySelector('form'));
				expect(event.currentTarget).toBe(event.target);
				expect(event.nativeEvent).toBeInstanceOf(SubmitEvent);
				actualOnSubmit(event);
			});
			// Re-render the native form to bind the spy to its actual React submit handler.
			await act(async () => form.forceUpdate());
			await act(async () => form.submit());
			expect(onFormSubmit).toHaveBeenCalledTimes(1);
			expect(onFormSubmit.mock.calls[0][0].isDefaultPrevented()).toBe(true);
			if (row.submitted) {
				expect(onError).not.toHaveBeenCalled();
				expect(onSubmit).toHaveBeenCalledTimes(1);
				const [submission, event] = onSubmit.mock.calls[0];
				const data = submission as typeof submission & FormState;
				expect(data.status).toBe('submitted');
				expect(data.formData).toEqual(row.submittedData);
				expect(data.errors.map(error => error.message)).toEqual(row.serverMessages);
				expect(data.errorSchema).toEqual(row.extraErrors ?? {});
				expect(data.schemaValidationErrors).toEqual([]);
				expect(data.schemaValidationErrorSchema).toEqual({});
				expect(event).toBe(onFormSubmit.mock.calls[0][0]);
				expect(event.nativeEvent.target).toBe(container.querySelector('form'));
				expect(form.state.formData).toEqual(row.submittedData);
			} else {
				expect(onSubmit).not.toHaveBeenCalled();
				expect(onError).toHaveBeenCalledTimes(1);
				expect(onError.mock.calls[0][0].map(error => error.message)).toEqual([...row.validatorMessages, ...row.serverMessages]);
				expect(form.state.formData).toEqual(row.changedData);
			}
		} finally {
			await act(async () => root.unmount());
			container.remove();
		}
	});

	it.each(R2_MIXED_ERROR_SHAPES)('keeps validator and server errors separate: $name', async row => {
		const container = document.createElement('div');
		document.body.append(container);
		const root = createRoot(container);
		const formReference = createRef<Form>();
		const onSubmit = vi.fn<NonNullable<FormProps['onSubmit']>>();
		const onError = vi.fn<NonNullable<FormProps['onError']>>();
		try {
			await act(async () =>
				root.render(
					<FormComponent
						ref={formReference}
						schema={row.schema}
						formData={row.formData}
						validator={validator}
						extraErrors={row.extraErrors as FormProps['extraErrors']}
						onSubmit={onSubmit}
						onError={onError}
						noHtml5Validate
					/>
				)
			);
			await act(async () => formReference.current!.submit());
			expect(onSubmit).not.toHaveBeenCalled();
			expect(onError).toHaveBeenCalledTimes(1);
			const errors = onError.mock.calls[0][0];
			expect(errors.map(error => ({ property: error.property, message: error.message }))).toEqual([
				{ property: row.property, message: row.validatorMessage },
				{ property: row.property, message: row.serverMessage }
			]);
			expect(formReference.current!.state.schemaValidationErrors).toHaveLength(1);
			expect(formReference.current!.state.errors).toHaveLength(2);
		} finally {
			await act(async () => root.unmount());
			container.remove();
		}
	});
});
