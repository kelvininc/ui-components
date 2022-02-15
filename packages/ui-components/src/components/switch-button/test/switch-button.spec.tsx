import { SpecPage } from '@stencil/core/internal';
import { KvSwitchButton } from '../switch-button';
import { newSpecPage } from '@stencil/core/testing';

describe('Switch Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvSwitchButton;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button></kv-switch-button>`,
			});
			component = page.rootInstance;
		})

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isOn` with false', () => {
			expect(component.isOn).toBe(false)
		});

		it('should initialize `hasLabel` with false', () => {
			expect(component.hasLabel).toBe(false)
		});
	})

	describe('when has a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button label="Switch"></kv-switch-button>`,
			});
			component = page.rootInstance;
		})

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `hasLabel` with true', () => {
			expect(component.hasLabel).toBe(true)
		});
	})

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button disabled></kv-switch-button>`,
			});
			component = page.rootInstance;
		})

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when is ON', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSwitchButton],
				html: `<kv-switch-button state="on"></kv-switch-button>`,
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isOn` with true', () => {
			expect(component.isOn).toBe(true)
		});
	});
});
