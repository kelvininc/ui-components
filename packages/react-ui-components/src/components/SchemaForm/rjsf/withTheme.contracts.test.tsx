// @vitest-environment jsdom

import { createRequire } from 'node:module';
import Form, { FormProps, ThemeProps, withTheme as upstreamWithTheme } from '@rjsf/core';
import { FieldProps, FieldTemplateProps, WidgetProps } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { act, createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import GuardedForm from './Form';
import withTheme from './withTheme';

const commonJs = createRequire(import.meta.url)('@rjsf/core') as { default: typeof Form; withTheme: typeof upstreamWithTheme };

describe.each([
	{ name: 'import', upstream: upstreamWithTheme, FormComponent: Form },
	{ name: 'require', upstream: commonJs.withTheme, FormComponent: commonJs.default }
])('withTheme contract against $name', ({ upstream, FormComponent }) => {
	it.each([false, true])('matches registry precedence, ButtonTemplates merging and the real Form ref (overrides=%s)', async overrides => {
		const ThemeField = () => <p data-field-source="theme">Broker configuration</p>;
		let renderedRegistry: FieldProps['registry'];
		const DirectField = ({ registry }: FieldProps) => {
			renderedRegistry = registry;
			return <p data-field-source="direct">Broker configuration</p>;
		};
		const ThemeOnlyField = () => <p>Plant configuration</p>;
		const DirectOnlyField = () => <p>Connection configuration</p>;
		const ThemeWidget = ({ id }: WidgetProps) => <input id={id} data-widget-source="theme" />;
		const DirectWidget = ({ id }: WidgetProps) => <input id={id} data-widget-source="direct" />;
		const ThemeFieldTemplate = ({ children }: FieldTemplateProps) => <div data-template-source="theme">{children}</div>;
		const DirectFieldTemplate = ({ children }: FieldTemplateProps) => <div data-template-source="direct">{children}</div>;
		const ThemeAddButton = () => <button type="button">Add broker</button>;
		const ThemeRemoveButton = () => <button type="button">Remove broker</button>;
		const DirectRemoveButton = () => <button type="button">Disconnect broker</button>;
		const ThemeSubmitButton = () => (
			<button type="submit" data-submit-source="theme">
				Save brokers
			</button>
		);
		const DirectSubmitButton = () => (
			<button type="submit" data-submit-source="direct">
				Connect brokers
			</button>
		);
		const theme: ThemeProps = {
			fields: { SchemaField: ThemeField, PlantField: ThemeOnlyField },
			widgets: { ConnectionInput: ThemeWidget, PlantInput: ThemeWidget },
			templates: {
				FieldTemplate: ThemeFieldTemplate,
				ButtonTemplates: { AddButton: ThemeAddButton, RemoveButton: ThemeRemoveButton, SubmitButton: ThemeSubmitButton }
			}
		};
		const props: FormProps = {
			schema: { type: 'object', title: 'Connections' },
			formData: {},
			validator,
			noHtml5Validate: true,
			fields: overrides ? { SchemaField: DirectField, ConnectionField: DirectOnlyField } : undefined,
			widgets: overrides ? { ConnectionInput: DirectWidget } : undefined,
			templates: overrides ? { FieldTemplate: DirectFieldTemplate, ButtonTemplates: { RemoveButton: DirectRemoveButton, SubmitButton: DirectSubmitButton } } : undefined
		};
		let upstreamProps: FormProps;
		for (const { Component, ExpectedForm, internal } of [
			{ Component: upstream(theme), ExpectedForm: FormComponent, internal: false },
			{ Component: withTheme(theme), ExpectedForm: GuardedForm, internal: true }
		]) {
			const container = document.createElement('div');
			document.body.append(container);
			const root = createRoot(container);
			const ref = createRef<Form>();
			const onSubmit = vi.fn<NonNullable<FormProps['onSubmit']>>();
			try {
				await act(async () => root.render(<Component {...props} onSubmit={onSubmit} ref={ref} />));
				const form = ref.current!;
				expect(form).toBeInstanceOf(ExpectedForm);
				expect(form.formElement.current).toBe(container.querySelector('form'));
				expect(container.querySelector('[data-field-source]')?.getAttribute('data-field-source')).toBe(overrides ? 'direct' : 'theme');
				expect(container.querySelector('[data-submit-source]')?.getAttribute('data-submit-source')).toBe(overrides ? 'direct' : 'theme');
				expect(form.props.fields).toEqual({ ...theme.fields, ...props.fields });
				expect(form.props.widgets).toEqual({ ...theme.widgets, ...props.widgets });
				expect(form.props.templates?.FieldTemplate).toBe(overrides ? DirectFieldTemplate : ThemeFieldTemplate);
				expect(form.props.templates?.ButtonTemplates).toEqual({
					AddButton: ThemeAddButton,
					RemoveButton: overrides ? DirectRemoveButton : ThemeRemoveButton,
					SubmitButton: overrides ? DirectSubmitButton : ThemeSubmitButton
				});
				if (overrides) {
					expect(renderedRegistry!.fields.PlantField).toBe(ThemeOnlyField);
					expect(renderedRegistry!.fields.ConnectionField).toBe(DirectOnlyField);
					expect(renderedRegistry!.widgets.ConnectionInput).toBe(DirectWidget);
					expect(renderedRegistry!.widgets.PlantInput).toBe(ThemeWidget);
				}
				if (internal) {
					expect(form.props.fields).toEqual(upstreamProps!.fields);
					expect(form.props.widgets).toEqual(upstreamProps!.widgets);
					expect(form.props.templates).toEqual(upstreamProps!.templates);
				} else upstreamProps = form.props;
				await act(async () => form.submit());
				expect(onSubmit).toHaveBeenCalledOnce();
				expect(onSubmit.mock.lastCall?.[0]).toMatchObject({ formData: {}, status: 'submitted' });
				expect(onSubmit.mock.lastCall?.[1].nativeEvent.target).toBe(container.querySelector('form'));
			} finally {
				await act(async () => root.unmount());
				container.remove();
			}
		}
	});
});
