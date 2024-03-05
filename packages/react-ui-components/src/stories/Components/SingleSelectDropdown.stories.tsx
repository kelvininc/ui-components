import { ComponentStory } from '@storybook/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { selectHelper } from '@kelvininc/ui-components';
import { useArgs } from '@storybook/client-api';
import { EComponentSize, EIconName, KvSearch, KvSingleSelectDropdown } from '../../components';
import { LARGE_SET_DROPDOWN_OPTIONS_MOCK, SMALL_SET_DROPDOWN_OPTIONS_MOCK, TIMEZONES_DROPDOWN_OPTIONS_MOCK } from './mocks/dropdown.mock';

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
	const filteredOptions = useMemo(() => selectHelper.searchDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => {
		updateArgs({ searchValue: searchedLabel });
	}, []);

	const onOptionSelected = useCallback(({ detail }: CustomEvent<string>) => updateArgs({ selectedOption: detail }), []);

	return <KvSingleSelectDropdown {...args} filteredOptions={filteredOptions} onSearchChange={onSearchChange} onOptionSelected={onOptionSelected} />;
};

export const Default = SingleSelectDropdownTemplate.bind({});
Default.args = {
	options: SMALL_SET_DROPDOWN_OPTIONS_MOCK,
	selectedOption: 'option2',
	label: 'Options',
	placeholder: 'Select an option',
	icon: EIconName.Layer,
	shortcuts: true
};

export const SubOptions = SingleSelectDropdownTemplate.bind({});
SubOptions.args = {
	options: TIMEZONES_DROPDOWN_OPTIONS_MOCK,
	selectedOption: 'UTC-12',
	label: 'Timezone',
	placeholder: 'Select a timezone',
	icon: EIconName.Time,
	searchable: true,
	shortcuts: true
};

export const Virtualization = SingleSelectDropdownTemplate.bind({});
Virtualization.args = {
	options: LARGE_SET_DROPDOWN_OPTIONS_MOCK,
	selectedOption: 'option2',
	label: 'Options',
	placeholder: 'Select an option',
	icon: EIconName.Layer,
	shortcuts: true
};

export const IconOptions = SingleSelectDropdownTemplate.bind({});
IconOptions.args = {
	options: {
		option1: {
			value: 'low-temperature',
			label: 'Low Temperature',
			icon: EIconName.Square,
			customStyle: {
				'--select-option-icon-color': 'rgba(17, 241, 255, 1)',
				'--text-color-icon-default': 'rgba(17, 241, 255, 1)',
				'--text-color-icon-disabled': 'rgba(17, 241, 255, 1, 0.5)',
				'--text-color-icon-focused': 'rgba(17, 241, 255, 1)'
			}
		},
		option2: {
			value: 'high-temperature',
			label: 'High Temperature',
			icon: EIconName.Square,
			customStyle: {
				'--select-option-icon-color': 'rgba(195, 86, 99, 1)',
				'--text-color-icon-default': 'rgba(195, 86, 99, 1)',
				'--text-color-icon-disabled': 'rgba(195, 86, 99, 1, 0.5)',
				'--text-color-icon-focused': 'rgba(195, 86, 99, 1)'
			}
		},
		option3: {
			value: 'pressure-drop',
			label: 'Pressure Drop',
			icon: EIconName.Square,
			customStyle: {
				'--select-option-icon-color': 'rgba(240, 36, 159, 1)',
				'--text-color-icon-default': 'rgba(240, 36, 159, 1)',
				'--text-color-icon-disabled': 'rgba(240, 36, 159, 1, 0.5)',
				'--text-color-icon-focused': 'rgba(240, 36, 159, 1)'
			}
		},
		option4: {
			value: 'maintenance',
			label: 'Maintenance',
			icon: EIconName.Square,
			customStyle: {
				'--select-option-icon-color': 'rgba(0, 119, 205, 1)',
				'--text-color-icon-default': 'rgba(0, 119, 205, 1)',
				'--text-color-icon-disabled': 'rgba(0, 119, 205, 1, 0.5)',
				'--text-color-icon-focused': 'rgba(0, 119, 205, 1)'
			}
		},
		option5: {
			value: 'temperature',
			label: 'Temperature',
			icon: EIconName.Square,
			customStyle: {
				'--select-option-icon-color': 'rgba(213, 166, 0, 1)',
				'--text-color-icon-default': 'rgba(213, 166, 0, 1)',
				'--text-color-icon-disabled': 'rgba(213, 166, 0, 1, 0.5)',
				'--text-color-icon-focused': 'rgba(213, 166, 0, 1)'
			}
		}
	},
	label: 'Tags',
	shortcuts: true
};

const ExternalSearchTemplate: ComponentStory<typeof KvSingleSelectDropdown> = args => {
	const [searchTerm, setSearchTerm] = useState<string | undefined>();
	const [isOpen, setOpen] = useState<boolean>(false);
	const searchRef = useRef<HTMLKvSearchElement>(null);

	const [{ options, placeholder }, updateArgs] = useArgs();
	const dropdownOptions = useMemo(() => options, [options, searchTerm]);
	const filteredOptions = useMemo(() => selectHelper.searchDropdownOptions(searchTerm ?? '', dropdownOptions ?? {}), [searchTerm, dropdownOptions]);

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
	placeholder: "Write here the option name you're looking for",
	options: SMALL_SET_DROPDOWN_OPTIONS_MOCK
};
