import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';
import { EIconName, KvToggleButtonGroup } from '../../components';

export default {
	title: 'Inputs/Toggle Button Group',
	component: 'kv-toggle-button-group',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/toggle-button-group/readme.md')
	}
};

KvToggleButtonGroup.displayName = 'KvToggleButtonGroup';

const ToggleButtonGroupTemplate: ComponentStory<typeof KvToggleButtonGroup> = args => {
	const [{ selectedButtons }, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			selectedButtons: {
				...selectedButtons,
				[id]: !(selectedButtons[id] === true)
			}
		});

	return <KvToggleButtonGroup {...args} onCheckedChange={onCheckedChange} />;
};

export const TextButtonsState = ToggleButtonGroupTemplate.bind({});
TextButtonsState.args = {
	buttons: [
		{
			label: 'Option 1',
			value: 'opt1'
		},
		{
			label: 'Option 2',
			value: 'opt2'
		},
		{
			label: 'Option 3',
			value: 'opt3',
			disabled: true
		},
		{
			label: 'Option 4',
			value: 'opt4'
		},
		{
			label: 'Option 5',
			value: 'opt5'
		}
	],
	selectedButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: true,
		opt5: false
	},
	disabledButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: false,
		opt5: false
	},
	radioButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: false,
		opt5: false
	}
};

export const IconButtonsState = ToggleButtonGroupTemplate.bind({});
IconButtonsState.args = {
	buttons: [
		{
			icon: EIconName.DensityLow,
			value: 'low'
		},
		{
			icon: EIconName.DensityMedium,
			value: 'medium'
		},
		{
			icon: EIconName.DensityHigh,
			value: 'high'
		}
	],
	selectedButtons: {
		low: true,
		medium: false,
		hight: false
	}
};

export const RadioButtonsState = ToggleButtonGroupTemplate.bind({});
RadioButtonsState.args = {
	buttons: [
		{
			label: 'Option 1',
			value: 'opt1'
		},
		{
			label: 'Option 2',
			value: 'opt2'
		},
		{
			label: 'Option 3',
			value: 'opt3',
			disabled: true
		},
		{
			label: 'Option 4',
			value: 'opt4'
		},
		{
			label: 'Option 5',
			value: 'opt5'
		}
	],
	selectedButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: true,
		opt5: false
	},
	disabledButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: false,
		opt5: false
	},
	withRadio: true
};
