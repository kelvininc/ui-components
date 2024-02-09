import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { EAbsoluteTimePickerMode, ITimePickerTimezone, KvAbsoluteTimePickerDropdown, SelectedTimestamp } from '../../components';

// Required to have the correct TagName in the code sample
KvAbsoluteTimePickerDropdown.displayName = 'KvAbsoluteTimePickerDropdown';

export default {
	title: 'Time Picker/Absolute Time Picker Dropdown',
	component: 'kv-absolute-time-picker-dropdown',
	argTypes: {
		onSelectedDatesChange: {
			action: 'selectedDatesChange'
		},
		onDropdownStateChange: {
			action: 'dropdownStateChange'
		},
		onCancelClicked: {
			action: 'cancelClicked'
		}
	},
	parameters: {
		notes: require('@ui-notes/absolute-time-picker-dropdown/readme.md')
	}
};

const DefaultAbsoluteTimePickerDropdownTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdown> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>();

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} selectedDates={selectedDates} onSelectedDatesChange={onSelectedDatesChange} />;
};

const SingleDateTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdown> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>([1681319856833]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} mode={EAbsoluteTimePickerMode.Point} selectedDates={selectedDates} onSelectedDatesChange={onSelectedDatesChange} />;
};

const RangeTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdown> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>([1681319856833, 1681406272018]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} mode={EAbsoluteTimePickerMode.Range} selectedDates={selectedDates} onSelectedDatesChange={onSelectedDatesChange} />;
};

const WithTimezoneTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdown> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>([1681319856833]);

	const timezone: ITimePickerTimezone = {
		name: 'America/New_York',
		offset: -300
	};

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return (
		<KvAbsoluteTimePickerDropdown
			{...args}
			timezone={timezone}
			mode={EAbsoluteTimePickerMode.Point}
			selectedDates={selectedDates}
			onSelectedDatesChange={onSelectedDatesChange}
		/>
	);
};

export const DefaultState = DefaultAbsoluteTimePickerDropdownTemplate.bind({});
export const SingleDateState = SingleDateTemplate.bind({});
export const RangeState = RangeTemplate.bind({});
export const WithTimezone = WithTimezoneTemplate.bind({});
