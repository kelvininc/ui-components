import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvRadioButton } from '../radio-button';

describe('Radio Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvRadioButton;

	describe('when the component loads with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioButton],
				html: '<kv-radio-button></kv-radio-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isChecked` with value false', () => {
			expect(component.isChecked).toBeFalsy();
		});

		it('should initialize `isDisabled` with value false', () => {
			expect(component.isDisabled).toBeFalsy();
		});

		it('should initialize `label` with empty string', () => {
			expect(component.label).toBeFalsy();
		});
	});

	describe('when the component loads with a label', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioButton],
				html: '<kv-radio-button label="Accepted"></kv-radio-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `label` with empty string', () => {
			expect(component.label).toEqual('Accepted');
		});
	});

	describe('when the component loads with disabled prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioButton],
				html: '<kv-radio-button disabled></kv-radio-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isDisabled` with value true', () => {
			expect(component.isDisabled).toBeTruthy();
		});
	});

	describe('when the component loads with checked prop', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadioButton],
				html: '<kv-radio-button checked></kv-radio-button>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isChecked` with value true', () => {
			expect(component.isChecked).toBeTruthy();
		});
	});
});
