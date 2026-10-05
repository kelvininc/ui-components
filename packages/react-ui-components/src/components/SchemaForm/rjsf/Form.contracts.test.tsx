// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { FormProps, FormState } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { isEqual } from 'lodash';
import React, { act, ComponentType, createRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { R2_WIDGET_ERROR_SHAPES } from '../test-utils/matrix';
import GuardedForm, { areValidationConfigsEqual, getValidationConfig } from './Form';

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
type BrokerData = { host: string };
type BrokerProps = FormProps<BrokerData>;
const mounts: { root: Root; container: HTMLDivElement }[] = [];

afterEach(async () => {
	for (const { root, container } of mounts.splice(0)) {
		await act(async () => root.unmount());
		container.remove();
	}
	vi.restoreAllMocks();
});

async function mountForm(FormComponent: ComponentType<BrokerProps>, props: BrokerProps) {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);
	mounts.push({ root, container });
	const ref = createRef<Form<BrokerData>>();
	const render = (next: BrokerProps) => act(async () => root.render(<FormComponent {...next} ref={ref} />));
	await render(props);
	return { container, form: ref.current!, render };
}

async function editHost(container: HTMLDivElement, value: string) {
	const input = container.querySelector<HTMLInputElement>('input')!;
	const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
	await act(async () => {
		setNativeValue.call(input, value);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

const errorsOf = ({ errors, errorSchema, schemaValidationErrors, schemaValidationErrorSchema }: FormState<BrokerData>) => ({
	errors,
	errorSchema,
	schemaValidationErrors,
	schemaValidationErrorSchema
});
const hostErrors = ({ errorSchema }: FormState<BrokerData>) => errorSchema.host?.__errors ?? [];

describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('guarded Form lifecycle against $name', ({ FormComponent }) => {
	describe.each(R2_WIDGET_ERROR_SHAPES)('$name', row => {
		it.each([true, false])('preserves all native errors on an equal-edit echo with liveValidate=%s', async liveValidate => {
			const props: BrokerProps = { ...row, validator, liveValidate, showErrorList: false };
			const upstream = await mountForm(FormComponent, props);
			const guarded = await mountForm(GuardedForm, props);
			for (const mounted of [upstream, guarded]) {
				await editHost(mounted.container, row.nextHost);
				expect(mounted.form.state.errorSchema).toEqual({ host: { __errors: [row.message] } });
			}
			const nativeErrors = errorsOf(guarded.form.state);
			const upstreamBuild = vi.spyOn(upstream.form, 'getStateFromProps');
			const guardedBuild = vi.spyOn(guarded.form, 'getStateFromProps');
			const next: BrokerProps = { ...props, formData: { host: row.nextHost }, className: 'broker-settings', disabled: true, children: <p>Connection status</p> };
			await upstream.render(next);
			await guarded.render(next);
			expect(upstreamBuild).toHaveBeenCalled();
			expect(hostErrors(upstream.form.state)).toEqual([]);
			expect(guardedBuild).not.toHaveBeenCalled();
			expect(guarded.form.state.formData).toEqual(next.formData);
			expect(errorsOf(guarded.form.state)).toEqual(nativeErrors);
			for (const key of Object.keys(nativeErrors) as (keyof typeof nativeErrors)[]) expect(guarded.form.state[key]).toBe(nativeErrors[key]);
			expect(guarded.container.querySelector('form')?.classList.contains('broker-settings')).toBe(true);
			expect(guarded.container.textContent).toContain('Connection status');
			expect(guarded.form.props.disabled).toBe(true);
		});

		it.each([true, false])('recomputes ids upstream while preserving native errors with liveValidate=%s', async liveValidate => {
			const props: BrokerProps = { ...row, validator, liveValidate, showErrorList: false };
			const upstream = await mountForm(FormComponent, props);
			const guarded = await mountForm(GuardedForm, props);
			for (const mounted of [upstream, guarded]) await editHost(mounted.container, row.nextHost);
			const nativeErrors = errorsOf(guarded.form.state);
			const build = vi.spyOn(guarded.form, 'getStateFromProps');
			const next: BrokerProps = { ...props, formData: { host: row.nextHost }, idPrefix: 'plant', idSeparator: '/' };
			await upstream.render(next);
			await guarded.render(next);
			expect(build).toHaveBeenCalled();
			expect(guarded.form.state.idSchema).toEqual(upstream.form.state.idSchema);
			expect(guarded.form.state.idSchema.host.$id).toBe('plant/host');
			expect(guarded.container.querySelector('input')?.id).toBe('plant/host');
			expect(guarded.form.state.formData).toEqual(next.formData);
			expect(errorsOf(guarded.form.state)).toEqual(nativeErrors);
			for (const key of Object.keys(nativeErrors) as (keyof typeof nativeErrors)[]) expect(guarded.form.state[key]).toBe(nativeErrors[key]);
		});

		it.each(['external invalid broker', 'validation disabled', 'hostname rule changed'])('delegates %s to the real upstream lifecycle', async transition => {
			const props: BrokerProps = { ...row, validator, liveValidate: true, showErrorList: false };
			const upstream = await mountForm(FormComponent, props);
			const guarded = await mountForm(GuardedForm, props);
			for (const mounted of [upstream, guarded]) await editHost(mounted.container, row.nextHost);
			const build = vi.spyOn(guarded.form, 'getStateFromProps');
			const next: BrokerProps = {
				...props,
				formData: { host: transition === 'external invalid broker' ? 'a' : row.nextHost },
				noValidate: transition === 'validation disabled',
				schema: transition === 'hostname rule changed' ? { ...row.schema, properties: { host: { type: 'string', minLength: 40 } } } : row.schema
			};
			await upstream.render(next);
			await guarded.render(next);
			expect(build).toHaveBeenCalled();
			expect(guarded.form.state.formData).toEqual(upstream.form.state.formData);
			expect(guarded.form.state.idSchema).toEqual(upstream.form.state.idSchema);
			expect(errorsOf(guarded.form.state)).toEqual(errorsOf(upstream.form.state));
			expect(hostErrors(guarded.form.state)).not.toContain(row.message);
			expect(guarded.form.state.schemaValidationErrors.length).toBe(transition === 'validation disabled' ? 0 : 1);
		});
	});
});

describe('validation configuration', () => {
	const props: BrokerProps = { schema: R2_WIDGET_ERROR_SHAPES[0].schema, validator, liveValidate: true };

	it('excludes presentation, callbacks and submission policy from validation refreshes', () => {
		const next: BrokerProps = {
			...props,
			formData: { host: 'broker-2.local' },
			className: 'broker-settings',
			disabled: true,
			readonly: true,
			children: <p>Connection status</p>,
			onChange: vi.fn(),
			onSubmit: vi.fn(),
			onError: vi.fn(),
			formContext: { site: 'Lisbon' },
			omitExtraData: true,
			liveOmit: true,
			extraErrorsBlockSubmit: true,
			idPrefix: 'plant',
			idSeparator: '/'
		};
		expect(areValidationConfigsEqual(getValidationConfig(props), getValidationConfig(next))).toBe(true);
	});

	it('compares equal-looking validators by identity', () => {
		// These fixtures compare own properties without invoking validation methods.
		const first = { ...validator } as unknown as BrokerProps['validator'];
		const next = { ...validator } as unknown as BrokerProps['validator'];
		expect(isEqual(first, next)).toBe(true);
		expect(areValidationConfigsEqual(getValidationConfig({ ...props, validator: first }), getValidationConfig({ ...props, validator: next }))).toBe(false);
	});

	it.each([
		{ name: 'customValidate', first: { customValidate: (_data, errors) => errors }, next: { customValidate: (_data, errors) => errors } },
		{ name: 'transformErrors', first: { transformErrors: errors => errors }, next: { transformErrors: errors => errors } },
		{ name: 'experimental_customMergeAllOf', first: { experimental_customMergeAllOf: schema => schema }, next: { experimental_customMergeAllOf: schema => schema } }
	] satisfies { name: string; first: Partial<BrokerProps>; next: Partial<BrokerProps> }[])('compares $name by identity', ({ first, next }) => {
		expect(areValidationConfigsEqual(getValidationConfig({ ...props, ...first }), getValidationConfig({ ...props, ...next }))).toBe(false);
	});

	it('recognizes validation inputs and equivalent inline trees', () => {
		// RJSF's mapped string leaf type differs from its runtime __errors object.
		const extraErrors = { host: { __errors: ['Broker offline'] } } as unknown as BrokerProps['extraErrors'];
		const config = getValidationConfig({ ...props, uiSchema: { 'ui:options': { offline: true } }, extraErrors });
		expect(
			areValidationConfigsEqual(
				config,
				getValidationConfig({
					...props,
					uiSchema: { 'ui:options': { offline: true } },
					extraErrors: { host: { __errors: ['Broker offline'] } } as unknown as BrokerProps['extraErrors']
				})
			)
		).toBe(true);
		const replacements: (typeof config)[] = [
			{ ...config, schema: { ...props.schema, required: ['host', 'port'] } },
			{ ...config, uiSchema: { 'ui:options': { offline: false } } },
			{ ...config, extraErrors: undefined },
			{ ...config, liveValidate: false },
			{ ...config, noValidate: true },
			{ ...config, experimental_defaultFormStateBehavior: { emptyObjectFields: 'skipDefaults' as const } }
		];
		for (const next of replacements) expect(areValidationConfigsEqual(config, next)).toBe(false);
	});
});
