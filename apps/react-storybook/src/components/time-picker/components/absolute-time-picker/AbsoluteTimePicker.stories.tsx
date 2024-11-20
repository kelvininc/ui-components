import type { Meta, StoryObj } from '@storybook/react';
import { EAbsoluteTimePickerMode, ERelativeTimeInputMode, KvAbsoluteTimePicker } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Time Picker/Components/Absolute Time Picker',
	component: KvAbsoluteTimePicker,
	argTypes: {
		onSelectedDatesChange: {
			action: 'selectedDatesChange'
		},
		onBackButtonClicked: {
			action: 'backButtonClicked'
		},
		onRelativeTimeConfigReset: {
			action: 'relativeTimeConfigReset'
		},
		onRelativeTimeConfigChange: {
			action: 'relativeTimeConfigChange'
		}
	}
} satisfies Meta<typeof KvAbsoluteTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {}
};

export const RangeSelected: Story = {
	args: {
		selectedDates: ['2023-12-23 00:00:00', '2023-12-25 23:59:59'],
		initialDate: '2023-12-23'
	}
}

export const SingleDateSelected: Story = {
	args: {
		selectedDates: ['2023-12-23 00:00:00'],
		initialDate: '2023-12-23',
		mode: EAbsoluteTimePickerMode.Single
	}
}

export const RelativeConfig: Story = {
	args: {
		selectedDates: ['2023-12-23 00:00:00', '2023-12-23 23:59:59'],
		relativeTimeConfig: {
			mode: ERelativeTimeInputMode.Text,
			from: '23 december - 24 hours',
			to: '23 december end of day'
		}
	}
}
