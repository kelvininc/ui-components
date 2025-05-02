import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { EComponentSize, KvToggleSwitch } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const ToggleSwitchTemplate: StoryFn<ComponentProps<typeof KvToggleSwitch>> = args => {
	const [, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			...args,
			selectedOption: id
		});

	return <KvToggleSwitch {...args} onCheckedChange={onCheckedChange} />;
};

const meta = {
	title: 'Inputs/Toggle Switch',
	component: KvToggleSwitch,
	render: ToggleSwitchTemplate,
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	}
} satisfies Meta<typeof KvToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextButtonsState: Story = {
	args: {
		options: [
			{
				label: 'Option 1',
				key: 'opt1'
			},
			{
				label: 'Option 2',
				key: 'opt2'
			},
			{
				label: 'Option 3',
				key: 'opt3',
				disabled: true
			},
			{
				label: 'Option 4',
				key: 'opt4'
			},
			{
				label: 'Option 5',
				key: 'opt5'
			}
		],
		selectedOption: 'opt2',
		disabledButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: false,
			opt5: false
		},
		size: EComponentSize.Small
	}
};
