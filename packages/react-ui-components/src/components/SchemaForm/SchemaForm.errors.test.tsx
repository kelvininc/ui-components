// @vitest-environment jsdom

import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import Form from '@rjsf/core';
import { ErrorSchema, RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { getDefaultValidator } from '../../utils';
import { KvSchemaForm } from './SchemaForm';
import { SchemaFormProps } from './types';
import {
	BROKER_FORM_DATA,
	BROKER_SCHEMA,
	ERROR_SHAPES,
	R2_SUBMIT_CASES,
	R2_VALIDATION_SHAPES,
	R2_SECTION_ERROR_SHAPE,
	R2_RESET_SHAPES,
	R2_ERROR_DESCRIPTION_SHAPES,
	R2_BOUNDARY_TRANSITIONS,
	R2_SELECTOR_OWNER_SHAPES
} from './test-utils/matrix';

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

const errorMessages = () =>
	Array.from(container.querySelectorAll('kv-form-help-text'))
		.filter(element => propsOf(element).state === 'invalid')
		.flatMap(element => propsOf(element).helpText as string[]);
type TestFormProps = Omit<SchemaFormProps<any>, 'extraErrors'> & { extraErrors?: unknown };
const renderForm = async (props: TestFormProps) => act(async () => root.render(<KvSchemaForm {...(props as SchemaFormProps<any>)} />));
const saveDisabled = () => propsOf('Submit').disabled;

for (const liveValidate of [false, true])
	for (const extraErrorsBlockSubmit of [false, true]) {
		describe.each(ERROR_SHAPES)(`server errors: $name, live=${liveValidate}, block=${extraErrorsBlockSubmit}`, row => {
			it('sanitizes locations, clears messages and matches the real submit gate', async () => {
				const onSubmit = vi.fn();
				const onError = vi.fn();
				const props = {
					schema: BROKER_SCHEMA,
					formData: BROKER_FORM_DATA,
					displayErrors: true,
					showErrorList: false as const,
					liveValidate,
					extraErrorsBlockSubmit,
					onSubmit,
					onError
				};
				await renderForm({ ...props, extraErrors: row.extraErrors as ErrorSchema });
				expect(errorMessages()).toEqual(row.messages.map(({ message }) => message));
				expect(saveDisabled()).toBe(liveValidate && extraErrorsBlockSubmit && row.messages.length > 0);
				await act(async () => {
					fireStencilEvent('Submit', 'onClickButton', undefined, { force: true });
				});
				expect(onSubmit).toHaveBeenCalledTimes(extraErrorsBlockSubmit && row.messages.length > 0 ? 0 : 1);
				if (onSubmit.mock.calls.length) expect(onSubmit.mock.lastCall?.[0].status).toBe('submitted');
				await renderForm({ ...props, extraErrors: {} });
				expect(errorMessages()).toEqual([]);
				expect(saveDisabled()).toBe(false);
			});
		});
	}

describe.each(R2_SUBMIT_CASES)('Save contract: $name', row => {
	it('matches RJSF validation, omission, blocking and submitted status', async () => {
		const onSubmit = vi.fn();
		const onChange = vi.fn();
		const onError = vi.fn();
		await renderForm({ ...row, onSubmit, onChange, onError });
		await act(async () => {
			fireStencilEvent('root_host', 'onTextChange', row.nextHost);
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.changedData);
		await act(async () => {
			fireStencilEvent('Submit', 'onClickButton');
		});
		expect(onSubmit).toHaveBeenCalledTimes(row.wrapperSubmitted ?? row.submitted ? 1 : 0);
		if (row.wrapperSubmitted ?? row.submitted) {
			expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: row.submittedData, status: 'submitted' });
			expect(onSubmit.mock.lastCall?.[1].type).toBe('submit');
		} else expect(onError).toHaveBeenCalledOnce();
	});
});

describe.each(R2_VALIDATION_SHAPES)('initial validity: $name', row => {
	it('synchronizes Save and preserves scalar saved-data values', async () => {
		await renderForm({ ...row, liveValidate: true, allowDiscardChanges: true });
		expect(saveDisabled()).toBe(!row.valid || !row.hasChanges);
		expect(propsOf('Discard Changes').disabled).toBe(!row.hasChanges);
	});
});

