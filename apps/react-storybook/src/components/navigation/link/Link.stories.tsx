import type { Meta, StoryObj } from '@storybook/react';

import { EAnchorTarget, KvLink } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Navigation/Link',
	component: KvLink
} satisfies Meta<typeof KvLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
	args: {
		label: 'Link Label'
	}
};

export const LabelWithAnchor: Story = {
	args: {
		label: 'Link Label',
		href: 'https://kelvin.ai',
		target: EAnchorTarget.NewTab
	}
};

export const LabelAndSubtitle: Story = {
	args: {
		label: 'Link Label',
		subtitle: 'Link Subtitle'
	}
};
