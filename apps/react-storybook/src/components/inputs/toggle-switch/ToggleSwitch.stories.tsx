import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import {
	EComponentSize,
	EIconName,
	KvToggleSwitch
} from "@kelvininc/react-ui-components";
import { ComponentProps } from "react";

const ToggleSwitchTemplate: StoryFn<ComponentProps<typeof KvToggleSwitch>> = (
	args
) => {
	const [, updateArgs] = useArgs();
	const onCheckedChange = ({ detail: id }: CustomEvent<string>) =>
		updateArgs({
			...args,
			selectedOption: id
		});

	return <KvToggleSwitch {...args} onCheckedChange={onCheckedChange} />;
};

const meta = {
	title: "Inputs/Toggle Switch",
	component: KvToggleSwitch,
	render: ToggleSwitchTemplate,
	argTypes: {
		onCheckedChange: {
			action: "checkedChange"
		}
	}
} satisfies Meta<typeof KvToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		options: [
			{
				label: "Option 1",
				value: "opt1"
			},
			{
				label: "Option 2",
				value: "opt2"
			},
			{
				label: "Option 3",
				value: "opt3",
				disabled: true
			},
			{
				label: "Option 4",
				value: "opt4"
			},
			{
				label: "Option 5",
				value: "opt5"
			}
		],
		selectedOption: "opt2",
		disabledButtons: {
			opt1: false,
			opt2: false,
			opt3: false,
			opt4: false,
			opt5: true
		},
		size: EComponentSize.Small
	}
};

export const ActiveDisabledState: Story = {
	args: {
		options: [
			{
				label: "Option 1",
				value: "opt1"
			},
			{
				label: "Option 2",
				value: "opt2"
			},
			{
				label: "Option 3",
				value: "opt3",
				disabled: true
			},
			{
				label: "Option 4",
				value: "opt4"
			},
			{
				label: "Option 5",
				value: "opt5"
			}
		],
		selectedOption: "opt2",
		disabledButtons: {
			opt1: false,
			opt2: true,
			opt3: false,
			opt4: false,
			opt5: true
		},
		size: EComponentSize.Small
	}
};

export const IconsState: Story = {
	args: {
		options: [
			{
				value: "opt1",
				icon: EIconName.DensityLow
			},
			{
				value: "opt2",
				icon: EIconName.DensityMedium
			},
			{
				value: "opt3",
				icon: EIconName.DensityHigh
			}
		],
		selectedOption: "opt2",
		size: EComponentSize.Large
	}
};
