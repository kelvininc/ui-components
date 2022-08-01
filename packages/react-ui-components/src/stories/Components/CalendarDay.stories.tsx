import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvCalendarDay } from '../../components';

// Required to have the correct TagName in the code sample
KvCalendarDay.displayName = 'KvCalendarDay';

export default {
	title: 'Calendar/Base/CalendarDay',
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

const CalendarDayTemplate: ComponentStory<typeof KvCalendarDay> = args => <KvCalendarDay {...args} />;

export const DefaultState = CalendarDayTemplate.bind({});
DefaultState.args = {
	day: 12
};

export const DisabledState = CalendarDayTemplate.bind({});
DisabledState.args = {
	day: 12,
	disabled: true
};

export const ActiveState = CalendarDayTemplate.bind({});
ActiveState.args = {
	day: 12,
	active: true
};

export const InRangeState = CalendarDayTemplate.bind({});
InRangeState.args = {
	day: 12,
	inRange: true
};
