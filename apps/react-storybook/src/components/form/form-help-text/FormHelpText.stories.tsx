import type { Meta, StoryObj } from '@storybook/react';
import { EValidationState, KvFormHelpText } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Form/FormHelpText',
	component: KvFormHelpText,
	argTypes: {
		helpText: { control: { type: 'array' } },
		state: {
			control: { type: 'radio' },
			options: Object.values(EValidationState)
		}
	}
} satisfies Meta<typeof KvFormHelpText>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
	args: {
		helpText: 'Help text'
	}
};

export const DefaultWithErrorState: Story = {
	args: {
		...Default.args,
		state: EValidationState.Invalid
	}
};

export const ArrayOfStrings: Story = {
	args: {
		helpText: ['Help text 1', 'Help Text 2']
	}
};
