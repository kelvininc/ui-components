import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAnchorTarget, KvLink } from '../../components';

export default {
	title: "Components/Link",
	component: 'kv-link',
	parameters: {
		notes: require('@ui-notes/link/readme.md')
	}
};

KvLink.displayName = 'KvLink';

const KvLinkTemplate: ComponentStory<typeof KvLink> = (args) => <KvLink {...args} />;

export const LabelOnly = KvLinkTemplate.bind(this);
LabelOnly.args = {
	label: "Link Label"
};

export const LabelWithAnchor = KvLinkTemplate.bind(this);
LabelWithAnchor.args = {
	label: "Link Label",
	href: 'https://kelvin.ai',
	target: EAnchorTarget.NewTab
};

export const LabelAndSubtitle = KvLinkTemplate.bind(this);
LabelAndSubtitle.args = {
	label: "Link Label",
	subtitle: "Link Subtitle"
};
