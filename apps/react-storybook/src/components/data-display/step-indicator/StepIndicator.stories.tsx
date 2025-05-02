import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps, useMemo } from 'react';
import { KvStepIndicator } from '@kelvininc/react-ui-components';
import { action } from '@storybook/addon-actions';


const StepIndicatorTemplate: StoryFn<ComponentProps<typeof KvStepIndicator>> = args => {
	const onStepClick = useMemo(() => action('The step has been clicked'), []);

	return <KvStepIndicator {...args} onIndicatorClicked={onStepClick} />;
};

const meta = {
	title: 'Data Display/Step Indicator',
	component: KvStepIndicator,
	render: StepIndicatorTemplate,
	argTypes: {
		enabled: {
			control: {
				type: 'boolean'
			}
		},
		active: {
			control: {
				type: 'boolean'
			}
		},
		hasError: {
			control: {
				type: 'boolean'
			}
		}
	}
} satisfies Meta<typeof KvStepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}

export const ClickEnabled: Story = {
	args: {
		enabled: true
	}
}

export const Active: Story = {
	args: {
		active: true
	}
}

export const WithError: Story = {
	args: {
		hasError: true
	}
}
