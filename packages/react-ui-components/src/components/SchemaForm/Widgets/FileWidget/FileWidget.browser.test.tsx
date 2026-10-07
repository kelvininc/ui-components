/// <reference types="@vitest/browser-playwright" />

import { EIconName } from '@kelvininc/ui-components';
import { cdp, userEvent } from 'vitest/browser';
import React, { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import { R6_FILE_ERROR_SHAPES, R6_FILE_LABEL_SHAPES, R6_FILE_READ_CANCELLATIONS, R6_FILE_REFERENCE_FORMS, R6_FILE_SHAPES, R6_FILE_VALUES } from '../../test-utils/matrix';
import styles from './FileWidget.module.scss';

const certificate = R6_FILE_VALUES[1].values[0];
const uploaded = 'data:text/plain;name=client.pem;base64,Y2xpZW50';
const uploadFile = () => new File(['client'], 'client.pem', { type: 'text/plain' });
const input = (container: Element) => container.querySelector<HTMLInputElement>('input[type="file"]')!;
const names = (container: Element) => Array.from(container.querySelectorAll(`.${styles.FileName}`)).map(element => element.textContent);
const NativeReader = window.FileReader;
afterEach(() => {
	window.FileReader = NativeReader;
});

describe.each(R6_FILE_REFERENCE_FORMS)('file reference submission in Chromium: $name', row => {
	it('submits the exact reference and only offers downloads for uploaded files', async () => {
		const onSubmit = vi.fn();
		const screen = await render(<KvSchemaForm {...row} liveValidate displayErrors onSubmit={onSubmit} showErrorList={false} />);
		await whenAllKelvinReady(screen.container);
		expect(names(screen.container)).toEqual(row.multiple ? ['<% secrets.ca %>', 'ca.pem'] : ['<% secrets.ca %>']);
		expect(screen.container.querySelector('kv-form-help-text')).toBeNull();
		const downloads = Array.from(screen.container.querySelectorAll<HTMLKvActionButtonIconElement>('kv-action-button-icon')).filter(host => host.icon === EIconName.Download);
		expect(downloads).toHaveLength(row.multiple ? 1 : 0);
		await expect.element(screen.getByRole('button', { name: 'Submit', exact: true })).toBeEnabled();
		await screen.getByRole('button', { name: 'Submit', exact: true }).click();
		await expect.poll(() => onSubmit.mock.calls.length).toBe(1);
		expect(onSubmit.mock.lastCall?.[0].formData).toEqual(row.formData);
	});
});

describe.each(R6_FILE_LABEL_SHAPES)('file label in Chromium: $name', row => {
	it('names the actual Browse control using its field title or id', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={certificate} />);
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('button', { name: row.expected, exact: true })).toBeVisible();
	});
});

describe.each(R6_FILE_SHAPES)('file controls in Chromium: $name', row => {
	it('renders stored values safely and applies a real upload only when editable', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} onChange={onChange} showErrorList={false} />);
		await whenAllKelvinReady(screen.container);
		expect(names(screen.container)).toEqual(row.labels.length ? row.labels : ['Empty']);
		for (const [index, file] of Array.from(screen.container.querySelectorAll(`.${styles.FileName}`)).entries()) {
			if (row.labels.length) expect(file.getAttribute('title')).toBe(row.labels[index]);
		}
		const browse = screen.getByRole('button', { name: row.browseName, exact: true });
		await expect.element(browse).toBeVisible();
		if (row.disabled || row.readonly) await expect.element(browse).toBeDisabled();
		else await expect.element(browse).toBeEnabled();
		expect(input(screen.container).id).toBe('file_root');
		expect(input(screen.container).disabled).toBe(row.disabled || row.readonly);
		onChange.mockClear();
		await userEvent.upload(input(screen.container), uploadFile());
		if (row.disabled || row.readonly) expect(onChange).not.toHaveBeenCalled();
		else {
			await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.multiple ? [...row.values, uploaded] : uploaded);
			await whenAllKelvinReady(screen.container);
			expect(names(screen.container)).toEqual(row.multiple ? [...row.labels, 'client.pem'] : ['client.pem']);
		}
	});
});

it('removes the second duplicate without changing the first file payload', async () => {
	const row = R6_FILE_SHAPES.find(row => row.multiple && row.labels.length === 2 && !row.disabled && !row.readonly)!;
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	await screen.getByRole('button', { name: 'Remove ca.pem', exact: true }).nth(1).click();
	await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual([certificate]);
	expect(names(screen.container)).toEqual(['ca.pem']);
});

