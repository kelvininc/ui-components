
import { ComponentProps, CSSProperties, useRef, useState } from 'react';
import { KvInlineEditableField, KvInlineEditableFieldCustomEvent } from '@kelvininc/react-ui-components';
import { Meta, StoryFn, StoryObj } from '@storybook/react';

const KvInlineEditableFieldTemplate: StoryFn<ComponentProps<typeof KvInlineEditableField>> = args => {
	const ref = useRef(null);
	const [title, setTitle] = useState(args.value);

	const onContentEdited = ({ detail }: KvInlineEditableFieldCustomEvent<string>) => {
		setTitle(detail);
	};

	return (
		<div style={containerStyle}>
			<KvInlineEditableField {...args} ref={ref} value={title} onContentEdited={onContentEdited}>
				<div style={{ fontSize: 32, fontWeight: 600, lineHeight: '48px' }}>{title}</div>
			</KvInlineEditableField>
		</div>
	);
};

const meta = {
	title: 'Inputs/Inline Editable Field',
	component: KvInlineEditableField,
	render: KvInlineEditableFieldTemplate,
	argTypes: {
		onContentEdited: {
			action: 'contentEdited'
		}
	}
} satisfies Meta<typeof KvInlineEditableField>;

export default meta;
type Story = StoryObj<typeof meta>;

const containerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '16px',
	color: 'white',
	fontFamily: 'proxima-nova',
	padding: '32px',
	backgroundColor: 'black'
};

export const Default: Story = {
	args: {
		value: 'Hello World'
	}
};

export const DisableEdit: Story = {
	args: {
		value: 'Hello World',
		disabled: true
	}
};
