import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvSvgIcon } from '../../components';
import { icons } from '../foundation/SvgIcons/SvgIcons-list';
export default {
	title: 'Media/SVG Icon',
	component: 'kv-svg-icon',
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
		notes: require('@ui-notes/svg-icon/readme.md')
	}
};

KvSvgIcon.displayName = 'KvSvgIcon';

const KvSvgIconTemplate: ComponentStory<typeof KvSvgIcon> = args => <KvSvgIcon {...args} />;

export const IconOnly = KvSvgIconTemplate.bind(this);
IconOnly.args = {
	name: 'kv-logo-kelvin'
};

export const CustomClass = KvSvgIconTemplate.bind(this);
CustomClass.args = {
	name: 'kv-logo-kelvin',
	customClass: 'icon-full-size rotate-90'
};

export const CustomColor = KvSvgIconTemplate.bind(this);
CustomColor.args = {
	name: 'kv-logo-kelvin',
	customColor: '#05a357'
};
