import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTimePickerCalendarDay } from '../../components';

// Required to have the correct TagName in the code sample
KvTimePickerCalendarDay.displayName = 'KvTimePickerCalendarDay';

export default {
	title: 'Time Picker/Time Picker Calendar Day',
	component: 'kv-time-picker-calendar-day',
	argTypes: {
		onClickDay: {
			action: 'clickDay'
		},
		onMouseEnterDay: {
			action: 'mouseEnterDay'
		},
		onMouseLeaveDay: {
			action: 'mouseLeaveDay'
		}
	},
	parameters: {
		notes: require('@ui-notes/time-picker-calendar-day/readme.md')
	}
};

const TimePickerCalendarDayTemplate: ComponentStory<typeof KvTimePickerCalendarDay> = args => <KvTimePickerCalendarDay {...args} />;

export const DefaultState = TimePickerCalendarDayTemplate.bind({});
DefaultState.args = {
	day: 12
};

export const DisabledState = TimePickerCalendarDayTemplate.bind({});
DisabledState.args = {
	day: 12,
	disabled: true
};

export const ActiveState = TimePickerCalendarDayTemplate.bind({});
ActiveState.args = {
	day: 12,
	active: true
};

export const InRangeState = TimePickerCalendarDayTemplate.bind({});
InRangeState.args = {
	day: 12,
	inRange: true
};
