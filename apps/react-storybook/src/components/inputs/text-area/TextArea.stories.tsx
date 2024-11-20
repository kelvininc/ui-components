import type { Meta, StoryObj } from '@storybook/react';
import { EIconName, EOtherIconName, KvTextArea } from '@kelvininc/react-ui-components';
import { action } from '@storybook/addon-actions';

const meta = {
	title: 'Inputs / Text Area',
	component: KvTextArea,
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		text: { control: { type: 'text' } },
		placeholder: { control: { type: 'text' } },
		maxCharLength: { control: { type: 'number' } }
	}
} satisfies Meta<typeof KvTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		maxCharLength: 200,
		onTextChange: ({ detail }: CustomEvent<string>) => action('onTextChange')(detail)
	}
};

export const WithText: Story = {
	args: {
		...Default.args,
		text: 'Pressure evaluation metric'
	}
};

export const WithPlaceholder: Story = {
	args: {
		...Default.args,
		placeholder: 'Add a description'
	}
};

export const WithTextAndPlaceholder: Story = {
	args: {
		...WithText.args,
		placeholder: 'Add a description'
	}
};

export const WithIcon: Story = {
	args: {
		...WithTextAndPlaceholder.args,
		text: '',
		icon: EIconName.Notes
	}
};

export const Disabled: Story = {
	args: {
		disabled: true
	}
};
