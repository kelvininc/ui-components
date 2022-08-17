import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvCalendarAdvanceDateSelector, ICalendarAdvanceSelectedTime, ECalendarAdvanceTimeType, ICalendarAdvanceTime } from '../../components';
import { TIMEZONES } from './configs/date.config';

// Required to have the correct TagName in the code sample
KvCalendarAdvanceDateSelector.displayName = 'KvCalendarAdvanceDateSelector';

export default {
	title: 'Calendar/AdvanceSelector',
	component: 'kv-advance-date-selector',
	argTypes: {
		timezone: {
			type: 'select',
			options: { arg: 'timezones' }
		},
		timezones: {
			type: 'array',
			options: TIMEZONES
		},
		onTimezoneChange: {
			action: 'timezoneChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/calendar-advance-date-selector/readme.md')
	}
};

const CalendarAdvanceDateSelectorTemplate: ComponentStory<typeof KvCalendarAdvanceDateSelector> = args => {
	const [selectedTime, setSelectedTime] = useState<ICalendarAdvanceSelectedTime>();
	const [selectedTimezone, setSelectedTimezone] = useState<string>();

	const onRelativeTimeChange = ({ detail: newRelativeOption }: CustomEvent<ICalendarAdvanceTime>) => {
		setSelectedTime({
			type: ECalendarAdvanceTimeType.Relative,
			key: newRelativeOption.key
		});
	};

	const onAbsoluteTimeChange = ({ detail: newSelectedRangeDates }: CustomEvent<ICalendarAdvanceTime>) => {
		setSelectedTime({
			type: ECalendarAdvanceTimeType.Absolute,
			key: newSelectedRangeDates.key
		});
	};

	const onTimezoneChange = ({ detail: newTimezone }: CustomEvent<string>) => {
		setSelectedTimezone(newTimezone);
	};

	return (
		<KvCalendarAdvanceDateSelector
			{...args}
			selectedTime={selectedTime}
			selectedTimezone={selectedTimezone}
			onTimezoneChange={onTimezoneChange}
			onRelativeTimeChange={onRelativeTimeChange}
			onAbsoluteTimeChange={onAbsoluteTimeChange}
		/>
	);
};

export const DefaultState = CalendarAdvanceDateSelectorTemplate.bind({});
DefaultState.args = {
	timezones: TIMEZONES
};

export const NoTimezone = CalendarAdvanceDateSelectorTemplate.bind({});
NoTimezone.args = {
	timezones: []
};
