import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ITimePickerTime, KvTimePicker, KvTimePickerCustomEvent } from '@kelvininc/react-ui-components';
import { ComponentProps, useCallback, useState } from 'react';

const meta = {
	title: 'Time Picker/Time Picker',
	component: KvTimePicker,
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
	}
} satisfies Meta<typeof KvTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const TimePickerTemplate: StoryFn<ComponentProps<typeof KvTimePicker>> = args => {
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

const TimePickerSettedTimeTemplate: StoryFn<ComponentProps<typeof KvTimePicker>> = args => {
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

const TimePickerSettedRelativeTimeTemplate: StoryFn<ComponentProps<typeof KvTimePicker>> = args => {
	const [showCalendar, setShowCalendar] = useState<boolean>(false);
	const [selectedTime, setSelectedTime] = useState<ITimePickerTime>({
		key: 'last-24-h',
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

const TimePickerWithoutTimezoneTemplate: StoryFn<ComponentProps<typeof KvTimePicker>> = args => {
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

export const DefaultState: Story = {
	args: {},
	render: TimePickerTemplate,
};

export const AbsoluteTimeOptionSelected: Story = {
	args: {},
	render: TimePickerSettedTimeTemplate,
};

export const RelativeTimeOptionSelected: Story = {
	args: {},
	render: TimePickerSettedRelativeTimeTemplate,
};

export const NoTimezoneProvided: Story = {
	args: {},
	render: TimePickerWithoutTimezoneTemplate,
};
