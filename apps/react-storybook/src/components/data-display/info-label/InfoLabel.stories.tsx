
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { KvInfoLabel, KvTagLetter } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const meta = {
	title: 'Data Display/Info Label',
	component: KvInfoLabel,
	argTypes: {
		labelTitle: { control: { type: 'text' } },
		description: { control: { type: 'text' } },
		descriptionHeight: { control: { type: 'number' } },
		descriptionCollapsedText: { control: { type: 'text' } },
		descriptionOpenedText: { control: { type: 'text' } },
		copyValue: { control: { type: 'text' } }
	}
} satisfies Meta<typeof KvInfoLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		labelTitle: 'TYPE',
		description: 'Data Model'
	}
};


export const ReadMoreLess: Story = {
	args: {
		labelTitle: 'DESCRIPTION',
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
		descriptionHeight: 34,
		descriptionCollapsedText: 'Read more',
		descriptionOpenedText: 'Read less'
	}
};


export const CopyValues: Story = {
	args: {
		labelTitle: 'TYPE',
		description: 'data-model',
		copyValue: 'data-model'
	}
};


const InfoLabelTemplateWithComponent: StoryFn<ComponentProps<typeof KvInfoLabel>> = args => (
	<KvInfoLabel {...args}>
		<KvTagLetter tagLetter="C" label="Change The Rapper" />
	</KvInfoLabel>
);

export const WithComponent: Story = {
	args: {
		labelTitle: 'DESCRIPTION'
	},
	render: InfoLabelTemplateWithComponent
};
