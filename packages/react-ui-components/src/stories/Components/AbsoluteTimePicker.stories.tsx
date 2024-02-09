import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAbsoluteTimePickerMode, ERelativeTimeInputMode, KvAbsoluteTimePicker } from '../../components';

// Required to have the correct TagName in the code sample
KvAbsoluteTimePicker.displayName = 'KvAbsoluteTimePicker';

export default {
	title: 'Time Picker/Components/Absolute Time Picker',
	component: 'kv-absolute-time-picker',
	argTypes: {
		onSelectedDatesChange: {
			action: 'selectedDatesChange'
		},
		onBackButtonClicked: {
			action: 'backButtonClicked'
		},
		onRelativeTimeConfigReset: {
			action: 'relativeTimeConfigReset'
		},
		onRelativeTimeConfigChange: {
			action: 'relativeTimeConfigChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/absolute-time-picker/readme.md')
	}
};

const CalendarMonthTem: ComponentStory<typeof KvAbsoluteTimePicker> = args => <KvAbsoluteTimePicker {...args} />;

export const DefaultState = CalendarMonthTem.bind({});
export const RangeSelected = CalendarMonthTem.bind({});
RangeSelected.args = {
	selectedDates: ['2023-12-23 00:00:00', '2023-12-25 23:59:59'],
	initialDate: '2023-12-23'
};

export const SingleDateSelected = CalendarMonthTem.bind({});
SingleDateSelected.args = {
	selectedDates: ['2023-12-23 00:00:00'],
	initialDate: '2023-12-23',
	mode: EAbsoluteTimePickerMode.Single
};

export const RelativeConfig = CalendarMonthTem.bind({});
RelativeConfig.args = {
	selectedDates: ['2023-12-23 00:00:00', '2023-12-23 23:59:59'],
	relativeTimeConfig: {
		mode: ERelativeTimeInputMode.Text,
		from: '23 december - 24 hours',
		to: '23 december end of day'
	}
};
