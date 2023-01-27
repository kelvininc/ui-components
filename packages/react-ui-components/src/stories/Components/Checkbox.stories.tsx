import { ComponentStory } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { KvCheckbox, ICheckbox } from '../../components';

export default {
	title: 'Inputs/Checkbox',
	component: 'kv-checkbox',
	parameters: {
		notes: require('@ui-notes/checkbox/readme.md')
	}
};

KvCheckbox.displayName = 'KvCheckbox';

const CheckboxTemplate: ComponentStory<typeof KvCheckbox> = ({ checked: initialChecked, ...otherArgs }: ICheckbox) => {
	const [checked, setChecked] = useState(initialChecked);

	const onClickCheckbox = useCallback(() => {
		setChecked(!checked);
	}, [checked]);

	return <KvCheckbox {...otherArgs} checked={checked} onClickCheckbox={onClickCheckbox} />;
};

const DefaultArgs = {
	checked: false,
	disabled: false,
	indeterminate: false
};

export const Default = CheckboxTemplate.bind({});
Default.args = DefaultArgs;

export const Disabled = CheckboxTemplate.bind({});
Disabled.args = {
	...DefaultArgs,
	disabled: true
};

export const Indeterminate = CheckboxTemplate.bind({});
Indeterminate.args = {
	...DefaultArgs,
	indeterminate: true
};
