import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvInlineEditableField } from '../inline-editable-field';
import { KvActionButtonIcon } from '../../action-button-icon/action-button-icon';
import { KvActionButton } from '../../action-button/action-button';
import { ACTIVATION_MODIFIERS } from '../../action-button/test/action-button.mock';

describe('KvInlineEditableField (unit tests)', () => {
	let page: SpecPage;
	let component: KvInlineEditableField;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvInlineEditableField],
			html: `<kv-inline-editable-field><div><div></kv-inline-editable-field>`
		});
		component = page.rootInstance;
	});

	describe('on mouseenter the component', () => {
		beforeEach(() => {
			page.root.dispatchEvent(new MouseEvent('mouseenter'));
		});

		it('should change the isHovered to true', () => {
			expect(component.isHovering).toBe(true);
		});
	});

	describe('on mouseleave the component', () => {
		beforeEach(() => {
			page.root.dispatchEvent(new MouseEvent('mouseleave'));
		});

		it('should change the isHovered to false', () => {
			expect(component.isHovering).toBe(false);
		});
	});

	describe('while editing', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvInlineEditableField, KvActionButtonIcon, KvActionButton],
				html: '<kv-inline-editable-field value="Connection"><div>Connection</div></kv-inline-editable-field>'
			});
			component = page.rootInstance;
			(page.root.querySelector('.inline-editable-field-slot') as HTMLElement).innerText = 'Connection';
			component.handleFocus();
			await page.waitForChanges();
		});

		it('should name its discard and save actions', () => {
			const names = Array.from(page.root.querySelectorAll('kv-action-button-icon'), host =>
				host.shadowRoot?.querySelector('kv-action-button')?.shadowRoot?.querySelector('[part="button"]')?.getAttribute('aria-label')
			);

			expect(names).toEqual(['Discard changes', 'Save changes']);
		});

		it.each(ACTIVATION_MODIFIERS)('should leave %s + Enter to a page shortcut', modifier => {
			const save = jest.spyOn(component as unknown as { saveChanges: () => void }, 'saveChanges');
			component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', [modifier]: true }));

			expect(save).not.toHaveBeenCalled();
		});

		it('should honor an Enter that another control already handled', () => {
			const save = jest.spyOn(component as unknown as { saveChanges: () => void }, 'saveChanges');
			const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
			event.preventDefault();
			component.handleKeyDown(event);

			expect(save).not.toHaveBeenCalled();
		});
	});
});
