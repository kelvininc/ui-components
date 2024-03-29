import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvModal } from '../modal';

describe('Modal (unit tests)', () => {
	let page: SpecPage;
	let comp: KvModal;

	describe('when using default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvModal],
				html: `<kv-modal></kv-modal>`
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', async () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the overlay to render', () => {
			expect(comp.showOverlay).toBe(true);
		});

		it('should set the close button to render', () => {
			expect(comp.showCloseButton).toBe(true);
		});
	});

	describe('when using a title', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvModal],
				html: `<kv-modal header-title="Hello World"></kv-modal>`
			});
			comp = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should set the correct title', () => {
			expect(comp.headerTitle).toEqual('Hello World');
		});
	});
});
