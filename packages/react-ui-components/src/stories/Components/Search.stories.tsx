import { ComponentStory } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { EComponentSize, KvSearch, KvTextField } from '../../components';

KvTextField.displayName = 'KvSearch';

export default {
	title: 'Inputs/Search',
	component: 'kv-search',
	argTypes: {
		disabled: { control: { type: 'boolean' } },
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
	},
	parameters: {
		notes: require('@ui-notes/search/readme.md')
	}
};

const SearchTemplate: ComponentStory<typeof KvSearch> = args => {
	const [searchValue, setSearchValue] = useState('');
	const onSearchTermChange = useCallback(({ detail }: CustomEvent<string>) => {
		setSearchValue(detail);
	}, []);

	return <KvSearch {...args} value={searchValue} onTextChange={onSearchTermChange} />;
};

export const Default = SearchTemplate.bind({});
Default.args = {
	value: '',
	disabled: false,
	placeholder: 'Placeholder Here',
	size: EComponentSize.Large
};

export const Disabled = SearchTemplate.bind({});
Disabled.args = {
	...Default.args,
	value: '',
	placeholder: 'Search disabled',
	disabled: true,
	size: EComponentSize.Large
};

export const Slim = SearchTemplate.bind({});
Slim.args = {
	...Default.args,
	value: '',
	placeholder: 'Small Search',
	size: EComponentSize.Small
};
