import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvIcon } from '../../components';
import { icons } from '../foundation/SvgIcons/SvgIcons-list';
export default {
	title: 'Media/Icon',
	component: 'kv-icon',
	argTypes: {
		name: {
			control: { type: 'select' },
			options: [...icons]
		},
		customClass: {
			control: { type: 'text' }
		},
		customColor: {
			control: { type: 'color' }
		}
	},
	parameters: {
		notes: require('@ui-notes/icon/readme.md')
	}
};

KvIcon.displayName = 'KvIcon';

const KvIconTemplate: ComponentStory<typeof KvIcon> = args => <KvIcon {...args} />;

export const IconOnly = KvIconTemplate.bind(this);
IconOnly.args = {
	name: 'kv-logo-kelvin'
};

export const CustomClass = KvIconTemplate.bind(this);
CustomClass.args = {
	name: 'kv-logo-kelvin',
	customClass: 'icon-full-size rotate-90'
};

export const CustomColor = KvIconTemplate.bind(this);
CustomColor.args = {
	name: 'kv-logo-kelvin',
	customColor: '#05a357'
};
