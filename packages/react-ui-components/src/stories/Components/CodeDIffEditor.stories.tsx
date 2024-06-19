import { ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { KvCodeDiffEditor, ECodeEditorTheme } from '../../components';

export default {
	title: 'Inputs/CodeDiffEditor',
	component: 'KvCodeDiffEditor',
	argTypes: {
		originalCode: {
			control: {
				type: 'text'
			}
		},
		modifiedCode: {
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
		notes: require('@react-ui-notes/CodeEditor/readme/CodeDiffEditor/readme.md')
	}
};

const onChangeAction = action('Data Changed');

const originalCode = `{
	"name": "Name",
	"props": {
		"title": "Title",
		"owner": 1
	}
}`;

const modifiedCode = `{
	"name": "Changes Name",
	"props": {
		"title": "Title",
		"owner": 2,
		"isAdmin": true
	}
}`;

const DefaultCodeEditorTemplate: ComponentStory<typeof KvCodeDiffEditor> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	return (
		<div style={wrapperStyle}>
			<KvCodeDiffEditor {...args} onChange={onChangeAction} />
		</div>
	);
};

export const Default = DefaultCodeEditorTemplate.bind(this);
Default.args = {
	language: 'json',
	originalCode,
	modifiedCode
};

export const SingleEditorDiff = DefaultCodeEditorTemplate.bind(this);
SingleEditorDiff.args = {
	language: 'json',
	originalCode,
	modifiedCode,
	customOptions: { renderSideBySide: false }
};
