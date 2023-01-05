import { ComponentStory } from '@storybook/react';
import React from 'react';
import { ETagStatusType, KvTagStatus } from '../../components';

KvTagStatus.displayName = 'KvTagStatus';

export default {
	title: 'Data Display/Tag Status',
	component: 'kv-tag-status',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(ETagStatusType)
		}
	},
	parameters: {
		notes: require('@ui-notes/tag-status/readme.md')
	}
};

const TagStatusTemplate: ComponentStory<typeof KvTagStatus> = args => <KvTagStatus {...args} />;

export const DefaultState = TagStatusTemplate.bind({});
export const Running = TagStatusTemplate.bind({});
Running.args = {
	type: ETagStatusType.Running
};

export const OnlineState = TagStatusTemplate.bind({});
OnlineState.args = {
	type: ETagStatusType.Online
};

export const FailedState = TagStatusTemplate.bind({});
FailedState.args = {
	type: ETagStatusType.Failed
};

export const OfflineState = TagStatusTemplate.bind({});
OfflineState.args = {
	type: ETagStatusType.Offline
};

export const UnknownState = TagStatusTemplate.bind({});
UnknownState.args = {
	type: ETagStatusType.Unknown
};

export const PendingDeployState = TagStatusTemplate.bind({});
PendingDeployState.args = {
	type: ETagStatusType.Pending
};

export const PartiallyOnlineState = TagStatusTemplate.bind({});
PartiallyOnlineState.args = {
	type: ETagStatusType.Partially
};
