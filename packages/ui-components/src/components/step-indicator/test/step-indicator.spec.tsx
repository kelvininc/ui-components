import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvStepIndicator } from '../step-indicator';

describe('StepIndicator (unit tests)', () => {
	let page: SpecPage;
	let component: KvStepIndicator;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepIndicator],
				html: `<kv-step-indicator></kv-step-indicator>`
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});
	});

	describe('when rendering with `active`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepIndicator],
				html: `<kv-step-indicator active></kv-step-indicator>`
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should set the `active` prop to true', () => {
				expect(component.active).toEqual(true);
			});
		});
	});

	describe('when rendering with `hasError`', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvStepIndicator],
				html: `<kv-step-indicator has-error></kv-step-indicator>`
			});
			component = page.rootInstance;
		});

		describe('when the component loads', () => {
			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should set the `active` prop to true', () => {
				expect(component.hasError).toEqual(true);
			});
		});
	});
});
