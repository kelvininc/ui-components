import { ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { KvCodeEditor, ECodeEditorTheme, CustomThemeData } from '../../components';

export default {
	title: 'Inputs/CodeEditor',
	component: 'KvCodeEditor',
	argTypes: {
		code: {
			control: {
				type: 'text'
			}
		},
		debounceTime: {
			control: {
				type: 'number'
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
		customTheme: {
			control: {
				type: 'object'
			}
		},
		readOnly: {
			control: {
				type: 'boolean'
			}
		}
	},
	parameters: {
		notes: require('@react-ui-notes/CodeEditor/readme.md')
	}
};

const onChangeAction = action('Data Changed');

const DefaultCodeEditorTemplate: ComponentStory<typeof KvCodeEditor> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	return (
		<div style={wrapperStyle}>
			<KvCodeEditor {...args} onChange={onChangeAction} />
		</div>
	);
};

export const Default = DefaultCodeEditorTemplate.bind(this);

const CustomCodeEditorTemplate: ComponentStory<typeof KvCodeEditor> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	const customDarkTheme: CustomThemeData = {
		base: 'vs-dark',
		inherit: true,
		rules: [],
		colors: {
			'editor.foreground': '#ffffff',
			'editor.background': '#3f3f3f',
			'editor.lineHighlightBorder': '#3f3f3f'
		}
	};

	return (
		<div style={wrapperStyle}>
			<KvCodeEditor {...args} customTheme={customDarkTheme} onChange={onChangeAction} />
		</div>
	);
};

export const CustomTheme = CustomCodeEditorTemplate.bind(this);
