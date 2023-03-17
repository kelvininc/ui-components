# _<kv-description-list>_



<!-- Auto Generated Below -->


## Usage

### Angular

```html

<!-- Default -->
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
<kv-description-list items=[defaultConfig] />

<!-- With text tooltip -->
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
<kv-description-list items=[withTextTooltip] />

<!-- With icon tooltip -->
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
<kv-description-list items=[withIconTooltip] />
```


### React

```tsx
import React from 'react';

import { KvDescriptionList } from '@kelvininc/react-ui-components';

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



## Properties

| Property                   | Attribute | Description                                                              | Type                                                                                                                                                                                                                                                                                                                                                                           | Default                         |
| -------------------------- | --------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `descriptionTooltipConfig` | --        | (optional) The config to use on the tooltip that shows hovering the text | `{ placement?: Placement; strategy?: Strategy; middleware?: (false \| { name: string; options?: any; fn: (state: { platform: Platform; placement: Placement; strategy: Strategy; x: number; y: number; initialPlacement: Placement; middlewareData: MiddlewareData; rects: ElementRects; elements: Elements; }) => Promisable<MiddlewareReturn>; })[]; platform?: Platform; }` | `DEFAULT_TEXT_TOOLTIP_CONFIG`   |
| `iconToggletipConfig`      | --        | (optional) The config to use on the icon toggletip                       | `IDescriptionListItemToggletipConfig`                                                                                                                                                                                                                                                                                                                                          | `DEFAULT_ICON_TOGGLETIP_CONFIG` |
| `items` _(required)_       | --        | (required) The array of items to display in the list                     | `IDescriptionListItem[]`                                                                                                                                                                                                                                                                                                                                                       | `undefined`                     |


## Dependencies

### Depends on

- [kv-tooltip](../tooltip)
- [kv-toggle-tip](../toggle-tip)
- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-description-list --> kv-tooltip
  kv-description-list --> kv-toggle-tip
  kv-description-list --> kv-icon
  style kv-description-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


