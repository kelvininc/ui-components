/// <reference types="@vitest/browser-playwright" />

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import {
	R7_TEXTAREA_COMPOSITION_SHAPES,
	R7_TEXTAREA_EMPTY_SHAPES,
	R7_TEXTAREA_LIMIT_SHAPES,
	R7_TEXTAREA_NATIVE_INPUT_SHAPES,
	R7_TEXTAREA_PASTE_SHAPES,
	R7_TEXTAREA_REPLACEMENT_SHAPES,
	R7_TEXTAREA_RESET_SHAPES
} from '../../test-utils/matrix';

const selectText = (selection?: string) => userEvent.keyboard(selection === 'all' ? '{Control>}a{/Control}' : selection === 'last' ? '{End}{Shift>}{ArrowLeft}{/Shift}' : '{End}');

describe.each(R7_TEXTAREA_NATIVE_INPUT_SHAPES)('textarea native insertion in Chromium: $name', row => {
	it('enforces the cap without relying on keypress', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.initial} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		(control.element() as HTMLElement).focus();
		await selectText(row.selection);
		onChange.mockClear();
		await cdp().send('Input.insertText', { text: row.inserted });
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(row.expected);
		expect(onChange).toHaveBeenCalledTimes(row.expected === row.initial ? 0 : 1);
		expect(onChange.mock.lastCall?.[0].formData).toBe(row.expected === row.initial ? undefined : row.expected);
		await expect.poll(() => (control.element().getRootNode() as ShadowRoot).activeElement === control.element()).toBe(true);
	});
});

describe.each(R7_TEXTAREA_COMPOSITION_SHAPES)('textarea IME in Chromium: $name', row => {
	it('keeps the browser draft and commits one value within the cap', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.initial} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		(control.element() as HTMLElement).focus();
		await selectText(row.selection);
		onChange.mockClear();
		const session = cdp();
		await session.send('Input.imeSetComposition', { text: row.draft, selectionStart: row.draft.length, selectionEnd: row.draft.length });
		expect((control.element() as HTMLElement).innerText).toBe((row.selection === 'all' ? '' : row.initial) + row.draft);
		expect(onChange).not.toHaveBeenCalled();
		if (row.committed) await session.send('Input.insertText', { text: row.committed });
		else await session.send('Input.imeSetComposition', { text: '', selectionStart: 0, selectionEnd: 0 });
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(row.expected);
		expect(onChange).toHaveBeenCalledTimes(row.expected === row.initial ? 0 : 1);
		expect(onChange.mock.lastCall?.[0].formData).toBe(row.expected === row.initial ? undefined : row.expected);
		await expect.poll(() => (control.element().getRootNode() as ShadowRoot).activeElement === control.element()).toBe(true);
	});
});

describe.each(R7_TEXTAREA_EMPTY_SHAPES)('textarea empty value in Chromium: $name', row => {
	it('clears the named textbox and commits the configured value once', async () => {
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm<Record<string, unknown>> schema={row.schema} uiSchema={row.uiSchema} formData={{ notes: 'Plant broker notes' }} onChange={onChange} />
		);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		onChange.mockClear();
		(control.element() as HTMLElement).focus();
		await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData.notes).toEqual(row.expected);
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(row.displayText);
	});
});

describe.each(R7_TEXTAREA_LIMIT_SHAPES)('textarea limit in Chromium: $name', row => {
	it('counts Unicode code points during keyboard edits and keeps schema errors independent', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} formData="é🚀" onChange={onChange} liveValidate displayErrors showErrorList={false} />);
		await whenAllKelvinReady(screen.container);
		const host = screen.container.querySelector<HTMLKvTextAreaElement>('kv-text-area')!;
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		expect(host.maxCharLength).toBe(row.limit);
		host.focus();
		onChange.mockClear();
		await userEvent.keyboard('{End}ABC');
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(row.expectedText);
		if (row.expectedText === 'é🚀') expect(onChange).not.toHaveBeenCalled();
		else expect(onChange.mock.lastCall?.[0].formData).toBe(row.expectedText);
		const invalid = row.schema.maxLength !== undefined && [...row.expectedText].length > row.schema.maxLength;
		if (invalid) await expect.element(control).toHaveAttribute('aria-invalid', 'true');
		else await expect.element(control).not.toHaveAttribute('aria-invalid');
		if (row.limit) expect(host.shadowRoot!.querySelector('.character-counter')?.textContent).toContain(`${[...row.expectedText].length}/${row.limit}`);
	});
});

describe.each(R7_TEXTAREA_PASTE_SHAPES)('textarea native paste in Chromium: $name', row => {
	it('pastes plain text from a rich clipboard and honors the effective limit', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} formData={row.initial} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		const session = cdp();
		const { targetInfo } = (await session.send('Target.getTargetInfo')) as { targetInfo: { browserContextId?: string } };
		await session.send('Browser.grantPermissions', {
			origin: location.origin,
			browserContextId: targetInfo.browserContextId,
			permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite']
		});
		try {
			(control.element() as HTMLElement).focus();
			await navigator.clipboard.write([
				new ClipboardItem({
					'text/plain': new Blob([row.pasted], { type: 'text/plain' }),
					'text/html': new Blob([`<strong>${row.pasted}</strong>`], { type: 'text/html' })
				})
			]);
			onChange.mockClear();
			await selectText(row.selection);
			await userEvent.keyboard('{Control>}v{/Control}');
			const expectedText = row.expectedText ?? row.initial + (row.allowed ? row.pasted : '');
			await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(expectedText);
			expect(control.element().querySelector('strong, b, span')).toBeNull();
			expect(onChange).toHaveBeenCalledTimes(row.allowed ? 1 : 0);
			if (row.allowed) expect(onChange.mock.lastCall?.[0].formData).toBe(expectedText);
		} finally {
			await session.send('Browser.resetPermissions', { browserContextId: targetInfo.browserContextId });
		}
	});
});

describe.each(R7_TEXTAREA_REPLACEMENT_SHAPES)('textarea keyboard replacement in Chromium: $name', row => {
	it('allows selected replacement up to the schema limit', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.initial} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		(control.element() as HTMLElement).focus();
		onChange.mockClear();
		await selectText(row.selection);
		for (const character of row.replacement) {
			// Vitest's keyboard parser splits surrogate pairs; send those through native text input.
			if (character.length > 1) await cdp().send('Input.insertText', { text: character });
			else await userEvent.keyboard(character);
		}
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(row.typed);
		expect(onChange.mock.lastCall?.[0].formData).toBe(row.typed);
	});
});

describe.each(R7_TEXTAREA_RESET_SHAPES)('textarea controlled clear in Chromium: $name', row => {
	it('clears the actual textbox after an external update or form reset', async () => {
		const form = (formData = { notes: 'Edited broker notes' } as Record<string, unknown>) => (
			<KvSchemaForm<Record<string, unknown>>
				{...row}
				formData={formData}
				submittedData={row.emptyData}
				allowDiscardChanges={row.action === 'discard'}
				allowResetToDefaults={row.action === 'defaults'}
			/>
		);
		const screen = await render(form());
		await whenAllKelvinReady(screen.container);
		const control = screen.getByRole('textbox', { name: 'Connection notes', exact: true });
		expect((control.element() as HTMLElement).innerText).toBe('Edited broker notes');
		if (row.action === 'external') await screen.rerender(form(row.emptyData));
		else await screen.getByRole('button', { name: row.action === 'discard' ? 'Discard Changes' : 'Reset to Default', exact: true }).click();
		await expect.poll(() => (control.element() as HTMLElement).innerText).toBe('');
	});
});
