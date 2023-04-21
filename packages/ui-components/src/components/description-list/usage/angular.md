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