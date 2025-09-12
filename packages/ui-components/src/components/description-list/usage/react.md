```tsx
import React from 'react';

import { KvDescriptionList } from '@kelvininc/react-ui-components/client';

const defaultConfig: IDescriptionListItem[] = [
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
];

const withTextTooltip: IDescriptionListItem[] = [
	{
		title: 'Name ID',
		description: 'cluster-a-brownie',
		popoverInfo: {
			text: `This name cannot be changed`
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
];

const withIconTooltip: IDescriptionListItem[] = [
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
];

export const KvDescriptionListExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvDescriptionList items={defaultConfig} />

		{/*-- With text tooltip --*/}
		<KvDescriptionList items={withTextTooltip} />

		{/*--  With icon tooltip --*/}
		<KvDescriptionList items={withIconTooltip} />
	</>
);
```
