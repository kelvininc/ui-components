import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvTabItem } from '../../tab-item/tab-item';
import { KvTabList } from '../tab-list';

describe('Tab List (unit tests)', () => {
	let page: SpecPage;
	let component: KvTabList;

	describe('when initialized with required props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTabList, KvTabItem],
				html: `<kv-tab-list selectedTabKey='dashboard'>
							<kv-tab-item tab-key="dashboard" label="Dashboard"></kv-tab-item>
						</kv-tab-list>
					`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
