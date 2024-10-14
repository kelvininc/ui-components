import type { Meta, StoryObj } from '@storybook/react';
import { KvIllustration, EIllustrationName } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Media/Illustration',
	component: KvIllustration,
	argTypes: {
		name: {
			control: { type: 'select' },
			options: Object.values(EIllustrationName)
		},
		customClass: {
			control: { type: 'text' }
		}
	}
} satisfies Meta<typeof KvIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IllustrationOnly: Story = {
	args: {
		name: EIllustrationName.EsSectionSomethingwentwrong
	}
};

export const CustomClass: Story = {
	args: {
		name: EIllustrationName.EsSectionSomethingwentwrong,
		customClass: 'illustration-full-size'
	}
};
