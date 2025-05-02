import type { Meta, StoryObj } from '@storybook/react';
import { KvRelativeTimePicker } from '@kelvininc/react-ui-components';


const meta = {
	title: 'Time Picker/Components/Relative Time Picker',
	component: KvRelativeTimePicker,
	argTypes: {
		onTimezoneChange: {
			action: 'timezoneChange'
		},
		onSelectedRelativeTimeChange: {
			action: 'selectedRelativeTimeChange'
		},
		onCustomizeIntervalClicked: {
			action: 'customizeIntervalClicked'
		}
	}
} satisfies Meta<typeof KvRelativeTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;


export const DefaultState: Story = {
	args: {
		selectedTimeKey: 'today',
		customIntervalOptionEnabled: true,
		timezoneSelectionEnabled: true
	}
}

export const TimezoneHidden: Story = {
	args: {
		selectedTimeKey: 'today',
		customIntervalOptionEnabled: true,
		timezoneSelectionEnabled: false
	}
}

export const OnlySliderVisible: Story = {
	args: {
		selectedTimeKey: 'today',
		customIntervalOptionEnabled: false,
		timezoneSelectionEnabled: false
	}
}
