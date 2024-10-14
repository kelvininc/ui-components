import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps, useCallback, useState } from 'react';
import { KvRadioList } from '@kelvininc/react-ui-components';

const RadioListTemplate: StoryFn<ComponentProps<typeof KvRadioList>> = args => {
	const [selectedOption, setSelectedOption] = useState(args.selectedOption);

	const selectOption = useCallback(({ detail }: CustomEvent<string | number>) => {
		setSelectedOption(detail);
	}, []);

	return <KvRadioList {...args} selectedOption={selectedOption} onOptionSelected={selectOption} />;
};

const meta = {
	title: 'Inputs/Radio List',
	component: KvRadioList,
	render: RadioListTemplate,
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
	}
} satisfies Meta<typeof KvRadioList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
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
	}
};

export const WithFormLabel: Story = {
	args: {
		...Default.args,
		label: 'Select an option',
		required: true
	}
};
