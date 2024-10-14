import type { StoryObj } from '@storybook/react';

import { EIconName, KvDescriptionList } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/Description List',
	component: KvDescriptionList,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
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
	}
};;

export const WithLabelTooltip: Story = {
	args: {
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
	}
};;

export const WithIconTooltip: Story = {
	args: {
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
	}
};;
