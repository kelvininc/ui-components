import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAlarmSeverity, ETagAlarmSize, KvTagAlarm } from '../../components';

KvTagAlarm.displayName = 'KvTagAlarm';

export default {
	title: 'Data Display/Tag Alarm',
	component: 'kv-tag-alarm',
	argTypes: {
		severity: {
			control: { type: 'select' },
			options: Object.values(EAlarmSeverity)
		},
		size: {
			control: { type: 'select' },
			options: Object.values(ETagAlarmSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/tag-alarm/readme.md')
	}
};

const TagTemplate: ComponentStory<typeof KvTagAlarm> = args => <KvTagAlarm {...args} />;

export const Default = TagTemplate.bind(this);
Default.args = {
	severity: EAlarmSeverity.One,
	size: ETagAlarmSize.XSmall,
	hideLabel: false
};

export const CustomText = TagTemplate.bind(this);
CustomText.args = {
	severity: EAlarmSeverity.One,
	size: ETagAlarmSize.XSmall,
	hideLabel: false,
	label: '+99'
};

export const HiddenLabel = TagTemplate.bind(this);
HiddenLabel.args = {
	severity: EAlarmSeverity.One,
	size: ETagAlarmSize.XSmall,
	hideLabel: true
};
