import { ComponentStory } from '@storybook/react';
import { KvRelativeTimePicker } from '../../components';
import React from 'react';

KvRelativeTimePicker.displayName = 'KvRelativeTimePicker';

export default {
	title: 'Time Picker/RelativeTimePicker',
	component: 'kv-relative-time-picker',
	argTypes: {
		onTimezoneChange: {
			action: 'timezoneChange'
		},
		onSelectedRelativeTimeChange: {
			action: 'selectedRelativeTimeChange'
		},
		onCustomizeIntervalClicked: {
			action: 'customizeIntervalClicked'
		}
	},
	parameters: {
		notes: require('@ui-notes/relative-time-picker/readme.md')
	}
};

const RelativeTimePickerTemplate: ComponentStory<typeof KvRelativeTimePicker> = args => <KvRelativeTimePicker {...args} />;

export const DefaultState = RelativeTimePickerTemplate.bind({});
DefaultState.args = {
	selectedTimeKey: 'today',
	customizeIntervalOptionVisible: true,
	timezoneSelectVisible: true
};

export const TimezoneHidden = RelativeTimePickerTemplate.bind({});
TimezoneHidden.args = {
	selectedTimeKey: 'today',
	customizeIntervalOptionVisible: true,
	timezoneSelectVisible: false
};

export const OnlySliderVisible = RelativeTimePickerTemplate.bind({});
OnlySliderVisible.args = {
	selectedTimeKey: 'today',
	customizeIntervalOptionVisible: false,
	timezoneSelectVisible: false
};