it('supports reselecting the same file without retaining native input state', async () => {
	const row = R6_FILE_SHAPES.find(row => row.multiple && !row.values.length && !row.disabled && !row.readonly)!;
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
	await userEvent.upload(input(screen.container), uploadFile());
	await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual([uploaded]);
	expect(input(screen.container).value).toBe('');
	await userEvent.upload(input(screen.container), uploadFile());
	await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual([uploaded, uploaded]);
});

it('reads a multi-file selection in order and decodes a reserved filename exactly once', async () => {
	const row = R6_FILE_SHAPES.find(row => row.multiple && !row.values.length && !row.disabled && !row.readonly)!;
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
	const special = new File(['ca'], 'plant CA # 1%23.pem', { type: 'text/plain' });
	await userEvent.upload(input(screen.container), [special, uploadFile()]);
	await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(['data:text/plain;name=plant%20CA%20%23%201%2523.pem;base64,Y2E=', uploaded]);
	expect(names(screen.container)).toEqual([special.name, 'client.pem']);
});

function delayReads(source: File, failedSource?: File) {
	const completions: (() => void)[] = [];
	window.FileReader = class extends NativeReader {
		readAsDataURL(file: Blob) {
			// Vitest reads supplied Files before sending them to Playwright. Intercept only selected copies.
			if (file !== source && file !== failedSource) {
				if (failedSource && file instanceof File && file.name === failedSource.name) {
					queueMicrotask(() => this.dispatchEvent(new ProgressEvent('error')));
					return;
				}
				const notify = this.onload;
				this.onload = event => completions.push(() => notify?.call(this, event));
			}
			super.readAsDataURL(file);
		}
	};
	return {
		wait: async () => expect.poll(() => completions.length).toBeGreaterThan(0),
		release: async () =>
			act(async () => {
				completions.splice(0).forEach(notify => notify());
			})
	};
}
const raceSchema = {
	type: 'object' as const,
	properties: {
		certificate: { type: 'array' as const, title: 'Certificates', items: { type: 'string' as const, format: 'data-url' } },
		host: { type: 'string' as const, title: 'Host' }
	}
};
const raceData = { certificate: [certificate], host: 'edited-broker.local' };
const savedData = { ...raceData, host: 'saved-broker.local' };

it('shows a later read failure immediately in Browse while an earlier real upload is pending', async () => {
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={raceSchema} formData={raceData} onChange={onChange} showErrorList={false} />);
	await whenAllKelvinReady(screen.container);
	const source = uploadFile();
	const failure = new File(['backup'], 'backup.pem', { type: 'text/plain' });
	const reads = delayReads(source, failure);
	await userEvent.upload(input(screen.container), source);
	await reads.wait();
	onChange.mockClear();
	await userEvent.upload(input(screen.container), failure);
	await expect.poll(() => nativeDescription('Browse File for Certificates')).toBe('Could not read the selected file. Try again.');
	expect(onChange).not.toHaveBeenCalled();
	await reads.release();
	await expect.poll(() => onChange.mock.lastCall?.[0].formData.certificate).toEqual([certificate, uploaded]);
	expect(await nativeDescription('Browse File for Certificates')).toBe('Could not read the selected file. Try again.');
	window.FileReader = NativeReader;
	await userEvent.upload(input(screen.container), uploadFile());
	await expect.poll(() => onChange.mock.lastCall?.[0].formData.certificate).toEqual([certificate, uploaded, uploaded]);
	await expect.poll(() => nativeDescription('Browse File for Certificates')).toBe('');
});

describe.each(R6_FILE_READ_CANCELLATIONS)('Chromium upload cancellation: %s', reason => {
	it('drops the old real file read and lets a new selection finish', async () => {
		const onChange = vi.fn();
		const form = (flags = {}, formData = raceData) => (
			<KvSchemaForm schema={raceSchema} formData={formData} submittedData={savedData} allowDiscardChanges onChange={onChange} {...flags} />
		);
		const screen = await render(form());
		await whenAllKelvinReady(screen.container);
		const source = uploadFile();
		const reads = delayReads(source);
		await userEvent.upload(input(screen.container), source);
		await reads.wait();
		if (reason === 'unmount') await screen.rerender(<div />);
		else if (reason === 'external value') await screen.rerender(form({}, { ...raceData, certificate: [uploaded] }));
		else if (reason === 'discard') await screen.getByRole('button', { name: 'Discard Changes', exact: true }).click();
		else {
			await screen.rerender(form(reason.startsWith('readonly') ? { readonly: true } : { disabled: true }));
			if (reason.endsWith('editable')) await screen.rerender(form());
		}
		onChange.mockClear();
		await reads.release();
		expect(onChange).not.toHaveBeenCalled();
		await screen.rerender(form());
		window.FileReader = NativeReader;
		await userEvent.upload(input(screen.container), uploadFile());
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.certificate).toEqual([certificate, uploaded]);
	});
});

