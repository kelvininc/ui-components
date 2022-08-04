import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, KvActionButton, KvToaster } from '../../components';

KvToaster.displayName = 'KvToaster';

enum EToasterType {
	Info = 'info',
	Warning = 'warning',
	Error = 'error',
	Success = 'success'
}

export default {
	title: 'Data Display/Toaster',
	component: 'kv-toaster',
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
	},
	parameters: {
		notes: require('@ui-notes/toaster/readme.md')
	}
};

const ToasterTemplate: ComponentStory<typeof KvToaster> = args => <KvToaster {...args} />;
const ToasterWithSlotTemplate: ComponentStory<typeof KvToaster> = args => (
	<KvToaster {...args}>
		<KvActionButton type={EActionButtonType.Tertiary}>Clean Simulation</KvActionButton>
	</KvToaster>
);

export const ErrorIcon = ToasterTemplate.bind({});
ErrorIcon.args = {
	header: 'Main Message',
	description: 'Secondary Message',
	ttl: 2000,
	type: EToasterType.Error
};

export const WarningIcon = ToasterTemplate.bind({});
WarningIcon.args = {
	header: 'Main Message',
	description: 'Secondary Message',
	ttl: 2000,
	type: EToasterType.Warning
};

export const SuccessIcon = ToasterTemplate.bind({});
SuccessIcon.args = {
	header: 'Main Message',
	description: 'Secondary Message',
	ttl: 2000,
	type: EToasterType.Success
};

export const InfoIcon = ToasterTemplate.bind({});
InfoIcon.args = {
	header: 'Main Message',
	description: 'Secondary Message',
	ttl: 2000,
	type: EToasterType.Info
};

export const NoTTL = ToasterTemplate.bind({});
NoTTL.args = {
	header: 'Main Message',
	description: 'Secondary Message',
	ttl: 0,
	type: EToasterType.Info
};

export const WithSlot = ToasterWithSlotTemplate.bind({});
WithSlot.args = {
	header: 'Displaying results of simulation',
	description: 'Click to end simulation',
	type: EToasterType.Warning
};
