import type { StoryFn, StoryObj } from "@storybook/react";

import {
	EIconName,
	KvDescriptionList
} from "@kelvininc/react-ui-components/client";

import * as styles from "./DescriptionList.module.scss";
import { ComponentProps } from "react";

const meta = {
	title: "Data Display/Description List",
	component: KvDescriptionList
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{
				title: "Name ID",
				description: "cluster-a-brownie"
			},
			{
				title: "Kubernetes Version",
				description: "1.20.5"
			},
			{
				title: "Kelvin Version",
				description: "4.2.4"
			},
			{
				title: "Cluster ID",
				description: "cluster-a-brownie-12345",
				copiableTextConfig: {
					copiableText: "cluster-a-brownie-12345"
				}
			}
		]
	}
};

export const WithLabelTooltip: Story = {
	args: {
		items: [
			{
				title: "Name ID",
				description: "cluster-a-brownie"
			},
			{
				title: "Kubernetes Version",
				description: "N/A",
				popoverInfo: {
					text: `Data is not available`
				}
			},
			{
				title: "Kelvin Version",
				description: "N/A",
				popoverInfo: {
					text: `Data is not available`
				}
			}
		]
	}
};

export const WithIconTooltip: Story = {
	args: {
		items: [
			{
				title: "Name ID",
				description: "cluster-a-brownie",
				popoverInfo: {
					text: `This name cannot be changed`,
					icon: EIconName.Info
				}
			},
			{
				title: "Kubernetes Version",
				description: "1.20.5"
			},
			{
				title: "Kelvin Version",
				description: "4.2.4"
			}
		]
	}
};

const CustomDescriptionListTemplate: StoryFn<
	ComponentProps<typeof KvDescriptionList>
> = (args) => {
	return (
		<KvDescriptionList
			{...args}
			customClass={styles.CustomDescriptionList}
		/>
	);
};

export const WithCustomDescriptionList: Story = {
	args: {
		items: [
			{
				title: "Gigant Title",
				description:
					"lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
			},
			{
				title: "Kubernetes Version",
				description: "1.20.5"
			},
			{
				title: "Kelvin Version",
				description: "4.2.4"
			},
			{
				title: "Cluster ID",
				description: "cluster-a-brownie-12345",
				copiableTextConfig: {
					copiableText: "cluster-a-brownie-12345"
				}
			}
		]
	},
	render: CustomDescriptionListTemplate
};
