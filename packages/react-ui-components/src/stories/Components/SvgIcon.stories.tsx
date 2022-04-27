import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, KvIcon } from '../../components';

export default {
	title: 'Media/Icon',
	component: 'kv-icon',
	argTypes: {
		name: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
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
	name: EIconName.LogoKelvin
};

export const CustomClass = KvIconTemplate.bind(this);
CustomClass.args = {
	name: EIconName.LogoKelvin,
	customClass: 'icon-full-size rotate-90'
};

export const CustomColor = KvIconTemplate.bind(this);
CustomColor.args = {
	name: EIconName.LogoKelvin,
	customColor: '#05a357'
};
