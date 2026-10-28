import { ownsEnterKey } from '../wizard.helper';

describe('Wizard helper (unit tests)', () => {
	describe('ownsEnterKey', () => {
		const createElement = (tagName: string, attributes: Record<string, string> = {}): HTMLElement => {
			const element = document.createElement(tagName);
			Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));

			return element;
		};

		it.each(['button', 'summary', 'textarea', 'select'])('should give Enter to a native %s', tagName => {
			expect(ownsEnterKey(createElement(tagName))).toBe(true);
		});

		it('should give Enter to a link to follow', () => {
			expect(ownsEnterKey(createElement('a', { href: '#docs' }))).toBe(true);
		});

		it('should not give Enter to a link without href, which is not a link to follow', () => {
			expect(ownsEnterKey(createElement('a'))).toBe(false);
		});

		it.each(['button', 'textbox', 'searchbox', 'combobox', 'listbox', 'spinbutton'])('should give Enter to a control with role %s', role => {
			expect(ownsEnterKey(createElement('div', { role }))).toBe(true);
		});

		it.each(['Combobox', 'combobox listbox', 'switch combobox'])('should read the role %p as HTML and ARIA do', role => {
			expect(ownsEnterKey(createElement('div', { role }))).toBe(true);
		});

		it('should not give Enter to a control with an unrelated role', () => {
			expect(ownsEnterKey(createElement('div', { role: 'switch' }))).toBe(false);
		});

		it('should give Enter to editable text', () => {
			const editor = createElement('div');
			Object.defineProperty(editor, 'isContentEditable', { value: true });

			expect(ownsEnterKey(editor)).toBe(true);
		});

		const createInput = (type?: string): HTMLInputElement => {
			const input = document.createElement('input');
			if (type !== undefined) input.type = type;

			return input;
		};

		it.each(['button', 'submit', 'reset', 'image'])('should give Enter to an input of type %s, which it activates', type => {
			expect(ownsEnterKey(createInput(type))).toBe(true);
		});

		it.each(['text', 'search', 'url', 'tel', 'email', 'password', 'number', 'date', 'datetime-local', 'month', 'time', 'week'])(
			'should give Enter to an input of type %s, which it confirms',
			type => {
				expect(ownsEnterKey(createInput(type))).toBe(true);
			}
		);

		it.each(['file', 'color'])('should give Enter to an input of type %s, whose picker it opens', type => {
			expect(ownsEnterKey(createInput(type))).toBe(true);
		});

		it.each([undefined, ''])('should read an input with a type of %p as the text field it is', type => {
			expect(ownsEnterKey(createInput(type))).toBe(true);
		});

		it.each(['checkbox', 'radio', 'range', 'hidden'])('should not give Enter to an input of type %s, which Enter does nothing to', type => {
			expect(ownsEnterKey(createInput(type))).toBe(false);
		});

		it.each([null, undefined, document.createElement('div'), document.createTextNode('step'), window])('should not give Enter to %p', node => {
			expect(ownsEnterKey(node)).toBe(false);
		});
	});
});
