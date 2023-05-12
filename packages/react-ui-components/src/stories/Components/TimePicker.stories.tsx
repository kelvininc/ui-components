import { ComponentStory } from '@storybook/react';
import { ITimePickerTime, KvTimePicker } from '../../components';
import React, { useState } from 'react';

KvTimePicker.displayName = 'KvTimePicker';

export default {
	title: 'Time Picker/Time Picker',
	component: 'kv-time-picker',
	argTypes: {
		onTimeRangeChange: {
			action: 'timeRangeChange'
		},
		onDropdownStateChange: {
			action: 'dropdownStateChange'
		},
		onCancelClicked: {
			action: 'cancelClicked'
		},
		onShowCalendarStateChange: {
			action: 'showCalendarStateChange'
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

	return <KvTimePicker {...args} selectedTimeOption={selectedTime} onTimeRangeChange={onRelativeTimeChange} />;
};

const TimePickerSettedTimeTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'customize-interval',
		range: [1681319856833, 1681406272018],
		timezone: {
			name: 'Europe/Lisbon',
			offset: 60
		}
	});

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return <KvTimePicker {...args} selectedTimeOption={selectedTime} onTimeRangeChange={onRelativeTimeChange} />;
};

const TimePickerSettedRelativeTimeTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'last-24-h',
		range: [],
		timezone: {
			name: 'Europe/Lisbon',
			offset: 60
		}
	});

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return <KvTimePicker {...args} selectedTimeOption={selectedTime} onTimeRangeChange={onRelativeTimeChange} />;
};

const TimePickerWithoutTimezoneTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'last-72-h',
		range: []
	});
	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return <KvTimePicker {...args} selectedTimeOption={selectedTime} onTimeRangeChange={onRelativeTimeChange} />;
};

export const DefaultState = TimePickerTemplate.bind({});
export const AbsoluteTimeOptionSelected = TimePickerSettedTimeTemplate.bind({});
export const RelativeTimeOptionSelected = TimePickerSettedRelativeTimeTemplate.bind({});
export const NoTimezoneProvided = TimePickerWithoutTimezoneTemplate.bind({});
