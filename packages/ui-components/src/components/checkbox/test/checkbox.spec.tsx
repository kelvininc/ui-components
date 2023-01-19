import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvCheckbox } from '../checkbox';

describe('Radio Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvCheckbox;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCheckbox],
				html: '<kv-checkbox></kv-checkbox>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `checked` with value false', () => {
			expect(component.checked).toBeFalsy();
		});

		it('should initialize `disabled` with value false', () => {
			expect(component.disabled).toBeFalsy();
		});

		it('should initialize `indeterminate` with empty string', () => {
			expect(component.indeterminate).toBeFalsy();
		});
	});
});
