import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvRadioButtonGroup } from '../radio-button-group';
import { RADIO_BUTTON_ITENS } from './radio-button-group.mock';
import { h } from '@stencil/core';

describe('Radio Button Group (unit tests)', () => {
	let page: SpecPage;
	let component: KvRadioButtonGroup;

	const radioButtonsMock = cloneDeep(RADIO_BUTTON_ITENS);

	describe('when rendering with required props', () => {
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
					label: 'Option 1',
					id: 'opt1'
				},
				{
					label: 'Option 2',
					id: 'opt2'
				},
				{
					label: 'Option 3',
					id: 'opt3',
					disabled: true
				},
				{
					label: 'Option 4',
					id: 'opt4',
					active: true
				}
			]);
		});
	});
});
