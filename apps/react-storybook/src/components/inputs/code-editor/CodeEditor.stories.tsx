
import { action } from '@storybook/addon-actions';

import { KvCodeEditor, ECodeEditorTheme } from '@kelvininc/react-ui-components';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

const onChangeAction = action('Data Changed');

const DefaultCodeEditorTemplate: StoryFn<ComponentProps<typeof KvCodeEditor>> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	return (
		<div style={wrapperStyle}>
			<KvCodeEditor {...args} onChange={onChangeAction} />
		</div>
	);
};

const meta = {
	title: 'Inputs/CodeEditor',
	component: KvCodeEditor,
	render: DefaultCodeEditorTemplate,
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
	}
} satisfies Meta<typeof KvCodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const code = `{
	"name": "Name",
	"props": {
		"title": "Title",
		"owner": 1
	}
}`;

export const Default: Story = {
	args: {
		language: 'json',
		code
	}
};

export const CustomTheme: Story = {
	args: {
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
	}
};
