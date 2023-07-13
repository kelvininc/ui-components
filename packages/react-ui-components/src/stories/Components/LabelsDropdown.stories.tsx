import React, { useCallback, useMemo } from 'react';
import { ComponentStory } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { KvLabelsDropdown, KvSelectOption } from '../../components';
import { ISelectMultiOptions } from '@kelvininc/ui-components/dist/types/components/select-multi-options/select-multi-options.types';
import { get, isEmpty } from 'lodash';
import { searchMultiLevelDropdownOptions } from './helpers/dropdown.helper';

KvLabelsDropdown.displayName = 'KvLabelsDropdown';

const getAllChildrenValues = (options: ISelectMultiOptions): string[] => {
	if (!options || Object.values(options).length <= 0) {
		return [];
	}
	return Object.values(options).reduce<string[]>((acc, option) => {
		if (isEmpty(option.children)) {
			acc.push(option.value);
		} else {
			acc = acc.concat(getAllChildrenValues(option.children));
		}
		return acc;
	}, []);
};

export default {
	title: 'Inputs/Dropdown/Labels',
	component: 'kv-labels-dropdown',
	argTypes: {
		isOpen: { control: { type: 'boolean' } },
		options: { control: { type: 'object' } },
		selectedOptions: { control: { type: 'object' } },
		filteredOptions: { control: { type: 'object' } },
		noDataAvailableLabel: { control: { type: 'text' } },
		searchable: { control: { type: 'boolean' } },
		searchValue: { control: { type: 'text' } },
		minHeight: { control: { type: 'text' } },
		maxHeight: { control: { type: 'text' } }
	},
	parameters: {
		notes: require('@ui-notes/labels-dropdown/readme.md')
	}
};

const LabelsDropdownTemplate: ComponentStory<typeof KvLabelsDropdown> = args => {
	const [{ options, selectedOptions, searchValue }, updateArgs] = useArgs();

	const filteredOptions = useMemo(() => searchMultiLevelDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const onSelectAll = useCallback(() => {
		const newSelectedOptions = getAllChildrenValues(options ?? {}).reduce<Record<string, boolean>>((acc, cur) => {
			acc[cur] = true;
			return acc;
		}, {});

		updateArgs({ selectedOptions: newSelectedOptions });
	}, [options, getAllChildrenValues]);

	const onClearAll = useCallback(() => {
		updateArgs({ selectedOptions: {} });
	}, []);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => {
		updateArgs({ searchValue: searchedLabel });
	}, []);

	const onOptionsSelected = useCallback(({ detail }: CustomEvent<Record<string, boolean>>) => {
		updateArgs({ selectedOptions: detail });
	}, []);

	const onAddNewLabel = ({ detail }: CustomEvent<string>) => {
		const existOption = get(options, ['recents', detail]);
		if (!existOption) {
			updateArgs({
				options: {
					...options,
					recents: {
						...options.recents,
						children: {
							[detail]: {
								label: detail,
								value: detail
							},
							...options.recents.children
						}
					}
				},
				selectedOptions: {
					...selectedOptions,
					[detail]: true
				},
				searchValue: ''
			});
		}
	};
	return (
		<KvLabelsDropdown
			{...args}
			onSelectAll={onSelectAll}
			onSelectionCleared={onClearAll}
			onOptionsSelected={onOptionsSelected}
			onSearchChange={onSearchChange}
			filteredOptions={filteredOptions}
		>
			<div slot="no-data-available">
				<KvSelectOption
					label={`${searchValue} (Add new label)`}
					value={searchValue!}
					selected={selectedOptions?.[searchValue!]}
					togglable={true}
					onItemSelected={onAddNewLabel}
				/>
			</div>
		</KvLabelsDropdown>
	);
};

export const Default = LabelsDropdownTemplate.bind({});
Default.args = {
	options: {
		recents: {
			value: 'recents',
			label: 'Recents',
			children: {
				label_f: {
					value: 'label_f',
					label: 'Label F'
				},
				label_e: {
					value: 'label_e',
					label: 'Label E'
				}
			}
		},
		all: {
			value: 'all',
			label: 'All Labels',
			children: {
				label_a: {
					value: 'label_a',
					label: 'Label A'
				},
				label_b: {
					value: 'label_b',
					label: 'Label B'
				},
				label_c: {
					value: 'label_c',
					label: 'Label C'
				},
				label_d: {
					value: 'label_d',
					label: 'Label D'
				}
			}
		}
	},
	selectedOptions: {
		label_a: true,
		label_c: true,
		label_b: true,
		label_f: true
	}
};
