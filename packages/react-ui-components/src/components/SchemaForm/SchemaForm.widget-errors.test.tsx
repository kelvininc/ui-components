// @vitest-environment jsdom

import React, { act, createRef, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { SchemaFormContext } from './types';
import { R2_WIDGET_ERROR_POLICIES, R2_WIDGET_ERROR_SHAPES, R2_WIDGET_ERROR_TRANSITIONS } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

type BrokerData = { host: string };
type BrokerForm = Form<BrokerData, RJSFSchema, SchemaFormContext>;
type BrokerFormProps = FormProps<BrokerData, RJSFSchema, SchemaFormContext>;
type ConsumerSettings = { className: string; latestSubmit: boolean; noValidate: boolean; liveValidate: boolean };

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

const messages = () =>
	Array.from(container.querySelectorAll('kv-form-help-text'))
		.filter(element => propsOf(element).state === 'invalid')
		.flatMap(element => propsOf(element).helpText as string[]);

describe.each(R2_WIDGET_ERROR_POLICIES)('widget error policy: $name', policy => {
	describe.each(R2_WIDGET_ERROR_SHAPES)('widget errors during consumer updates: $name', row => {
		it.each(R2_WIDGET_ERROR_TRANSITIONS)('preserves errors for $name until validation changes', async transition => {
			const ref = createRef<BrokerForm>();
			const onChange = vi.fn<NonNullable<BrokerFormProps['onChange']>>();
			const firstSubmit = vi.fn<NonNullable<BrokerFormProps['onSubmit']>>();
			const latestSubmit = vi.fn<NonNullable<BrokerFormProps['onSubmit']>>();
			const onError = vi.fn<NonNullable<BrokerFormProps['onError']>>();
			const Consumer = ({ settings, externalData }: { settings: ConsumerSettings; externalData?: BrokerData }) => {
				const [data, setData] = useState(row.formData);
				const handleChange = useCallback<NonNullable<BrokerFormProps['onChange']>>(
					(event, id) => {
						onChange(event, id);
						if (transition.controlled) setData(event.formData);
					},
					[onChange, transition.controlled]
				);
				return (
					<KvSchemaForm
						schema={row.schema}
						uiSchema={row.uiSchema}
						formData={externalData ?? data}
						className={settings.className}
						noValidate={settings.noValidate}
						liveValidate={settings.liveValidate}
						displayErrors
						showErrorList={false}
						formReference={ref}
						onChange={handleChange}
						onSubmit={settings.latestSubmit ? latestSubmit : firstSubmit}
						onError={onError}
					/>
				);
			};
			let settings: ConsumerSettings = { className: 'connection-form', latestSubmit: false, noValidate: false, liveValidate: policy.liveValidate };
			const renderConsumer = async (externalData?: BrokerData) => act(async () => root.render(<Consumer settings={settings} externalData={externalData} />));
			const expectWidgetError = () => {
				expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
				expect(ref.current?.state.errorSchema).toEqual({ host: { __errors: [row.message] } });
				expect(messages()).toEqual([row.message]);
				expect(propsOf('Submit').disabled).toBe(policy.liveValidate);
			};
			await renderConsumer();
			const input = container.querySelector<HTMLInputElement>('input#root_host')!;
			const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
			await act(async () => {
				setNativeValue.call(input, row.nextHost);
				input.dispatchEvent(new Event('input', { bubbles: true }));
			});
			expect(onChange.mock.lastCall?.[0].formData).toEqual({ host: row.nextHost });
			expect(onChange.mock.lastCall?.[0].errorSchema).toEqual({ host: { __errors: [row.message] } });
			expectWidgetError();

			if (transition.change !== 'none') {
				settings = {
					...settings,
					className: transition.change === 'className' ? 'connection-form compact' : settings.className,
					latestSubmit: transition.change === 'submitCallback'
				};
				await renderConsumer();
				if (transition.change === 'className') expect(container.querySelector('form')!.classList.contains('compact')).toBe(true);
				expectWidgetError();
			}
			expect(firstSubmit).not.toHaveBeenCalled();
			expect(latestSubmit).not.toHaveBeenCalled();
			expect(onError).not.toHaveBeenCalled();

			settings = { ...settings, noValidate: true };
			await renderConsumer();
			expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
			expect(messages()).toEqual([]);
			expect(propsOf('Submit').disabled).toBe(false);
			await act(async () => {
				fireStencilEvent('Submit', 'onClickButton');
			});
			const submitted = settings.latestSubmit ? latestSubmit : firstSubmit;
			const unused = settings.latestSubmit ? firstSubmit : latestSubmit;
			expect(submitted).toHaveBeenCalledOnce();
			expect(submitted.mock.lastCall?.[0]).toMatchObject({ formData: { host: row.nextHost }, status: 'submitted' });
			expect(submitted.mock.lastCall?.[1].type).toBe('submit');
			expect(unused).not.toHaveBeenCalled();
			expect(onError).not.toHaveBeenCalled();

			settings = { ...settings, noValidate: false, liveValidate: true };
			await renderConsumer();
			expect(messages()).toEqual([]);
			await renderConsumer(row.externalData);
			expect(ref.current?.state.formData).toEqual(row.externalData);
			expect(container.querySelector<HTMLInputElement>('input#root_host')!.value).toBe(row.externalData.host);
			expect(messages()).toEqual([row.externalMessage]);
			expect(ref.current?.state.schemaValidationErrors).toEqual([expect.objectContaining({ message: row.externalMessage })]);
			expect(propsOf('Submit').disabled).toBe(true);
		});
	});
});