it('keeps a deletion made while a real FileReader is pending', async () => {
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={raceSchema} formData={raceData} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	const source = uploadFile();
	const reads = delayReads(source);
	await userEvent.upload(input(screen.container), source);
	await reads.wait();
	await screen.getByRole('button', { name: 'Remove ca.pem', exact: true }).click();
	await expect.poll(() => onChange.mock.lastCall?.[0].formData.certificate).toEqual([]);
	await reads.release();
	await expect.poll(() => onChange.mock.lastCall?.[0].formData.certificate).toEqual([uploaded]);
	expect(names(screen.container)).toEqual(['client.pem']);
});

describe.each(R6_FILE_ERROR_SHAPES)('per-file errors in Chromium: $name', row => {
	it('owns only its own visible row messages and remove descriptions', async () => {
		const form = (displayErrors = false, extraErrors: object = row.extraErrors) => (
			<KvSchemaForm<unknown>
				schema={raceSchema.properties.certificate}
				formData={[...row.formData]}
				extraErrors={extraErrors}
				displayErrors={displayErrors}
				showErrorList={false}
			/>
		);
		const screen = await render(form());
		await whenAllKelvinReady(screen.container);
		const messages = () =>
			Array.from(screen.container.querySelectorAll('[data-file-index]')).map(file =>
				Array.from(file.querySelectorAll<HTMLKvFormHelpTextElement>('kv-form-help-text')).flatMap(help => help.helpText)
			);
		expect(messages()).toEqual([[], []]);
		(screen.getByRole('button', { name: 'Browse File for Certificates', exact: true }).element() as HTMLElement).focus();
		await expect.poll(messages).toEqual(row.messages.map(message => (message ? [message] : [])));
		for (const [index, file] of Array.from(screen.container.querySelectorAll('[data-file-index]')).entries()) {
			const host = Array.from(file.querySelectorAll<HTMLKvActionButtonIconElement>('kv-action-button-icon')).find(host => host.icon === EIconName.Delete)!;
			const control = host.shadowRoot!.querySelector('kv-action-button')!.shadowRoot!.querySelector('[role="button"]')!;
			await expect.poll(() => control.ariaDescribedByElements?.length ?? 0).toBe(row.messages[index] ? 1 : 0);
			if (row.messages[index]) expect(control.ariaDescribedByElements![0].parentElement).toBe(file);
		}
		await screen.rerender(form(true, {}));
		await expect.poll(messages).toEqual([[], []]);
	});
});

it('renders a real validator error only at the invalid file row', async () => {
	const screen = await render(
		<KvSchemaForm
			schema={raceSchema.properties.certificate}
			formData={[certificate, 'certificates/client.pem']}
			liveValidate
			displayErrors
			humanizeErrors={false}
			showErrorList={false}
		/>
	);
	await whenAllKelvinReady(screen.container);
	const rows = Array.from(screen.container.querySelectorAll('[data-file-index]'));
	expect(rows[0].querySelector('kv-form-help-text')).toBeNull();
	await expect.poll(() => rows[1].querySelector<HTMLKvFormHelpTextElement>('kv-form-help-text')?.helpText).toEqual(['must match format "data-url"']);
});

type FrameTree = { frame: { id: string; url: string }; childFrames?: FrameTree[] };
const frameFor = (tree: FrameTree): FrameTree | undefined => (tree.frame.url === location.href ? tree : tree.childFrames?.map(frameFor).find(Boolean));
async function nativeDescription(name: string) {
	const session = cdp();
	const { frameTree } = (await session.send('Page.getFrameTree')) as { frameTree: FrameTree };
	const frame = frameFor(frameTree);
	expect(frame).toBeDefined();
	const { nodes } = (await session.send('Accessibility.getFullAXTree', { frameId: frame!.frame.id })) as {
		nodes: { ignored: boolean; role?: { value: string }; name?: { value: string }; description?: { value: string } }[];
	};
	const controls = nodes.filter(node => !node.ignored && node.role?.value === 'button' && node.name?.value === name);
	expect(controls).toHaveLength(1);
	return controls[0].description?.value ?? '';
}

