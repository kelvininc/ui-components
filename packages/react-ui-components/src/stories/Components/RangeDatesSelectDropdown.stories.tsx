import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { ISelectRangeDates, KvRangeDatesSelectDropdown, SelectedRange } from '../../components';

// Required to have the correct TagName in the code sample
KvRangeDatesSelectDropdown.displayName = 'KvRangeDatesSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Date/Range Dates Select Dropdown',
	component: 'kv-range-dates-select-dropdown',
	argTypes: {
		startInputConfig: {
			control: { type: 'object' }
		},
		endInputConfig: {
			control: { type: 'object' }
		},
		isOpen: {
			control: { type: 'boolean' }
		},
		selectedRangeDates: {
			control: 'object'
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
		notes: require('@ui-notes/range-dates-select-dropdown/readme.md')
	}
};

const RangeDatesSelectDropdownTemplate: ComponentStory<typeof KvRangeDatesSelectDropdown> = args => {
	const [selectedRangeDates, setSelectedRangeDates] = useState<SelectedRange>([]);

	const onSelectRangeDates = ({ detail: { payload: newSelectedRangeDates } }: CustomEvent<ISelectRangeDates>) => {
		setSelectedRangeDates(newSelectedRangeDates);
	};

	return <KvRangeDatesSelectDropdown {...args} selectedRangeDates={selectedRangeDates} onSelectRangeDates={onSelectRangeDates} />;
};

export const DefaultState = RangeDatesSelectDropdownTemplate.bind({});
DefaultState.args = {
	startInputConfig: {
		label: 'From'
	},
	endInputConfig: {
		label: 'To'
	}
};