it('keeps identical validator and server messages blocking in the same array item', async () => {
	const schema: RJSFSchema = {
		...BROKER_SCHEMA,
		properties: { ...BROKER_SCHEMA.properties, brokers: { type: 'array', items: { type: 'object', properties: { host: { type: 'string', minLength: 5 } } } } }
	};
	const formData = { ...BROKER_FORM_DATA, brokers: [{ host: 'a' }, { host: 'broker-2.local' }] };
	const extraErrors = { brokers: { 0: { host: { __errors: ['Must be at least 5 characters.'] } }, 1: { host: { __errors: ['Server cannot reach this broker'] } } } };
	const ref = createRef<Form>();
	await renderForm({ schema, formData, extraErrors, liveValidate: true, displayErrors: true, showErrorList: false, formReference: ref });
	expect(saveDisabled()).toBe(true);
	expect(ref.current?.state.errors).toHaveLength(3);
	expect(errorMessages()).toContain('Server cannot reach this broker');
});

it('refreshes callbacks and validation flags against current unsaved data', async () => {
	const ref = createRef<Form>();
	const schema: RJSFSchema = { type: 'object', properties: { host: { type: 'string', minLength: 5 } } };
	const valid = { host: 'broker-1.local' };
	const onSubmit = vi.fn();
	const base = { schema, formData: valid, liveValidate: true, formReference: ref, displayErrors: true, showErrorList: false as const, onSubmit };
	await renderForm(base);
	expect(saveDisabled()).toBe(false);
	await act(async () => {
		fireStencilEvent('root_host', 'onTextChange', 'broker-2.local');
	});
	const customValidate: NonNullable<SchemaFormProps<any>['customValidate']> = (data, errors) => {
		if (data.host === 'broker-2.local') errors.host!.addError('Broker is offline');
		return errors;
	};
	await renderForm({ ...base, customValidate });
	expect(ref.current?.state.formData).toEqual({ host: 'broker-2.local' });
	expect(errorMessages()).toEqual(['Broker is offline']);
	expect(saveDisabled()).toBe(true);
	await renderForm({ ...base, customValidate, noValidate: true, extraErrors: { host: { __errors: ['Server error'] } }, extraErrorsBlockSubmit: true });
	expect(ref.current?.state.formData).toEqual({ host: 'broker-2.local' });
	expect(saveDisabled()).toBe(false);
	await act(async () => {
		fireStencilEvent('Submit', 'onClickButton');
	});
	expect(onSubmit).toHaveBeenCalledOnce();
	await renderForm({ ...base, customValidate: (_data, errors) => errors });
	expect(errorMessages()).toEqual([]);
	expect(saveDisabled()).toBe(false);
	await renderForm({ ...base, liveValidate: false, customValidate });
	expect(saveDisabled()).toBe(false);
	await renderForm({ ...base, customValidate });
	expect(saveDisabled()).toBe(true);
});

it('refreshes a replaced validator and the latest simultaneous data/transform callback', async () => {
	const ref = createRef<Form>();
	const validator = getDefaultValidator();
	const schema: RJSFSchema = { type: 'object', properties: { host: { type: 'string', minLength: 5 } } };
	const base = { schema, formData: { host: 'broker-1.local' }, liveValidate: true, formReference: ref, displayErrors: true, showErrorList: false as const, validator };
	await renderForm(base);
	const reject = {
		...validator,
		validateFormData: vi.fn(() => ({
			errors: [{ name: 'custom', property: '.host', message: 'Validator changed', stack: 'Validator changed', params: {}, schemaPath: '' }],
			errorSchema: { host: { __errors: ['Validator changed'] } } as unknown as ErrorSchema
		}))
	};
	await renderForm({ ...base, validator: reject });
	expect(errorMessages()).toEqual(['Validator changed']);
	expect(saveDisabled()).toBe(true);
	await renderForm({ ...base, formData: { host: 'a' }, transformErrors: errors => errors.map(error => ({ ...error, message: 'Latest transform', stack: 'Latest transform' })) });
	expect(ref.current?.state.formData).toEqual({ host: 'a' });
	expect(errorMessages()).toEqual(['Latest transform']);
});

