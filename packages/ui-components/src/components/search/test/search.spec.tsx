import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { EComponentSize } from '../../../types';
import { EIconName } from '../../icon/icon.types';
import { KvSearch } from '../search';

describe('Search (unit tests)', () => {
	let page: SpecPage;
	let component: KvSearch;

	const getResetIcon = () => page.root.shadowRoot.querySelector('kv-text-field').getAttribute('actionicon');

	describe('when value is not provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search></kv-search>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `inputDisabled` with false', () => {
			expect(component.inputDisabled).toBe(false);
		});

		it('should initialize `size` with large', () => {
			expect(component.size).toBe(EComponentSize.Large);
		});

		it('should not render the reset icon', () => {
			expect(getResetIcon()).toBeNull();
		});
	});

	describe('when value is changed', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search value="Teste"></kv-search>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should render the reset icon', () => {
			expect(getResetIcon()).toBe(EIconName.Close);
		});
	});

	describe('when value is a number', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				template: () => <kv-search value={5} />
			});
		});

		it('should render the reset icon', () => {
			expect(getResetIcon()).toBe(EIconName.Close);
		});
	});

	describe('when is disabled', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search value="Teste" input-disabled></kv-search>`
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `inputDisabled` with true', () => {
			expect(component.inputDisabled).toBe(true);
		});

		it('should not render the reset icon', () => {
			expect(getResetIcon()).toBeNull();
		});
	});

	describe('when the reset button is clicked', () => {
		let textChange: jest.SpyInstance;
		let clickResetButton: jest.SpyInstance;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSearch],
				html: `<kv-search value="Teste"></kv-search>`
			});
			component = page.rootInstance;
			textChange = jest.spyOn(component.textChange, 'emit');
			clickResetButton = jest.spyOn(component.clickResetButton, 'emit');

			// kv-text-field is not registered, so its event is dispatched on the element the listener is attached to
			page.root.shadowRoot.querySelector('kv-text-field').dispatchEvent(new CustomEvent('rightActionClick', { detail: {} }));
		});

		it('should emit an empty search', () => {
			expect(textChange).toHaveBeenCalledWith('');
		});

		it('should emit the reset click', () => {
			expect(clickResetButton).toHaveBeenCalled();
		});
	});
});
