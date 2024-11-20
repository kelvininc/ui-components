import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { KvStepIndicator, KvStepProgressBar } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const StepProgressBarTemplate: StoryFn<ComponentProps<typeof KvStepProgressBar>> = args => {
	return (
		<KvStepProgressBar {...args}>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
	);
};

const meta = {
	title: 'Data Display/Step Progress Bar',
	component: KvStepProgressBar,
	render: StepProgressBarTemplate,
	argTypes: {
		progressPercentage: {
			control: {
				type: 'number'
			}
		},
		hasError: {
			control: {
				type: 'boolean'
			}
		}
	}
} satisfies Meta<typeof KvStepProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		progressPercentage: 67
	}
};

const StepProgressBarErrorTemplate: StoryFn<ComponentProps<typeof KvStepProgressBar>> = args => {
	return (
		<KvStepProgressBar {...args}>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
	);
};

export const ErrorState = {
	args: {
		progressPercentage: 67,
		hasError: true
	},
	render: StepProgressBarErrorTemplate
};