it('memoizes equivalent inline server errors and uses the replacement submit callback', async () => {
	const validator = getDefaultValidator();
	const validate = vi.spyOn(validator, 'validateFormData');
	const first = vi.fn();
	const latest = vi.fn();
	const base = { schema: BROKER_SCHEMA, formData: BROKER_FORM_DATA, validator, liveValidate: true };
	await renderForm({ ...base, extraErrors: { site: { __errors: ['Site is offline'] } }, onSubmit: first });
	const count = validate.mock.calls.length;
	await renderForm({ ...base, extraErrors: { site: { __errors: ['Site is offline'] } }, onSubmit: first });
	expect(validate).toHaveBeenCalledTimes(count);
	await renderForm({ ...base, extraErrors: { site: { __errors: ['Site is offline'] } }, onSubmit: latest });
	await act(async () => {
		fireStencilEvent('Submit', 'onClickButton');
	});
	expect(first).not.toHaveBeenCalled();
	expect(latest).toHaveBeenCalledOnce();
});

it('turns humanization off and lets the caller transform messages last', async () => {
	const schema: RJSFSchema = { type: 'object', properties: { host: { type: 'string', minLength: 5 } } };
	const base = { schema, formData: { host: 'a' }, liveValidate: true, displayErrors: true, showErrorList: false as const };
	await renderForm(base);
	expect(errorMessages()).toEqual(['Must be at least 5 characters.']);
	await renderForm({ ...base, humanizeErrors: false });
	expect(errorMessages()).toEqual(['must NOT have fewer than 5 characters']);
	const transformErrors = vi.fn((errors: RJSFValidationError[]) => errors.map(error => ({ ...error, message: `Connection: ${error.message}` })));
	await renderForm({ ...base, transformErrors });
	expect(transformErrors.mock.lastCall?.[0][0].message).toBe('Must be at least 5 characters.');
	expect(errorMessages()).toEqual(['Connection: Must be at least 5 characters.']);
});

it.each(['_', '__'])('shows touched ancestors with separator %s and keeps snake_case siblings untouched', async idSeparator => {
	await renderForm({ ...R2_SECTION_ERROR_SHAPE, idSeparator, showErrorList: false });
	expect(errorMessages()).toEqual([]);
	await act(async () => {
		fireStencilEvent(['root', 'tls', 'host'].join(idSeparator), 'onTextFieldFocus', 'broker-1.local');
	});
	expect(errorMessages()).toEqual(['Connection failed', 'TLS failed']);
	expect(errorMessages()).not.toContain('Version failed');
});

describe.each(R2_SELECTOR_OWNER_SHAPES)('option-selector ownership: $name', row => {
	it('uses the actual RJSF id and reveals only its owner and ancestors on focus', async () => {
		const { name: _name, selectorId, ...props } = row;
		await renderForm({ ...props, showErrorList: false });
		expect(container.querySelector(`[id="${selectorId}"]`)).not.toBeNull();
		expect(errorMessages()).toEqual([]);
		await act(async () => fireStencilEvent(selectorId, 'onFocus'));
		expect(errorMessages()).toEqual(expect.arrayContaining(['Connection failed', 'Authentication failed']));
		expect(errorMessages()).not.toContain('Audit mode failed');
	});
});

it('clears touched and submitted visibility on discard and acknowledges new saved data', async () => {
	const props = { ...R2_SECTION_ERROR_SHAPE, submittedData: { tls: { host: 'broker-0.local' }, tls_version: '1.3' }, allowDiscardChanges: true, showErrorList: false as const };
	await renderForm(props);
	await act(async () => {
		fireStencilEvent('root_tls_host', 'onTextFieldFocus', 'broker-1.local');
	});
	expect(errorMessages()).toHaveLength(2);
	await act(async () => {
		fireStencilEvent('Submit', 'onClickButton');
	});
	expect(errorMessages()).toHaveLength(3);
	await act(async () => {
		fireStencilEvent('Discard Changes', 'onClickButton');
	});
	expect(errorMessages()).toEqual([]);
	await act(async () => {
		fireStencilEvent('Submit', 'onClickButton');
	});
	expect(errorMessages()).toHaveLength(3);
	await renderForm({ ...props, submittedData: R2_SECTION_ERROR_SHAPE.formData });
	expect(errorMessages()).toEqual([]);
});

