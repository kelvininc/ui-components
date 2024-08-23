import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvInlineEditableField } from '../inline-editable-field';

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
});
