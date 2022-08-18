import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvRange } from '../range';

describe('Range (unit tests)', () => {
	let page: SpecPage;
	let component: KvRange;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRange],
				html: `<kv-range></kv-range>`
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when user defines props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRange],
				html: `<kv-range min=0 max=100 step=10 value=0></kv-range>`
			});
			component = page.rootInstance;
		});

		it('component min value should match the given value', () => {
			expect(component.min).toBe(0);
		});

		it('component max value should match the given value', () => {
			expect(component.max).toBe(100);
		});

		it('component step value should match the given value', () => {
			expect(component.step).toBe(10);
		});

		it('component value prop value should match the given value', () => {
			expect(component.value).toBe(0);
		});
	});

	describe('when user defines only min and max', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRange],
				html: `<kv-range min=0 max=100></kv-range>`
			});
			component = page.rootInstance;
		});

		it('component min value should match the given value', () => {
			expect(component.min).toBe(0);
		});

		it('component max value should match the given value', () => {
			expect(component.max).toBe(100);
		});

		it('component step value should match the given value', () => {
			expect(component.step).toBe(1);
		});

		it('component value prop value should match the given value', () => {
			expect(component.value).toBe(0);
		});
	});
});
