import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTimePickerCalendar } from '../../components';

// Required to have the correct TagName in the code sample
KvTimePickerCalendar.displayName = 'KvTimePickerCalendar';

export default {
	title: 'Time Picker/Components/Time Picker Calendar',
	component: 'kv-time-picker-calendar',
	argTypes: {
		selectedDates: {
			type: 'object'
		},
		onChangeMonth: {
			action: 'changeMonth'
		},
		onChangeYear: {
			action: 'changeYear'
		},
		onClickDate: {
			action: 'clickDate'
		}
	},
	parameters: {
		notes: require('@ui-notes/time-picker-calendar/readme.md')
	}
};

const CalendarMonthTem: ComponentStory<typeof KvTimePickerCalendar> = args => <KvTimePickerCalendar {...args} />;

export const DefaultState = CalendarMonthTem.bind({});
DefaultState.args = {
	initialDate: new Date('2023-01-01').toISOString()
};
