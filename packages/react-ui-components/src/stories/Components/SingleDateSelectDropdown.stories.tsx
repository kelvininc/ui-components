import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { ISelectDate, KvSingleDateSelectDropdown } from '../../components';

// Required to have the correct TagName in the code sample
KvSingleDateSelectDropdown.displayName = 'KvSingleDateSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Date/Single Date Select Dropdown',
	component: 'kv-single-date-select-dropdown',
	argTypes: {
		dropdownConfig: {
			control: { type: 'object' }
		},
		isOpen: {
			control: { type: 'boolean' }
		},
		selectedDate: {
			control: 'date'
		},
		initialDate: {
			control: 'date'
		},
		disabledDates: {
			control: 'object'
		},
		minDate: {
			control: 'date'
		},
		maxDate: {
			control: 'date'
		}
	},
	parameters: {
		notes: require('@ui-notes/single-date-select-dropdown/readme.md')
	}
};

const SingleDateSelectDropdownTemplate: ComponentStory<typeof KvSingleDateSelectDropdown> = args => {
	const [selectedDate, setSelectedDate] = useState<string | undefined>();

	const onSelectDate = ({ detail: { payload: newSelectedDate } }: CustomEvent<ISelectDate>) => {
		setSelectedDate(newSelectedDate);
	};

	return <KvSingleDateSelectDropdown {...args} selectedDate={selectedDate} onSelectDate={onSelectDate} />;
};

export const DefaultState = SingleDateSelectDropdownTemplate.bind({});
