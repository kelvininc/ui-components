import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvTimePickerSelectOption } from '../time-picker-select-option';
import { h } from '@stencil/core';

describe('KvTimePickerSelectOption (unit tests)', () => {
	let page: SpecPage;
	let component: KvTimePickerSelectOption;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTimePickerSelectOption],
				template: () => <kv-time-picker-select-option label="Option 1" value="option1"></kv-time-picker-select-option>
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
		});
	});
});
