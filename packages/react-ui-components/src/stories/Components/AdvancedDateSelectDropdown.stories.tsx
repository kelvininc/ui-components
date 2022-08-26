import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvAdvancedDateSelectDropdown, ICalendarAdvanceSelectedTime, ITimeChange } from '../../components';
import { TIMEZONES } from './configs/date.config';

// Required to have the correct TagName in the code sample
KvAdvancedDateSelectDropdown.displayName = 'KvAdvancedDateSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Date/Advance Date Select Dropdown',
	component: 'kv-advanced-date-select-dropdown',
	argTypes: {
		timezone: {
			control: { type: 'select' },
			options: TIMEZONES
		},
		timezones: {
			control: { type: 'array' },
			options: TIMEZONES
		}
	},
	parameters: {
		notes: require('@ui-notes/advanced-date-select-dropdown/readme.md'),
		layout: 'centered'
	}
};

const AdvancedDateSelectorDropdownTemplate: ComponentStory<typeof KvAdvancedDateSelectDropdown> = args => {
	const [selectedTime, setSelectedTime] = useState<ICalendarAdvanceSelectedTime>();
	const [selectedTimezone, setSelectedTimezone] = useState<string>();

	const onTimeApplied = ({ detail: newTimeState }: CustomEvent<ITimeChange>) => {
		setSelectedTime({
			type: newTimeState.time.type,
			key: newTimeState.time.payload?.key
		});
		setSelectedTimezone(newTimeState.timezone);
	};

	return <KvAdvancedDateSelectDropdown {...args} selectedTime={selectedTime} selectedTimezone={selectedTimezone} onTimeApplied={onTimeApplied} />;
};

export const DefaultState = AdvancedDateSelectorDropdownTemplate.bind({});
DefaultState.args = {
	timezones: TIMEZONES
};

export const NoTimezones = AdvancedDateSelectorDropdownTemplate.bind({});
NoTimezones.args = {
	timezones: []
};