describe.each(R2_RESET_SHAPES)('reset defaults: $name', row => {
	it('gates Save using freshly validated defaults', async () => {
		const onChange = vi.fn();
		await renderForm({ ...row, liveValidate: true, allowResetToDefaults: true, onChange });
		await act(async () => {
			fireStencilEvent('Reset to Default', 'onClickButton');
		});
		const event = onChange.mock.lastCall?.[0];
		expect(event.formData).toEqual(row.expectedFormData);
		expect(event.errors.length === 0).toBe(row.expectedValid);
		expect(event.schemaValidationErrors.length === 0).toBe(row.expectedValid);
		expect(saveDisabled()).toBe(!row.expectedValid);
	});
});

describe.each(R2_ERROR_DESCRIPTION_SHAPES)('error reference: $name', row => {
	it('passes the owning mounted help element to every built-in control and clears it', async () => {
		const { fields: expectedFields, ...formProps } = row;
		await renderForm({ ...formProps, displayErrors: true, showErrorList: false });
		for (const field of expectedFields) {
			const hosts = Array.from(container.querySelectorAll(field.tag)).filter(host => field.id === 'root' || host.id === field.id);
			expect(hosts.length).toBeGreaterThan(0);
			for (const host of hosts) {
				const props = propsOf<{
					accessibleDescriptionElements: readonly Element[];
					inputConfig: { accessibleDescriptionElements: readonly Element[] };
					buttons: { accessibleDescriptionElements: readonly Element[] }[];
				}>(host);
				const references = field.tag.includes('select-dropdown')
					? props.inputConfig.accessibleDescriptionElements
					: field.tag === 'kv-toggle-button-group'
					? props.buttons[0].accessibleDescriptionElements
					: props.accessibleDescriptionElements;
				expect(references).toHaveLength(1);
				expect(references[0].id).toMatch(/-errors$/);
				expect(container.querySelectorAll(`[id="${references[0].id}"]`)).toHaveLength(1);
				expect(propsOf(references[0].querySelector('kv-form-help-text')!).helpText).toEqual([field.message]);
			}
		}
		await renderForm({ ...formProps, extraErrors: {}, displayErrors: true, showErrorList: false });
		expect(errorMessages()).toEqual([]);
		for (const field of expectedFields)
			for (const host of container.querySelectorAll(field.tag)) {
				const props = propsOf<{
					accessibleDescriptionElements: readonly Element[];
					inputConfig: { accessibleDescriptionElements: readonly Element[] };
					buttons: { accessibleDescriptionElements: readonly Element[] }[];
				}>(host);
				const references = field.tag.includes('select-dropdown')
					? props.inputConfig.accessibleDescriptionElements
					: field.tag === 'kv-toggle-button-group'
					? props.buttons[0].accessibleDescriptionElements
					: props.accessibleDescriptionElements;
				expect(references).toEqual([]);
			}
	});
});

it('refreshes UI-schema validation settings while keeping equivalent inline options stable', async () => {
	const customValidate: NonNullable<SchemaFormProps<any>['customValidate']> = (_data, errors, ui) => {
		if (ui?.['ui:options']?.offline) errors.site!.addError('Broker is offline');
		return errors;
	};
	const validator = getDefaultValidator();
	const validate = vi.spyOn(validator, 'validateFormData');
	const base = { schema: BROKER_SCHEMA, formData: BROKER_FORM_DATA, liveValidate: true, displayErrors: true, showErrorList: false as const, customValidate, validator };
	await renderForm({ ...base, uiSchema: { 'ui:options': { offline: true } } });
	expect(errorMessages()).toEqual(['Broker is offline']);
	expect(saveDisabled()).toBe(true);
	const count = validate.mock.calls.length;
	await renderForm({ ...base, uiSchema: { 'ui:options': { offline: true } } });
	expect(validate).toHaveBeenCalledTimes(count);
	await renderForm({ ...base, uiSchema: { 'ui:options': { offline: false } } });
	expect(errorMessages()).toEqual([]);
	expect(saveDisabled()).toBe(false);
});

describe.each(R2_BOUNDARY_TRANSITIONS)('pristine data: $name', row => {
	it('applies rederived boundary data when the default policy or schema changes', async () => {
		const ref = createRef<Form>();
		const base = { formData: {}, formReference: ref, liveValidate: true };
		await renderForm({ ...base, schema: row.schema });
		expect(ref.current?.state.formData).toEqual({ port: 1883 });
		await renderForm({ ...base, schema: row.nextSchema, applyDefaults: row.nextApplyDefaults });
		expect(ref.current?.state.formData).toEqual(row.expectedData);
	});
});
