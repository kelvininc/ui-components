import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvSelectOption } from '../select-option';
import { EToggleState } from '../select-option.types';
import { KvCheckbox } from '../../checkbox/checkbox';
import { KvRadio } from '../../radio/radio';
import { h } from '@stencil/core';
import { KvActionButtonIcon } from '../../action-button-icon/action-button-icon';
import { KvActionButton } from '../../action-button/action-button';
import { EIconName } from '../../icon/icon.types';

describe('KvSelectOption (unit tests)', () => {
	let page: SpecPage;
	let component: KvSelectOption;

	it('should forward its configured action name', async () => {
		const action = { icon: EIconName.Close, accessibleLabel: 'Remove compressor', onClick: jest.fn() };
		page = await newSpecPage({
			components: [KvSelectOption, KvActionButtonIcon, KvActionButton],
			template: () => <kv-select-option label="Compressor" value="compressor" action={action} />
		});
		const control = page.root?.shadowRoot?.querySelector('kv-action-button-icon')?.shadowRoot?.querySelector('kv-action-button')?.shadowRoot?.querySelector('[part="button"]');

		expect(control?.getAttribute('aria-label')).toBe('Remove compressor');
	});

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSelectOption],
				template: () => <kv-select-option label="Option 1" value="option1"></kv-select-option>
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should set the label', () => {
				expect(component.label).toEqual('Option 1');
			});

			it('should set the option value', () => {
				expect(component.value).toEqual('option1');
			});

			it('should set the selected status', () => {
				expect(component.selected).toEqual(false);
			});

			it('should set the togglable status', () => {
				expect(component.togglable).toEqual(false);
			});
		});
	});

	describe('when rendering with bottom slot flag `true`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSelectOption],
				template: () => <kv-select-option label="Option 1" value="option1"></kv-select-option>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when togglable', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvSelectOption, KvCheckbox, KvRadio],
				template: () => <kv-select-option label="Compressor A" value="compressor-a" togglable state={EToggleState.Selected}></kv-select-option>
			});
		});

		it("should name its checkbox with the option's label", () => {
			const control = page.root?.shadowRoot?.querySelector('kv-checkbox')?.shadowRoot?.querySelector('kv-radio')?.shadowRoot?.querySelector('.circle');

			expect(control?.getAttribute('role')).toBe('checkbox');
			expect(control?.getAttribute('aria-checked')).toBe('true');
			expect(control?.getAttribute('aria-label')).toBe('Compressor A');
		});
	});
});
