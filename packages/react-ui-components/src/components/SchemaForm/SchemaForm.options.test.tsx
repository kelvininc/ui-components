// @vitest-environment jsdom

import Form from '@rjsf/core';
import { FieldTemplateProps, getSubmitButtonOptions, getUiOptions, UiSchema } from '@rjsf/utils';
import { cloneDeepWith } from 'lodash';
import React, { act, createRef, forwardRef, memo } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { EApplyDefaults } from './types';
import {
	CUSTOM_FIELDS,
	R2_WIDGET_ERROR_SHAPES,
	R4_BRANCH_LABEL_SHAPES,
	R4_CLASS_SETTING_SHAPES,
	R4_HETEROGENEOUS_ORDER_SHAPES,
	R4_OPTION_ERROR_SHAPES,
	R4_OPTION_PAYLOAD_SHAPE,
	R4_OPTION_SHAPES,
	R4_ORDER_SHAPES,
	R4_SAME_RENDER_TEMPLATES,
	R4_SUBMIT_UI_SHAPES,
	R4_TEMPLATE_PLACEMENTS,
	R4_UI_SETTING_SHAPES,
	SUBMIT_BUTTON_SHAPES,
	TEMPLATE_COMPONENTS
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

const copySettings = (settings: UiSchema) => cloneDeepWith(settings, value => (value?.$$typeof ? value : undefined));
const helpTexts = () => Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(element => propsOf(element).helpText);
const Replacement = ({ children }: FieldTemplateProps) => <div data-template-replacement="">{children}</div>;
const ForwardReplacement = forwardRef<HTMLDivElement, FieldTemplateProps>(({ children }, ref) => (
	<div ref={ref} data-template-replacement="">
		{children}
	</div>
));
ForwardReplacement.displayName = 'ForwardReplacement';
const replacements = [Replacement, memo(Replacement), ForwardReplacement];

describe.each(R4_OPTION_SHAPES)('$name UI inheritance', row => {
	const renderForm = async (authUi: UiSchema, auth: unknown = row.values[0], revision = 0, ref = createRef<Form>()) => {
		const uiSchema = { ...row.uiSchema, 'auth': authUi, 'ui:submitButtonOptions': { norender: true } };
		const original = copySettings(uiSchema);
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={row.schema}
					uiSchema={uiSchema}
					formData={{ auth }}
					customClass={`connection-${revision}`}
					formReference={ref}
					applyDefaults={EApplyDefaults.Never}
				/>
			)
		);
		expect(uiSchema).toEqual(original);
		return ref;
	};

	describe.each(TEMPLATE_COMPONENTS)('$name component', ({ FieldLayout, name }) => {
		it.each(R4_TEMPLATE_PLACEMENTS)('keeps a %s template and its input mounted across ten rebuilt UI schemas', async placement => {
			const auth = placement === 'inherited child' ? row.values[1] : row.values[0];
			const inputId = placement === 'inherited child' ? 'root_auth_host' : 'root_auth';
			const buildUi = (): UiSchema =>
				placement === 'field'
					? { 'ui:FieldTemplate': FieldLayout }
					: placement === 'branch'
					? { [row.keyword]: [{ 'ui:FieldTemplate': FieldLayout }, {}] }
					: { host: { 'ui:FieldTemplate': FieldLayout } };
			const ref = await renderForm(buildUi(), auth);
			const input = container.querySelector(`#${inputId}`);
			expect(input).not.toBeNull();
			expect(
				ref.current?.props.uiSchema?.auth['ui:FieldTemplate'] ??
					ref.current?.props.uiSchema?.auth[row.keyword]?.[0]?.['ui:FieldTemplate'] ??
					ref.current?.props.uiSchema?.auth.host['ui:FieldTemplate']
			).toBe(FieldLayout);
			for (let revision = 1; revision <= 10; revision++) {
				await renderForm(buildUi(), auth, revision, ref);
				expect(container.querySelector(`#${inputId}`)).toBe(input);
			}
		});

		it.each(['uiSchema', 'templates', 'branch'] as const)('applies a mounted template replacement through %s', async placement => {
			const replacement = replacements[TEMPLATE_COMPONENTS.findIndex(template => template.name === name)];
			const renderTemplate = async (Template: typeof FieldLayout) =>
				act(async () =>
					root.render(
						<KvSchemaForm
							schema={row.schema}
							formData={{ auth: row.values[0] }}
							uiSchema={{
								...row.uiSchema,
								auth:
									placement === 'uiSchema'
										? { 'ui:FieldTemplate': Template }
										: placement === 'branch'
										? { [row.keyword]: [{ 'ui:FieldTemplate': Template }, {}] }
										: {}
							}}
							templates={placement === 'templates' ? { FieldTemplate: Template } : undefined}
							applyDefaults={EApplyDefaults.Never}
						/>
					)
				);
			await renderTemplate(FieldLayout);
			expect(container.querySelector('[data-template-replacement]')).toBeNull();
			await renderTemplate(replacement);
			expect(container.querySelector('[data-template-replacement]')).not.toBeNull();
		});
	});

	describe.each(R4_SAME_RENDER_TEMPLATES)('$name', ({ build }) => {
		it.each(['field', 'branch'] as const)('replaces a mounted %s type while preserving edited data and native errors', async placement => {
			const ref = createRef<Form>();
			const widget = R2_WIDGET_ERROR_SHAPES[0];
			const first = build();
			const replacement = build();
			const branchUi = { 'ui:widget': widget.uiSchema.host['ui:widget'] };
			const uiFor = (Template: typeof first): UiSchema =>
				placement === 'field' ? { 'ui:FieldTemplate': Template, [row.keyword]: [branchUi, {}] } : { [row.keyword]: [{ ...branchUi, 'ui:FieldTemplate': Template }, {}] };
			await renderForm(uiFor(first), row.values[0], 0, ref);
			const input = container.querySelector<HTMLInputElement>('input#root_auth')!;
			expect(input).not.toBeNull();
			await act(async () => {
				Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, widget.nextHost);
				input.dispatchEvent(new Event('input', { bubbles: true }));
			});
			const before = ref.current!.state;
			expect(before.errorSchema.auth.__errors).toEqual([widget.message]);
			await renderForm(uiFor(replacement), row.values[0], 1, ref);
			const form = ref.current!;
			expect(placement === 'field' ? form.state.uiSchema.auth['ui:FieldTemplate'] : form.state.uiSchema.auth[row.keyword][0]['ui:FieldTemplate']).toBe(replacement);
			expect(container.querySelector('input#root_auth')).not.toBe(input);
			expect(form.state.formData.auth).toBe(widget.nextHost);
			for (const key of ['errors', 'errorSchema', 'schemaValidationErrors', 'schemaValidationErrorSchema'] as const) expect(form.state[key]).toBe(before[key]);
		});
	});

	describe.each(R4_UI_SETTING_SHAPES)('parent $name precedence', parent => {
		describe.each(R4_UI_SETTING_SHAPES)('branch $name precedence', branch => {
			it.each(R4_BRANCH_LABEL_SHAPES)('resolves $name across UI forms', async label => {
				let effective: UiSchema;
				const Capture = (props: FieldTemplateProps) => {
					effective = props.uiSchema;
					return <>{props.children}</>;
				};
				const provided = { ...branch.build(label.branch === undefined ? {} : { label: label.branch }), 'ui:FieldTemplate': Capture };
				await renderForm({ ...parent.build({ label: label.parent }), [row.keyword]: [provided, {}] });
				expect(getUiOptions(effective!).label).toBe(label.expected);
			});
			it('lets explicit branch child widgets override inherited settings', async () => {
				await renderForm(
					{
						host: { 'ui:options': { placeholder: 'Inherited broker' }, ...parent.build({ widget: 'text' }) },
						[row.keyword]: [{}, { host: branch.build({ widget: 'password' }) }]
					},
					row.values[1]
				);
				expect(propsOf('root_auth_host').type).toBe('password');
			});
		});
	});

	it.each(R4_UI_SETTING_SHAPES)('scopes $name description and selector settings, preserving explicit branch overrides', async ({ build }) => {
		await renderForm(build({ description: 'Broker authentication help', placeholder: 'Choose an authentication method', autofocus: true }));
		expect(helpTexts().filter(text => text === 'Broker authentication help')).toHaveLength(1);
		expect(propsOf(row.selectorId).placeholder).toBe('Choose an authentication method');
		expect(propsOf('root_auth').placeholder).toBe('');
		expect(propsOf('root_auth').forcedFocus).toBeFalsy();
		await renderForm({
			...build({ description: 'Broker authentication help', placeholder: 'Choose an authentication method' }),
			[row.keyword]: [build({ description: 'Issued by the broker admin', placeholder: 'Paste the token', autofocus: true }), {}]
		});
		expect(helpTexts().filter(text => text === 'Broker authentication help')).toHaveLength(1);
		expect(helpTexts().filter(text => text === 'Issued by the broker admin')).toHaveLength(1);
		expect(propsOf('root_auth').placeholder).toBe('Paste the token');
		expect(propsOf('root_auth').forcedFocus).toBe(true);
	});

	it.each(R4_UI_SETTING_SHAPES)('scopes $name custom fields and widgets to the selector', async ({ build }) => {
		await renderForm(build({ field: CUSTOM_FIELDS.Connection }));
		expect(container.querySelectorAll('[data-custom-field="connection"]')).toHaveLength(1);
		expect(container.querySelector('kv-text-field#root_auth')).not.toBeNull();
		await renderForm({ ...build({ field: CUSTOM_FIELDS.Connection }), [row.keyword]: [build({ field: CUSTOM_FIELDS.Connection }), {}] });
		expect(container.querySelectorAll('[data-custom-field="connection"]')).toHaveLength(2);
		expect(container.querySelector('kv-text-field#root_auth')).toBeNull();
		await renderForm(build({ widget: 'radio' }));
		expect(container.querySelector(`kv-radio-list#${row.selectorId}`)).not.toBeNull();
		expect(container.querySelector('kv-text-field#root_auth')).not.toBeNull();
	});

	it.each(R4_ORDER_SHAPES)('inherits $name and leaves caller arrays untouched', async order => {
		await renderForm({ ...order.parent, [row.keyword]: [{}, order.branch] }, row.values[1]);
		const branch = container.querySelector('[data-schema-form-row="auth"] [data-schema-form-object]')!;
		expect(branch).not.toBeNull();
		expect(Array.from(branch.querySelectorAll(':scope > [data-schema-form-row]')).map(element => element.getAttribute('data-schema-form-row'))).toEqual(order.expected);
	});

	it.each(R4_CLASS_SETTING_SHAPES)('scopes $name to the selector while retaining explicit branch classes', async ({ build }) => {
		let branchClasses = '';
		const Capture = (props: FieldTemplateProps) => {
			branchClasses = props.classNames;
			return <div className={props.classNames}>{props.children}</div>;
		};
		await renderForm({ ...build({ classNames: 'selector-only' }), [row.keyword]: [{ 'ui:FieldTemplate': Capture }, {}] });
		expect(branchClasses.split(' ')).not.toContain('selector-only');
		expect(container.querySelectorAll('.selector-only')).toHaveLength(1);
		await renderForm({ ...build({ classNames: 'selector-only' }), [row.keyword]: [{ ...build({ classNames: 'branch-only' }), 'ui:FieldTemplate': Capture }, {}] });
		expect(branchClasses.split(' ')).toContain('branch-only');
		expect(container.querySelectorAll('.selector-only')).toHaveLength(1);
	});
});

