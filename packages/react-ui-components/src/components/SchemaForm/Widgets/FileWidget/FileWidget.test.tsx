// @vitest-environment jsdom

import { EIconName } from '@kelvininc/ui-components';
import standardValidator from '@rjsf/validator-ajv8';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../../test-utils';
import { KvSchemaForm } from '../../SchemaForm';
import {
	R6_FILE_ACTION_LABEL_SHAPES,
	R6_FILE_ACTION_TRANSITIONS,
	R6_FILE_EMPTY_RESET_SHAPE,
	R6_FILE_ERROR_SHAPES,
	R6_FILE_LABEL_SHAPES,
	R6_FILE_READ_CANCELLATIONS,
	R6_FILE_READ_FAILURES,
	R6_FILE_REFERENCE_FORMS,
	R6_FILE_SHAPES,
	R6_FILE_VALUES
} from '../../test-utils/matrix';
import { extractFileInfo, processFiles } from './utils';
import type { FileInfoType } from './types';
import styles from './FileWidget.module.scss';

vi.mock('../../../../stencil-generated', async () => (await import('../../../../test-utils')).stencilMocks);
vi.mock('./utils', async original => ({ ...(await original<typeof import('./utils')>()), processFiles: vi.fn() }));

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
beforeEach(() => {
	container = document.createElement('div');
	document.body.append(container);
	root = createRoot(container);
	vi.mocked(processFiles).mockReset();
});
afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
});
const renderForm = async (form: React.ReactElement) => act(async () => root.render(form));
const names = () => Array.from(container.querySelectorAll(`.${styles.FileName}`)).map(element => element.textContent);
const removes = () => Array.from(container.querySelectorAll('kv-action-button-icon')).filter(element => propsOf(element).icon === EIconName.Delete);
const input = () => container.querySelector<HTMLInputElement>('input[type="file"]')!;
const upload = async () => {
	const control = input();
	Object.defineProperty(control, 'files', { configurable: true, value: [new File(['client'], 'client.pem', { type: 'text/plain' })] });
	await act(async () => control.dispatchEvent(new Event('change', { bubbles: true })));
};
const certificate = R6_FILE_VALUES[1].values[0];
const uploaded = 'data:text/plain;name=client.pem;base64,Y2xpZW50';

describe.each(R6_FILE_REFERENCE_FORMS)('valid file references: $name', row => {
	it('submits references unchanged without offering to download them', async () => {
		const onSubmit = vi.fn();
		await renderForm(<KvSchemaForm {...row} liveValidate displayErrors onSubmit={onSubmit} showErrorList={false} />);
		expect(names()).toEqual(row.multiple ? ['<% secrets.ca %>', 'ca.pem'] : ['<% secrets.ca %>']);
		expect(container.querySelector('kv-form-help-text')).toBeNull();
		const downloads = Array.from(container.querySelectorAll('kv-action-button-icon')).filter(element => propsOf(element).icon === EIconName.Download);
		expect(downloads).toHaveLength(row.multiple ? 1 : 0);
		expect(propsOf('Submit').disabled).toBe(false);
		await act(async () => fireStencilEvent('Submit', 'onClickButton'));
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit.mock.lastCall?.[0].formData).toEqual(row.formData);
	});
});

it('honors a caller validator that rejects secret references', async () => {
	const row = R6_FILE_REFERENCE_FORMS[0];
	await renderForm(<KvSchemaForm {...row} validator={standardValidator} liveValidate displayErrors showErrorList={false} />);
	const messages = Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
	expect(messages.length).toBeGreaterThan(0);
	expect(propsOf('Submit').disabled).toBe(true);
});

describe.each(R6_FILE_LABEL_SHAPES)('file label: $name', row => {
	it('uses the effective field title and the id fallback', async () => {
		await renderForm(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={certificate} />);
		expect(propsOf(container.querySelector('kv-action-button-text')!).accessibleLabel).toBe(row.expected);
	});
});

