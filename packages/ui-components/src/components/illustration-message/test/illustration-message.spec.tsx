import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { KvIllustrationMessage } from '../illustration-message';
import { EIllustrationName } from '../../illustration/illustration.types';

describe('Illustration Message (unit tests)', () => {
	describe('when rendered with an illustration', () => {
		it('should present the illustration above its texts', async () => {
			const page = await newSpecPage({
				components: [KvIllustrationMessage],
				template: () => <kv-illustration-message illustration={EIllustrationName.NoDataAvailable} header="No Data Available" description="Nothing to show" />
			});

			expect(page.root.shadowRoot.querySelector('kv-illustration').getAttribute('name')).toBe(EIllustrationName.NoDataAvailable);
			expect(page.root.shadowRoot.querySelector('.header').textContent).toBe('No Data Available');
			expect(page.root.shadowRoot.querySelector('.description').textContent).toBe('Nothing to show');
		});
	});

	describe('when rendered without an illustration', () => {
		it('should only present its texts', async () => {
			const page = await newSpecPage({
				components: [KvIllustrationMessage],
				template: () => <kv-illustration-message header="No results found" />
			});

			expect(page.root.shadowRoot.querySelector('kv-illustration')).toBeNull();
			expect(page.root.shadowRoot.querySelector('.header').textContent).toBe('No results found');
			expect(page.root.shadowRoot.querySelector('.description')).toBeNull();
		});
	});
});
