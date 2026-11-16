import React, { useState } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { KvDropdownBase, KvSingleSelectDropdown } from '../stencil-generated';
import { EIconName } from '@kelvininc/ui-components';
import { whenKelvinReady } from '../test-utils/browser';

const OPTIONS = {
	heading: { label: 'Results', value: 'heading', selectable: false },
	disabled: { label: 'Unavailable', value: 'disabled', disabled: true },
	assets: { label: 'Assets', value: 'assets' },
	streams: { label: 'Data streams', value: 'streams' },
	tasks: { label: 'Tasks', value: 'tasks' }
};

type DropdownProps = ComponentProps<typeof KvSingleSelectDropdown>;

function EditorDropdown({ onEditorKey, ...props }: DropdownProps & { onEditorKey?: (key: string) => void }): React.JSX.Element {
	const [editor, setEditor] = useState<HTMLDivElement | null>(null);
	return (
		<div style={{ paddingTop: 400, width: 360 }}>
			<div ref={setEditor} contentEditable suppressContentEditableWarning role="textbox" aria-label="Composer" onKeyDown={event => onEditorKey?.(event.key)}>
				Mention @
			</div>
			<input aria-label="Other field" />
			{editor && (
				<KvSingleSelectDropdown
					options={OPTIONS}
					highlightedOption={undefined}
					filteredOptions={undefined}
					disabled={false}
					isOpen
					shortcuts
					autoHighlightFirst
					preserveFocus
					autoFocus={false}
					searchable={false}
					selectionClearable={false}
					actionElement={editor}
					keyboardTarget={editor}
					dropdownOptions={{ placement: 'top-start' }}
					maxHeight="160px"
					{...props}
				>
					<span slot="dropdown-action" />
				</KvSingleSelectDropdown>
			)}
		</div>
	);
}

async function setUp(props: DropdownProps & { onEditorKey?: (key: string) => void } = {}) {
	const screen = await render(<EditorDropdown {...props} />);
	const editor = screen.getByRole('textbox', { name: 'Composer' });
	const dropdown = await whenKelvinReady(screen.container.querySelector('kv-single-select-dropdown')!);
	await editor.click();
	const range = document.createRange();
	range.selectNodeContents(editor.element());
	range.collapse(false);
	window.getSelection()?.removeAllRanges();
	window.getSelection()?.addRange(range);
	return { screen, editor, dropdown };
}

