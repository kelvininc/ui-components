import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvBadge, EBadgeState } from '../../components';

// Required to have the correct TagName in the code sample
KvBadge.displayName = 'KvBadge';

export default {
	title: 'Data Display/Badge',
	component: 'kv-badge',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EBadgeState)
		}
	},
	parameters: {
		notes: require('@ui-notes/badge/readme.md')
	}
};

const ButtonTemplate: ComponentStory<typeof KvBadge> = args => <KvBadge {...args}>12</KvBadge>;

export const DefaultState = ButtonTemplate.bind({});
export const InfoState = ButtonTemplate.bind({});
InfoState.args = {
	state: EBadgeState.Info
};

export const WarningState = ButtonTemplate.bind({});
WarningState.args = {
	state: EBadgeState.Warning
};

export const ErrorState = ButtonTemplate.bind({});
ErrorState.args = {
	state: EBadgeState.Error
};

export const SuccessState = ButtonTemplate.bind({});
SuccessState.args = {
	state: EBadgeState.Success
};
