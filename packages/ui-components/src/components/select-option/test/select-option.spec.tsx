import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvSelectOption } from '../select-option';
import { h } from '@stencil/core';

describe('KvSelectOption (unit tests)', () => {
	let page: SpecPage;
	let component: KvSelectOption;

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvSelectOption],
			template: () => <kv-select-option label="Option 1" value="option1"></kv-select-option>
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
