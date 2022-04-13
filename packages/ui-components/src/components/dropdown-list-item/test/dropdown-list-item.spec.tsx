import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvDropdownListItem } from '../dropdown-list-item';
import { h } from '@stencil/core';

describe('KvDropdownListItem (unit tests)', () => {
	let page: SpecPage;
	let component: KvDropdownListItem;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvDropdownListItem],
			template: () => <kv-dropdown-list-item label="Option 1" value="option1"></kv-dropdown-list-item>
		});
		component = page.rootInstance;
	});

	describe('when the component loads', () => {
		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the label', () => {
			expect(component.label).toEqual('Option 1');
		});

		it('should set the option value', () => {
			expect(component.value).toEqual('option1');
		});

		it('should set the selected status', () => {
			expect(component.selected).toEqual(false);
		});

		it('should set the togglable status', () => {
			expect(component.togglable).toEqual(false);
		});
	});
});
