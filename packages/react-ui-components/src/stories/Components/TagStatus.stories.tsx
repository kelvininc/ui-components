import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, EIconName, ETagState, KvTagStatus } from '../../components';

KvTagStatus.displayName = 'KvTagStatus';

export default {
	title: 'Data Display/Tag Status',
	component: 'kv-tag-status',
	argTypes: {
		state: {
			control: { type: 'select' },
			options: Object.values(ETagState)
		},
		icon: {
			control: { type: 'select' },
			options: Object.values(EIconName)
		}
	},
	parameters: {
		notes: require('@ui-notes/tag-status/readme.md')
	}
};

const TagStatusTemplate: ComponentStory<typeof KvTagStatus> = args => <KvTagStatus {...args} />;

export const Error = TagStatusTemplate.bind({});
Error.args = {
	state: ETagState.Error,
	icon: EIconName.Error,
	label: 'Failed'
};

export const Unknown = TagStatusTemplate.bind({});
Unknown.args = {
	state: ETagState.Unknown,
	icon: EIconName.Error,
	label: 'Unknown'
};

export const Warning = TagStatusTemplate.bind({});
Warning.args = {
	state: ETagState.Warning,
	icon: EIconName.Error,
	label: 'Partially Online'
};

export const Success = TagStatusTemplate.bind({});
Success.args = {
	state: ETagState.Success,
	icon: EIconName.Success,
	label: 'Running'
};

export const Info = TagStatusTemplate.bind({});
Info.args = {
	state: ETagState.Info,
	icon: EIconName.Error,
	label: 'Started'
};

export const WithoutLabel = TagStatusTemplate.bind({});
WithoutLabel.args = {
	state: ETagState.Info,
	icon: EIconName.Error,
	label: ''
};
