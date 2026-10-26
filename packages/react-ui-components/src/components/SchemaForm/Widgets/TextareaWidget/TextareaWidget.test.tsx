// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JSX } from '@kelvininc/ui-components';
import { fireStencilEvent, propsOf } from '../../../../test-utils';
import { KvSchemaForm } from '../../SchemaForm';
import { R7_TEXTAREA_EMPTY_SHAPES, R7_TEXTAREA_LIMIT_SHAPES, R7_TEXTAREA_RESET_SHAPES, TEXTAREA_EDITABILITY_SHAPES } from '../../test-utils/matrix';

vi.mock('../../../../stencil-generated', async () => (await import('../../../../test-utils')).stencilMocks);

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
const renderForm = async (form: React.ReactElement) => act(async () => root.render(form));

describe.each(R7_TEXTAREA_EMPTY_SHAPES)('textarea empty value: $name', row => {
	it('commits the exact configured value and preserves nonempty multiline text', async () => {
		const onChange = vi.fn();
		await renderForm(<KvSchemaForm<Record<string, unknown>> schema={row.schema} uiSchema={row.uiSchema} formData={{ notes: 'Plant broker notes' }} onChange={onChange} />);
		onChange.mockClear();
		await act(async () => fireStencilEvent('root_notes', 'onTextChange', ''));
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData.notes).toEqual(row.expected);
		expect(propsOf<JSX.KvTextArea>('root_notes').text).toBe(row.displayText);
		onChange.mockClear();
		const notes = 'Use TLS\nKeepalive enabled';
		await act(async () => fireStencilEvent('root_notes', 'onTextChange', notes));
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData.notes).toBe(notes);
	});
});

it('uses a changed emptyValue after a settings update', async () => {
	const row = R7_TEXTAREA_EMPTY_SHAPES[0];
	const onChange = vi.fn();
	const form = (emptyValue: unknown) => (
		<KvSchemaForm<Record<string, unknown>>
			schema={row.schema}
			uiSchema={{ notes: { 'ui:widget': 'textarea', 'ui:emptyValue': emptyValue } }}
			formData={{ notes: 'Plant broker notes' }}
			onChange={onChange}
		/>
	);
	await renderForm(form(null));
	await act(async () => fireStencilEvent('root_notes', 'onTextChange', ''));
	expect(onChange.mock.lastCall?.[0].formData.notes).toBeNull();
	await renderForm(form('No connection notes'));
	onChange.mockClear();
	await act(async () => fireStencilEvent('root_notes', 'onTextChange', ''));
	expect(onChange).toHaveBeenCalledOnce();
	expect(onChange.mock.lastCall?.[0].formData.notes).toBe('No connection notes');
});

describe.each(TEXTAREA_EDITABILITY_SHAPES)('textarea direct event: $name', flags => {
	it('honors editing flags even when a disabled event is forced', async () => {
		const row = R7_TEXTAREA_EMPTY_SHAPES[0];
		const onChange = vi.fn();
		await renderForm(
			<KvSchemaForm<Record<string, unknown>> schema={row.schema} uiSchema={row.uiSchema} formData={{ notes: 'Plant broker notes' }} onChange={onChange} {...flags} />
		);
		onChange.mockClear();
		await act(async () => fireStencilEvent('root_notes', 'onTextChange', 'Updated broker notes', { force: true }));
		expect(onChange).toHaveBeenCalledTimes(flags.editable ? 1 : 0);
		expect(propsOf<JSX.KvTextArea>('root_notes').text).toBe(flags.editable ? 'Updated broker notes' : 'Plant broker notes');
	});
});

describe.each(R7_TEXTAREA_LIMIT_SHAPES)('textarea limit: $name', row => {
	it('forwards the effective limit and leaves schema validation independent', async () => {
		await renderForm(<KvSchemaForm {...row} formData="é🚀" liveValidate displayErrors showErrorList={false} humanizeErrors={false} />);
		expect(propsOf<JSX.KvTextArea>('root').maxCharLength).toBe(row.limit);
		await act(async () => fireStencilEvent('root', 'onTextChange', 'é🚀ABC'));
		const errors = Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(help => propsOf(help).helpText ?? []);
		expect(errors.length > 0).toBe(row.schema.maxLength !== undefined);
	});
});

describe.each(R7_TEXTAREA_RESET_SHAPES)('textarea controlled clear: $name', row => {
	it('sends an empty string to the component when the stored value clears', async () => {
		const form = (formData = { notes: 'Edited broker notes' } as Record<string, unknown>) => (
			<KvSchemaForm<Record<string, unknown>>
				{...row}
				formData={formData}
				submittedData={row.emptyData}
				allowDiscardChanges={row.action === 'discard'}
				allowResetToDefaults={row.action === 'defaults'}
			/>
		);
		await renderForm(form());
		expect(propsOf<JSX.KvTextArea>('root_notes').text).toBe('Edited broker notes');
		if (row.action === 'external') await renderForm(form(row.emptyData));
		else await act(async () => fireStencilEvent(row.action === 'discard' ? 'Discard Changes' : 'Reset to Default', 'onClickButton'));
		expect(propsOf<JSX.KvTextArea>('root_notes').text).toBe('');
	});
});
