import { ComponentStory } from '@storybook/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EComponentSize, EIconName, KvMultiSelectDropdown } from '../../components';
import { searchDropdownOptions } from './helpers/dropdown.helper';

// Required to have the correct TagName in the code sample
KvMultiSelectDropdown.displayName = 'KvMultiSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Select/Multi Select Dropdown',
	component: 'kv-multi-select-dropdown',
	argTypes: {
		isOpen: {
			control: { type: 'boolean' }
		},
		icon: {
			control: { type: 'text' }
		},
		placeholder: {
			control: { type: 'text' }
		},
		searchable: {
			control: { type: 'boolean' }
		},
		required: {
			control: { type: 'boolean' }
		},
		disabled: {
			control: { type: 'boolean' }
		},
		selectionClearable: {
			control: { type: 'boolean' }
		},
		label: {
			control: { type: 'text' }
		},
		helpText: {
			control: { type: 'text' }
		},
		errorState: {
			control: { type: 'text' }
		},
		selectedOptions: {
			control: { type: 'object' }
		},
		inputSize: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/multi-select-dropdown/readme.md')
	}
};

const MultiSelectDropdownTemplate: ComponentStory<typeof KvMultiSelectDropdown> = ({
	options,
	selectedOptions,
	...otherProps
}: {
	options?: ISelectMultiOptions;
	selectedOptions?: Record<string, boolean>;
}) => {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => setSearchTerm(searchedLabel), []);
	const filteredOptions = useMemo(() => searchDropdownOptions(searchTerm ?? '', options ?? {}), [searchTerm, options]);

	const onOptionsSelected = useCallback(({ detail: options }: CustomEvent<Record<string, boolean>>) => setSelected(options), []);
	const [selected, setSelected] = useState<Record<string, boolean>>(selectedOptions || {});

	useEffect(() => {
		setSelected(selectedOptions || {});
	}, [selectedOptions]);

	return (
		<KvMultiSelectDropdown
			onSearchChange={onSearchChange}
			selectedOptions={selected}
			options={options}
			filteredOptions={filteredOptions}
			onOptionsSelected={onOptionsSelected}
			{...otherProps}
		/>
	);
};

export const Default = MultiSelectDropdownTemplate.bind({});
Default.args = {
	options: {
		option1: {
			value: 'option1',
			label: 'Option 1'
		},
		option2: {
			value: 'option2',
			label: 'Option 2'
		},
		option3: {
			value: 'option3',
			label: 'Option 3'
		},
		option4: {
			value: 'option4',
			label: 'Option 4'
		},
		option5: {
			value: 'option5',
			label: 'Option 5'
		},
		option6: {
			value: 'option6',
			label: 'Option 6'
		},
		option7: {
			value: 'option7',
			label: 'Option 7'
		},
		option8: {
			value: 'option8',
			label: 'Option 8'
		},
		option9: {
			value: 'option9',
			label: 'Option 9'
		},
		option10: {
			value: 'option10',
			label: 'Option 10'
		},
		option11: {
			value: 'option11',
			label: 'Option 11'
		},
		option12: {
			value: 'option12',
			label: 'Option 12'
		}
	},
	selectedOptions: { option2: true, option3: true },
	label: 'Options',
	icon: EIconName.Layer,
	searchable: true,
	selectionClearable: true
};

export const Groups = MultiSelectDropdownTemplate.bind({});
Groups.args = {
	options: {
		'UTC-12': {
			value: 'UTC-12',
			label: '(UTC-12) Anywhere on Earth',
			group: 'System Timezone - Default'
		},
		'UTC-01': {
			value: 'UTC-01',
			label: '(UTC-01) Azores Time',
			group: 'Other timezones'
		},
		'UTC-05': {
			value: 'UTC-05',
			label: '(UTC-05) Ecuador Time',
			group: 'Other timezones'
		},
		'UTC-11': {
			value: 'UTC-11',
			label: '(UTC-11) Samoa Standard Time',
			group: 'Other timezones'
		},
		'eUTC-10': {
			value: 'UTC-10',
			label: '(UTC-10) Cook Islands Standard Time',
			group: 'Other timezones'
		},
		'UTC-09': {
			value: 'UTC-09',
			label: '(UTC-09) Hawaii-Aleutian Standarc Time',
			group: 'Other timezones'
		}
	},
	selectedOptions: { 'UTC-12': true, 'UTC-05': true },
	label: 'Timezone',
	placeholder: 'Select a timezone',
	icon: EIconName.Time,
	searchable: true,
	selectionClearable: true
};
