import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvSummaryCard, ESummaryCardType } from '../../components';

export default {
	title: 'Data Display/Summary Card',
	component: 'kv-summary-card',
	argTypes: {
		type: {
			control: 'select',
			options: Object.values(ESummaryCardType)
		}
	},
	parameters: {
		notes: require('@ui-notes/summary-card/readme.md')
	}
};

KvSummaryCard.displayName = 'KvSummaryCard';

const SummaryCardTemplate: ComponentStory<typeof KvSummaryCard> = args => <KvSummaryCard {...args} />;

export const Loading = SummaryCardTemplate.bind({});
Loading.args = {
	type: ESummaryCardType.Text,
	loading: true
};

export const NoLabel = SummaryCardTemplate.bind({});
NoLabel.args = {
	type: ESummaryCardType.Text
};

export const Loaded = SummaryCardTemplate.bind({});
Loaded.args = {
	type: ESummaryCardType.Number,
	label: '23',
	subtitle: 'PSI',
	description: 'Casing Pressure Avg.'
};
