import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvSvgIcon } from '../svg-icon';

describe('Svg Icon (unit tests)', () => {
	let page: SpecPage;
	let component: KvSvgIcon;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSvgIcon],
				html: `<kv-svg-icon name="kv-logo-kelvin"></kv-svg-icon>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSvgIcon],
				html: `<kv-svg-icon name="kv-logo-kelvin" custom-class="icon-full-size rotate-90"></kv-svg-icon>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has custom color', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSvgIcon],
				html: `<kv-svg-icon name="kv-logo-kelvin" custom-color="#05a357"></kv-svg-icon>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
