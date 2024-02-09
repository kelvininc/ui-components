import { ComponentStory } from '@storybook/react';
import { KvRelativeTimePicker } from '../../components';
import React from 'react';

KvRelativeTimePicker.displayName = 'KvRelativeTimePicker';

export default {
	title: 'Time Picker/Components/Relative Time Picker',
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
	customIntervalOptionEnabled: true,
	timezoneSelectionEnabled: true
};

export const TimezoneHidden = RelativeTimePickerTemplate.bind({});
TimezoneHidden.args = {
	selectedTimeKey: 'today',
	customIntervalOptionEnabled: true,
	timezoneSelectionEnabled: false
};

export const OnlySliderVisible = RelativeTimePickerTemplate.bind({});
OnlySliderVisible.args = {
	selectedTimeKey: 'today',
	customIntervalOptionEnabled: false,
	timezoneSelectionEnabled: false
};
