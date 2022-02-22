import { SpecPage } from '@stencil/core/internal';
import { KvSwitchButton } from '../switch-button';
import { newSpecPage } from '@stencil/core/testing';
import { ESwitchButtonState } from '../switch-button.types';

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

		describe('and the label is removed', () => {
			beforeEach(() => {
				page.root.setAttribute('label', '');
			});

			it('should change `hasLabel` to false', () => {
				expect(component.hasLabel).toBe(false)
			});
		})
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

		it('should initialize `isDisabled` with true', () => {
			expect(component.isDisabled).toBe(true)
		});

		describe('and it\s enabled', () => {
			beforeEach(() => {
				page.root.removeAttribute('disabled');
			});

			it('should change `isDisabled` to false', () => {
				expect(component.isDisabled).toBe(false)
			});
		})
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

		describe('and it\s turned OFF', () => {
			beforeEach(() => {
				page.root.setAttribute('state', ESwitchButtonState.OFF);
			});

			it('should change `isOn` to false', () => {
				expect(component.isOn).toBe(false)
			});
		})
	});
});
