import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { EApplyDefaults } from './types';
import { R4_BRANCH_PRESENTATIONS, R4_OPTION_SHAPES, R4_REPORT_SCOPE_SHAPES, R4_TEMPLATE_PLACEMENTS, TEMPLATE_COMPONENTS } from './test-utils/matrix';

const borders = (container: HTMLElement) => ['auth', 'audit'].map(name => getComputedStyle(container.querySelector(`[data-schema-form-row="${name}"]`)!).borderTopWidth);
const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};
const chooseOption = async (label: string) => {
	await expect
		.poll(() =>
			Array.from(document.querySelectorAll('kv-select-multi-options'))
				.flatMap(host =>
					Array.from(host.shadowRoot?.querySelector('kv-virtualized-list')?.shadowRoot?.querySelectorAll<HTMLKvSelectOptionElement>('kv-select-option') ?? [])
				)
				.find(option => option.label === label)
		)
		.toBeDefined();
	const options = Array.from(document.querySelectorAll('kv-select-multi-options')).flatMap(host =>
		Array.from(host.shadowRoot?.querySelector('kv-virtualized-list')?.shadowRoot?.querySelectorAll<HTMLKvSelectOptionElement>('kv-select-option') ?? [])
	);
	const option = options.find(option => option.label === label)!;
	await option.componentOnReady();
	await userEvent.click(option.shadowRoot!.querySelector('[part="option-container"]')!);
};

describe.each(R4_OPTION_SHAPES)('$name selected branch layout', row => {
	it.each(R4_BRANCH_PRESENTATIONS)('uses the effective $name branch UI for section dividers through scalar/object rerenders', async presentation => {
		const uiSchema: UiSchema = { ...row.uiSchema, 'ui:inline': presentation.inline, 'auth': { [row.keyword]: [{}, presentation.uiSchema] } };
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={uiSchema} formData={{ auth: row.values[0] }} applyDefaults={EApplyDefaults.Never} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['0px', '0px']);
		await screen.rerender(<KvSchemaForm schema={row.schema} uiSchema={uiSchema} formData={{ auth: row.values[1] }} applyDefaults={EApplyDefaults.Never} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(presentation.section && !presentation.inline ? ['1px', '1px'] : ['0px', '0px']);
		await screen.rerender(<KvSchemaForm schema={row.schema} uiSchema={uiSchema} formData={{ auth: row.values[0] }} applyDefaults={EApplyDefaults.Never} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['0px', '0px']);
	});

	it('keeps an explicitly selected empty object divided until the user chooses a scalar', async () => {
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={{ auth: row.values[0] }} applyDefaults={EApplyDefaults.Never} onChange={onChange} />
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: 'Authentication', exact: true }).click();
		await chooseOption('Broker address');
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('textbox', { name: 'Host', exact: true })).toBeVisible();
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData.auth).toBeUndefined();
		expect(borders(screen.container)).toEqual(['1px', '1px']);
		await screen.getByRole('textbox', { name: 'Authentication', exact: true }).click();
		await chooseOption('Token');
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['0px', '0px']);
	});

	it('removes the selected branch report when a union becomes an ordinary scalar', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={{ auth: row.values[1] }} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['1px', '1px']);
		const scalar: RJSFSchema = { ...row.schema, properties: { ...row.schema.properties, auth: { type: 'string', title: 'Authentication' } } };
		await screen.rerender(<KvSchemaForm schema={scalar} uiSchema={row.uiSchema} formData={{ auth: row.values[0] }} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['0px', '0px']);
		await screen.rerender(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={{ auth: row.values[1] }} />);
		await whenAllKelvinReady(screen.container);
		expect(borders(screen.container)).toEqual(['1px', '1px']);
	});

	it.each(R4_REPORT_SCOPE_SHAPES)('keeps branch reports local to $name', async scope => {
		const uiSchema: UiSchema = { primary: row.uiSchema, backup: row.uiSchema };
		const schema: RJSFSchema = { type: 'object', properties: { primary: row.schema, backup: row.schema } };
		const data = { primary: { auth: row.values[1] }, backup: { auth: row.values[0] } };
		const screen = await render(
			scope.nested ? (
				<KvSchemaForm schema={schema} uiSchema={uiSchema} formData={data} />
			) : (
				<>
					<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={data.primary} />
					<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={data.backup} />
				</>
			)
		);
		await whenAllKelvinReady(screen.container);
		const auditRows = Array.from(screen.container.querySelectorAll('[data-schema-form-row="audit"]'));
		expect(auditRows.map(element => getComputedStyle(element).borderTopWidth)).toEqual(['1px', '0px']);
	});

	describe.each(TEMPLATE_COMPONENTS)('$name real input identity', ({ FieldLayout }) => {
		it.each(R4_TEMPLATE_PLACEMENTS)('retains the %s input and focus through ten typed host rerenders', async placement => {
			const Harness = () => {
				const [auth, setAuth] = useState(row.values[placement === 'inherited child' ? 1 : 0]);
				const authUi: UiSchema =
					placement === 'field'
						? { 'ui:FieldTemplate': FieldLayout }
						: placement === 'branch'
						? { [row.keyword]: [{ 'ui:FieldTemplate': FieldLayout }, {}] }
						: { host: { 'ui:FieldTemplate': FieldLayout } };
				return (
					<KvSchemaForm
						schema={row.schema}
						uiSchema={{ ...row.uiSchema, auth: authUi }}
						formData={{ auth }}
						onChange={event => setAuth(event.formData.auth)}
						applyDefaults={EApplyDefaults.Never}
					/>
				);
			};
			const screen = await render(<Harness />);
			await whenAllKelvinReady(screen.container);
			const control = screen.getByRole('textbox', { name: placement === 'inherited child' ? 'Host' : 'Token', exact: true });
			const input = control.element();
			await control.click();
			for (let revision = 0; revision < 10; revision++) {
				await userEvent.keyboard('x');
				await whenAllKelvinReady(screen.container);
				expect(control.element()).toBe(input);
				await expect.poll(focusedControl).toBe(input);
			}
			await expect.element(control).toHaveValue((placement === 'inherited child' ? 'broker.local' : 'broker-token') + 'xxxxxxxxxx');
		});
	});
});

describe.each([StyleMode.Light, StyleMode.Night])('option rail in %s', theme => {
	it.each(R4_OPTION_SHAPES)('uses the field gap and rail for $name', async row => {
		setThemeMode(theme);
		try {
			const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={{ auth: row.values[1] }} />);
			await whenAllKelvinReady(screen.container);
			const branch = screen.container.querySelector('[data-schema-form-row="auth"] [data-schema-form-field="section"]')!;
			expect(getComputedStyle(branch).borderLeftWidth).toBe('1px');
			expect(getComputedStyle(branch).paddingLeft).toBe('16px');
			expect(getComputedStyle(branch.parentElement!).rowGap).toBe('20px');
		} finally {
			setThemeMode(StyleMode.Night);
		}
	});
});
