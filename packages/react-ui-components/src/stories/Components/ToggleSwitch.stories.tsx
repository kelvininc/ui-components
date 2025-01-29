import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';
import { EComponentSize, KvToggleSwitch } from '../../components';

export default {
	title: 'Inputs/Toggle Switch',
	component: 'kv-toggle-switch',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/toggle-switch/readme.md')
	}
};

KvToggleSwitch.displayName = 'KvToggleSwitch';

const ToggleSwitchTemplate: ComponentStory<typeof KvToggleSwitch> = args => {
	const [, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			...args,
			selectedOption: id
		});

	return <KvToggleSwitch {...args} onCheckedChange={onCheckedChange} />;
};

export const TextButtonsState = ToggleSwitchTemplate.bind({});
TextButtonsState.args = {
	options: [
		{
			label: 'Option 1',
			key: 'opt1'
		},
		{
			label: 'Option 2',
			key: 'opt2'
		},
		{
			label: 'Option 3',
			key: 'opt3',
			disabled: true
		},
		{
			label: 'Option 4',
			key: 'opt4'
		},
		{
			label: 'Option 5',
			key: 'opt5'
		}
	],
	selectedOption: 'opt2',
	disabledButtons: {
		opt1: false,
		opt2: false,
		opt3: false,
		opt4: false,
		opt5: false
	},
	size: EComponentSize.Small
};
