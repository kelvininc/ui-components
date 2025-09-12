import type { Meta, StoryObj, StoryFn } from "@storybook/react";
import {
	KvModal,
	ModalOverlay,
	useModal
} from "@kelvininc/react-ui-components/client";
import { ComponentProps } from "react";

const ControlledModalTemplate: StoryFn<ComponentProps<typeof ModalOverlay>> = (
	args
) => {
	const modalCtrl = useModal(args.isOpen);
	args.onClickClose = () => modalCtrl.close();

	return (
		<>
			<button type="button" onClick={modalCtrl.open}>
				Open Modal
			</button>
			<ModalOverlay
				rootId="storybook-root"
				{...args}
				isOpen={modalCtrl.isOpen}
				onEscapeKeyPressed={modalCtrl.close}
			>
				{args.children}
			</ModalOverlay>
		</>
	);
};

const meta = {
	title: "Popover/Modal",
	component: KvModal,
	render: ControlledModalTemplate
} satisfies Meta<typeof KvModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		headerTitle: "Modal Header",
		isOpen: false
	}
};

export const NoCloseButton: Story = {
	args: {
		...DefaultState.args,
		showCloseButton: false
	}
};

export const NoOverlay: Story = {
	args: {
		...DefaultState.args,
		showOverlay: false
	}
};

export const WithContentProjection: Story = {
	args: {
		...DefaultState.args,
		children: (
			<>
				<div slot="header">
					<p>Content Header</p>
				</div>
				<div slot="body">
					<p>Content Body</p>
				</div>
				<div slot="footer">
					<p>Content footer</p>
				</div>
			</>
		)
	}
};
