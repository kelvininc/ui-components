
import { ComponentProps, useCallback, useMemo } from 'react';
import { useArgs } from '@storybook/preview-api';
import { EComponentSize, EIconName, KvMultiSelectDropdown } from '@kelvininc/react-ui-components';
import { selectHelper } from '@kelvininc/react-ui-components';
import { Meta, StoryObj, StoryFn } from '@storybook/react';

const MultiSelectDropdownTemplate: StoryFn<ComponentProps<typeof KvMultiSelectDropdown>> = args => {
	const [{ options, selectedOptions, searchValue }, updateArgs] = useArgs();

	const filteredOptions = useMemo(() => selectHelper.searchDropdownOptions(searchValue ?? '', options ?? {}), [searchValue, options]);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => {
		updateArgs({ searchValue: searchedLabel });
	}, [updateArgs]);

	const onOptionsSelected = useCallback(({ detail }: CustomEvent<Record<string, boolean>>) => {
		updateArgs({ selectedOptions: detail });
	}, [updateArgs]);

	return (
		<KvMultiSelectDropdown
			{...args}
			selectedOptions={selectedOptions}
			onOptionsSelected={onOptionsSelected}
			onSearchChange={onSearchChange}
			filteredOptions={filteredOptions}
		/>
	);
};

const meta = {
	title: 'Inputs/Dropdown/Select/Multi Select Dropdown',
	component: KvMultiSelectDropdown,
	render: MultiSelectDropdownTemplate,
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
		},
		counter: {
			control: { type: 'boolean' }
		},
		shortcuts: {
			control: { type: 'boolean' }
		}
	}
} satisfies Meta<typeof KvMultiSelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
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
		counter: true,
		shortcuts: true
	}
};

export const SubOptions: Story = {
	args: {
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
		counter: true,
		shortcuts: true
	}
};

export const IconOptions: Story = {
	args: {
		options: {
			option1: {
				value: 'low-temperature',
				label: 'Low Temperature',
				icon: EIconName.Square,
				customStyle: {
					'--select-option-icon-color': 'rgba(17, 241, 255, 1)',
					'--text-color-icon-default': 'rgba(17, 241, 255, 1)',
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
					'--text-color-icon-focused': 'rgba(213, 166, 0, 1)'
				}
			}
		},
		selectedOptions: { 'low-temperature': true },
		label: 'Tags',
		searchable: true,
		selectionClearable: true,
		selectionAll: true,
		counter: true,
		shortcuts: true
	}
};
