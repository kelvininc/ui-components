import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvToggleButtonGroup } from '../toggle-button-group';
import { TOGGLE_BUTTON_ITEMS } from './toggle-button-group.mock';
import { h } from '@stencil/core';

describe('Toggle Button Group (unit tests)', () => {
	let page: SpecPage;
	let component: KvToggleButtonGroup;

	const toggleButtonsMock = cloneDeep(TOGGLE_BUTTON_ITEMS);

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleButtonGroup],
				template: () => <kv-toggle-button-group buttons={toggleButtonsMock}></kv-toggle-button-group>
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
					label: 'Option 3'
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
