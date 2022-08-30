import { SpecPage } from '@stencil/core/internal';
import { KvToggleTip } from '../toggle-tip';
import { newSpecPage } from '@stencil/core/testing';

describe('Toggle Tip (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleTip],
				html: `<kv-toggle-tip text="Toggle tip"><kv-icon slot="open-element-slot" name="kv-logo-kelvin"/></kv-toggle-tip>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has a position', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvToggleTip],
				html: `<kv-toggle-tip text="Toggle tip" position="left"><kv-icon slot="open-element-slot" name="kv-logo-kelvin"/></kv-toggle-tip>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
