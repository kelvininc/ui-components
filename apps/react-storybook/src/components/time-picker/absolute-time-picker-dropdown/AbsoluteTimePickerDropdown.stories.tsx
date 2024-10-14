import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { EAbsoluteTimePickerMode, ITimePickerTimezone, KvAbsoluteTimePickerDropdown, SelectedTimestamp } from '@kelvininc/react-ui-components';

const DefaultAbsoluteTimePickerDropdownTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>();

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} selectedDates={selectedDates} onSelectedDatesChange={onSelectedDatesChange} />;
};

const meta = {
	title: 'Time Picker/Absolute Time Picker Dropdown',
	component: KvAbsoluteTimePickerDropdown,
	render: DefaultAbsoluteTimePickerDropdownTemplate,
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
	}
} satisfies Meta<typeof KvAbsoluteTimePickerDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const SingleDateTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [date, setSelectedDate] = useState<SelectedTimestamp>([1681319856833]); // Date: 12-04-2023 18:17:36

	const onSelectedDateChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDate(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} mode={EAbsoluteTimePickerMode.Single} selectedDates={date} onSelectedDatesChange={onSelectedDateChange} />;
};

const RangeTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>([1681319856833, 1681406272018]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} mode={EAbsoluteTimePickerMode.Range} selectedDates={selectedDates} onSelectedDatesChange={onSelectedDatesChange} />;
};

const WithTimezoneTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [date, setSelectedDate] = useState<SelectedTimestamp>([1681319856833]);

	const timezone: ITimePickerTimezone = {
		name: 'America/New_York',
		offset: -300
	};

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDate(newDates);
	};

	return <KvAbsoluteTimePickerDropdown {...args} timezone={timezone} mode={EAbsoluteTimePickerMode.Single} selectedDates={date} onSelectedDatesChange={onSelectedDatesChange} />;
};

const SingleDateWithMinimumDateTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [date, setSelectedDate] = useState<SelectedTimestamp>([1681319856833]); // Date: 12-04-2023 18:17:36

	const onSelectedDateChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDate(newDates);
	};

	return (
		<KvAbsoluteTimePickerDropdown
			{...args}
			mode={EAbsoluteTimePickerMode.Single}
			calendarInputMinDate={1681319856833}
			selectedDates={date}
			onSelectedDatesChange={onSelectedDateChange}
		/>
	);
};

const RangeTemplateWithMinimumAndMaxDatesTemplate: StoryFn<ComponentProps<typeof KvAbsoluteTimePickerDropdown>> = args => {
	const [selectedDates, setSelectedDates] = useState<SelectedTimestamp>([1709500383063, 1709905174836]);

	const onSelectedDatesChange = ({ detail: newDates }: CustomEvent<SelectedTimestamp>) => {
		setSelectedDates(newDates);
	};

	return (
		<KvAbsoluteTimePickerDropdown
			{...args}
			mode={EAbsoluteTimePickerMode.Range}
			calendarInputMinDate={1704533805674}
			calendarInputMaxDate={1712309805674}
			selectedDates={selectedDates}
			onSelectedDatesChange={onSelectedDatesChange}
		/>
	);
};

export const DefaultState: Story = {
	args: {},
	render: DefaultAbsoluteTimePickerDropdownTemplate,
};

export const SingleDateState: Story = {
	args: {},
	render: SingleDateTemplate,
};

export const SingleDateWithMinimumDate: Story = {
	args: {},
	render: SingleDateWithMinimumDateTemplate,
};

export const RangeState: Story = {
	args: {},
	render: RangeTemplate,
};

export const RangeTemplateWithMinimumAndMaxDates: Story = {
	args: {},
	render: RangeTemplateWithMinimumAndMaxDatesTemplate,
};

export const WithTimezone: Story = {
	args: {},
	render: WithTimezoneTemplate,
};
