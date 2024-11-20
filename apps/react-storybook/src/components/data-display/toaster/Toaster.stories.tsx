import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { EActionButtonType, EToasterType, KvActionButton, KvToaster } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const meta = {
	title: 'Data Display/Toaster',
	component: KvToaster,
	argTypes: {
		type: {
			control: 'select',
			options: Object.values(EToasterType)
		},
		onClickCloseButton: {
			action: 'clickCloseButton'
		},
		onTtlExpired: {
			action: 'ttlExpired'
		}
	}

} satisfies Meta<typeof KvToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorIcon: Story = {
	args: {
		header: 'Main Message',
		description: 'Secondary Message',
		ttl: 2000,
		type: EToasterType.Error
	}
};

export const WarningIcon: Story = {
	args: {
		header: 'Main Message',
		description: 'Secondary Message',
		ttl: 2000,
		type: EToasterType.Warning
	}
};

export const SuccessIcon: Story = {
	args: {
		header: 'Main Message',
		description: 'Secondary Message',
		ttl: 2000,
		type: EToasterType.Success
	}
};

export const InfoIcon: Story = {
	args: {
		header: 'Main Message',
		description: 'Secondary Message',
		ttl: 2000,
		type: EToasterType.Info
	}
};

export const NoTTL: Story = {
	args: {
		header: 'Main Message',
		description: 'Secondary Message',
		ttl: 0,
		type: EToasterType.Info
	}
};


const ToasterWithSlotTemplate: StoryFn<ComponentProps<typeof KvToaster>> = args => (
	<KvToaster {...args}>
		<KvActionButton type={EActionButtonType.Tertiary}>Clean Simulation</KvActionButton>
	</KvToaster>
);
export const WithSlot: Story = {
	render: ToasterWithSlotTemplate,
	args: {
		header: 'Displaying results of simulation',
		description: 'Click to end simulation',
		type: EToasterType.Warning
	}
};