describe.each(R4_HETEROGENEOUS_ORDER_SHAPES)('$name heterogeneous inherited ordering', row => {
	describe.each(R4_UI_SETTING_SHAPES)('$name', ({ build }) => {
		it.each(row.branches)('orders the branch as $expected without copying RJSF filtering', async branch => {
			await act(async () =>
				root.render(<KvSchemaForm schema={row.schema} uiSchema={{ auth: build({ order: row.order }) }} formData={branch.formData} applyDefaults={EApplyDefaults.Never} />)
			);
			const object = container.querySelector('[data-schema-form-row="auth"] [data-schema-form-object]')!;
			expect(object).not.toBeNull();
			expect(Array.from(object.querySelectorAll(':scope > [data-schema-form-row]')).map(element => element.getAttribute('data-schema-form-row'))).toEqual(branch.expected);
			expect(row.order).toEqual(['port', 'username', 'host']);
		});
	});
});

describe.each(R4_SUBMIT_UI_SHAPES)('$name submit UI', ({ build }) => {
	it.each(SUBMIT_BUTTON_SHAPES)('keeps one external footer for $name', async row => {
		const ref = createRef<Form>();
		await act(async () =>
			root.render(
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={build({ submitButtonOptions: getSubmitButtonOptions(row.uiSchema) })} formReference={ref} />
			)
		);
		expect(getSubmitButtonOptions(ref.current!.state.uiSchema).norender).toBe(true);
		expect(container.querySelector('form button[type="submit"]')).toBeNull();
		const buttons = container.querySelectorAll('kv-action-button-text');
		expect(buttons).toHaveLength(1);
		expect(propsOf(buttons[0])).toMatchObject({ text: row.label, disabled: row.disabled });
	});
});

