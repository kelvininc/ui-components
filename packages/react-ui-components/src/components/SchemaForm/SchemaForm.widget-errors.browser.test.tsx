import React, { createRef, useCallback, useState } from 'react';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { SchemaFormContext } from './types';
import { R2_WIDGET_ERROR_SHAPES, R2_WIDGET_ERROR_TRANSITIONS } from './test-utils/matrix';

type BrokerData = { host: string };
type BrokerForm = Form<BrokerData, RJSFSchema, SchemaFormContext>;
type BrokerFormProps = FormProps<BrokerData, RJSFSchema, SchemaFormContext>;
type ConsumerSettings = { className: string; latestSubmit: boolean; noValidate: boolean };

describe.each(R2_WIDGET_ERROR_SHAPES)('real widget errors during consumer updates: $name', row => {
	it.each(R2_WIDGET_ERROR_TRANSITIONS)('preserves errors and blocks Submit for $name', async transition => {
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
					liveValidate
					displayErrors
					showErrorList={false}
					formReference={ref}
					onChange={handleChange}
					onSubmit={settings.latestSubmit ? latestSubmit : firstSubmit}
					onError={onError}
				/>
			);
		};
		let settings: ConsumerSettings = { className: 'connection-form', latestSubmit: false, noValidate: false };
		const screen = await render(<Consumer settings={settings} />);
		const messages = () =>
			Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
				.filter(host => host.state === 'invalid')
				.flatMap(host => host.helpText as string[]);
		const expectWidgetError = async () => {
			expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
			expect(ref.current?.state.errorSchema).toEqual({ host: { __errors: [row.message] } });
			await expect.poll(messages).toEqual([row.message]);
			await expect.element(screen.getByText(row.message, { exact: true })).toBeVisible();
			await expect.element(screen.getByRole('button', { name: 'Submit', exact: true })).toBeDisabled();
		};
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: 'Host', exact: true }).fill(row.nextHost);
		// Finish the consumer's controlled echo before checking the persistent error.
		await screen.rerender(<Consumer settings={settings} />);
		await whenAllKelvinReady(screen.container);
		expect(onChange.mock.lastCall?.[0].formData).toEqual({ host: row.nextHost });
		expect(onChange.mock.lastCall?.[0].errorSchema).toEqual({ host: { __errors: [row.message] } });
		await expectWidgetError();

		if (transition.change !== 'none') {
			settings = {
				...settings,
				className: transition.change === 'className' ? 'connection-form compact' : settings.className,
				latestSubmit: transition.change === 'submitCallback'
			};
			await screen.rerender(<Consumer settings={settings} />);
			await whenAllKelvinReady(screen.container);
			if (transition.change === 'className') expect(screen.container.querySelector('form')!.classList.contains('compact')).toBe(true);
			await expectWidgetError();
		}
		(screen.getByRole('button', { name: 'Submit', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		expect(firstSubmit).not.toHaveBeenCalled();
		expect(latestSubmit).not.toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();

		settings = { ...settings, noValidate: true };
		await screen.rerender(<Consumer settings={settings} />);
		await whenAllKelvinReady(screen.container);
		await expect.poll(messages).toEqual([]);
		expect(ref.current?.state.formData).toEqual({ host: row.nextHost });
		const submit = screen.getByRole('button', { name: 'Submit', exact: true });
		await expect.element(submit).toBeEnabled();
		await submit.click();
		const submitted = settings.latestSubmit ? latestSubmit : firstSubmit;
		const unused = settings.latestSubmit ? firstSubmit : latestSubmit;
		await expect.poll(() => submitted.mock.calls.length).toBe(1);
		expect(submitted.mock.lastCall?.[0]).toMatchObject({ formData: { host: row.nextHost }, status: 'submitted' });
		expect(submitted.mock.lastCall?.[1].type).toBe('submit');
		expect(unused).not.toHaveBeenCalled();
		expect(onError).not.toHaveBeenCalled();

		settings = { ...settings, noValidate: false };
		await screen.rerender(<Consumer settings={settings} />);
		await whenAllKelvinReady(screen.container);
		await expect.poll(messages).toEqual([]);
		await screen.rerender(<Consumer settings={settings} externalData={row.externalData} />);
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('textbox', { name: 'Host', exact: true })).toHaveValue(row.externalData.host);
		expect(ref.current?.state.formData).toEqual(row.externalData);
		await expect.poll(messages).toEqual([row.externalMessage]);
		await expect.element(screen.getByText(row.externalMessage, { exact: true })).toBeVisible();
		expect(ref.current?.state.schemaValidationErrors).toEqual([expect.objectContaining({ message: row.externalMessage })]);
		await expect.element(screen.getByRole('button', { name: 'Submit', exact: true })).toBeDisabled();
	});
});
