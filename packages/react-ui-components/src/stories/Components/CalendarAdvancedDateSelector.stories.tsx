import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvCalendarAdvancedDateSelector, ICalendarAdvanceSelectedTime, ECalendarAdvanceTimeType, ICalendarAdvanceTime } from '../../components';
import { TIMEZONES } from './configs/date.config';

// Required to have the correct TagName in the code sample
KvCalendarAdvancedDateSelector.displayName = 'KvCalendarAdvancedDateSelector';

export default {
	title: 'Calendar/AdvanceSelector',
	component: 'kv-advanced-date-selector',
	argTypes: {
		timezone: {
			type: 'select',
			options: { arg: 'timezones' }
		},
		timezones: {
			type: 'array',
			options: TIMEZONES
		},
		absoluteTimeConfig: {
			type: 'object'
		},
		onTimezoneChange: {
			action: 'timezoneChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/calendar-advanced-date-selector/readme.md')
	}
};

const CalendarAdvancedDateSelectorTemplate: ComponentStory<typeof KvCalendarAdvancedDateSelector> = args => {
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
		<KvCalendarAdvancedDateSelector
			{...args}
			selectedTime={selectedTime}
			selectedTimezone={selectedTimezone}
			onTimezoneChange={onTimezoneChange}
			onRelativeTimeChange={onRelativeTimeChange}
			onAbsoluteTimeChange={onAbsoluteTimeChange}
			absoluteTimeConfig={args.absoluteTimeConfig}
		/>
	);
};

export const DefaultState = CalendarAdvancedDateSelectorTemplate.bind({});
DefaultState.args = {
	timezones: TIMEZONES,
	absoluteTimeConfig: {
		startInputConfig: {
			dateMask: 'YYYY-MM-DD HH:mm:ss'
		},
		endInputConfig: {
			dateMask: 'YYYY-MM-DD'
		}
	}
};

export const NoTimezone = CalendarAdvancedDateSelectorTemplate.bind({});
NoTimezone.args = {
	timezones: []
};
