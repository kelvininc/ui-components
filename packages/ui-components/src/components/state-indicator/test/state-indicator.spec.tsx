import { SpecPage } from '@stencil/core/internal';
import { KvStateIndicator } from '../state-indicator';
import { newSpecPage } from '@stencil/core/testing';

describe('Switch Button (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStateIndicator],
				html: `<kv-state-inidcator text="State Indicator"></kv-state-indicator>`,
			});
		})

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	})

	describe('when has a color', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStateIndicator],
				html: `<kv-state-inidcator text="State Indicator" color="green"></kv-state-indicator>`,
			});
		})

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