describe('Single select dropdown with an external editor', () => {
	it('should size the popup to the editor when only placement is overridden', async () => {
		const { editor } = await setUp();
		const result = page.getByText('Assets', { exact: true });
		await expect.element(result).toBeVisible();
		await expect.poll(() => result.element().getBoundingClientRect().width).toBeGreaterThan(0);
		const popup = document.querySelector('kv-portal')!;
		await expect.poll(() => popup.getBoundingClientRect().width).toBeCloseTo(editor.element().getBoundingClientRect().width, 0);
		expect(popup.getBoundingClientRect().bottom).toBeLessThanOrEqual(editor.element().getBoundingClientRect().top);
	});

	it('should capture navigation and selection before the editor handles Enter', async () => {
		const selected = vi.fn();
		const editorKeys = vi.fn();
		const highlight = vi.fn();
		const { editor, dropdown } = await setUp({ onOptionSelected: selected, onEditorKey: editorKeys, onHighlightedOptionChange: highlight });
		await expect.poll(() => dropdown.highlightedOption).toBe('assets');
		await userEvent.keyboard('{ArrowDown}');
		await expect.poll(() => dropdown.highlightedOption).toBe('streams');
		await userEvent.keyboard('{ArrowUp}');
		await expect.poll(() => dropdown.highlightedOption).toBe('assets');
		await userEvent.keyboard('{Enter}');
		expect(selected).toHaveBeenCalledTimes(1);
		expect(selected.mock.calls[0][0].detail).toBe('assets');
		expect(editorKeys).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(editor.element());
		expect(editor.element().textContent).toBe('Mention @');
		await expect.poll(() => dropdown.isOpen).toBe(false);
		await expect.poll(() => dropdown.highlightedOption).toBeUndefined();
		expect(highlight.mock.calls.map(([event]) => event.detail)).toEqual(['assets', 'streams', 'assets', null]);
	});

	it('should keep the caret when a result is clicked and render the popup above the editor', async () => {
		const selected = vi.fn();
		const highlight = vi.fn();
		const { editor, dropdown } = await setUp({ onOptionSelected: selected, onHighlightedOptionChange: highlight });
		const selection = window.getSelection()!;
		const caretNode = selection.anchorNode;
		const caretOffset = selection.anchorOffset;
		const option = page.getByText('Data streams', { exact: true });
		await expect.element(option).toBeVisible();
		expect(option.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(editor.element().getBoundingClientRect().top);
		await option.click();
		expect(document.activeElement).toBe(editor.element());
		expect(selection.anchorNode).toBe(caretNode);
		expect(selection.anchorOffset).toBe(caretOffset);
		expect(selected.mock.calls[0][0].detail).toBe('streams');
		await expect.poll(() => dropdown.isOpen).toBe(false);
		await expect.poll(() => dropdown.highlightedOption).toBeUndefined();
		expect(highlight.mock.calls.map(([event]) => event.detail)).toEqual(['assets', null]);
	});

	it('should keep option actions usable and allow Escape after focusing an action', async () => {
		const selected = vi.fn();
		const action = vi.fn();
		const options = { assets: { ...OPTIONS.assets, action: { icon: EIconName.InfoOutline, accessibleLabel: 'Result details', onClick: action } } };
		const { dropdown } = await setUp({ options, onOptionSelected: selected });
		await page.getByRole('button', { name: 'Result details' }).click();
		expect(action).toHaveBeenCalledTimes(1);
		expect(selected).not.toHaveBeenCalled();
		expect(dropdown.isOpen).toBe(true);
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => dropdown.isOpen).toBe(false);
	});

	it('should dismiss on Escape without forwarding it to the editor', async () => {
		const editorKeys = vi.fn();
		const dismiss = vi.fn();
		const { dropdown } = await setUp({ onEditorKey: editorKeys, onDismiss: dismiss });
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => dropdown.isOpen).toBe(false);
		expect(dismiss).toHaveBeenCalledTimes(1);
		expect(editorKeys).not.toHaveBeenCalled();
	});

	it.each([true, false])('should respect the topmost dropdown on Escape (escapeClose: %s)', async escapeClose => {
		const { editor, dropdown } = await setUp();
		const closed = vi.fn();
		const overlay = await render(
			<KvDropdownBase isOpen actionElement={editor.element() as HTMLElement} escapeClose={escapeClose} onOpenStateChange={closed}>
				<div slot="list">Another popup</div>
			</KvDropdownBase>
		);
		await whenKelvinReady(overlay.container.querySelector('kv-dropdown-base')!);
		await userEvent.keyboard('{Escape}');
		expect(dropdown.isOpen).toBe(true);
		expect(dropdown.highlightedOption).toBe('assets');
		if (escapeClose) {
			expect(closed).toHaveBeenCalledTimes(1);
			expect(closed.mock.calls[0][0].detail).toBe(false);
		} else {
			expect(closed).not.toHaveBeenCalled();
		}
	});

	it.each([false, true])('should close on Escape when editor shortcuts are off (initial shortcuts: %s)', async initiallyEnabled => {
		const { dropdown } = await setUp({ shortcuts: initiallyEnabled });
		dropdown.shortcuts = false;
		await expect.poll(() => document.querySelector('kv-select-multi-options')?.shortcuts).toBe(false);
		await userEvent.keyboard('{Escape}');
		await expect.poll(() => dropdown.isOpen).toBe(false);
	});

	it('should pass IME, modified, and ordinary typing keys through to the editor', async () => {
		const selected = vi.fn();
		const editorKeys = vi.fn();
		const { editor, dropdown } = await setUp({ onOptionSelected: selected, onEditorKey: editorKeys });
		await expect.poll(() => dropdown.highlightedOption).toBe('assets');
		for (const key of ['Enter', 'Escape', 'ArrowDown']) {
			for (const composition of [{ isComposing: true }, { keyCode: 229 }]) {
				const event = new KeyboardEvent('keydown', { key, ...composition, bubbles: true, cancelable: true, composed: true });
				editor.element().dispatchEvent(event);
				expect(event.defaultPrevented).toBe(false);
			}
		}
		await userEvent.keyboard('{Shift>}{Enter}{/Shift}x');
		expect(editorKeys.mock.calls.map(([key]) => key)).toContain('x');
		expect(selected).not.toHaveBeenCalled();
		expect(dropdown.isOpen).toBe(true);
		expect(dropdown.highlightedOption).toBe('assets');
	});

	it('should ignore keys from another field and stop handling keys when closed or disabled', async () => {
		const selected = vi.fn();
		const editorKeys = vi.fn();
		const { screen, editor, dropdown } = await setUp({ onOptionSelected: selected, onEditorKey: editorKeys });
		(screen.getByRole('textbox', { name: 'Other field' }).element() as HTMLInputElement).focus();
		await userEvent.keyboard('{ArrowDown}{Enter}{Escape}');
		expect(dropdown.isOpen).toBe(true);
		expect(dropdown.highlightedOption).toBe('assets');
		expect(selected).not.toHaveBeenCalled();
		(editor.element() as HTMLElement).focus();
		await screen.rerender(<EditorDropdown disabled onOptionSelected={selected} onEditorKey={editorKeys} />);
		await expect.poll(() => document.querySelector('kv-select-multi-options')?.shortcuts).toBe(false);
		await userEvent.keyboard('{Enter}');
		expect(selected).not.toHaveBeenCalled();
		expect(editorKeys.mock.calls.map(([key]) => key)).toContain('Enter');
		await screen.rerender(<EditorDropdown isOpen={false} onOptionSelected={selected} onEditorKey={editorKeys} />);
		await userEvent.keyboard('{Enter}');
		expect(selected).not.toHaveBeenCalled();
	});

	it('should follow controlled highlighting and replace a removed result after an asynchronous update', async () => {
		const { screen, dropdown } = await setUp();
		await screen.rerender(<EditorDropdown highlightedOption="tasks" />);
		await expect.poll(() => dropdown.highlightedOption).toBe('tasks');
		await screen.rerender(<EditorDropdown filteredOptions={{ streams: OPTIONS.streams }} />);
		await expect.poll(() => dropdown.highlightedOption).toBe('streams');
		await screen.rerender(<EditorDropdown filteredOptions={{}} />);
		await expect.poll(() => dropdown.highlightedOption).toBeUndefined();
		await screen.rerender(<EditorDropdown filteredOptions={{ tasks: OPTIONS.tasks }} />);
		await expect.poll(() => dropdown.highlightedOption).toBe('tasks');
		await userEvent.keyboard('{Escape}');
		await screen.rerender(<EditorDropdown isOpen={false} />);
		await screen.rerender(<EditorDropdown isOpen />);
		await expect.poll(() => dropdown.highlightedOption).toBe('assets');
	});

	it('should scroll a highlighted result into view beyond the virtualized rows', async () => {
		const options = Object.fromEntries(Array.from({ length: 60 }, (_, index) => [String(index), { value: String(index), label: `Result ${index}` }]));
		const { dropdown } = await setUp({ options });
		await expect.poll(() => dropdown.highlightedOption).toBe('0');
		await userEvent.keyboard('{ArrowDown>25/}');
		await expect.poll(() => dropdown.highlightedOption).toBe('25');
		await expect.element(page.getByText('Result 25', { exact: true })).toBeVisible();
	});

	it('should route keys only to the dropdown for the focused editor', async () => {
		const firstSelected = vi.fn();
		const secondSelected = vi.fn();
		const screen = await render(
			<>
				<EditorDropdown onOptionSelected={firstSelected} />
				<EditorDropdown onOptionSelected={secondSelected} />
			</>
		);
		const editors = screen.container.querySelectorAll<HTMLElement>('[contenteditable]');
		const dropdowns = screen.container.querySelectorAll('kv-single-select-dropdown');
		await Promise.all(Array.from(dropdowns, dropdown => whenKelvinReady(dropdown)));
		await expect.poll(() => dropdowns[0].highlightedOption).toBe('assets');
		await expect.poll(() => dropdowns[1].highlightedOption).toBe('assets');
		editors[0].focus();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		expect(firstSelected.mock.calls[0][0].detail).toBe('streams');
		expect(secondSelected).not.toHaveBeenCalled();
		expect(dropdowns[1].isOpen).toBe(true);
		expect(dropdowns[1].highlightedOption).toBe('assets');
	});

	it('should follow a replacement keyboard target without keeping the old editor active', async () => {
		const selected = vi.fn();
		const { screen, editor, dropdown } = await setUp({ onOptionSelected: selected });
		const replacement = screen.getByRole('textbox', { name: 'Other field' }).element() as HTMLInputElement;
		dropdown.keyboardTarget = replacement;
		await expect.poll(() => document.querySelector('kv-select-multi-options')?.keyboardTarget).toBe(replacement);
		const oldEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
		editor.element().dispatchEvent(oldEvent);
		expect(oldEvent.defaultPrevented).toBe(false);
		replacement.focus();
		await userEvent.keyboard('{ArrowDown}{Enter}');
		expect(selected.mock.calls[0][0].detail).toBe('streams');
	});

	it('should release its keyboard target after unmounting', async () => {
		const selected = vi.fn();
		const { screen, editor } = await setUp({ onOptionSelected: selected });
		const detachedEditor = editor.element();
		await screen.unmount();
		document.body.append(detachedEditor);
		try {
			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
			detachedEditor.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(false);
			expect(selected).not.toHaveBeenCalled();
		} finally {
			detachedEditor.remove();
		}
	});
});
