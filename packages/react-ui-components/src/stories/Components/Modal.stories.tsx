import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvModal } from '../../components';

export default {
	title: 'Data Display/Modal',
	component: 'kv-modal',
	parameters: {
		notes: require('@ui-notes/modal/readme.md')
	}
};

KvModal.displayName = 'KvModal';

const ModalTemplate: ComponentStory<typeof KvModal> = args => (
	<KvModal {...args}>
		<div className="header">This is a modal header</div>
		<div className="body">This is a modal body</div>
		<div className="footer">This is a modal footer</div>
	</KvModal>
);

export const Default = ModalTemplate.bind({});
Default.args = {
	modalTitle: 'Modal Test'
};

export const Center = ModalTemplate.bind({});
Center.args = {
	modalTitle: 'Modal Test',
	center: true
};
