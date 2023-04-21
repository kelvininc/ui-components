import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvCopyToClipboard } from '../copy-to-clipboard';

describe('Copy To Clipboard (unit tests)', () => {
	let page: SpecPage;

	describe('when rendering', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCopyToClipboard],
				html: `
					<kv-copy-to-clipboard copiable-text='https://kelvin.ai' tooltip-suffix='Link'>
						<span>Click me to copy the link</span>
					</kv-copy-to-clipboard>
				`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
