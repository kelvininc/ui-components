import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { EComponentSize } from '../../../types';
import { EActionButtonType } from '../../action-button/action-button.types';
import { EIconName } from '../../icon/icon.types';
import { KvTextField } from '../../text-field/text-field';
import { KvSelectCreateOption } from '../select-create-option';

describe('Select Create Option (unit tests)', () => {
	let page: SpecPage;
	let component: KvSelectCreateOption;
	let clickCreate: jest.Mock;
	let clickCancel: jest.Mock;
	let documentKeyDown: jest.Mock;

	const getTextField = (): HTMLKvTextFieldElement => page.root.querySelector('kv-text-field');
	const getNativeInput = (): HTMLInputElement => getTextField().shadowRoot.querySelector('input');
	// kv-action-button-icon is not registered, so its props are rendered as attributes
	const getCancelButton = (): HTMLElement => page.root.querySelector('[part="cancel-button"]');
	const getCreateButton = (): HTMLElement => page.root.querySelector('[part="create-button"]');

	const renderCreateOption = async (template: () => unknown) => {
		page = await newSpecPage({
			components: [KvSelectCreateOption, KvTextField],
			template
		});
		component = page.rootInstance;

		clickCreate = jest.fn();
		clickCancel = jest.fn();
		documentKeyDown = jest.fn();
		page.root.addEventListener('clickCreate', (event: CustomEvent<MouseEvent | KeyboardEvent>) => clickCreate(event.detail));
		page.root.addEventListener('clickCancel', (event: CustomEvent<MouseEvent | KeyboardEvent>) => clickCancel(event.detail));
		page.doc.addEventListener('keydown', documentKeyDown);
	};

	const pressKey = (target: Element, init: KeyboardEventInit): KeyboardEvent => {
		const event = new KeyboardEvent('keydown', { bubbles: true, composed: true, cancelable: true, ...init });
		target.dispatchEvent(event);

		return event;
	};

	// kv-action-button-icon is not registered, so its event is dispatched on the element the listener is attached to
	const clickButton = (button: Element): MouseEvent => {
		const event = new MouseEvent('click');
		button.dispatchEvent(new CustomEvent('clickButton', { detail: event }));

		return event;
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option />);
		});

		it('should initialize `value` with an empty string', () => {
			expect(component.value).toBe('');
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `loading` with false', () => {
			expect(component.loading).toBe(false);
		});

		it('should initialize `size` with small', () => {
			expect(component.size).toBe(EComponentSize.Small);
		});

		it('should render the cancel action as a secondary close button', () => {
			expect(getCancelButton().getAttribute('type')).toBe(EActionButtonType.Secondary);
			expect(getCancelButton().getAttribute('icon')).toBe(EIconName.Close);
		});

		it('should render the create action as a secondary done button', () => {
			expect(getCreateButton().getAttribute('type')).toBe(EActionButtonType.Secondary);
			expect(getCreateButton().getAttribute('icon')).toBe(EIconName.DoneAll);
		});

		it('should disable the create action', () => {
			expect(getCreateButton().hasAttribute('disabled')).toBe(true);
		});

		it('should keep the cancel action enabled', () => {
			expect(getCancelButton().hasAttribute('disabled')).toBe(false);
		});

		describe('and Enter is pressed in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Enter' });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});
	});

	describe('when it loads', () => {
		let focusInput: jest.SpyInstance;

		beforeEach(async () => {
			focusInput = jest.spyOn(KvTextField.prototype, 'focusInput');
			await renderCreateOption(() => <kv-select-create-option />);
		});

		it('should focus the input', () => {
			expect(focusInput).toHaveBeenCalledTimes(1);
		});
	});

	describe('when the value is filled', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" />);
		});

		it('should enable the create action', () => {
			expect(getCreateButton().hasAttribute('disabled')).toBe(false);
		});

		it('should not show the create action loading', () => {
			expect(getCreateButton().hasAttribute('loading')).toBe(false);
		});

		it('should keep the input editable', () => {
			expect(getTextField().inputReadonly).toBe(false);
			expect(getNativeInput().hasAttribute('readonly')).toBe(false);
		});

		describe('and Enter is pressed in the input', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getTextField(), { key: 'Enter' });
			});

			it('should emit `clickCreate` once with the keyboard event', () => {
				expect(clickCreate).toHaveBeenCalledTimes(1);
				expect(clickCreate).toHaveBeenCalledWith(event);
			});

			it('should prevent the default action', () => {
				expect(event.defaultPrevented).toBe(true);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});

			it('should not emit `clickCancel`', () => {
				expect(clickCancel).not.toHaveBeenCalled();
			});
		});

		describe.each([
			['while composing a character', { isComposing: true }],
			['with the key code of an input method', { keyCode: 229 }]
		])('and Enter is pressed in the input %s', (_, init: KeyboardEventInit) => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getTextField(), { key: 'Enter', ...init });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});

			it('should leave the key to the input method', () => {
				expect(event.defaultPrevented).toBe(false);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});
		});

		describe('and Escape is pressed in the input while composing a character', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getTextField(), { key: 'Escape', isComposing: true });
			});

			it('should not emit `clickCancel`', () => {
				expect(clickCancel).not.toHaveBeenCalled();
			});

			it('should leave the key to the input method', () => {
				expect(event.defaultPrevented).toBe(false);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});
		});

		describe('and Enter is held down in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Enter', repeat: true });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});

		describe('and Enter is pressed on the cancel action', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getCancelButton(), { key: 'Enter' });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});

			it('should not prevent the default action', () => {
				expect(event.defaultPrevented).toBe(false);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});
		});

		describe('and Escape is pressed in the input', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getTextField(), { key: 'Escape' });
			});

			it('should emit `clickCancel` once with the keyboard event', () => {
				expect(clickCancel).toHaveBeenCalledTimes(1);
				expect(clickCancel).toHaveBeenCalledWith(event);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});

		describe('and Escape is pressed on the create action', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getCreateButton(), { key: 'Escape' });
			});

			it('should emit `clickCancel` once with the keyboard event', () => {
				expect(clickCancel).toHaveBeenCalledTimes(1);
				expect(clickCancel).toHaveBeenCalledWith(event);
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});
		});

		describe('and another key is pressed in the input', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				event = pressKey(getTextField(), { key: 'a' });
			});

			it('should reach the document', () => {
				expect(documentKeyDown).toHaveBeenCalledTimes(1);
				expect(documentKeyDown).toHaveBeenCalledWith(event);
			});

			it('should not prevent the default action', () => {
				expect(event.defaultPrevented).toBe(false);
			});

			it('should not emit any action', () => {
				expect(clickCreate).not.toHaveBeenCalled();
				expect(clickCancel).not.toHaveBeenCalled();
			});
		});

		describe('and the create action is clicked', () => {
			let event: MouseEvent;

			beforeEach(() => {
				event = clickButton(getCreateButton());
			});

			it('should emit `clickCreate` once with the mouse event', () => {
				expect(clickCreate).toHaveBeenCalledTimes(1);
				expect(clickCreate).toHaveBeenCalledWith(event);
			});
		});

		describe('and the cancel action is clicked', () => {
			let event: MouseEvent;

			beforeEach(() => {
				event = clickButton(getCancelButton());
			});

			it('should emit `clickCancel` once with the mouse event', () => {
				expect(clickCancel).toHaveBeenCalledTimes(1);
				expect(clickCancel).toHaveBeenCalledWith(event);
			});
		});
	});

	describe('when disabled', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" disabled />);
		});

		it('should disable the create action', () => {
			expect(getCreateButton().hasAttribute('disabled')).toBe(true);
		});

		it('should keep the cancel action enabled', () => {
			expect(getCancelButton().hasAttribute('disabled')).toBe(false);
		});

		it('should disable the input', () => {
			expect(getTextField().inputDisabled).toBe(true);
		});

		describe('and Enter is pressed in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Enter' });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});

		describe('and the create action is clicked', () => {
			beforeEach(() => {
				clickButton(getCreateButton());
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});

		describe('and the cancel action is clicked', () => {
			beforeEach(() => {
				clickButton(getCancelButton());
			});

			it('should emit `clickCancel` once', () => {
				expect(clickCancel).toHaveBeenCalledTimes(1);
			});
		});

		describe('and Escape is pressed on the cancel action', () => {
			beforeEach(() => {
				pressKey(getCancelButton(), { key: 'Escape' });
			});

			it('should emit `clickCancel` once', () => {
				expect(clickCancel).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('when disabled with an input config that enables the input', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" disabled inputConfig={{ inputDisabled: false }} />);
		});

		it('should enable the input', () => {
			expect(getTextField().inputDisabled).toBe(false);
			expect(getNativeInput().hasAttribute('disabled')).toBe(false);
		});

		it('should disable the create action', () => {
			expect(getCreateButton().hasAttribute('disabled')).toBe(true);
		});

		it('should keep the cancel action enabled', () => {
			expect(getCancelButton().hasAttribute('disabled')).toBe(false);
		});

		describe('and Enter is pressed in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Enter' });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});
	});

	describe('when the input config makes the input read-only', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" inputConfig={{ inputReadonly: true }} />);
		});

		it('should keep the input read-only', () => {
			expect(getTextField().inputReadonly).toBe(true);
		});
	});

	describe('when loading', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" loading inputConfig={{ inputReadonly: false, inputDisabled: false }} />);
		});

		it('should show the create action loading', () => {
			expect(getCreateButton().hasAttribute('loading')).toBe(true);
		});

		it('should disable the create action', () => {
			expect(getCreateButton().hasAttribute('disabled')).toBe(true);
		});

		it('should disable the cancel action', () => {
			expect(getCancelButton().hasAttribute('disabled')).toBe(true);
		});

		it('should make the input read-only even when the input config does not', () => {
			expect(getTextField().inputReadonly).toBe(true);
			expect(getNativeInput().hasAttribute('readonly')).toBe(true);
		});

		it('should keep the input enabled', () => {
			expect(getTextField().inputDisabled).toBe(false);
		});

		describe('and Enter is pressed in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Enter' });
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});
		});

		describe('and Escape is pressed in the input', () => {
			beforeEach(() => {
				pressKey(getTextField(), { key: 'Escape' });
			});

			it('should not emit `clickCancel`', () => {
				expect(clickCancel).not.toHaveBeenCalled();
			});

			it('should not reach the document', () => {
				expect(documentKeyDown).not.toHaveBeenCalled();
			});
		});

		describe('and the actions are clicked', () => {
			beforeEach(() => {
				clickButton(getCreateButton());
				clickButton(getCancelButton());
			});

			it('should not emit `clickCreate`', () => {
				expect(clickCreate).not.toHaveBeenCalled();
			});

			it('should not emit `clickCancel`', () => {
				expect(clickCancel).not.toHaveBeenCalled();
			});
		});

		describe('and it stops loading', () => {
			let focusInput: jest.SpyInstance;

			beforeEach(async () => {
				focusInput = jest.spyOn(KvTextField.prototype, 'focusInput');
				page.root.loading = false;
				await page.waitForChanges();
			});

			it('should focus the input again', () => {
				expect(focusInput).toHaveBeenCalledTimes(1);
			});

			it('should hide the create action loading', () => {
				expect(getCreateButton().hasAttribute('loading')).toBe(false);
			});

			it('should enable the create action', () => {
				expect(getCreateButton().hasAttribute('disabled')).toBe(false);
			});

			it('should enable the cancel action', () => {
				expect(getCancelButton().hasAttribute('disabled')).toBe(false);
			});

			it('should make the input editable again', () => {
				expect(getTextField().inputReadonly).toBe(false);
				expect(getNativeInput().hasAttribute('readonly')).toBe(false);
			});

			describe('and Enter is pressed in the input', () => {
				beforeEach(() => {
					pressKey(getTextField(), { key: 'Enter' });
				});

				it('should emit `clickCreate` once', () => {
					expect(clickCreate).toHaveBeenCalledTimes(1);
				});
			});
		});
	});

	describe('when it starts loading', () => {
		let focusInput: jest.SpyInstance;

		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" />);
			focusInput = jest.spyOn(KvTextField.prototype, 'focusInput');
			page.root.loading = true;
			await page.waitForChanges();
		});

		it('should not focus the input again', () => {
			expect(focusInput).not.toHaveBeenCalled();
		});

		it('should make the input read-only', () => {
			expect(getTextField().inputReadonly).toBe(true);
		});

		it('should keep the input enabled, so that it keeps its focus', () => {
			// With no config to override it: read-only, never disabled, while submitting
			expect(getTextField().inputDisabled).toBe(false);
		});

		it('should show the create action loading', () => {
			expect(getCreateButton().hasAttribute('loading')).toBe(true);
		});
	});

	describe('when the methods are called', () => {
		beforeEach(async () => {
			await renderCreateOption(() => <kv-select-create-option value="Foo" />);
		});

		it('should focus the text field input on `focusInput`', async () => {
			const focusInput = jest.spyOn(KvTextField.prototype, 'focusInput');

			await page.root.focusInput();

			expect(focusInput).toHaveBeenCalledTimes(1);
		});

		it('should resolve `blurInput` without throwing', async () => {
			await expect(page.root.blurInput()).resolves.toBeUndefined();
		});
	});
});
