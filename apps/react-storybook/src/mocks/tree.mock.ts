import {
	EBadgeState,
	EIconName,
	ETreeItemState,
	ITreeNodeItem
} from "@kelvininc/react-ui-components";

export const TREE_NODES_MOCK: ITreeNodeItem[] = [
	{
		id: "1",
		label: "Node 1",
		icon: EIconName.AssetA,
		children: [
			{
				id: "1.2",
				label: "Node 1.2 (Disabled)",
				icon: EIconName.AssetC
			},
			{
				id: "1.3",
				label: "Node 1.3",
				icon: EIconName.AssetP
			},
			{
				id: "1.4",
				label: "Node 1.4 (Highlighted)",
				icon: EIconName.AssetP
			},
			{
				id: "1.5",
				label: "Node 1.5",
				icon: EIconName.AssetC,
				children: [
					{
						id: "1.5.1",
						label: "Node 1.5.1",
						icon: EIconName.AssetS
					},
					{
						id: "1.5.2",
						label: "Node 1.5.2",
						icon: EIconName.AssetS
					}
				]
			}
		]
	},
	{
		id: "2",
		label: "Node 2",
		icon: EIconName.AssetSStatus,
		iconState: ETreeItemState.Error,
		counter: 32,
		counterState: EBadgeState.Error
	},
	{
		id: "3",
		label: "Node 3 is a node with a really long name that does not fit inside the box",
		icon: EIconName.AssetS
	},
	{
		id: "4",
		label: "Node 3"
	}
];

export const TREE_ENTITIES_NODES_MOCK: ITreeNodeItem[] = [
	{
		id: "1",
		label: "Business Units A",
		icon: EIconName.Asset,
		children: [
			{
				id: "1-houston",
				label: "Houston - US",
				icon: EIconName.Bullet
			},
			{
				id: "1-denver",
				label: "Denver - US",
				icon: EIconName.Bullet
			},
			{
				id: "1-lisbon",
				label: "Lisbon - Portugal",
				icon: EIconName.Bullet
			},
			{
				id: "1-melbourne",
				label: "Melbourne - Australia",
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: "2",
		label: "Business Units B",
		icon: EIconName.Asset,
		children: [
			{
				id: "2-houston",
				label: "Houston - US",
				icon: EIconName.Bullet
			},
			{
				id: "2-denver",
				label: "Denver - US",
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: "3",
		label: "Site D",
		icon: EIconName.Asset
	},
	{
		id: "4",
		label: "Process Map ABC",
		icon: EIconName.Asset
	},
	{
		id: "5",
		label: "Enterprise Process Map 01 (Production)",
		icon: EIconName.Asset
	}
];

export const TREE_ENTITIES_NESTED_NODES_MOCK: ITreeNodeItem[] = [
	{
		id: "1",
		label: "Business Units A",
		icon: EIconName.Asset,
		children: [
			{
				id: "1-houston",
				label: "Houston - US",
				icon: EIconName.Bullet,
				children: [
					{
						id: "1-houston-1",
						label: "Process Map ABC",
						icon: EIconName.Asset
					},
					{
						id: "1-houston-2",
						label: "Production Line K",
						icon: EIconName.Asset
					}
				]
			},
			{
				id: "1-denver",
				label: "Denver - US",
				icon: EIconName.Bullet
			},
			{
				id: "1-lisbon",
				label: "Lisbon - Portugal",
				icon: EIconName.Bullet
			},
			{
				id: "1-melbourne",
				label: "Melbourne - Australia",
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: "2",
		label: "Business Units B",
		icon: EIconName.Asset,
		children: [
			{
				id: "2-houston",
				label: "Houston - US",
				icon: EIconName.Bullet
			},
			{
				id: "2-denver",
				label: "Denver - US",
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: "3",
		label: "Site D",
		icon: EIconName.Asset
	},
	{
		id: "4",
		label: "Process Map ABC",
		icon: EIconName.Asset
	},
	{
		id: "5",
		label: "Enterprise Process Map 01 (Production)",
		icon: EIconName.Asset
	}
];
