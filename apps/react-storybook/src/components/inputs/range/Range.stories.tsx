import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { KvRange } from '@kelvininc/react-ui-components';
import { useArgs } from '@storybook/preview-api';
import { ComponentProps } from 'react';

const RangeTemplate: StoryFn<ComponentProps<typeof KvRange>> = args => {
	const [, updateArgs] = useArgs();
	const onValueChange = (event: CustomEvent<number>) => updateArgs({ value: event.detail });

	return <KvRange {...args} onValueChange={onValueChange} />;
};

const meta = {
	title: 'Inputs/Range',
	component: KvRange,
	render: RangeTemplate,
	argTypes: {
		min: { control: { type: 'number' } },
		max: { control: { type: 'number' } },
		value: { control: { type: 'number' } },
		step: { control: { type: 'number' } },
		onValueChange: {
			action: 'valueChange'
		}
	}
} satisfies Meta<typeof KvRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		min: 0,
		max: 10,
		value: 0,
		step: 1
	}
}
