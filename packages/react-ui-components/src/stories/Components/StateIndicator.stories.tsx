import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvStateIndicator } from '../../components';

KvStateIndicator.displayName = 'KvStateIndicator';

export default {
	title: 'Components/StateIndicator',
	component: 'kv-state-indicator',
	argTypes: {
		color: { type: 'color' },
		text: { type: 'text' }
	},
	parameters: {
		notes: require('@ui-notes/state-indicator/readme.md')
	}
};

const StateIndicatorTemplate: ComponentStory<typeof KvStateIndicator> = args => <KvStateIndicator {...args} />;

export const DefaultState = StateIndicatorTemplate.bind(this);
DefaultState.args = {
	text: 'State Indicator'
};

export const ColorState = StateIndicatorTemplate.bind(this);
ColorState.args = {
	color: 'green',
	text: 'State Indicator'
};
