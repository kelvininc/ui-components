import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvIcon } from '../icon';

describe('Icon (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvIcon],
				html: `<kv-icon name="kv-logo-kelvin"></kv-icon>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvIcon],
				html: `<kv-icon name="kv-logo-kelvin" custom-class="icon-full-size rotate-90"></kv-icon>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has custom color', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvIcon],
				html: `<kv-icon name="kv-logo-kelvin" custom-color="#05a357"></kv-icon>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
