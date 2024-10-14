import type { Meta, StoryObj } from '@storybook/react';

import { EActionButtonType, EBadgeState, EComponentSize, EIconName, EOtherIconName, KvActionButtonIcon } from "@kelvininc/react-ui-components"


const meta = {
	title: 'Buttons/Icon',
	component: KvActionButtonIcon,
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		},
		icon: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		badgeState: {
			control: { type: 'select' },
			options: Object.values(EBadgeState)
		}
	}
} satisfies Meta<typeof KvActionButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const SecondaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Secondary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const TertiaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const TertiaryLoadingState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Small,
		disabled: false,
		active: false,
		loading: true
	}
};

export const GhostState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Ghost,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const DangerState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Danger,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const DisabledState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: true,
		active: false
	}
};

export const AnchorState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const BadgeState: Story = {
	args: {
		icon: EIconName.Dashboard,
		type: EActionButtonType.Secondary,
		size: EComponentSize.Small,
		disabled: false,
		active: false,
		badgeLabel: '12',
		badgeState: EBadgeState.None
	}
};
