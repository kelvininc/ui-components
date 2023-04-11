import { ComponentStory } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { KvRadioList } from '../../components';

export default {
	title: 'Inputs/Radio List',
	component: 'kv-radio-list',
	argTypes: {
		options: {
			control: {
				type: 'object'
			}
		},
		selectedOption: {
			control: {
				type: 'text'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/radio-list/readme.md')
	}
};

KvRadioList.displayName = 'KvRadioList';

const RadioListTemplate: ComponentStory<typeof KvRadioList> = args => {
	const [selectedOption, setSelectedOption] = useState(args.selectedOption);

	const selectOption = useCallback(({ detail }: CustomEvent<string | number>) => {
		setSelectedOption(detail);
	}, []);

	return <KvRadioList {...args} selectedOption={selectedOption} onOptionSelected={selectOption} />;
};

export const Default = RadioListTemplate.bind(this);
Default.args = {
	selectedOption: 'k3s',
	options: [
		{
			optionId: 'k3s',
			label: 'K3S',
			description:
				'To create an edge cluster, use the Kelvin installation script for K3S. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
		},
		{
			optionId: 'kubernetes',
			label: 'Kubernetes',
			description:
				'To use, either choose an already existing cloud hosted or a generic Kubernetes cluster. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
		}
	]
};

export const WithFormLabel = RadioListTemplate.bind(this);
WithFormLabel.args = {
	...Default.args,
	label: 'Select an option',
	required: true
};
