
import { action } from '@storybook/addon-actions';
import { KvCodeDiffEditor, ECodeEditorTheme } from '@kelvininc/react-ui-components';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

const onChangeAction = action('Data Changed');

const DefaultCodeEditorTemplate: StoryFn<ComponentProps<typeof KvCodeDiffEditor>> = args => {
	const wrapperStyle = { width: '640px', height: '480px' };

	return (
		<div style={wrapperStyle}>
			<KvCodeDiffEditor {...args} onChange={onChangeAction} />
		</div>
	);
};

const meta = {
	title: 'Inputs/CodeDiffEditor',
	component: KvCodeDiffEditor,
	render: DefaultCodeEditorTemplate,
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
	}
} satisfies Meta<typeof KvCodeDiffEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
	args: {
		language: 'json',
		originalCode,
		modifiedCode
	}
};

export const SingleEditorDiff: Story = {
	args: {
		language: 'json',
		originalCode,
		modifiedCode,
		customOptions: { renderSideBySide: false }
	}
};
