import { ComponentStory } from '@storybook/react';
import React, { useCallback, useMemo } from 'react';
import { useArgs } from '@storybook/client-api';
import { EComponentSize, EIconName, KvMultiSelectDropdown, selectHelper } from '../../components';
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

const MultiSelectDropdownTemplate: ComponentStory<typeof KvMultiSelectDropdown> = args => {
	const [{ options, selectedOptions, searchValue }, updateArgs] = useArgs();

	const filteredOptions = useMemo(() => searchDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const onSelectAll = useCallback(() => {
		const newSelectedOptions = selectHelper.buildAllOptionsSelected(selectHelper.getSelectableOptions(options));

		updateArgs({ selectedOptions: newSelectedOptions });
	}, [options]);

	const onClearAll = useCallback(() => {
		updateArgs({ selectedOptions: {} });
	}, []);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => {
		updateArgs({ searchValue: searchedLabel });
	}, []);

	const onOptionsSelected = useCallback(({ detail }: CustomEvent<Record<string, boolean>>) => {
		updateArgs({ selectedOptions: detail });
	}, []);

	return (
		<KvMultiSelectDropdown
			{...args}
			selectedOptions={selectedOptions}
			onSelectAll={onSelectAll}
			onClearSelection={onClearAll}
			onOptionsSelected={onOptionsSelected}
			onSearchChange={onSearchChange}
			filteredOptions={filteredOptions}
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
	selectionClearable: true,
	selectionAll: true,
	counter: true
};

export const SubOptions = MultiSelectDropdownTemplate.bind({});
SubOptions.args = {
	options: {
		state: {
			value: 'state',
			label: 'state',
			selectable: false,
			options: {
				'demo-ogm-bp-status': {
					value: 'demo-ogm-bp-status',
					label: 'OGM - BeamPump - Status'
				},
				'demo-ogm-bp-status-setpoint': {
					value: 'demo-ogm-bp-status-setpoint',
					label: 'OGM - BeamPump - Status SetPoint'
				},
				'demo-ogm-cp-status': {
					value: 'demo-ogm-cp-status',
					label: 'OGM - C.Pump - Status'
				},
				'demo-ogm-cp-status-setpoint': {
					value: 'demo-ogm-cp-status-setpoint',
					label: 'OGM - C.Pump - Status SetPoint'
				}
			}
		},
		flow_rate: {
			value: 'flow_rate',
			label: 'flow_rate',
			selectable: false,
			options: {
				'demo-ogm-cp-flow-rate': {
					value: 'demo-ogm-cp-flow-rate',
					label: 'OGM - Flow Rate'
				}
			}
		},
		power: {
			value: 'power',
			label: 'power',
			selectable: false,
			options: {
				'demo-ogm-cp-power': {
					value: 'demo-ogm-cp-power',
					label: 'OGM - C.Pump - Power'
				}
			}
		},
		velocity: {
			value: 'velocity',
			label: 'velocity',
			selectable: false,
			options: {
				'demo-ogm-cp-speed': {
					value: 'demo-ogm-cp-speed',
					label: 'OGM - C.Pump - Speed'
				},
				'demo-ogm-cp-speed-setpoint': {
					value: 'demo-ogm-cp-speed-setpoint',
					label: 'OGM - C.Pump - Speed SetPoint'
				}
			}
		},
		temperature: {
			value: 'temperature',
			label: 'temperature',
			selectable: false,
			options: {
				'demo-ogm-cp-temperature': {
					value: 'demo-ogm-cp-temperature',
					label: 'CH - C.Pump - Temperature'
				},
				'demo-ogm-extruder-temperature': {
					value: 'demo-ogm-extruder-temperature',
					label: 'OGM Temperature'
				}
			}
		},
		volume: {
			value: 'volume',
			label: 'volume',
			selectable: false,
			options: {
				'demo-ogm-gas-tank-level': {
					value: 'demo-ogm-gas-tank-level',
					label: 'OGM - Gas Tank - Level'
				},
				'demo-ogm-oil-tank-level': {
					value: 'demo-ogm-oil-tank-level',
					label: 'OGM - Oil Tank - Level'
				},
				'demo-ogm-water-tank-level': {
					value: 'demo-ogm-water-tank-level',
					label: 'OGM - Water Tank - Level'
				}
			}
		}
	},
	selectedOptions: {},
	label: 'Data Streams',
	placeholder: 'Select a data stream',
	icon: EIconName.Datastreams,
	searchPlaceholder: 'Search for a data stream',
	searchable: true,
	selectionClearable: true,
	selectionAll: true,
	counter: true
};
