import { SpecPage } from '@stencil/core/internal';
import { KvTooltip } from '../tooltip';
import { newSpecPage } from '@stencil/core/testing';

describe('Tooltip (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTooltip],
				html: `<kv-tooltip text="Tooltip"></kv-tooltip>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a position', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvTooltip],
				html: `<kv-tooltip text="Tooltip" position="left"></kv-tooltip>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
