import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvCalendarSingleDateSelector, ISelectDate } from '../../components';

// Required to have the correct TagName in the code sample
KvCalendarSingleDateSelector.displayName = 'KvCalendarSingleDateSelector';

export default {
	title: 'Calendar/DateSelector',
	component: 'kv-calendar-single-date-selector',
	argTypes: {
		selectedDate: {
			control: 'date'
		},
		initialDate: {
			control: 'date'
		},
		disabledDates: {
			control: 'object'
		},
		minDate: {
			control: 'date'
		},
		maxDate: {
			control: 'date'
		}
	},
	parameters: {
		notes: require('@ui-notes/calendar-single-date-selector/readme.md')
	}
};

const CalendarSingleDateSelectorTemplate: ComponentStory<typeof KvCalendarSingleDateSelector> = args => {
	const [selectedDate, setSelectedDate] = useState<string>();

	const onSelectDate = ({ detail: { payload: newDate } }: CustomEvent<ISelectDate>) => {
		setSelectedDate(newDate);
	};

	return <KvCalendarSingleDateSelector {...args} selectedDate={selectedDate} onSelectDate={onSelectDate} />;
};

export const DefaultState = CalendarSingleDateSelectorTemplate.bind({});
DefaultState.args = {
	initialDate: new Date().toISOString()
};

export const DisabledState = CalendarSingleDateSelectorTemplate.bind({});
DisabledState.args = {
	initialDate: new Date('2025-03-01').toISOString(),
	disabledDates: Array(31)
		.fill({})
		.reduce((accumulator, _, index) => {
			if (index % 2 === 0) {
				accumulator.push(new Date(`2025-03-${index + 1}`).toISOString());
			}

			return accumulator;
		}, [])
};

export const RangeState = CalendarSingleDateSelectorTemplate.bind({});
RangeState.args = {
	initialDate: new Date('2023-01-01').toISOString(),
	minDate: new Date('2023-01-03').toISOString(),
	maxDate: new Date('2023-01-29').toISOString()
};
