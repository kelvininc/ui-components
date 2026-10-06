// @vitest-environment jsdom

import React, { act, createRef, Dispatch, SetStateAction, startTransition, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Form, { FormProps } from '@rjsf/core';
import { ErrorSchema, RJSFSchema, ValidatorType, validationDataMerge, WidgetProps } from '@rjsf/utils';
import { isEqual } from 'lodash';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { getDefaultValidator } from '../../utils';
import { KvSchemaForm } from './SchemaForm';
import { FormStateContextValue, useFormState } from './contexts';
import { SchemaFormContext, SchemaFormProps } from './types';
import { R2_ABANDONED_RENDER_SHAPES, R2_SHARED_FIELD_ID_SHAPES, R2_VALIDATOR_IDENTITY_SHAPES, R2_WIDGET_ERROR_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

type BrokerData = { host: string };
type BrokerForm = Form<BrokerData, RJSFSchema, SchemaFormContext>;
type BrokerValidator = ValidatorType<BrokerData, RJSFSchema, SchemaFormContext>;
type BrokerFormProps = FormProps<BrokerData, RJSFSchema, SchemaFormContext>;

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

const renderForm = async <T,>(props: SchemaFormProps<T, RJSFSchema, SchemaFormContext>) => act(async () => root.render(<KvSchemaForm {...props} />));
const errorMessages = () =>
	Array.from(container.querySelectorAll('kv-form-help-text'))
		.filter(element => propsOf(element).state === 'invalid')
		.flatMap(element => propsOf(element).helpText as string[]);
const submitDisabled = () => propsOf('Submit').disabled;

describe.each(R2_WIDGET_ERROR_SHAPES)('widget error lifetime: $name', row => {
	it('preserves the widget error and edited data until validation settings refresh', async () => {
		const ref = createRef<BrokerForm>();
		const onChange = vi.fn<NonNullable<BrokerFormProps['onChange']>>();
		const onSubmit = vi.fn<NonNullable<BrokerFormProps['onSubmit']>>();
		const props = {
			schema: row.schema,
			uiSchema: row.uiSchema,
			formData: row.formData,
			liveValidate: true,
			displayErrors: true,
			showErrorList: false as const,
			formReference: ref,
			onChange,
			onSubmit
		};
		await renderForm(props);
		const input = container.querySelector<HTMLInputElement>('input#root_host')!;
		const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
		await act(async () => {
			setNativeValue.call(input, row.nextHost);
			input.dispatchEvent(new Event('input', { bubbles: true }));
		});
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData).toEqual({ host: row.nextHost });
		expect(onChange.mock.lastCall?.[0].errorSchema).toEqual({ host: { __errors: [row.message] } });
		expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
		expect(ref.current?.state.schemaValidationErrors).toEqual([]);
		expect(ref.current?.state.errorSchema).toEqual({ host: { __errors: [row.message] } });
		expect(errorMessages()).toEqual([row.message]);
		expect(submitDisabled()).toBe(true);

		await renderForm({ ...props, noValidate: true });
		expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
		expect(errorMessages()).toEqual([]);
		expect(submitDisabled()).toBe(false);
		await act(async () => {
			fireStencilEvent('Submit', 'onClickButton');
		});
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: { host: row.nextHost }, status: 'submitted' });
		expect(onSubmit.mock.lastCall?.[1].type).toBe('submit');
	});
});

describe.each(R2_ABANDONED_RENDER_SHAPES)('abandoned external render: $name', row => {
	it('keeps unsaved data after a suspended external update is cancelled', async () => {
		const ref = createRef<BrokerForm>();
		const onChange = vi.fn<NonNullable<BrokerFormProps['onChange']>>();
		const onSubmit = vi.fn<NonNullable<BrokerFormProps['onSubmit']>>();
		const entered = vi.fn();
		let release!: () => void;
		const pending = new Promise<void>(resolve => {
			release = resolve;
		});
		type Frame = { formData: BrokerData; suspend: boolean; revision: number };
		let updateFrame!: Dispatch<SetStateAction<Frame>>;
		const SuspendAfterForm = ({ suspended }: { suspended: boolean }): React.ReactElement | null => {
			if (suspended) {
				entered();
				throw pending;
			}
			return null;
		};
		const Harness = () => {
			const [frame, setFrame] = useState<Frame>({ formData: row.formData, suspend: false, revision: 0 });
			updateFrame = setFrame;
			return (
				<Suspense fallback={<p data-broker-loading="">Loading broker</p>}>
					<KvSchemaForm
						schema={row.schema}
						formData={frame.formData}
						customClass={`connection-${frame.revision}`}
						liveValidate
						formReference={ref}
						onChange={onChange}
						onSubmit={onSubmit}
					/>
					<SuspendAfterForm suspended={frame.suspend} />
				</Suspense>
			);
		};
		await act(async () => root.render(<Harness />));
		await act(async () => {
			fireStencilEvent('root_host', 'onTextChange', row.editedData.host);
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.editedData);
		expect(ref.current?.state.formData).toEqual(row.editedData);
		await act(async () => {
			startTransition(() => updateFrame({ formData: row.pendingData, suspend: true, revision: 1 }));
		});
		expect(entered).toHaveBeenCalled();
		expect(container.querySelector('[data-broker-loading]')).toBeNull();
		expect(container.querySelector('#root_host')?.getAttribute('data-value')).toBe(row.editedData.host);

		await act(async () => updateFrame({ formData: row.formData, suspend: false, revision: 2 }));
		expect(ref.current?.state.formData).toEqual(row.editedData);
		expect(container.querySelector('#root_host')?.getAttribute('data-value')).toBe(row.editedData.host);
		await act(async () => {
			fireStencilEvent('Submit', 'onClickButton');
		});
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: row.editedData, status: 'submitted' });
		await act(async () => release());
		expect(ref.current?.state.formData).toEqual(row.editedData);
	});
});

