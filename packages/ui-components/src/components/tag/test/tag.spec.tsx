import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvTag } from '../tag';

describe('Tag (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTag],
				html: `<kv-tag label="Tag Default"></kv-tag>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
