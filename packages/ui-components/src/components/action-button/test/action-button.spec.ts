import { SpecPage } from '@stencil/core/internal';
import { KvActionButton } from '../action-button';
import { newSpecPage } from '@stencil/core/testing';
import { EComponentSize } from '../../../utils/types';
import { ACTIVATION_KEYS, ACTIVATION_MODIFIERS } from './action-button.mock';

describe('Action Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvActionButton;
	// `aria-busy` sits on the element with the button role, not on the host
	const buttonPart = () => page.root?.shadowRoot?.querySelector('[part="button"]') as HTMLElement;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="primary"></kv-action-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `disabled` with false', () => {
			expect(component.disabled).toBe(false);
		});

		it('should initialize `active` with false', () => {
			expect(component.active).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});

		it('should not set `aria-busy`', () => {
			expect(buttonPart().hasAttribute('aria-busy')).toBe(false);
		});

		it('should expose the focusable element as a button', () => {
			expect(page.root?.shadowRoot?.querySelector('[part="button"]')?.getAttribute('role')).toBe('button');
		});
	});

	describe('when it has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="tertiary" accessible-label="Remove Topic 1"></kv-action-button>'
			});
		});

		it('should name the button with it', () => {
			expect(page.root?.shadowRoot?.querySelector('[part="button"]')?.getAttribute('aria-label')).toBe('Remove Topic 1');
		});
	});

	describe('when activated from the keyboard', () => {
		const render = async (disabled = false) => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: `<kv-action-button type="tertiary"${disabled ? ' disabled' : ''}><span>Add</span></kv-action-button>`
			});
			const onClickButton = jest.fn();
			const onNativeClick = jest.fn();
			page.root?.addEventListener('clickButton', onClickButton);
			page.root?.addEventListener('click', onNativeClick);

			return { button: page.root?.shadowRoot?.querySelector('[part="button"]') as HTMLElement, onClickButton, onNativeClick };
		};
		const press = (target: Element, init: KeyboardEventInit) => target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true, ...init }));

		it('should click on Enter and Space', async () => {
			const { button, onClickButton } = await render();

			press(button, { key: 'Enter' });
			press(button, { key: ' ' });

			expect(onClickButton).toHaveBeenCalledTimes(2);
		});

		it.each([' ', 'Enter'])('should consume %p: no scrolling, and nothing further up acts on it too', async key => {
			const { button } = await render();
			const onKeyDownAbove = jest.fn();
			page.root?.addEventListener('keydown', onKeyDownAbove);
			const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });

			button.dispatchEvent(event);

			expect(event.defaultPrevented).toBe(true);
			expect(onKeyDownAbove).not.toHaveBeenCalled();
		});

		it('should let keys it ignores through', async () => {
			const { button } = await render();
			const onKeyDownAbove = jest.fn();
			page.root?.addEventListener('keydown', onKeyDownAbove);

			press(button, { key: 'Tab' });

			expect(onKeyDownAbove).toHaveBeenCalledTimes(1);
		});

		it('should ignore other keys', async () => {
			const { button, onClickButton } = await render();

			press(button, { key: 'a' });

			expect(onClickButton).not.toHaveBeenCalled();
		});

		it.each(ACTIVATION_KEYS.flatMap(key => ACTIVATION_MODIFIERS.map(modifier => ({ key, modifier }))))('should pass through $modifier + $key', async ({ key, modifier }) => {
			const { button, onClickButton, onNativeClick } = await render();
			const onKeyDownAbove = jest.fn();
			page.root?.addEventListener('keydown', onKeyDownAbove);
			const event = new KeyboardEvent('keydown', { key, [modifier]: true, bubbles: true, composed: true, cancelable: true });

			button.dispatchEvent(event);

			expect(event.defaultPrevented).toBe(false);
			expect(onKeyDownAbove).toHaveBeenCalledTimes(1);
			expect(onClickButton).not.toHaveBeenCalled();
			expect(onNativeClick).not.toHaveBeenCalled();
		});

		it('should click once per press, ignoring auto-repeat', async () => {
			const { button, onClickButton } = await render();

			press(button, { key: ' ' });
			press(button, { key: ' ', repeat: true });

			expect(onClickButton).toHaveBeenCalledTimes(1);
		});

		it.each([' ', 'Enter'])('should consume repeated %p without clicking again', async key => {
			const { button, onClickButton, onNativeClick } = await render();
			const onKeyDownAbove = jest.fn();
			page.root?.addEventListener('keydown', onKeyDownAbove);
			const repeated = new KeyboardEvent('keydown', { key, repeat: true, bubbles: true, composed: true, cancelable: true });

			press(button, { key });
			button.dispatchEvent(repeated);

			expect(repeated.defaultPrevented).toBe(true);
			expect(onKeyDownAbove).not.toHaveBeenCalled();
			expect(onClickButton).toHaveBeenCalledTimes(1);
			expect(onNativeClick).toHaveBeenCalledTimes(1);
		});

		it.each([' ', 'Enter'])('should consume repeated %p after activation disables the button', async key => {
			const { button, onClickButton, onNativeClick } = await render();
			const onKeyDownAbove = jest.fn();
			page.root?.addEventListener('keydown', onKeyDownAbove);
			page.root?.addEventListener(
				'clickButton',
				() => {
					page.rootInstance.disabled = true;
				},
				{ once: true }
			);
			press(button, { key });
			await page.waitForChanges();
			const repeated = new KeyboardEvent('keydown', { key, repeat: true, bubbles: true, composed: true, cancelable: true });

			button.dispatchEvent(repeated);

			expect(button.getAttribute('aria-disabled')).toBe('true');
			expect(repeated.defaultPrevented).toBe(true);
			expect(onKeyDownAbove).not.toHaveBeenCalled();
			expect(onClickButton).toHaveBeenCalledTimes(1);
			expect(onNativeClick).toHaveBeenCalledTimes(1);
		});

		it.each([' ', 'Enter'])('should honor a previously canceled %p', async key => {
			const { button, onClickButton, onNativeClick } = await render();
			const event = new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true });
			// Stencil's mock DOM has no capture phase, so cancel before dispatch.
			event.preventDefault();

			button.dispatchEvent(event);

			expect(event.defaultPrevented).toBe(true);
			expect(onClickButton).not.toHaveBeenCalled();
			expect(onNativeClick).not.toHaveBeenCalled();
		});

		it('should not click, not even natively, when disabled', async () => {
			const { button, onClickButton, onNativeClick } = await render(true);

			press(button, { key: 'Enter' });

			expect(onClickButton).not.toHaveBeenCalled();
			expect(onNativeClick).not.toHaveBeenCalled();
			expect(button.getAttribute('aria-disabled')).toBe('true');
		});

		it('should leave keys pressed on content inside the button alone', async () => {
			const { button, onClickButton } = await render();
			const inner = page.doc.createElement('span');
			button.appendChild(inner);

			press(inner, { key: 'Enter' });

			expect(onClickButton).not.toHaveBeenCalled();
		});
	});

	describe('when is loading', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="secondary" loading></kv-action-button>'
			});
		});

		it('should set `aria-busy` to true', () => {
			expect(buttonPart().getAttribute('aria-busy')).toBe('true');
		});

		describe('and it stops loading', () => {
			beforeEach(async () => {
				page.root.loading = false;
				await page.waitForChanges();
			});

			it('should remove `aria-busy`', () => {
				expect(buttonPart().hasAttribute('aria-busy')).toBe(false);
			});
		});
	});

	describe('when is not loading', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvActionButton],
				html: '<kv-action-button type="secondary" loading="false"></kv-action-button>'
			});
		});

		it('should not set `aria-busy`', () => {
			expect(buttonPart().hasAttribute('aria-busy')).toBe(false);
		});
	});
});
