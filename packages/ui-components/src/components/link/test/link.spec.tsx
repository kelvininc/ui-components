import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvLink } from '../link';

describe('KvLink (unit tests)', () => {
	let page: SpecPage;
	let component: KvLink;

	describe('when only label is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvLink],
				html: `<kv-link label='Hello'></kv-link>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize with the correct label', () => {
			expect(component.label).toEqual('Hello');
		});
	});

	describe('when label and subtitle is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvLink],
				html: `<kv-link label='Hello' subtitle='World'></kv-link>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize the label with the correct value', () => {
			expect(component.label).toEqual('Hello');
		});

		it('should initialize the subtitle with the correct value', () => {
			expect(component.subtitle).toEqual('World');
		});
	});
});
