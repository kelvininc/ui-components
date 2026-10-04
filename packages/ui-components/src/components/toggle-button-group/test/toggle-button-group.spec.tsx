import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { cloneDeep } from 'lodash-es';
import { KvToggleButtonGroup } from '../toggle-button-group';
import { KvToggleButton } from '../../toggle-button/toggle-button';
import { KvRadio } from '../../radio/radio';
import { ERadioControlType } from '../../radio/radio.types';
import { IToggleButton } from '../../toggle-button/toggle-button.types';
import { TOGGLE_BUTTON_ITEMS } from './toggle-button-group.mock';
import { h } from '@stencil/core';

describe('toggle group Tab policy', () => {
	it.each([
		{ type: 'radio', role: 'radiogroup', stops: [true, false, true] },
		{ type: 'checkbox', role: null, stops: [false, false, false] },
		{ type: undefined, role: 'radiogroup', stops: [true, false, true] }
	])('uses the $type control pattern', async ({ type, role, stops }) => {
		const buttons = ['telemetry', 'alarms', 'commands'].map(value => ({ value, label: value }));
		const page = await newSpecPage({
			components: [KvToggleButtonGroup, KvToggleButton],
			template: () => <kv-toggle-button-group buttons={buttons} withRadio selectedButtons={{ alarms: true }} />
		});
		page.root.radioControlType = type;
		await page.waitForChanges();
		expect(page.root.getAttribute('role')).toBe(role);
		expect(Array.from(page.root.shadowRoot.querySelectorAll('kv-toggle-button')).map(button => button.skipTabStop)).toEqual(stops);
	});
});

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

		it('should not be a radio group without radios', () => {
			expect(page.root?.hasAttribute('role')).toBe(false);
		});
	});

	describe('when rendering with radios', () => {
		const render = async (props: { radioControlType?: ERadioControlType; buttons?: IToggleButton[] } = {}) => {
			page = await newSpecPage({
				components: [KvToggleButtonGroup, KvToggleButton, KvRadio],
				template: () => <kv-toggle-button-group buttons={props.buttons ?? toggleButtonsMock} radioControlType={props.radioControlType} withRadio></kv-toggle-button-group>
			});
		};
		const roles = () =>
			Array.from(page.root?.shadowRoot?.querySelectorAll('kv-toggle-button') ?? []).map(button =>
				button.shadowRoot?.querySelector('kv-radio')?.shadowRoot?.querySelector('.circle')?.getAttribute('role')
			);

		it('should be a radio group of radios by default', async () => {
			await render();

			expect(page.root?.getAttribute('role')).toBe('radiogroup');
			expect(roles()).toEqual(['radio', 'radio', 'radio', 'radio']);
		});

		it('should be checkboxes, not a radio group, when a checked button can be unchecked or several checked at once', async () => {
			await render({ radioControlType: ERadioControlType.Checkbox });

			expect(page.root?.hasAttribute('role')).toBe(false);
			expect(roles()).toEqual(['checkbox', 'checkbox', 'checkbox', 'checkbox']);
		});

		it("should let a button's own control type win over the group's", async () => {
			await render({ buttons: toggleButtonsMock.map(button => ({ ...button, radioControlType: ERadioControlType.Checkbox })) });

			expect(page.root?.hasAttribute('role')).toBe(false);
			expect(roles()).toEqual(['checkbox', 'checkbox', 'checkbox', 'checkbox']);
		});
	});
});
