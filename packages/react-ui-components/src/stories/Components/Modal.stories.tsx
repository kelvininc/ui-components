import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvModal, ModalOverlay, useModal } from '../../components';

export default {
	title: 'Popover/Modal',
	component: 'kv-modal',
	parameters: {
		notes: require('@ui-notes/modal/readme.md')
	}
};

KvModal.displayName = 'KvModal';

const ControlledModalTemplate: ComponentStory<typeof ModalOverlay> = args => {
	const modalCtrl = useModal(args.isOpen);
	args.onClickClose = () => modalCtrl.close();

	return (
		<React.Fragment>
			<button type="button" onClick={modalCtrl.open}>
				Open Modal
			</button>
			<ModalOverlay rootId="root" {...args} isOpen={modalCtrl.isOpen}>
				{args.children}
			</ModalOverlay>
		</React.Fragment>
	);
};

export const DefaultState = ControlledModalTemplate.bind(this);
DefaultState.args = {
	headerTitle: 'Modal Header',
	isOpen: false,
	onClickClose: () => {
		console.log('close was clicked');
	}
};

export const NoCloseButton = ControlledModalTemplate.bind(this);
NoCloseButton.args = {
	...DefaultState.args,
	showCloseButton: false
};

export const NoOverlay = ControlledModalTemplate.bind(this);
NoOverlay.args = {
	...DefaultState.args,
	showOverlay: false
};

export const WithContentProjection = ControlledModalTemplate.bind(this);
WithContentProjection.args = {
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
};
