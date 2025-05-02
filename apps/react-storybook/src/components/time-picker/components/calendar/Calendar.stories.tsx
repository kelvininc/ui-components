import type { Meta, StoryObj } from '@storybook/react';
import { KvCalendar } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Time Picker/Components/Calendar',
	component: KvCalendar,
	argTypes: {
		selectedDates: {
			type: 'object'
		},
		onChangeMonth: {
			action: 'changeMonth'
		},
		onChangeYear: {
			action: 'changeYear'
		},
		onClickDate: {
			action: 'clickDate'
		}
	}
} satisfies Meta<typeof KvCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		initialDate: new Date('2023-01-01').toISOString()
	}
};