describe.each(R4_UI_SETTING_SHAPES)('$name JSON options', ({ build }) => {
	it('clears an object-valued enum without changing its configured empty value', async () => {
		const row = R4_OPTION_PAYLOAD_SHAPE;
		const ref = createRef<Form>();
		const onChange = vi.fn();
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={row.schema}
					formData={row.formData}
					uiSchema={{ broker: build({ emptyValue: row.emptyValue }) }}
					formReference={ref}
					onChange={onChange}
					omitExtraData={false}
					liveOmit={false}
					liveValidate
					applyDefaults={EApplyDefaults.Never}
				/>
			)
		);
		expect(ref.current!.state.errors).toEqual([]);
		await act(async () => fireStencilEvent('root_broker', 'onOptionSelected', undefined));
		expect(onChange.mock.lastCall![0].formData).toEqual({ broker: row.emptyValue });
		expect(ref.current!.state.errors).toEqual([]);
	});
});

describe.each(R4_OPTION_ERROR_SHAPES)('$name hidden discriminator errors', row => {
	it('keeps the selector neutral, reports missing credentials and blocks submission', async () => {
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={row.schema}
					uiSchema={row.uiSchema}
					formData={row.formData}
					applyDefaults={EApplyDefaults.Never}
					liveValidate
					displayErrors
					showErrorList={false}
				/>
			)
		);
		expect(propsOf(row.selectorId).errorState).toBe('valid');
		const messages = Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(element => propsOf(element).helpText);
		expect(messages.filter(message => message === 'This field is required.')).toHaveLength(2);
		expect(messages.some(message => String(message).includes('Must match exactly one'))).toBe(false);
		expect(propsOf('Submit').disabled).toBe(true);
	});
});