describe.each(R6_FILE_ACTION_LABEL_SHAPES)('consumer file action: $name', row => {
	it('uses the resolved text and opens its own input', async () => {
		await renderForm(<KvSchemaForm {...row} showErrorList={false} />);
		const action = container.querySelector('kv-action-button-text')!;
		expect(propsOf(action).text).toBe(row.actionLabel);
		expect(propsOf(action).accessibleLabel).toBe(row.actionName);
		const clicked = vi.spyOn(input(), 'click').mockImplementation(() => {});
		await act(async () => fireStencilEvent(action, 'onClickButton'));
		expect(clicked).toHaveBeenCalledOnce();
	});
});

const deferredRead = () => {
	let resolve!: (files: FileInfoType[]) => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<FileInfoType[]>((accept, fail) => {
		resolve = accept;
		reject = fail;
	});
	vi.mocked(processFiles).mockReturnValueOnce(promise);
	return {
		finish: (value = uploaded) => resolve(extractFileInfo(value)),
		resolve: async (value = uploaded) => act(async () => resolve(extractFileInfo(value))),
		reject: async () => act(async () => reject(new Error('Could not read file')))
	};
};

describe.each(R6_FILE_ACTION_TRANSITIONS)('file action transitions: $name', row => {
	it('tracks upload and removal while retaining a consumer override', async () => {
		const onChange = vi.fn();
		await renderForm(<KvSchemaForm {...row} onChange={onChange} showErrorList={false} />);
		const action = () => propsOf(container.querySelector('kv-action-button-text')!);
		expect(action().text).toBe(row.initialLabel);
		expect(action().accessibleLabel).toBe(`${row.initialLabel}: ${row.fieldName}`);
		const read = deferredRead();
		await upload();
		await read.resolve();
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.multiple ? [uploaded] : uploaded);
		expect(action().text).toBe(row.selectedLabel);
		expect(action().accessibleLabel).toBe(`${row.selectedLabel}: ${row.fieldName}`);
		await act(async () => fireStencilEvent(removes()[0], 'onClickButton'));
		expect(onChange.mock.lastCall?.[0].formData).toEqual(row.multiple ? [] : undefined);
		expect(action().text).toBe(row.initialLabel);
		expect(action().accessibleLabel).toBe(`${row.initialLabel}: ${row.fieldName}`);
	});
});

describe.each(R6_FILE_SHAPES)('file values: $name', row => {
	it('renders every stored value with a title and its own file action name and id', async () => {
		await renderForm(<KvSchemaForm {...row} showErrorList={false} />);
		expect(names()).toEqual(row.labels.length ? row.labels : ['Empty']);
		for (const [index, element] of Array.from(container.querySelectorAll(`.${styles.FileName}`)).entries()) {
			if (row.labels.length) expect(element.getAttribute('title')).toBe(row.labels[index]);
		}
		const action = propsOf(container.querySelector('kv-action-button-text')!);
		expect(action.text).toBe(row.actionLabel);
		expect(action.accessibleLabel).toBe(row.actionName);
		expect(input().id).toBe('file_root');
		expect(input().disabled).toBe(row.disabled || row.readonly);
	});

	it('removes only the selected index and refuses forced readonly or disabled edits', async () => {
		const onChange = vi.fn();
		await renderForm(<KvSchemaForm {...row} onChange={onChange} showErrorList={false} />);
		onChange.mockClear();
		if (!row.values.length) {
			expect(removes()).toHaveLength(0);
			return;
		}
		const index = row.values.length - 1;
		expect(removes()).toHaveLength(row.values.length);
		expect(propsOf(removes()[index]).disabled).toBe(row.disabled || row.readonly);
		await act(async () => fireStencilEvent(removes()[index], 'onClickButton', undefined, { force: true }));
		if (row.disabled || row.readonly) expect(onChange).not.toHaveBeenCalled();
		else {
			const remaining = row.values.filter((_, position) => position !== index);
			expect(onChange.mock.lastCall?.[0].formData).toEqual(row.multiple ? remaining : remaining[0]);
		}
	});
});

