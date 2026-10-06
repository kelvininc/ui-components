// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { FormProps, getDefaultRegistry } from '@rjsf/core';
import { FieldProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { act, ComponentClass, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { TEMPLATE_COMPONENTS } from '../test-utils/matrix';
import GuardedForm from './Form';
import { generateSchemaField } from './SchemaField';

const commonJs = createRequire(import.meta.url)('@rjsf/core') as { default: typeof Form; getDefaultRegistry: typeof getDefaultRegistry };
const IdentitySchemaField = generateSchemaField();

describe.each([
	{ name: 'import', UpstreamForm: Form, defaultRegistry: getDefaultRegistry() },
	{ name: 'require', UpstreamForm: commonJs.default, defaultRegistry: commonJs.getDefaultRegistry() }
])('component identity contract through $name', ({ UpstreamForm, defaultRegistry }) => {
	describe.each(TEMPLATE_COMPONENTS)('$name template', ({ FieldLayout }) => {
		it('pins upstream function equality and preserves ordinary Form/SchemaField update decisions', () => {
			const props: FormProps = { schema: { type: 'string', title: 'Broker host' }, formData: 'broker.local', validator, uiSchema: { 'ui:FieldTemplate': FieldLayout } };
			const upstream = new UpstreamForm(props);
			const guarded = new GuardedForm(props);
			for (const next of [props, { ...props, disabled: true }, { ...props, formData: 'standby.local' }]) {
				expect(guarded.shouldComponentUpdate(next, guarded.state)).toBe(upstream.shouldComponentUpdate(next, upstream.state));
			}
			const replacement = typeof FieldLayout === 'function' ? () => null as React.ReactElement | null : Object.assign({}, FieldLayout);
			const changed = { ...props, uiSchema: { 'ui:FieldTemplate': replacement as typeof FieldLayout } };
			expect(upstream.shouldComponentUpdate(changed, upstream.state)).toBe(false);
			expect(guarded.shouldComponentUpdate(changed, guarded.state)).toBe(true);

			const fieldProps: FieldProps = {
				schema: props.schema,
				uiSchema: props.uiSchema,
				idSchema: { $id: 'root' },
				name: 'host',
				formData: props.formData,
				onChange: () => undefined,
				onBlur: () => undefined,
				onFocus: () => undefined,
				registry: upstream.getRegistry()
			};
			const UpstreamField = defaultRegistry.fields.SchemaField as ComponentClass<FieldProps>;
			const upstreamField = new UpstreamField(fieldProps);
			const identityField = new IdentitySchemaField(fieldProps);
			for (const next of [fieldProps, { ...fieldProps, disabled: true }, { ...fieldProps, formData: 'standby.local' }]) {
				expect(identityField.shouldComponentUpdate(next)).toBe(Reflect.apply(upstreamField.shouldComponentUpdate!, upstreamField, [next]));
			}
			const changedField = { ...fieldProps, uiSchema: changed.uiSchema };
			expect(Reflect.apply(upstreamField.shouldComponentUpdate!, upstreamField, [changedField])).toBe(false);
			expect(identityField.shouldComponentUpdate(changedField)).toBe(true);
		});
	});

	it('inherits the actual SchemaField render and matches upstream built-in dispatch', async () => {
		const UpstreamField = defaultRegistry.fields.SchemaField as ComponentClass<FieldProps>;
		expect(IdentitySchemaField.prototype.render).toBe(getDefaultRegistry().fields.SchemaField.prototype.render);
		const rendered: string[] = [];
		for (const FormComponent of [UpstreamForm, GuardedForm]) {
			const container = document.createElement('div');
			const root = createRoot(container);
			const ref = createRef<Form>();
			try {
				await act(async () =>
					root.render(
						<FormComponent
							schema={{ type: 'object', properties: { host: { type: 'string', title: 'Host' } } }}
							formData={{ host: 'broker.local' }}
							validator={validator}
							fields={{ SchemaField: FormComponent === GuardedForm ? IdentitySchemaField : UpstreamField }}
							ref={ref}
						/>
					)
				);
				rendered.push(container.innerHTML);
				await act(async () =>
					root.render(
						<FormComponent
							schema={{ type: 'object', properties: { host: { type: 'string', title: 'Host' } } }}
							formData={{ host: 'standby.local' }}
							validator={validator}
							fields={{ SchemaField: FormComponent === GuardedForm ? IdentitySchemaField : UpstreamField }}
							ref={ref}
						/>
					)
				);
				expect(container.querySelector<HTMLInputElement>('input')?.value).toBe('standby.local');
			} finally {
				await act(async () => root.unmount());
			}
		}
		expect(rendered[1]).toBe(rendered[0]);
	});
});
