import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvRadioButtonGroup } from '../radio-button-group';
import { RADIO_BUTTON_ITEMS } from './radio-button-group.mock';
import { h } from '@stencil/core';

describe('Radio Button Group (unit tests)', () => {
	let page: SpecPage;
	let component: KvRadioButtonGroup;

	const radioButtonsMock = cloneDeep(RADIO_BUTTON_ITEMS);

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioButtonGroup],
				template: () => <kv-radio-button-group buttons={radioButtonsMock}></kv-radio-button-group>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct component tabs', () => {
			expect(component.buttons).toEqual([
				{
					value: 'opt1',
					label: 'Option 1'
				},
				{
					value: 'opt2',
					label: 'Option 2'
				},
				{
					value: 'opt3',
					label: 'Option 3',
					disabled: true
				},
				{
					value: 'opt4',
					label: 'Option 4',
					checked: true
				}
			]);
		});
	});
});
