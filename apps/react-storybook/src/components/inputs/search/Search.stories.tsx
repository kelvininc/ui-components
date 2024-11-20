import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps, useCallback, useState } from 'react';
import { EComponentSize, KvSearch } from '@kelvininc/react-ui-components';

const SearchTemplate: StoryFn<ComponentProps<typeof KvSearch>> = args => {
	const [searchValue, setSearchValue] = useState('');
	const onSearchTermChange = useCallback(({ detail }: CustomEvent<string>) => {
		setSearchValue(detail);
	}, []);

	return <KvSearch {...args} value={searchValue} onTextChange={onSearchTermChange} />;
};

const meta = {
	title: 'Inputs/Search',
	component: KvSearch,
	render: SearchTemplate,
	argTypes: {
		inputDisabled: { control: { type: 'boolean' } },
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		},
		onTextChange: {
			action: 'textChange'
		},
		onTextFieldBlur: {
			action: 'textFieldBlur'
		},
		onClickResetButton: {
			action: 'clickResetButton'
		}
	}
} satisfies Meta<typeof KvSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: '',
		inputDisabled: false,
		placeholder: 'Placeholder Here',
		size: EComponentSize.Large
	}
};

export const Disabled: Story = {
	args: {
		...Default.args,
		value: '',
		placeholder: 'Search disabled',
		inputDisabled: true,
		size: EComponentSize.Large
	}
};

export const Slim: Story = {
	args: {
		...Default.args,
		value: '',
		placeholder: 'Small Search',
		size: EComponentSize.Small
	}
};
