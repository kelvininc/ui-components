import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { EIconName, KvToggleButtonGroup } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const ToggleButtonGroupTemplate: StoryFn<ComponentProps<typeof KvToggleButtonGroup>> = args => {
	const [{ selectedButtons }, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			selectedButtons: {
				...selectedButtons,
				[id]: !(selectedButtons[id] === true)
			}
		});

	return <KvToggleButtonGroup {...args} onCheckedChange={onCheckedChange} />;
};

const meta = {
	title: 'Inputs/Toggle Button Group',
	component: KvToggleButtonGroup,
	render: ToggleButtonGroupTemplate,
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	}
} satisfies Meta<typeof KvToggleButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextButtonsState: Story = {
	args: {
		buttons: [
			{
				label: 'Option 1',
				value: 'opt1'
			},
			{
				label: 'Option 2',
				value: 'opt2'
			},
			{
				label: 'Option 3',
				value: 'opt3',
				disabled: true
			},
			{
				label: 'Option 4',
				value: 'opt4'
			},
			{
				label: 'Option 5',
				value: 'opt5'
			}
		],
		selectedButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: true,
			opt5: false
		},
		disabledButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: false,
			opt5: false
		},
		radioButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: false,
			opt5: false
		}
	}
};

export const IconButtonsState: Story = {
	args: {
		buttons: [
			{
				icon: EIconName.DensityLow,
				value: 'low'
			},
			{
				icon: EIconName.DensityMedium,
				value: 'medium'
			},
			{
				icon: EIconName.DensityHigh,
				value: 'high'
			}
		],
		selectedButtons: {
			low: true,
			medium: false,
			hight: false
		}
	}
};

export const RadioButtonsState: Story = {
	args: {
		buttons: [
			{
				label: 'Option 1',
				value: 'opt1'
			},
			{
				label: 'Option 2',
				value: 'opt2'
			},
			{
				label: 'Option 3',
				value: 'opt3',
				disabled: true
			},
			{
				label: 'Option 4',
				value: 'opt4'
			},
			{
				label: 'Option 5',
				value: 'opt5'
			}
		],
		selectedButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: true,
			opt5: false
		},
		disabledButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: false,
			opt5: false
		},
		withRadio: true
	}
};
