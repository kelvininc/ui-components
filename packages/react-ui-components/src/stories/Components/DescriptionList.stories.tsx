import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, KvDescriptionList } from '../../components';

KvDescriptionList.displayName = 'KvDescriptionList';

export default {
	title: 'Data Display/Description List',
	component: 'kv-description-list',
	parameters: {
		notes: require('@ui-notes/description-list/readme.md')
	}
};

const DescriptionListTemplate: ComponentStory<typeof KvDescriptionList> = args => <KvDescriptionList {...args} />;

export const Default = DescriptionListTemplate.bind(this);
Default.args = {
	items: [
		{
			title: 'Name ID',
			description: 'cluster-a-brownie'
		},
		{
			title: 'Kubernetes Version',
			description: '1.20.5'
		},
		{
			title: 'Kelvin Version',
			description: '4.2.4'
		}
	]
};

export const WithLabelTooltip = DescriptionListTemplate.bind(this);
WithLabelTooltip.args = {
	items: [
		{
			title: 'Name ID',
			description: 'cluster-a-brownie'
		},
		{
			title: 'Kubernetes Version',
			description: 'N/A',
			popoverInfo: {
				text: `Data is not available`
			}
		},
		{
			title: 'Kelvin Version',
			description: 'N/A',
			popoverInfo: {
				text: `Data is not available`
			}
		}
	]
};

export const WithIconTooltip = DescriptionListTemplate.bind(this);
WithIconTooltip.args = {
	items: [
		{
			title: 'Name ID',
			description: 'cluster-a-brownie',
			popoverInfo: {
				text: `This name cannot be changed`,
				icon: EIconName.Info
			}
		},
		{
			title: 'Kubernetes Version',
			description: '1.20.5'
		},
		{
			title: 'Kelvin Version',
			description: '4.2.4'
		}
	]
};
