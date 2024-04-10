import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvCalendarDay } from '../../components';

// Required to have the correct TagName in the code sample
KvCalendarDay.displayName = 'KvCalendarDay';

export default {
	title: 'Time Picker/Components/Calendar Day',
	component: 'kv-calendar-day',
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
		notes: require('@ui-notes/calendar-day/readme.md')
	}
};

const TimePickerCalendarDayTemplate: ComponentStory<typeof KvCalendarDay> = args => <KvCalendarDay {...args} />;

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
