import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { KvRadio } from '../radio';

describe('Radio Button (unit tests)', () => {
	let page: SpecPage;
	let component: KvRadio;

	describe('when the component loads with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRadio],
				html: '<kv-radio></kv-radio>'
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
				components: [KvRadio],
				html: '<kv-radio label="Accepted"></kv-radio>'
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
				components: [KvRadio],
				html: '<kv-radio disabled></kv-radio>'
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
				components: [KvRadio],
				html: '<kv-radio checked></kv-radio>'
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
