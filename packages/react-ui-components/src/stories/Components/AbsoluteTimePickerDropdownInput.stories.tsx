import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { EAbsoluteTimePickerMode, ITimePickerTimezone, KvAbsoluteTimePickerDropdownInput, SelectedTime, SelectedTimeState } from '../../components';

// Required to have the correct TagName in the code sample
KvAbsoluteTimePickerDropdownInput.displayName = 'KvAbsoluteTimePickerDropdownInput';

export default {
	title: 'Time Picker/Absolute Time Picker Dropdown Input',
	component: 'kv-absolute-time-picker-dropdown-input',
	argTypes: {
		onSelectedTimeChange: {
			action: 'selectedTimeChange'
		},
		onDropdownStateChange: {
			action: 'dropdownStateChange'
		},
		onCancelClicked: {
			action: 'cancelClicked'
		}
	},
	parameters: {
		notes: require('@ui-notes/absolute-time-picker-dropdown-input/readme.md')
	}
};

const DefaultAbsoluteTimePickerDropdownInputTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdownInput> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimeState>([]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTime>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdownInput {...args} selectedTime={selectedDates} onSelectedTimeChange={onSelectedDatesChange} />;
};

const DefaultAbsoluteTimePickerDropdownInputSingleInputTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdownInput> = args => {
	const JANUARY_1_0H00: number = 1640995200 * 1000;
	const [selectedDates, setSelectedDates] = useState<SelectedTimeState>([JANUARY_1_0H00]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTime>) => {
		setSelectedDates(newDates);
	};

	const timezone: ITimePickerTimezone = {
		name: 'Asia/Tokyo',
		offset: 540
	};

	return (
		<KvAbsoluteTimePickerDropdownInput
			{...args}
			timezone={timezone}
			mode={EAbsoluteTimePickerMode.Single}
			selectedTime={selectedDates}
			onSelectedTimeChange={onSelectedDatesChange}
		/>
	);
};

const DefaultAbsoluteTimePickerDropdownInputWithMinimumDateTemplate: ComponentStory<typeof KvAbsoluteTimePickerDropdownInput> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimeState>([]);

	const APRIL_12_18H17: number = 1681319856833;
	const APRIL_12_21H06: number = 1681329996833;

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTime>) => {
		setSelectedDates(newDates);
	};

	return (
		<KvAbsoluteTimePickerDropdownInput
			{...args}
			selectedTime={selectedDates}
			onSelectedTimeChange={onSelectedDatesChange}
			minimumFromInputDate={APRIL_12_18H17}
			minimumToInputDate={APRIL_12_21H06}
			initialDate={APRIL_12_18H17}
		/>
	);
};

export const DefaultState = DefaultAbsoluteTimePickerDropdownInputTemplate.bind({});
export const SingleState = DefaultAbsoluteTimePickerDropdownInputSingleInputTemplate.bind({});
export const DefaultStateWithMinimumDates = DefaultAbsoluteTimePickerDropdownInputWithMinimumDateTemplate.bind({});