it('shows externally replaced values and filenames after Discard', async () => {
	const schema = { type: 'string' as const, format: 'data-url', title: 'Certificate' };
	const action = () => propsOf(container.querySelector('kv-action-button-text')!);
	await renderForm(<KvSchemaForm schema={schema} formData={certificate} submittedData={certificate} allowDiscardChanges />);
	expect(action().accessibleLabel).toBe('Replace file: Certificate');
	await renderForm(<KvSchemaForm schema={schema} formData="" submittedData={certificate} allowDiscardChanges />);
	expect(action().accessibleLabel).toBe('Choose file: Certificate');
	await renderForm(<KvSchemaForm schema={schema} formData={uploaded} submittedData={certificate} allowDiscardChanges />);
	expect(names()).toEqual(['client.pem']);
	expect(action().accessibleLabel).toBe('Replace file: Certificate');
	await act(async () => fireStencilEvent('Discard Changes', 'onClickButton'));
	expect(names()).toEqual(['ca.pem']);
	expect(action().accessibleLabel).toBe('Replace file: Certificate');
});

it('restores the empty single-file label on Reset to Default', async () => {
	await renderForm(<KvSchemaForm {...R6_FILE_EMPTY_RESET_SHAPE} allowResetToDefaults showErrorList={false} />);
	const read = deferredRead();
	await upload();
	await read.resolve();
	expect(propsOf(container.querySelector('kv-action-button-text')!).accessibleLabel).toBe('Replace file: Certificate');
	await act(async () => fireStencilEvent('Reset to Default', 'onClickButton'));
	expect(names()).toEqual(['Empty']);
	expect(propsOf(container.querySelector('kv-action-button-text')!).accessibleLabel).toBe('Choose file: Certificate');
});

const raceSchema = {
	type: 'object' as const,
	properties: {
		certificate: { ...R6_FILE_SHAPES.find(row => row.multiple)!.schema, default: [certificate] },
		host: { type: 'string' as const, title: 'Host', default: 'default-broker.local' }
	}
};
const raceData = { certificate: [certificate], host: 'edited-broker.local' };
const savedData = { ...raceData, host: 'saved-broker.local' };
const raceForm = (onChange = vi.fn(), flags = {}, formData = raceData) => (
	<KvSchemaForm schema={raceSchema} formData={formData} submittedData={savedData} allowDiscardChanges allowResetToDefaults onChange={onChange} showErrorList={false} {...flags} />
);

describe.each(R6_FILE_READ_CANCELLATIONS)('pending upload: %s', reason => {
	it('ignores the old result and permits a fresh upload after cancellation', async () => {
		const onChange = vi.fn();
		await renderForm(raceForm(onChange));
		const oldRead = deferredRead();
		await upload();
		if (reason === 'unmount') await renderForm(<div />);
		else if (reason === 'external value') await renderForm(raceForm(onChange, {}, { ...raceData, certificate: [uploaded] }));
		else if (reason === 'discard') await act(async () => fireStencilEvent('Discard Changes', 'onClickButton'));
		else if (reason === 'reset defaults') await act(async () => fireStencilEvent('Reset to Default', 'onClickButton'));
		else {
			await renderForm(raceForm(onChange, reason.startsWith('readonly') ? { readonly: true } : { disabled: true }));
			if (reason.endsWith('editable')) await renderForm(raceForm(onChange));
		}
		onChange.mockClear();
		await oldRead.resolve();
		expect(onChange).not.toHaveBeenCalled();
		await renderForm(raceForm(onChange));
		const freshRead = deferredRead();
		await upload();
		await freshRead.resolve();
		expect(onChange.mock.lastCall?.[0].formData.certificate).toEqual([certificate, uploaded]);
	});
});

