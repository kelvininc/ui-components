import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvCopyToClipboard } from '../../components';

export default {
	title: 'Data Display/Copy To Clipboard',
	component: 'kv-copy-to-clipboard',
	parameters: {
		notes: require('@ui-notes/copy-to-clipboard/readme.md')
	}
};

KvCopyToClipboard.displayName = 'KvCopyToClipboard';

const QUOTE = 'Inspiration does exist, but it must find you working.';

const CopyToClipboardTemplate: ComponentStory<typeof KvCopyToClipboard & { textContent: string }> = args => (
	<div style={{ color: 'white', fontFamily: 'proxima-nova' }}>
		<KvCopyToClipboard {...args}>{QUOTE}</KvCopyToClipboard>
	</div>
);

export const Default = CopyToClipboardTemplate.bind(this);
Default.args = {
	copiableText: QUOTE
};

export const WithTooltipSuffix = CopyToClipboardTemplate.bind(this);
WithTooltipSuffix.args = {
	...Default.args,
	tooltipSuffix: 'Quote'
};
