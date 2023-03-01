import { ComponentStory } from '@storybook/react';
import { ITimePickerTime, KvTimePicker } from '../../components';
import React, { useState } from 'react';

KvTimePicker.displayName = 'KvTimeRangePicker';

export default {
	title: 'Time Picker/Time Picker',
	component: 'kv-time-picker',
	argTypes: {
		onTimeRangeChange: {
			action: 'change'
		},
		onDropdownStateChange: {
			action: 'change'
		},
		onCancelClicked: {
			action: 'change'
		}
	},
	parameters: {
		notes: require('@ui-notes/time-picker/readme.md')
	}
};

const TimePickerTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>();

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return <KvTimePicker {...args} selectedTimeState={selectedTime} selectedTimezone={selectedTime?.timezone?.name} onTimeRangeChange={onRelativeTimeChange} />;
};

export const DefaultState = TimePickerTemplate.bind({});
