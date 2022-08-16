import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { ISelectRangeDates, KvCalendarRangeDatesSelector } from '../../components';

// Required to have the correct TagName in the code sample
KvCalendarRangeDatesSelector.displayName = 'KvCalendarRangeDatesSelector';

export default {
	title: 'Calendar/RangeSelector',
	component: 'kv-calendar-range-dates-selector',
	argTypes: {
		selectedRangeDate: {
			control: 'object'
		},
		disabledDates: {
			control: 'object'
		},
		initialDate: {
			control: 'date'
		},
		minDate: {
			control: 'date'
		},
		maxDate: {
			control: 'date'
		}
	},
	parameters: {
		notes: require('@ui-notes/calendar-range-dates-selector/readme.md')
	}
};

const CalendarRangeDatesSelectorTemplate: ComponentStory<typeof KvCalendarRangeDatesSelector> = args => {
	const [selectedRangeDates, setSelectedRangeDates] = useState<[] | [string] | [string, string]>([]);

	const onSelectRangeDates = ({ detail: { payload: dates } }: CustomEvent<ISelectRangeDates>) => {
		setSelectedRangeDates(dates);
	};

	return <KvCalendarRangeDatesSelector {...args} selectedRangeDates={selectedRangeDates} onSelectRangeDates={onSelectRangeDates} />;
};

export const DefaultState = CalendarRangeDatesSelectorTemplate.bind({});
DefaultState.args = {
	initialDate: new Date().toISOString()
};

export const DisabledState = CalendarRangeDatesSelectorTemplate.bind({});
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

export const RangeState = CalendarRangeDatesSelectorTemplate.bind({});
RangeState.args = {
	initialDate: new Date('2023-01-01').toISOString(),
	minDate: new Date('2023-01-03').toISOString(),
	maxDate: new Date('2023-01-29').toISOString()
};
