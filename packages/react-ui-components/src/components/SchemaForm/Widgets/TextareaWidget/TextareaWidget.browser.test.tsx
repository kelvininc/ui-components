/// <reference types="@vitest/browser-playwright" />

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvSchemaForm } from '../../SchemaForm';
import { R7_TEXTAREA_EMPTY_SHAPES, R7_TEXTAREA_LIMIT_SHAPES, R7_TEXTAREA_PASTE_SHAPES, R7_TEXTAREA_RESET_SHAPES } from '../../test-utils/matrix';

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
			await userEvent.keyboard('{End}{Control>}v{/Control}');
			const expectedText = row.initial + (row.allowed ? row.pasted : '');
			await expect.poll(() => (control.element() as HTMLElement).innerText).toBe(expectedText);
			expect(control.element().querySelector('strong, b, span')).toBeNull();
			expect(onChange).toHaveBeenCalledTimes(row.allowed ? 1 : 0);
			if (row.allowed) expect(onChange.mock.lastCall?.[0].formData).toBe(expectedText);
		} finally {
			await session.send('Browser.resetPermissions', { browserContextId: targetInfo.browserContextId });
		}
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
