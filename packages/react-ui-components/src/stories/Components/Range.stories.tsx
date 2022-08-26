import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRange } from '../../components';
import { useArgs } from '@storybook/client-api';

KvRange.displayName = 'KvRange';

export default {
	title: 'Inputs/Range',
	component: 'kv-range',
	argTypes: {
		min: { control: { type: 'number' } },
		max: { control: { type: 'number' } },
		value: { control: { type: 'number' } },
		step: { control: { type: 'number' } },
		onValueChange: {
			action: 'valueChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/range/readme.md'),
		layout: 'centered'
	}
};

const RangeTemplate: ComponentStory<typeof KvRange> = args => {
	const [_, updateArgs] = useArgs();
	const onValueChange = (event: CustomEvent<number>) => updateArgs({ value: event.detail });

	return <KvRange {...args} onValueChange={onValueChange} />;
};

export const DefaultState = RangeTemplate.bind(this);
DefaultState.args = {
	min: 0,
	max: 10,
	value: 0,
	step: 1
};