it('appends a pending upload to the latest list after a deletion', async () => {
	const onChange = vi.fn();
	await renderForm(raceForm(onChange));
	const read = deferredRead();
	await upload();
	await act(async () => fireStencilEvent(removes()[0], 'onClickButton'));
	expect(onChange.mock.lastCall?.[0].formData.certificate).toEqual([]);
	await read.resolve();
	expect(onChange.mock.lastCall?.[0].formData.certificate).toEqual([uploaded]);
	expect(names()).toEqual(['client.pem']);
});

it('applies multiple upload selections in selection order when reads finish out of order', async () => {
	const onChange = vi.fn();
	await renderForm(raceForm(onChange));
	const first = deferredRead();
	await upload();
	const second = deferredRead();
	await upload();
	const backup = R6_FILE_VALUES[2].values[1];
	await second.resolve(backup);
	await first.resolve();
	expect(onChange.mock.lastCall?.[0].formData.certificate).toEqual([certificate, uploaded, backup]);
});

it('keeps the newest selection in a single file field', async () => {
	const onChange = vi.fn();
	await renderForm(<KvSchemaForm schema={R6_FILE_SHAPES[0].schema} formData={certificate} onChange={onChange} />);
	const first = deferredRead();
	await upload();
	const second = deferredRead();
	await upload();
	await second.resolve();
	await first.resolve(certificate);
	expect(onChange.mock.lastCall?.[0].formData).toBe(uploaded);
});

it('reports an active read failure and recovers on the next selection', async () => {
	await renderForm(raceForm());
	const read = deferredRead();
	await upload();
	await read.reject();
	const messages = () => Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
	expect(messages()).toContain('Could not read the selected file. Try again.');
	const fresh = deferredRead();
	await upload();
	await fresh.resolve();
	expect(messages()).not.toContain('Could not read the selected file. Try again.');
});

it('clears a failed queued read when the later upload succeeds', async () => {
	await renderForm(raceForm());
	const first = deferredRead();
	await upload();
	const second = deferredRead();
	await upload();
	await second.resolve();
	await first.reject();
	const messages = Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
	expect(names()).toEqual(['ca.pem', 'client.pem']);
	expect(messages).not.toContain('Could not read the selected file. Try again.');
});

describe.each(R6_FILE_READ_FAILURES)('later upload failure: $name', row => {
	it('reports immediately, survives an earlier completion, and clears on a fresh upload', async () => {
		const onChange = vi.fn();
		await renderForm(raceForm(onChange));
		const first = deferredRead();
		await upload();
		const second = deferredRead();
		await upload();
		onChange.mockClear();
		await second.reject();
		const messages = () => Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
		expect(messages()).toContain('Could not read the selected file. Try again.');
		expect(onChange).not.toHaveBeenCalled();
		if (row.earlierFails) await first.reject();
		else await first.resolve();
		expect(messages()).toContain('Could not read the selected file. Try again.');
		const fresh = deferredRead();
		await upload();
		await fresh.resolve();
		expect(messages()).not.toContain('Could not read the selected file. Try again.');
		expect(onChange.mock.lastCall?.[0].formData.certificate).toEqual(row.earlierFails ? [certificate, uploaded] : [certificate, uploaded, uploaded]);
	});
});

describe.each(R6_FILE_READ_CANCELLATIONS)('canceled upload failure: %s', reason => {
	it('ignores an old rejection after cancellation', async () => {
		await renderForm(raceForm());
		const read = deferredRead();
		await upload();
		if (reason === 'unmount') await renderForm(<div />);
		else if (reason === 'external value') await renderForm(raceForm(vi.fn(), {}, { ...raceData, certificate: [uploaded] }));
		else if (reason === 'discard') await act(async () => fireStencilEvent('Discard Changes', 'onClickButton'));
		else if (reason === 'reset defaults') await act(async () => fireStencilEvent('Reset to Default', 'onClickButton'));
		else {
			await renderForm(raceForm(vi.fn(), reason.startsWith('readonly') ? { readonly: true } : { disabled: true }));
			if (reason.endsWith('editable')) await renderForm(raceForm());
		}
		await read.reject();
		const messages = Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
		expect(messages).not.toContain('Could not read the selected file. Try again.');
	});
});

