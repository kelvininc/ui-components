import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { EAbsoluteTimePickerMode, ITimePickerTimezone, KvAbsoluteTimePickerDropdownInput, SelectedTime, SelectedTimeState } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Time Picker/Absolute Time Picker Dropdown Input',
	component: KvAbsoluteTimePickerDropdownInput,
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
	}
} satisfies Meta<typeof KvAbsoluteTimePickerDropdownInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultAbsoluteTimePickerDropdownInputTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdownInput>> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimeState>([]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTime>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdownInput {...args} selectedTime={selectedDates} onSelectedTimeChange={onSelectedDatesChange} />;
};

const DefaultAbsoluteTimePickerDropdownInputSingleInputTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdownInput>> = args => {
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

const DefaultAbsoluteTimePickerDropdownInputWithMinimumDateTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdownInput>> = args => {
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

export const DefaultState: Story = {
	args: {},
	render: DefaultAbsoluteTimePickerDropdownInputTemplate,
};

export const SingleState: Story = {
	args: {},
	render: DefaultAbsoluteTimePickerDropdownInputSingleInputTemplate,
};

export const DefaultStateWithMinimumDates: Story = {
	args: {},
	render: DefaultAbsoluteTimePickerDropdownInputWithMinimumDateTemplate,
};
