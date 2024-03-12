import { ComponentStory } from '@storybook/react';
import { ITimePickerTime, KvTimePicker, KvTimePickerCustomEvent } from '../../components';
import React, { useCallback, useState } from 'react';

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
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>();

	const onShowCalendarStateChange = useCallback(({ detail }: KvTimePickerCustomEvent<boolean>) => {
		setShowCalendar(detail);
	}, []);

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return (
		<KvTimePicker
			{...args}
			showCalendar={showCalendar}
			onShowCalendarStateChange={onShowCalendarStateChange}
			selectedTimeOption={selectedTime}
			onTimeRangeChange={onRelativeTimeChange}
		/>
	);
};

const TimePickerSettedTimeTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'customize-interval',
		range: [1681319856833, 1681406272018],
		timezone: {
			name: 'Europe/Lisbon',
			offset: 60
		}
	});

	const onShowCalendarStateChange = useCallback(({ detail }: KvTimePickerCustomEvent<boolean>) => {
		setShowCalendar(detail);
	}, []);

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return (
		<KvTimePicker
			{...args}
			showCalendar={showCalendar}
			onShowCalendarStateChange={onShowCalendarStateChange}
			selectedTimeOption={selectedTime}
			onTimeRangeChange={onRelativeTimeChange}
		/>
	);
};

const TimePickerSettedRelativeTimeTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'last-72-h',
		range: [1707844501238, 1708103701238],
		timezone: {
			name: 'Europe/Lisbon',
			offset: 60
		}
	});

	const onShowCalendarStateChange = useCallback(({ detail }: KvTimePickerCustomEvent<boolean>) => {
		setShowCalendar(detail);
	}, []);

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return (
		<KvTimePicker
			{...args}
			showCalendar={showCalendar}
			onShowCalendarStateChange={onShowCalendarStateChange}
			selectedTimeOption={selectedTime}
			onTimeRangeChange={onRelativeTimeChange}
		/>
	);
};

const TimePickerWithoutTimezoneTemplate: ComponentStory<typeof KvTimePicker> = args => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>();
	const onShowCalendarStateChange = useCallback(({ detail }: KvTimePickerCustomEvent<boolean>) => {
		setShowCalendar(detail);
	}, []);
	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ITimePickerTime>) => {
		setSelectedTime({
			key: newRelativeOption.key,
			range: newRelativeOption.range,
			timezone: newRelativeOption.timezone
		});
	};

	return (
		<KvTimePicker
			{...args}
			showCalendar={showCalendar}
			onShowCalendarStateChange={onShowCalendarStateChange}
			selectedTimeOption={selectedTime}
			onTimeRangeChange={onRelativeTimeChange}
		/>
	);
};

export const DefaultState = TimePickerTemplate.bind({});
export const AbsoluteTimeOptionSelected = TimePickerSettedTimeTemplate.bind({});
export const RelativeTimeOptionSelected = TimePickerSettedRelativeTimeTemplate.bind({});
export const NoTimezoneProvided = TimePickerWithoutTimezoneTemplate.bind({});