class ConnectionPolicyValidator implements BrokerValidator {
	#delegate: BrokerValidator;
	#rejects: boolean;
	#message: string;

	constructor(delegate: BrokerValidator, rejects: boolean, message: string) {
		this.#delegate = delegate;
		this.#rejects = rejects;
		this.#message = message;
	}

	validateFormData(...args: Parameters<BrokerValidator['validateFormData']>) {
		const result = this.#delegate.validateFormData(...args);
		// RJSF 5 types string error leaves as strings; its runtime uses __errors objects.
		const policyErrors = { host: { __errors: [this.#message] } } as unknown as ErrorSchema<BrokerData>;
		return this.#rejects ? validationDataMerge(result, policyErrors) : result;
	}

	toErrorList(errorSchema?: ErrorSchema<BrokerData>, fieldPath?: string[]) {
		return this.#delegate.toErrorList(errorSchema, fieldPath);
	}

	isValid(...args: Parameters<BrokerValidator['isValid']>) {
		return this.#delegate.isValid(...args);
	}

	rawValidation<Result = unknown>(schema: RJSFSchema, formData?: BrokerData) {
		return this.#delegate.rawValidation<Result>(schema, formData);
	}
}

describe.each(R2_VALIDATOR_IDENTITY_SHAPES)('validator identity: $name', row => {
	it('refreshes equal-looking validator instances against the current edited data', async () => {
		const delegate = getDefaultValidator<BrokerData, RJSFSchema, SchemaFormContext>();
		const first = new ConnectionPolicyValidator(delegate, row.firstRejects, row.message);
		const replacement = new ConnectionPolicyValidator(delegate, row.nextRejects, row.message);
		expect(first).not.toBe(replacement);
		expect(isEqual(first, replacement)).toBe(true);
		const ref = createRef<BrokerForm>();
		const onChange = vi.fn<NonNullable<BrokerFormProps['onChange']>>();
		const onSubmit = vi.fn<NonNullable<BrokerFormProps['onSubmit']>>();
		const onError = vi.fn();
		const props = {
			schema: row.schema,
			formData: row.formData,
			liveValidate: true,
			displayErrors: true,
			showErrorList: false as const,
			formReference: ref,
			onChange,
			onSubmit,
			onError
		};
		await renderForm({ ...props, validator: first });
		await act(async () => {
			fireStencilEvent('root_host', 'onTextChange', row.editedData.host);
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.editedData);
		expect(errorMessages()).toEqual(row.firstRejects ? [row.message] : []);

		await renderForm({ ...props, validator: replacement });
		expect(ref.current?.props.validator).toBe(replacement);
		expect(ref.current?.state.schemaUtils.getValidator()).toBe(replacement);
		expect(ref.current?.state.formData).toEqual(row.editedData);
		expect(errorMessages()).toEqual(row.nextRejects ? [row.message] : []);
		expect(submitDisabled()).toBe(row.nextRejects);
		await act(async () => {
			fireStencilEvent('Submit', 'onClickButton', undefined, { force: true });
		});
		if (row.nextRejects) {
			expect(onSubmit).not.toHaveBeenCalled();
			expect(onError).toHaveBeenCalledOnce();
			expect(onError.mock.lastCall?.[0].map((error: { message: string }) => error.message)).toEqual([row.message]);
		} else {
			expect(onError).not.toHaveBeenCalled();
			expect(onSubmit).toHaveBeenCalledOnce();
			expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: row.editedData, status: 'submitted' });
		}
	});
});

describe.each(R2_SHARED_FIELD_ID_SHAPES)('shared field registration: $name', row => {
	it('keeps the remaining field linked to touched ancestors after removing its duplicate', async () => {
		let stateApi!: FormStateContextValue;
		const HostInput = ({ id, value, onChange }: WidgetProps) => {
			const state = useFormState();
			stateApi = state;
			return <input id={id} aria-label="Host" value={value ?? ''} onChange={event => onChange(event.target.value)} onFocus={() => state.markFieldAsTouched(id)} />;
		};
		const onChange = vi.fn();
		const ref = createRef<Form<typeof row.formData, RJSFSchema, SchemaFormContext>>();
		await renderForm({
			schema: row.schema,
			formData: row.formData,
			uiSchema: { authentication: { host: { 'ui:widget': HostInput } } },
			extraErrors: row.extraErrors,
			showErrorList: false,
			formReference: ref,
			onChange
		});
		expect(container.querySelectorAll(`input[id="${row.fieldId}"]`)).toHaveLength(2);
		expect(errorMessages()).toEqual([]);
		await act(async () => {
			const options = propsOf(row.selectorId).options as Record<string, { value: string }>;
			fireStencilEvent(row.selectorId, 'onOptionSelected', Object.values(options)[Number(row.nextOption)].value);
		});
		expect(container.querySelectorAll(`input[id="${row.fieldId}"]`)).toHaveLength(1);
		expect(onChange).toHaveBeenCalled();
		expect(ref.current?.state.formData).toEqual(onChange.mock.lastCall?.[0].formData);
		await act(async () => stateApi.resetAllFieldStates());
		expect(errorMessages()).toEqual([]);
		await act(async () => container.querySelector<HTMLInputElement>(`input[id="${row.fieldId}"]`)!.focus());
		expect(stateApi.isFieldTouched(row.fieldId)).toBe(true);
		expect(stateApi.isFieldOrNestedTouched(row.parentId)).toBe(true);
		expect(stateApi.isFieldOrNestedTouched('root')).toBe(true);
		expect(errorMessages()).toEqual([row.message]);
	});
});
