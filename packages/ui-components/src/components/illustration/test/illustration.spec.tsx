import { SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { KvIllustration } from '../illustration';

describe('Illustration (unit tests)', () => {
	let page: SpecPage;
	let component: KvIllustration;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvIllustration],
				html: `<kv-illustration name="kv-es-section-somethingwentwrong"></kv-illustration>`
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
				components: [KvIllustration],
				html: `<kv-illustration name="kv-es-section-somethingwentwrong" custom-class="icon-full-size"></kv-illustration>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
