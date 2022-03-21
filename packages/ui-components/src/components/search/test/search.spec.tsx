import { newSpecPage } from '@stencil/core/testing';
import { KvSearch } from '../search';

describe('search', () => {
	it('renders', async () => {
		const page = await newSpecPage({
			components: [KvSearch],
			html: `<kv-search></kv-search>`,
		});
		expect(page.root).toEqualHtml(`
			<kv-search>
				<mock:shadow-root>
				<slot></slot>
				</mock:shadow-root>
			</kv-search>
		`);
	});
});
