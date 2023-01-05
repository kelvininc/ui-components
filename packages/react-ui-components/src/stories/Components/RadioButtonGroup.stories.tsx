import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';
import { EIconName, KvRadioButtonGroup } from '../../components';

export default {
	title: 'Inputs/Radio Button Group',
	component: 'kv-radio-button-group',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/radio-button-group/readme.md')
	}
};

KvRadioButtonGroup.displayName = 'KvRadioButtonGroup';

const RadioButtonGroupTemplate: ComponentStory<typeof KvRadioButtonGroup> = args => {
	const [{ selectedButtons }, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			selectedButtons: {
				...selectedButtons,
				[id]: !(selectedButtons[id] === true)
			}
		});

	return <KvRadioButtonGroup {...args} onCheckedChange={onCheckedChange} />;
};

export const TextButtonsState = RadioButtonGroupTemplate.bind({});
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
	}
};

export const IconButtonsState = RadioButtonGroupTemplate.bind({});
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
