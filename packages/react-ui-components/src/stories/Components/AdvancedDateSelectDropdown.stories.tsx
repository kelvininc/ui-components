import { ComponentStory } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import React from 'react';
import { KvAdvancedDateSelectDropdown, ITimeChange, ECalendarAdvanceTimeType } from '../../components';
import { TIMEZONES } from './configs/date.config';

// Required to have the correct TagName in the code sample
KvAdvancedDateSelectDropdown.displayName = 'KvAdvancedDateSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Date/Advanced Date Select Dropdown',
	component: 'kv-advanced-date-select-dropdown',
	argTypes: {
		selectedTimezone: {
			control: { type: 'select' },
			options: TIMEZONES
		},
		timezones: {
			control: { type: 'array' },
			options: TIMEZONES
		},
		onTimeApplied: {
			action: 'timeApplied'
		}
	},
	parameters: {
		layout: 'centered',
		notes: require('@ui-notes/advanced-date-select-dropdown/readme.md')
	}
};

const AdvancedDateSelectorDropdownTemplate: ComponentStory<typeof KvAdvancedDateSelectDropdown> = args => {
	const [{ onTimeApplied: onTimeAppliedAction }, updateArgs] = useArgs();

	const onTimeApplied = ({ detail: newTimeState }: CustomEvent<ITimeChange>) => {
		updateArgs({
			selectedTime: {
				type: newTimeState.time.type,
				key: newTimeState.time.payload?.key
			},
			selectedTimezone: newTimeState.timezone.name
		});

		onTimeAppliedAction(newTimeState);
	};

	return <KvAdvancedDateSelectDropdown {...args} onTimeApplied={onTimeApplied} />;
};

export const DefaultState = AdvancedDateSelectorDropdownTemplate.bind({});
DefaultState.args = {
	timezones: TIMEZONES,
	selectedTime: {
		type: ECalendarAdvanceTimeType.Relative,
		key: 'last-24-h'
	}
};

export const NoTimezones = AdvancedDateSelectorDropdownTemplate.bind({});
NoTimezones.args = {
	timezones: []
};
