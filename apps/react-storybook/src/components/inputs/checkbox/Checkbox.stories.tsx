
import { ComponentProps, useCallback, useState } from 'react';
import { KvCheckbox, ICheckbox } from '@kelvininc/react-ui-components';
import { Meta, StoryFn, StoryObj } from '@storybook/react';

const CheckboxTemplate: StoryFn<ComponentProps<typeof KvCheckbox>> = ({ checked: initialChecked, ...otherArgs }: ICheckbox) => {
	const [checked, setChecked] = useState(initialChecked);

	const onClickCheckbox = useCallback(() => {
		setChecked(!checked);
	}, [checked]);

	return <KvCheckbox {...otherArgs} checked={checked} onClickCheckbox={onClickCheckbox} />;
};

const meta = {
	title: 'Inputs/Checkbox',
	component: KvCheckbox,
	render: CheckboxTemplate
} satisfies Meta<typeof KvCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultArgs = {
	checked: false,
	disabled: false,
	indeterminate: false
};

export const Default: Story = {
	args: DefaultArgs
};
export const Disabled: Story = {
	args: {
		...DefaultArgs,
		disabled: true
	}
};

export const Indeterminate: Story = {
	args: {
		...DefaultArgs,
		indeterminate: true
	}
};
