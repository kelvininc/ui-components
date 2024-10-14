import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { EIconName, KvToggleButton } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const ToggleButtonTemplate: StoryFn<ComponentProps<typeof KvToggleButton>> = args => {
	const [{ checked }, updateArgs] = useArgs();
	const onCheckedChange = () => updateArgs({ checked: !(checked === true) });

	return <KvToggleButton {...args} onCheckedChange={onCheckedChange} />;
};

const meta = {
	title: 'Inputs/Toggle Button',
	component: KvToggleButton,
	render: ToggleButtonTemplate,
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	}
} satisfies Meta<typeof KvToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		label: 'Option 1',
		value: 'opt1'
	}
};

export const CheckedState: Story = {
	args: {
		label: 'Option 2',
		value: 'opt2',
		checked: true
	}
};

export const DisabledState: Story = {
	args: {
		label: 'Option 3',
		value: 'opt3',
		disabled: true
	}
};

export const WithIconState: Story = {
	args: {
		icon: EIconName.Add,
		label: 'Option 4',
		value: 'opt4'
	}
};

export const OnlyIconState: Story = {
	args: {
		icon: EIconName.Add,
		value: 'opt5'
	}
};

export const WithRadioState: Story = {
	args: {
		label: 'Option 6',
		value: 'opt6',
		withRadio: true
	}
};
