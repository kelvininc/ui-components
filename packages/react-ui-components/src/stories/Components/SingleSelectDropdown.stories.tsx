import { ComponentStory } from '@storybook/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { selectHelper } from '@kelvininc/ui-components';
import { useArgs } from '@storybook/client-api';
import { EComponentSize, EIconName, KvSearch, KvSingleSelectDropdown } from '../../components';
import {
	LARGE_SET_DROPDOWN_OPTIONS_MOCK,
	SMALL_SET_DROPDOWN_OPTIONS_MOCK,
	TAGS_DROPDOWN_OPTIONS_MOCK,
	TIMEZONES_DROPDOWN_OPTIONS_MOCK,
	VIEWS_DROPDOWN_OPTIONS_MOCK
} from './mocks/dropdown.mock';

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

const AddOptionTemplate: ComponentStory<typeof KvSingleSelectDropdown> = args => {
	const [{ options, searchValue }, updateArgs] = useArgs();
	const filteredOptions = useMemo(() => selectHelper.searchDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const addNewOption = (newOption: string) => {
		updateArgs({
			options: { ...options, [newOption]: { label: newOption, value: newOption } }
		});
	};

	return (
		<KvSingleSelectDropdown
			{...args}
			options={options}
			filteredOptions={filteredOptions}
			onSearchChange={({ detail: newSearchTerm }) => updateArgs({ searchValue: newSearchTerm })}
			onOptionSelected={({ detail: newOption }) => updateArgs({ selectedOption: newOption })}
			onOptionCreated={({ detail: newOption }) => addNewOption(newOption)}
			canAddItems
		/>
	);
};

export const AddOption = AddOptionTemplate.bind({});
AddOption.args = {
	placeholder: 'Please select a tag',
	searchPlaceholder: 'Search for Tags',
	options: TAGS_DROPDOWN_OPTIONS_MOCK,
	label: 'Tags',
	shortcuts: false
};

export const ActionOptions = SingleSelectDropdownTemplate.bind({});
ActionOptions.args = {
	placeholder: 'Please select a view',
	searchPlaceholder: 'Search for views',
	options: VIEWS_DROPDOWN_OPTIONS_MOCK
};
