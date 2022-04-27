import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadio } from '../../components';

export default {
	title: 'Inputs/Radio',
	component: 'kv-radio',
	parameters: {
		notes: require('@ui-notes/radio/readme.md')
	}
};

KvRadio.displayName = 'KvRadio';

const RadioTemplate: ComponentStory<typeof KvRadio> = args => <KvRadio {...args} />;

export const Default = RadioTemplate.bind({});
Default.args = {
	checked: false
};

export const DefaultWithLabel = RadioTemplate.bind({});
DefaultWithLabel.args = {
	...Default.args,
	label: 'Yes'
};

export const Checked = RadioTemplate.bind({});
Checked.args = {
	checked: true
};

export const CheckedWithLabel = RadioTemplate.bind({});
CheckedWithLabel.args = {
	...Checked.args,
	label: 'Yes'
};

export const Disabled = RadioTemplate.bind({});
Disabled.args = {
	disabled: true
};

export const DisabledWithLabel = RadioTemplate.bind({});
DisabledWithLabel.args = {
	...Disabled.args,
	label: 'Yes'
};
