import { SpecPage } from '@stencil/core/internal';
import { KvLoader } from '../loader';
import { newSpecPage } from '@stencil/core/testing';

describe('Loader (unit tests)', () => {
	let page: SpecPage;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvLoader],
				html: `<kv-loader></kv-loader>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is loading', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvLoader],
				html: `<kv-loader is-loading></kv-loader>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when has overlay', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvLoader],
				html: `<kv-switch-button is-loading has-overlay></kv-switch-button>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});
});
