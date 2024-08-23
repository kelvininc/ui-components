import { ComponentStory } from '@storybook/react';
import React, { CSSProperties, useRef, useState } from 'react';
import { KvInlineEditableField, KvInlineEditableFieldCustomEvent } from '../../components';

export default {
	title: 'Inputs/Inline Editable Field',
	component: 'kv-inline-editable-field',
	argTypes: {
		onContentEdited: {
			action: 'contentEdited'
		}
	},
	parameters: {
		notes: require('@ui-notes/inline-editable-field/readme.md')
	}
};

KvInlineEditableField.displayName = 'KvInlineEditableField';

const containerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '16px',
	color: 'white',
	fontFamily: 'proxima-nova',
	padding: '32px',
	backgroundColor: 'black'
};

const KvInlineEditableFieldTemplate: ComponentStory<typeof KvInlineEditableField> = args => {
	const ref = useRef<any>(null);
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

export const Default = KvInlineEditableFieldTemplate.bind(this);
Default.args = {
	value: 'Hello World'
};

export const DisableEdit = KvInlineEditableFieldTemplate.bind(this);
DisableEdit.args = {
	value: 'Hello World',
	disabled: true
};
