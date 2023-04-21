import { ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { KvCodeEditor, ECodeEditorTheme } from '../../components';

export default {
	title: 'Inputs/CodeEditor',
	component: 'KvCodeEditor',
	argTypes: {
		code: {
			control: {
				type: 'text'
			}
		},
		language: {
			control: {
				type: 'text'
			}
		},
		theme: {
			control: {
				type: 'select'
			},
			options: Object.values(ECodeEditorTheme)
		},
		customOptions: {
			control: {
				type: 'object'
			}
		},
		customTheme: {
			control: {
				type: 'object'
			}
		}
	},
	parameters: {
		notes: require('@react-ui-notes/CodeEditor/readme.md')
	}
};

const onChangeAction = action('Data Changed');

const code = `{
	"name": "Name",
	"props": {
		"title": "Title",
		"owner": 1
	}
}`;

const DefaultCodeEditorTemplate: ComponentStory<typeof KvCodeEditor> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	return (
		<div style={wrapperStyle}>
			<KvCodeEditor {...args} onChange={onChangeAction} />
		</div>
	);
};

export const Default = DefaultCodeEditorTemplate.bind(this);
Default.args = {
	language: 'json',
	code
};

export const CustomTheme = DefaultCodeEditorTemplate.bind(this);
CustomTheme.args = {
	...Default.args,
	customTheme: {
		base: 'vs-dark',
		inherit: true,
		rules: [],
		colors: {
			'editor.foreground': '#ffffff',
			'editor.background': '#3f3f3f',
			'editor.lineHighlightBorder': '#3f3f3f'
		}
	}
};
