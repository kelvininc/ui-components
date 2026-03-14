import type { Meta, StoryObj } from "@storybook/react";

import {
	KvTabNavigation,
	ETabItemType,
	EIconName,
	ETagState
} from "@kelvininc/react-ui-components/client";
import { useArgs } from "@storybook/preview-api";

const meta = {
	title: "Navigation/Tabs/Tab Navigation",
	component: KvTabNavigation,
	render: function Renderer(args) {
		const [, updateArgs] = useArgs();

		const handleTabChange = (event: CustomEvent<string>) => {
			updateArgs({ selectedTabKey: event.detail });
		};

		return (
			<KvTabNavigation
				tabs={args.tabs}
				selectedTabKey={args.selectedTabKey}
				type={args.type}
				onTabChange={handleTabChange}
			/>
		);
	},
	argTypes: {
		selectedTabKey: {
			control: "text"
		},
		type: {
			control: "radio",
			options: Object.values(ETabItemType)
		}
	}
} satisfies Meta<typeof KvTabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryType: Story = {
	args: {
		tabs: [
			{
				tabKey: "assets",
				label: "Assets"
			},
			{
				tabKey: "components",
				label: "Components",
				badge: "0"
			},
			{
				tabKey: "parts",
				label: "Parts",
				disabled: true
			},
			{
				tabKey: "sensors",
				label: "Sensors",
				tagIcon: EIconName.Error,
				tagState: ETagState.Error
			}
		],
		selectedTabKey: "assets",
		type: ETabItemType.Primary
	}
};

export const SecondaryType: Story = {
	args: {
		tabs: [
			{
				tabKey: "assets",
				label: "Assets",
				badge: "0"
			},
			{
				tabKey: "components",
				label: "Components",
				badge: "4"
			},
			{
				tabKey: "parts",
				label: "Parts",
				disabled: true
			},
			{
				tabKey: "sensors",
				label: "Sensors",
				tagIcon: EIconName.Error,
				tagState: ETagState.Error
			}
		],
		selectedTabKey: "assets",
		type: ETabItemType.Secondary
	}
};

export const SecondaryTypeOnlyIcon: Story = {
	args: {
		tabs: [
			{
				tabKey: "device",
				icon: EIconName.Device
			},
			{
				tabKey: "place",
				icon: EIconName.Place
			},
			{
				tabKey: "properties",
				icon: EIconName.Properties,
				disabled: true
			},
			{
				tabKey: "world",
				icon: EIconName.World
			}
		],
		selectedTabKey: "device",
		type: ETabItemType.Secondary
	}
};

export const SecondaryTypeOnlyIconVertical: Story = {
	render: function Renderer(args) {
		const [, updateArgs] = useArgs();

		const handleTabChange = (event: CustomEvent<string>) => {
			updateArgs({ selectedTabKey: event.detail });
		};

		return (
			<KvTabNavigation
				style={{
					"--secondary-tab-list-direction": "column",
					"--secondary-items-align": "flex-start"
				}}
				tabs={args.tabs}
				selectedTabKey={args.selectedTabKey}
				type={args.type}
				onTabChange={handleTabChange}
			/>
		);
	},
	args: {
		tabs: [
			{
				tabKey: "device",
				icon: EIconName.Device
			},
			{
				tabKey: "place",
				icon: EIconName.Place
			},
			{
				tabKey: "properties",
				icon: EIconName.Properties,
				disabled: true
			},
			{
				tabKey: "world",
				icon: EIconName.World
			}
		],
		selectedTabKey: "device",
		type: ETabItemType.Secondary
	}
};
