import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvCopyToClipboard } from '../../components';
import { LOREM_TEXT } from './configs/copy-to-clipboard.config';

export default {
	title: 'Data Display/Copy To Clipboard',
	component: 'kv-copy-to-clipboard',
	parameters: {
		notes: require('@ui-notes/copy-to-clipboard/readme.md')
	}
};

KvCopyToClipboard.displayName = 'KvCopyToClipboard';

const CopyToClipboardTemplate: ComponentStory<typeof KvCopyToClipboard> = args => <KvCopyToClipboard {...args} />;

export const Default = CopyToClipboardTemplate.bind(this);
Default.args = {
	copiableText: LOREM_TEXT
};

export const WithTooltipSuffix = CopyToClipboardTemplate.bind(this);
WithTooltipSuffix.args = {
	...Default.args,
	tooltipSuffix: 'Lorem'
};

const ContentProjectionTemplate: ComponentStory<typeof KvCopyToClipboard> = args => (
	<KvCopyToClipboard {...args}>
		<div style={{ color: 'white', fontFamily: 'proxima-nova' }}>{LOREM_TEXT}</div>
	</KvCopyToClipboard>
);

export const WithContent = ContentProjectionTemplate.bind(this);
WithContent.args = {
	...WithTooltipSuffix.args
};
