import { ComponentStory } from '@storybook/react';
import React, { useCallback, useMemo } from 'react';
import { EComponentSize, EIconName, KvSingleSelectDropdown } from '../../components';
import { searchDropdownOptions } from './helpers/dropdown.helper';
import { useArgs } from '@storybook/client-api';

// Required to have the correct TagName in the code sample
KvSingleSelectDropdown.displayName = 'KvSingleSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Select/Single Select Dropdown',
	component: 'kv-single-select-dropdown',
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
		label: {
			control: { type: 'text' }
		},
		helpText: {
			control: { type: 'text' }
		},
		errorState: {
			control: { type: 'text' }
		},
		selectedOption: {
			control: { type: 'text' }
		},
		inputSize: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/single-select-dropdown/readme.md')
	}
};

const SingleSelectDropdownTemplate: ComponentStory<typeof KvSingleSelectDropdown> = args => {
	const [{ options, searchValue }, updateArgs] = useArgs();
	const filteredOptions = useMemo(() => searchDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => {
		updateArgs({ searchValue: searchedLabel });
	}, []);

	const onOptionSelected = useCallback(({ detail }: CustomEvent<string>) => updateArgs({ selectedOption: detail }), []);

	return <KvSingleSelectDropdown {...args} filteredOptions={filteredOptions} onSearchChange={onSearchChange} onOptionSelected={onOptionSelected} />;
};

export const Default = SingleSelectDropdownTemplate.bind({});
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
		}
	},
	selectedOption: 'option2',
	label: 'Options',
	placeholder: 'Select an option',
	icon: EIconName.Layer
};

export const SubOptions = SingleSelectDropdownTemplate.bind({});
SubOptions.args = {
	options: {
		'system-timezone': {
			value: 'system-timezone',
			label: 'System Timezone - Default',
			options: {
				'UTC-12': {
					value: 'UTC-12',
					label: '(UTC-12) Anywhere on Earth'
				}
			}
		},
		'other-timezones': {
			value: 'other-timezones',
			label: 'Other timezones',
			options: {
				'UTC-01': {
					value: 'UTC-01',
					label: '(UTC-01) Azores Time'
				},
				'UTC-05': {
					value: 'UTC-05',
					label: '(UTC-05) Ecuador Time'
				},
				'UTC-11': {
					value: 'UTC-11',
					label: '(UTC-11) Samoa Standard Time'
				},
				'UTC-10': {
					value: 'UTC-10',
					label: '(UTC-10) Cook Islands Standard Time'
				},
				'UTC-09': {
					value: 'UTC-09',
					label: '(UTC-09) Hawaii-Aleutian Standarc Time'
				}
			}
		}
	},
	selectedOption: 'UTC-12',
	label: 'Timezone',
	placeholder: 'Select a timezone',
	icon: EIconName.Time,
	searchable: true
};
