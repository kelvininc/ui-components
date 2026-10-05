import React from 'react';
import { ErrorSchema } from '@rjsf/utils';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { R2NativeSubmitData, R2_NATIVE_SUBMIT_SHAPES } from './test-utils/matrix';

describe.each(R2_NATIVE_SUBMIT_SHAPES)('Enter submission visibility: $name', row => {
	it('reveals the untouched client secret error and forwards the real callback once', async () => {
		const onSubmit = vi.fn();
		const onError = vi.fn();
		const onChange = vi.fn();
		const screen = await render(
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
				onSubmit={onSubmit}
				onError={onError}
				onChange={onChange}
			>
				<button type="submit">Submit connection</button>
			</KvSchemaForm>
		);
		await whenAllKelvinReady(screen.container);
		const messages = () =>
			Array.from(screen.container.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text'))
				.filter(host => host.state === 'invalid')
				.flatMap(host => host.helpText as string[]);
		expect(messages()).toEqual([]);
		const submitted = vi.fn();
		screen.container.querySelector('form')!.addEventListener('submit', submitted);
		const brokerHost = screen.getByRole('textbox', { name: 'Broker host', exact: true });
		await brokerHost.click();
		expect(document.activeElement).toBe(brokerHost.element());
		expect(messages()).toEqual([]);
		await userEvent.keyboard('{Enter}');
		if (row.accepted) {
			await expect.poll(() => onSubmit.mock.calls.length).toBe(1);
			expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: row.formData, status: 'submitted' });
			expect(onSubmit.mock.lastCall?.[1].type).toBe('submit');
			expect(onError).not.toHaveBeenCalled();
		} else {
			await expect.poll(() => onError.mock.calls.length).toBe(1);
			expect(onError.mock.lastCall?.[0]).toEqual([expect.objectContaining({ property: 'secret', message: row.message })]);
			expect(onSubmit).not.toHaveBeenCalled();
		}
		expect(submitted).toHaveBeenCalledOnce();
		expect((submitted.mock.lastCall?.[0] as SubmitEvent).submitter).toBe(screen.getByRole('button', { name: 'Submit connection', exact: true }).element());
		await expect.poll(messages).toEqual([row.message]);
		await whenAllKelvinReady(screen.container);
		const secretOwner = screen.container.querySelector('#root_secret')!.closest('[data-schema-form-field]')!;
		const help = secretOwner.querySelector<HTMLKvFormHelpTextElement>('kv-form-help-text')!;
		expect(help.helpText).toEqual([row.message]);
		expect(help.shadowRoot!.textContent).toContain(row.message);

		await screen.getByRole('button', { name: 'Discard Changes', exact: true }).click();
		await expect.poll(messages).toEqual([]);
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.submittedData);
		expect(onSubmit).toHaveBeenCalledTimes(row.accepted ? 1 : 0);
		expect(onError).toHaveBeenCalledTimes(row.accepted ? 0 : 1);
	});
});
