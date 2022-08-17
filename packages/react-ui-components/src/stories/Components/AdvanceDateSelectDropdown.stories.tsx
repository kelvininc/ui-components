import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvAdvanceDateSelectDropdown, ICalendarAdvanceSelectedTime, ITimeChange } from '../../components';
import { TIMEZONES } from './configs/date.config';

// Required to have the correct TagName in the code sample
KvAdvanceDateSelectDropdown.displayName = 'KvAdvanceDateSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Date/Advance Date Select Dropdown',
	component: 'kv-advance-date-select-dropdown',
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
		notes: require('@ui-notes/advance-date-select-dropdown/readme.md'),
		layout: 'centered'
	}
};

const AdvanceDateSelectorDropdownTemplate: ComponentStory<typeof KvAdvanceDateSelectDropdown> = args => {
	const [selectedTime, setSelectedTime] = useState<ICalendarAdvanceSelectedTime>();
	const [selectedTimezone, setSelectedTimezone] = useState<string>();

	const onTimeApplied = ({ detail: newTimeState }: CustomEvent<ITimeChange>) => {
		setSelectedTime({
			type: newTimeState.time.type,
			key: newTimeState.time.payload?.key
		});
		setSelectedTimezone(newTimeState.timezone);
	};

	return <KvAdvanceDateSelectDropdown {...args} selectedTime={selectedTime} selectedTimezone={selectedTimezone} onTimeApplied={onTimeApplied} />;
};

export const DefaultState = AdvanceDateSelectorDropdownTemplate.bind({});
DefaultState.args = {
	timezones: TIMEZONES
};

export const NoTimezones = AdvanceDateSelectorDropdownTemplate.bind({});
NoTimezones.args = {
	timezones: []
};
