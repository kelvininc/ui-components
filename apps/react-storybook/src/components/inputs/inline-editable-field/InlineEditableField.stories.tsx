import { ComponentProps, useRef, useState } from "react";
import {
	KvInlineEditableField,
	KvInlineEditableFieldCustomEvent
} from "@kelvininc/react-ui-components/client";
import { Meta, StoryFn, StoryObj } from "@storybook/react";

const KvInlineEditableFieldTemplate: StoryFn<
	ComponentProps<typeof KvInlineEditableField>
> = (args) => {
	const ref = useRef(null);
	const [title, setTitle] = useState(args.value);

	const onContentEdited = ({
		detail
	}: KvInlineEditableFieldCustomEvent<string>) => {
		setTitle(detail);
	};

	return (
		<KvInlineEditableField
			{...args}
			ref={ref}
			value={title}
			onContentEdited={onContentEdited}
		>
			<div
				style={{
					fontSize: 32,
					fontWeight: 600,
					lineHeight: "48px"
				}}
			>
				{title}
			</div>
		</KvInlineEditableField>
	);
};

const meta = {
	title: "Inputs/Inline Editable Field",
	component: KvInlineEditableField,
	render: KvInlineEditableFieldTemplate,
	argTypes: {
		onContentEdited: {
			action: "contentEdited"
		}
	}
} satisfies Meta<typeof KvInlineEditableField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		value: "Hello World"
	}
};

export const DisableEdit: Story = {
	args: {
		value: "Hello World",
		disabled: true
	}
};

export const WithPlaceholder: Story = {
	args: {
		value: "",
		placeholder: "-"
	}
};