it('gives two Browse buttons independent native AX descriptions and clears them on hide and clear', async () => {
	const schema = {
		type: 'object' as const,
		properties: {
			ca: { type: 'string' as const, title: 'CA certificate', format: 'data-url' },
			client: { type: 'string' as const, title: 'Client certificate', format: 'data-url' }
		}
	};
	const errors = { ca: { __errors: ['Review the CA certificate.'] }, client: { __errors: ['Review the client certificate.'] } };
	const form = (displayErrors = false, extraErrors = errors) => (
		<KvSchemaForm<unknown> schema={schema} formData={{ ca: certificate, client: uploaded }} extraErrors={extraErrors} displayErrors={displayErrors} showErrorList={false} />
	);
	const screen = await render(form());
	await whenAllKelvinReady(screen.container);
	for (const name of ['CA certificate', 'Client certificate']) expect(await nativeDescription(`Browse File for ${name}`)).toBe('');
	await screen.rerender(form(true));
	await whenAllKelvinReady(screen.container);
	await expect.poll(() => nativeDescription('Browse File for CA certificate')).toBe('Review the CA certificate.');
	await expect.poll(() => nativeDescription('Browse File for Client certificate')).toBe('Review the client certificate.');
	await screen.rerender(form(true, { ca: { __errors: ['CA certificate expired.'] }, client: { __errors: ['Client certificate expired.'] } }));
	await expect.poll(() => nativeDescription('Browse File for CA certificate')).toBe('CA certificate expired.');
	await expect.poll(() => nativeDescription('Browse File for Client certificate')).toBe('Client certificate expired.');
	await screen.rerender(form());
	await expect.poll(() => nativeDescription('Browse File for CA certificate')).toBe('');
	await expect.poll(() => nativeDescription('Browse File for Client certificate')).toBe('');
	await screen.rerender(form(true, { ca: { __errors: [] }, client: { __errors: [] } }));
	await expect.poll(() => nativeDescription('Browse File for CA certificate')).toBe('');
	await expect.poll(() => nativeDescription('Browse File for Client certificate')).toBe('');
});

it('restores touched Browse descriptions to empty when Discard restores an unchanged file', async () => {
	const form = (
		<KvSchemaForm<Record<string, unknown>>
			schema={raceSchema}
			formData={raceData}
			submittedData={savedData}
			allowDiscardChanges
			extraErrors={{ certificate: { __errors: ['Review the certificates.'] } }}
			showErrorList={false}
		/>
	);
	const screen = await render(form);
	await whenAllKelvinReady(screen.container);
	(screen.getByRole('button', { name: 'Browse File for Certificates', exact: true }).element() as HTMLElement).focus();
	await expect.poll(() => nativeDescription('Browse File for Certificates')).toBe('Review the certificates.');
	await screen.getByRole('button', { name: 'Discard Changes', exact: true }).click();
	await expect.poll(() => nativeDescription('Browse File for Certificates')).toBe('');
});

it('keeps nested array input ids unique and routes Browse to the matching file input', async () => {
	const schema = {
		type: 'array' as const,
		title: 'Connections',
		items: { type: 'object' as const, properties: { certificate: { type: 'string' as const, title: 'Certificate', format: 'data-url' } } }
	};
	const screen = await render(<KvSchemaForm schema={schema} formData={[{ certificate }, { certificate: uploaded }]} />);
	await whenAllKelvinReady(screen.container);
	const inputs = Array.from(screen.container.querySelectorAll<HTMLInputElement>('input[type="file"]'));
	expect(inputs.map(control => control.id)).toEqual(['file_root_0_certificate', 'file_root_1_certificate']);
	const clicks = inputs.map(control => {
		const clicked = vi.fn((event: MouseEvent) => event.preventDefault());
		control.addEventListener('click', clicked);
		return clicked;
	});
	const controls = screen.getByRole('button', { name: 'Browse File for Certificate', exact: true });
	await controls.nth(1).click();
	expect(clicks.map(click => click.mock.calls.length)).toEqual([0, 1]);
});

it('keeps each file action and Browse to a single Tab stop, including readonly downloads', async () => {
	const row = R6_FILE_SHAPES.find(row => !row.multiple && row.values.length === 1 && row.labels[0] === 'ca.pem' && !row.disabled && !row.readonly)!;
	const form = (readonly = false) => (
		<div>
			<button>Before files</button>
			<KvSchemaForm {...row} readonly={readonly} />
			<button>After files</button>
		</div>
	);
	const screen = await render(form());
	await whenAllKelvinReady(screen.container);
	await screen.getByRole('button', { name: 'Before files', exact: true }).click();
	for (const name of ['Download ca.pem', 'Remove ca.pem', 'Browse File for Certificate', 'Submit', 'After files']) {
		await userEvent.tab();
		expect(screen.getByRole('button', { name, exact: true }).element().matches(':focus')).toBe(true);
	}
	await screen.rerender(form(true));
	await whenAllKelvinReady(screen.container);
	await screen.getByRole('button', { name: 'Before files', exact: true }).click();
	await userEvent.tab();
	expect(screen.getByRole('button', { name: 'Download ca.pem', exact: true }).element().matches(':focus')).toBe(true);
	await userEvent.tab();
	expect(screen.getByRole('button', { name: 'Submit', exact: true }).element().matches(':focus')).toBe(true);
});
