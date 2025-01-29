import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvToggleSwitch } from '../toggle-switch';
import { TOGGLE_BUTTON_ITEMS } from './toggle-switch.mock';
import { h } from '@stencil/core';

describe('Toggle Switch (unit tests)', () => {
	let page: SpecPage;
	let component: KvToggleSwitch;

	const toggleOptionsMock = cloneDeep(TOGGLE_BUTTON_ITEMS);

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleSwitch],
				template: () => <kv-toggle-switch options={toggleOptionsMock}></kv-toggle-switch>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct component tabs', () => {
			expect(component.options).toEqual([
				{
					key: 'opt1',
					label: 'Option 1'
				},
				{
					key: 'opt2',
					label: 'Option 2'
				},
				{
					key: 'opt3',
					label: 'Option 3'
				},
				{
					key: 'opt4',
					label: 'Option 4'
				}
			]);
		});
	});
});