describe.each(R6_FILE_READ_CANCELLATIONS.filter(reason => reason === 'discard' || reason === 'reset defaults'))('same-event reset: %s', reason => {
	it('ignores a read that finishes in the same event as the reset', async () => {
		const onChange = vi.fn();
		await renderForm(raceForm(onChange));
		const read = deferredRead();
		await upload();
		onChange.mockClear();
		await act(async () => {
			fireStencilEvent(reason === 'discard' ? 'Discard Changes' : 'Reset to Default', 'onClickButton');
			read.finish();
		});
		expect(onChange.mock.calls.map(([event]) => event.formData)).toEqual([reason === 'discard' ? savedData : { ...raceData, host: 'default-broker.local' }]);
		expect(names()).toEqual(['ca.pem']);
	});
});

it('preserves touched file errors when resetting to the same default file', async () => {
	await renderForm(raceForm(vi.fn(), { extraErrors: { certificate: { __errors: ['Review the certificates.'] } } }));
	await act(async () => fireStencilEvent(container.querySelector('kv-action-button-text')!, 'onFocusButton'));
	const messages = () => Array.from(container.querySelectorAll('kv-form-help-text')).flatMap(host => propsOf(host).helpText ?? []);
	expect(messages()).toContain('Review the certificates.');
	await act(async () => fireStencilEvent('Reset to Default', 'onClickButton'));
	expect(names()).toEqual(['ca.pem']);
	expect(messages()).toContain('Review the certificates.');
});

describe.each(R6_FILE_ERROR_SHAPES)('per-file errors: $name', row => {
	it("shows only each row's errors through the shared visibility gate, then clears them", async () => {
		const form = (displayErrors = false, extraErrors: object = row.extraErrors) => (
			<KvSchemaForm<unknown>
				schema={raceSchema.properties.certificate}
				formData={[...row.formData]}
				extraErrors={extraErrors}
				displayErrors={displayErrors}
				showErrorList={false}
			/>
		);
		const messages = () =>
			Array.from(container.querySelectorAll('[data-file-index]')).map(file =>
				Array.from(file.querySelectorAll('kv-form-help-text')).flatMap(help => propsOf(help).helpText ?? [])
			);
		await renderForm(form());
		expect(messages()).toEqual([[], []]);
		await act(async () => fireStencilEvent(container.querySelector('kv-action-button-text')!, 'onFocusButton'));
		expect(messages()).toEqual(row.messages.map(message => (message ? [message] : [])));
		await renderForm(form(true, {}));
		expect(messages()).toEqual([[], []]);
	});
});

it('renders the validator error at the invalid array item', async () => {
	await renderForm(
		<KvSchemaForm
			schema={raceSchema.properties.certificate}
			formData={[certificate, 'certificates/client.pem']}
			liveValidate
			displayErrors
			humanizeErrors={false}
			showErrorList={false}
		/>
	);
	const rows = Array.from(container.querySelectorAll('[data-file-index]'));
	expect(rows[0].querySelector('kv-form-help-text')).toBeNull();
	expect(propsOf(rows[1].querySelector('kv-form-help-text')!).helpText).toEqual(['must match format "data-url"']);
});

it('does not show file-item errors when the field suppresses errors', async () => {
	const extraErrors = R6_FILE_ERROR_SHAPES[0].extraErrors;
	await renderForm(
		<KvSchemaForm<unknown>
			schema={raceSchema.properties.certificate}
			uiSchema={{ 'ui:hideError': true }}
			formData={[certificate, uploaded]}
			extraErrors={extraErrors}
			displayErrors
			showErrorList={false}
		/>
	);
	expect(container.querySelector('[data-file-index] kv-form-help-text')).toBeNull();
});
