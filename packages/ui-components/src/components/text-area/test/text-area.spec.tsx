import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvTextArea } from '../text-area';
import { EValidationState } from '../../text-field/text-field.types';
import { CONTROLLED_TEXT_CASES, INPUT_FALLBACK_CASES, PASTE_CASES, SELECTION_SCOPE_CASES } from './text-area.mock';

describe('text area contracts', () => {
	it.each(INPUT_FALLBACK_CASES)('handles $name after native input', async row => {
		const page = await newSpecPage({ components: [KvTextArea], html: `<kv-text-area text="${row.initial}" max-char-length="3"></kv-text-area>` });
		const input = page.root.shadowRoot.querySelector<HTMLElement>('.input');
		const changed = jest.fn();
		page.root.addEventListener('textChange', changed);
		input.innerText = row.incoming;
		const event = new Event('input', { bubbles: true });
		Object.defineProperty(event, 'inputType', { value: row.inputType });
		input.dispatchEvent(event);
		await page.waitForChanges();
		expect(input.innerText).toBe(row.expected);
		expect(changed).toHaveBeenCalledTimes(row.expected === row.initial ? 0 : 1);
	});

	it.each(SELECTION_SCOPE_CASES)('enforces the limit with $name', async row => {
		const page = await newSpecPage({ components: [KvTextArea], html: '<kv-text-area text="CAB" max-char-length="3"></kv-text-area>' });
		const input = page.root.shadowRoot.querySelector<HTMLElement>('.input');
		const outside = page.doc.createElement('div');
		const original = Object.getOwnPropertyDescriptor(page.doc, 'getSelection');
		Object.defineProperty(page.doc, 'getSelection', {
			configurable: true,
			value: () =>
				row.selected
					? {
							anchorNode: !row.composed && row.anchorInside ? input : outside,
							focusNode: !row.composed && row.focusInside ? input : outside,
							getComposedRanges: row.composed
								? () => [{ startContainer: row.anchorInside ? input : outside, endContainer: row.focusInside ? input : outside }]
								: undefined,
							toString: () => 'CAB'
						}
					: null
		});
		try {
			const key = new Event('keypress', { bubbles: true, cancelable: true });
			Object.defineProperty(key, 'key', { value: 'X' });
			input.dispatchEvent(key);
			expect(key.defaultPrevented).toBe(!row.allowed);
			const paste = new Event('paste', { bubbles: true, cancelable: true });
			Object.defineProperty(paste, 'clipboardData', { value: { getData: () => 'TLS' } });
			input.dispatchEvent(paste);
			expect(paste.defaultPrevented).toBe(!row.allowed);
		} finally {
			if (original) Object.defineProperty(page.doc, 'getSelection', original);
			else Reflect.deleteProperty(page.doc, 'getSelection');
		}
	});

	it.each(CONTROLLED_TEXT_CASES)('synchronizes external text with $name without emitting input', async row => {
		const page = await newSpecPage({ components: [KvTextArea], html: `<kv-text-area text="Broker" max-char-length="100" disabled="${row.disabled}"></kv-text-area>` });
		const changed = jest.fn();
		page.root.addEventListener('textChange', changed);
		page.root.text = row.text;
		await page.waitForChanges();
		const input = page.root.shadowRoot.querySelector<HTMLElement>('.input');
		expect(input.innerText).toBe(row.expected);
		expect(input.classList.contains('placeholder')).toBe(row.expected === '');
		expect(page.root.shadowRoot.querySelector('.character-counter').textContent).toContain(`${[...row.expected].length}/100`);
		expect(changed).not.toHaveBeenCalled();
	});

	it.each(PASTE_CASES)('handles paste with $name', async row => {
		const attributes = row.limit === undefined ? '' : `max-char-length="${row.limit}"`;
		const page = await newSpecPage({ components: [KvTextArea], html: `<kv-text-area text="${row.initial}" ${attributes}></kv-text-area>` });
		const event = new Event('paste', { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'clipboardData', { value: { getData: () => row.pasted } });
		page.root.shadowRoot.querySelector('.input').dispatchEvent(event);
		expect(event.defaultPrevented).toBe(!row.allowed);
	});

	it.each(Object.values(EValidationState))('reflects %s and exposes validation on its textbox', async state => {
		const page = await newSpecPage({ components: [KvTextArea], html: `<kv-text-area state="${state}"></kv-text-area>` });
		const input = page.root.shadowRoot.querySelector('[role="textbox"]');
		expect(page.root.getAttribute('state')).toBe(state);
		expect(input).not.toBeNull();
		expect(input.getAttribute('aria-invalid')).toBe(state === EValidationState.Invalid ? 'true' : null);
		expect(page.root.shadowRoot.querySelector('.text-area-wrapper').classList.contains('invalid')).toBe(state === EValidationState.Invalid);
	});

	it('names the editable textbox without changing its text', async () => {
		const page = await newSpecPage({
			components: [KvTextArea],
			html: '<kv-text-area accessible-label="Connection notes" placeholder="Describe the broker" text="Plant broker"></kv-text-area>'
		});
		const input = page.root.shadowRoot.querySelector('[role="textbox"]');
		expect(input).not.toBeNull();
		expect(input.getAttribute('aria-label')).toBe('Connection notes');
		expect(input.getAttribute('aria-multiline')).toBe('true');
		expect(input.getAttribute('aria-placeholder')).toBe('Describe the broker');
		expect((input as HTMLElement).innerText).toBe('Plant broker');
	});

	it.each([false, true])('uses plain-text editing with disabled=%s', async disabled => {
		const page = await newSpecPage({ components: [KvTextArea], html: `<kv-text-area disabled="${disabled}"></kv-text-area>` });
		const input = page.root.shadowRoot.querySelector('.input');
		expect(input.getAttribute('contenteditable')).toBe(disabled ? 'false' : 'plaintext-only');
		expect(input.getAttribute('aria-disabled')).toBe(disabled ? 'true' : null);
	});
});

describe('Text Area (unit tests)', () => {
	let page: SpecPage;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with icon', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area icon="kv-notes" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with text', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area text="Hello World" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when initialized with text and placeholder', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTextArea],
				html: `<kv-text-area text="Hello World" placeholder="Add Description" max-char-length=100 />`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
