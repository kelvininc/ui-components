import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvCalendar } from '../../components';

// Required to have the correct TagName in the code sample
KvCalendar.displayName = 'KvCalendar';

export default {
	title: 'Time Picker/Components/Calendar',
	component: 'kv-calendar',
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
		notes: require('@ui-notes/calendar/readme.md')
	}
};

const CalendarMonthTem: ComponentStory<typeof KvCalendar> = args => <KvCalendar {...args} />;

export const DefaultState = CalendarMonthTem.bind({});
DefaultState.args = {
	initialDate: new Date('2023-01-01').toISOString()
};
