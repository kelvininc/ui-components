import { ComponentStory } from '@storybook/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EComponentSize, EIconName, KvSearch, KvSingleSelectDropdown } from '../../components';
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
		},
		counter: {
			control: { type: 'boolean' }
		},
		shortcuts: {
			control: { type: 'boolean' }
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
	icon: EIconName.Layer,
	shortcuts: true
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
	searchable: true,
	shortcuts: true
};

const ExternalSearchTemplate: ComponentStory<typeof KvSingleSelectDropdown> = args => {
	const [searchTerm, setSearchTerm] = useState<string | undefined>();
	const [isOpen, setOpen] = useState<boolean>(false);
	const searchRef = useRef<HTMLKvSearchElement>(null);

	const [{ options, placeholder }, updateArgs] = useArgs();
	const dropdownOptions = useMemo(() => options, [options, searchTerm]);
	const filteredOptions = useMemo(() => searchDropdownOptions(searchTerm ?? '', dropdownOptions ?? {}), [searchTerm, dropdownOptions]);

	const onOptionSelected = useCallback(({ detail }: CustomEvent<string>) => {
		setSearchTerm(detail);
		updateArgs({ selectedOption: detail });
		setOpen(false);
	}, []);

	useEffect(() => {
		if (!searchRef.current) {
			return;
		}

		const element = searchRef.current;
		if (isOpen) {
			element.focus();
		} else {
			element.blur();
		}
	}, [isOpen]);

	return (
		<KvSingleSelectDropdown
			{...args}
			options={dropdownOptions}
			actionElement={searchRef.current as HTMLElement | null}
			filteredOptions={filteredOptions}
			isOpen={isOpen}
			onOptionSelected={onOptionSelected}
			onOpenStateChange={({ detail }) => setOpen(detail)}
		>
			<KvSearch
				ref={searchRef}
				slot="dropdown-action"
				value={searchTerm}
				placeholder={placeholder}
				onFocus={() => setOpen(true)}
				onTextChange={({ detail }) => setSearchTerm(detail)}
				onClickResetButton={() => setSearchTerm(undefined)}
			/>
		</KvSingleSelectDropdown>
	);
};

export const ExternalSearch = ExternalSearchTemplate.bind({});
ExternalSearch.args = {
	shortcuts: true,
	placeholder: "Write here the asset name you're looking for",
	options: {
		bp_01: {
			label: 'Beam Pump Well #01',
			value: 'bp_01',
			description: 'bp_01'
		},
		bp_02: {
			label: 'Beam Pump Well #02',
			value: 'bp_02',
			description: 'bp_02'
		},
		bp_03: {
			label: 'Beam Pump Well #03',
			value: 'bp_03',
			description: 'bp_03'
		},
		bp_04: {
			label: 'Beam Pump Well #04',
			value: 'bp_04',
			description: 'bp_04'
		},
		bp_05: {
			label: 'Beam Pump Well #05',
			value: 'bp_05',
			description: 'bp_05'
		},
		bp_06: {
			label: 'Beam Pump Well #06',
			value: 'bp_06',
			description: 'bp_06'
		},
		bp_07: {
			label: 'Beam Pump Well #07',
			value: 'bp_07',
			description: 'bp_07'
		},
		bp_08: {
			label: 'Beam Pump Well #08',
			value: 'bp_08',
			description: 'bp_08'
		},
		bp_09: {
			label: 'Beam Pump Well #09',
			value: 'bp_09',
			description: 'bp_09'
		},
		bp_10: {
			label: 'Beam Pump Well #10',
			value: 'bp_10',
			description: 'bp_10'
		}
	}
};
